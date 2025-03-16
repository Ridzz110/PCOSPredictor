"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ResultsDisplayProps {
  score: number
  onClose: () => void
}

export function ResultsDisplay({ score, onClose }: ResultsDisplayProps) {
  const numericScore = parseFloat(score.toString().replace('%', ''));
  const getRiskLevel = () => {

    if (numericScore < 30) return { level: "Low", color: "text-green-600" }
    else if (numericScore < 60) return { level: "Moderate", color: "text-amber-600" }
    else return { level: "High", color: "text-red-600" }
  }


  const risk = getRiskLevel()

  const getProgressColor = () => {
    if (numericScore < 30) return "bg-green-500"
    if (numericScore < 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-pink-600 text-xl">PCOS Prediction Results</DialogTitle>
          <DialogDescription className="text-center">Based on the information you provided</DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-pink-50 mb-4">
              {numericScore < 30 ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : numericScore < 60 ? (
                <AlertCircle className="h-12 w-12 text-amber-600" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <h3 className={`text-2xl font-bold ${risk.color}`}>{risk.level} Risk</h3>
            <p className="text-4xl font-bold mt-2">{score}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          <Progress value={numericScore} className={`h-3 ${getProgressColor()}`} />
          </div>

          <div className="bg-pink-50 p-4 rounded-md text-sm">
            <p className="font-medium mb-2">What does this mean?</p>
            <p>
              {numericScore < 30
                ? "Your symptoms suggest a lower likelihood of PCOS. However, this is not a medical diagnosis."
                : numericScore < 60
                  ? "Your symptoms suggest a moderate likelihood of PCOS. Consider consulting with a healthcare provider."
                  : "Your symptoms suggest a higher likelihood of PCOS. It's recommended to consult with a healthcare provider for proper evaluation."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

