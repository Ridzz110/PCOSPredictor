import React, { useEffect, useState } from "react";
interface BMICalculatorProps {
    weight: number;
    height: number;
    onBMICalculated: (bmi: number) => void;
}

function BMICalculator({ weight, height, onBMICalculated }: BMICalculatorProps) {
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    if (weight && height) {
      // Convert height from cm to meters
      const heightInMeters = height / 100;
      // Calculate BMI: weight (kg) / height² (m²)
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      // Round to 1 decimal place
      const roundedBMI = Math.round(calculatedBMI * 10) / 10;
      
      setBmi(roundedBMI);
      onBMICalculated(roundedBMI);
    }
  }, [weight, height, onBMICalculated]);

  return null; // This component doesn't render anything visually
}

export default BMICalculator;