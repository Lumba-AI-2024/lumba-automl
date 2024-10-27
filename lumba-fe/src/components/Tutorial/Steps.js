import React, { useEffect } from "react";

import { cn } from "../../helper/utils";
import Button from "../Button/Button";
import { AnimatePresence, motion } from "framer-motion";

function StepTitle({ children }) {
  const { step, totalStep } = useStep();
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="font-semibold text-sm">{children}</p>
        <p className="font-semibold text-gray tracking-wider">
          {step}/{totalStep}
        </p>
      </div>
    </>
  );
}

function StepDescription({ children }) {
  return (
    <div className="w-full mt-3">
      <p className="leading-5 text-sm">{children}</p>
    </div>
  );
}

function StepContent({ children, position = "left", className = "", executeFunction = [] }) {
  const { step, setStep, totalStep, setIsOngoing } = useStep();
  const { shouldRender } = useStepContent();

  const isLastStep = step === totalStep;

  useEffect(() => {
    if (Array.isArray(executeFunction)) {
      executeFunction.forEach((item) => {
        if (item.shouldExecuteOnStep === step) {
          item.function();
        }
      });
    } else {
      if (executeFunction.shouldExecuteOnStep === step) {
        executeFunction.function();
      }
    }
  }, [executeFunction, step]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-10 mt-4 flex w-80 sm:w-[28rem] flex-col items-end rounded-md bg-white shadow p-4",
        position === "left" && "left-0",
        position === "right" && "right-0",
        position === "center" && "left-1/2 -translate-x-1/2",
        position === "top-center" && "-bottom-full left-1/2 -translate-x-1/2",
        className
      )}
    >
      {position === "left" && <div className="w-3.5 h-3.5 bg-white absolute left-10 -top-1.5 rotate-45"></div>}
      {position === "center" && (
        <div className="w-3.5 h-3.5 bg-white absolute left-1/2 -translate-x-1/2 -top-1.5 rotate-45"></div>
      )}
      {position === "right" && <div className="w-3.5 h-3.5 bg-white absolute right-10 -top-1.5 rotate-45"></div>}
      {position === "top-center" && (
        <div className="w-3.5 h-3.5 bg-white absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45"></div>
      )}

      {children}
      <div className="mt-4 flex gap-2">
        {step !== 1 && (
          <Button variant="ghost" onClick={() => setStep((current) => current - 1)}>
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            setStep((current) => current + 1);
            if (isLastStep) {
              setIsOngoing(false);
            }
          }}
        >
          {isLastStep ? "Okay, got it!" : "Next"}
        </Button>
      </div>
    </div>
  );
}

const StepContentContext = React.createContext({});

const useStepContent = () => React.useContext(StepContentContext);

function StepContentProvider({ children, shouldRender }) {
  return <StepContentContext.Provider value={{ shouldRender }}>{children}</StepContentContext.Provider>;
}

function NotStepContent({ children }) {
  const { isOngoing } = useStep();

  if (isOngoing) {
    return null;
  }

  return children;
}

function IsStepContent({ children }) {
  const { isOngoing } = useStep();

  if (!isOngoing) {
    return null;
  }

  return children;
}

function Step({ children, step }) {
  const { step: currentStep, shouldPlay, isOngoing } = useStep();

  let shouldRender = false;
  if (step === 1) {
    shouldRender = shouldPlay ? currentStep === step : false;
  } else {
    shouldRender = currentStep === step;
  }

  if (!isOngoing) {
    return null;
  }

  return (
    <div className={cn(shouldRender ? "relative z-10" : "")}>
      {/* Default overlay */}
      <AnimatePresence>
        {shouldRender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween" }}
            className="fixed inset-0 z-10 h-full w-full bg-black/40"
          ></motion.div>
        )}
      </AnimatePresence>
      <StepContentProvider shouldRender={shouldRender}>{children}</StepContentProvider>
    </div>
  );
}

const StepContext = React.createContext({});

const useStep = () => React.useContext(StepContext);

function StepProvider({ children, totalStep, shouldPlay, onReset = () => {}, onFinish = () => {} }) {
  const [step, setStep] = React.useState(1);

  const [isOngoing, setIsOngoing] = React.useState(shouldPlay);

  useEffect(() => {
    setIsOngoing(shouldPlay);
  }, [shouldPlay]);

  const replaySteps = () => {
    onReset();
    setIsOngoing(true);
    setStep(1);
  };

  if (!isOngoing) {
    onFinish();
  }

  return (
    <StepContext.Provider
      value={{
        step,
        setStep,
        totalStep,
        shouldPlay,
        isOngoing,
        setIsOngoing,
        replaySteps,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

function ReplayTutorial() {
  const { replaySteps } = useStep();

  return (
    <Button variant="outline" onClick={replaySteps}>
      Replay Tutorial
    </Button>
  );
}

export {
  Step,
  StepContent,
  StepTitle,
  StepDescription,
  StepContentProvider,
  StepProvider,
  useStep,
  useStepContent,
  ReplayTutorial,
  NotStepContent,
  IsStepContent,
};
