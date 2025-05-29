import { useState } from "react";
import { useEffect } from "react";

function AnimatedWelcomeText({ text }) {
    const [step, setStep] = useState(0);
    const [isResetting, setIsResetting] = useState(false);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setStep((prev) => {
          if (prev >= text.length) {
            if (!isResetting) {
              setIsResetting(true);
              setTimeout(() => {
                setStep(0);
                setIsResetting(false);
              }, 2000);
            }
            return prev;
          }
          return prev + 1;
        });
      }, 200);
  
      return () => clearInterval(interval);
    }, [text, isResetting]);
  
    return (
      <h1 className="text-4xl lg:text-5xl text-teal-950 font-bold">
        {text.slice(0, step)}
        <span className="animate-pulse">|</span>
      </h1>
    );
  }
  
  export default AnimatedWelcomeText;