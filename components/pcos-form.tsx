"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Heart, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResultsDisplay } from "./pcos-result"
import axios from 'axios'

const bloodGroupOptions = [
  { label: "A+", value: "11" },
  { label: "A-", value: "12" },
  { label: "B+", value: "13" },
  { label: "B-", value: "14" },
  { label: "O+", value: "15" },
  { label: "O-", value: "16" },
  { label: "AB+", value: "17" },
  { label: "AB-", value: "18" },
]

const formSchema = z.object({
  Age: z.coerce.number().int().min(12).max(100),
  Weight: z.coerce.number().min(30).max(200),
  Height: z.coerce.number().min(120).max(220),
  BloodGroup: z.coerce.number().int(),
  PeriodFrequency: z.coerce.number().int().min(0).max(100),
  GainedWeight: z.coerce.number().int().min(0).max(1),
  ExcessiveHair: z.coerce.number().int().min(0).max(1),
  DarkSkin: z.coerce.number().int().min(0).max(1),
  HairLoss: z.coerce.number().int().min(0).max(1),
  FaceAcne: z.coerce.number().int().min(0).max(1),
  FastFood: z.coerce.number().int().min(0).max(1),
  RegularExercise: z.coerce.number().int().min(0).max(1),
  MoodSwings: z.coerce.number().int().min(0).max(1),
  RegularPeriods: z.coerce.number().int().min(0).max(1),
  PeriodDuration: z.coerce.number().int().min(0).max(15),
  BMI: z.coerce.number().min(10).max(50),
})

interface PCOSFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void
}

export default function PCOSForm({ onSubmit }: PCOSFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [predictionScore, setPredictionScore] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Age: undefined,
      Weight: undefined,
      Height: undefined,
      BloodGroup: undefined,
      PeriodFrequency: undefined,
      GainedWeight: 0,
      ExcessiveHair: 0,
      DarkSkin: 0,
      HairLoss: 0,
      FaceAcne: 0,
      FastFood: 0,
      RegularExercise: 0,
      MoodSwings: 0,
      RegularPeriods: 0,
      PeriodDuration: undefined,
      BMI: undefined,
    },
  })

  // Auto-calculate BMI when weight or height changes
  const weight = form.watch("Weight");
  const height = form.watch("Height");
  
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const roundedBMI = Math.round(bmi * 10) / 10;
      form.setValue("BMI", roundedBMI);
    }
  }, [weight, height, form]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    toast("Your data has been sent Successfully",{
        description: "Thank you for sharing your health information.",
      })

    try {
      const response = await axios.post("https://pcos-backend-yvaw.onrender.com/predict", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Prediction Response:", response.data);
      setPredictionScore(response.data.pcos_risk_score);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
    }
    // Simulate API call
    setTimeout(() => {
      toast("Form submitted successfully!", {
        description: "Thank you for sharing your health information.",
      })
      
      setIsSubmitting(false)

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(values)
      }
    }, 1500)
  }

  return (
    <>
    <Card className="w-full shadow-lg border-pink-200 bg-white">
      <CardHeader className="mt-[-25px] p-10 bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-lg h-40 flex flex-col justify-center items-center pt-6">
        <div className="flex w-9/12 justify-between items-center">
          <CardTitle className="text-2xl font-bold text-pink-800">PCOS Health Tracker</CardTitle>
          <Heart className="h-6 w-6 text-pink-500" />
        </div>
        <CardDescription className="text-pink-700 w-9/12">
          Track your PCOS symptoms and health metrics to better understand your condition
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="Age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-pink-700">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : 0);
                        }}
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your weight" 
                        {...field} 
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your height" 
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : 0);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="BloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodGroupOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="BMI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BMI</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="BMI" {...field}
                      value={field.value === 0 ? "" : field.value}
                       readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="bg-pink-100" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Menstrual Cycle Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="PeriodFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Period Cycle Frequency (months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Months between each cycle"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : 0);
                        }}
                          className="border-pink-200 focus:border-pink-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="PeriodDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Menstrual Period Length (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Duration of period"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : 0);
                        }}
                          className="border-pink-200 focus:border-pink-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="RegularPeriods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Regular Periods</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-pink-100" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Symptoms (Yes / No)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="GainedWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Weight Gain</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ExcessiveHair"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Excessive Body/Facial Hair</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="DarkSkin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Skin Darkening</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="HairLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Hair Loss/Thinning</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="FaceAcne"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Acne (Face/Jawline)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="MoodSwings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Mood Swings</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-pink-100" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-pink-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Lifestyle Factors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="FastFood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Fast Food Consumption</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="RegularExercise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-pink-700">Daily Exercise</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === 1 ? "default" : "outline"}
                            className={field.value === 1 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(1)}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 0 ? "default" : "outline"}
                            className={field.value === 0 ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200"}
                            onClick={() => field.onChange(0)}
                          >
                            No
                          </Button>
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Health Information"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-pink-50 mb-[-25px] h-28 to-purple-50 rounded-b-lg flex flex-col justify-center items-center text-center text-xs text-pink-700 py-4">
        <p>Your health information is private and secure.</p>
        <p>This form helps track PCOS symptoms for better management.</p>
      </CardFooter>
    </Card>
    {showResults && <ResultsDisplay score={predictionScore} onClose={() => setShowResults(false)} />}
    </>
  )
}

