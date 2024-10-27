import Button from "../../Button/Button";
import Close from "../../Icon/Close";
import Question from "../../Icon/Question";
import Input from "../../Form/Input";
import { Step, StepContent, StepTitle, StepDescription } from "../Steps";

export default function TestModalTutorial({ handleSubmit, CustomButton, open, predict, result, isTesting }) {
  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${open ? "block" : "hidden"} z-40 fixed inset-0 grid place-items-center`}
      >
        <form
          action=""
          className="rounded-md shadow px-4 py-3 w-[32rem] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleSubmit(formData, setFormData);
          }}
        >
          <div className="pb-2 mb-4">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-40">Test Model</h4>
              <Close
                onClick={(e) => {
                  e.stopPropagation();
                }}
                type="button"
              />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Feature to be trained</span> <Question label="predictor variable" />
            </div>
            <Step step={6}>
              <div className="relative">
                <Input name="age" label="Age" placeholder={"Enter numeric value"} />

                <StepContent position="right">
                  <StepTitle>Create Predicting Model</StepTitle>
                  <StepDescription>Feel free to enter the input here and see the test result.</StepDescription>
                </StepContent>
              </div>
            </Step>

            <div className="text-center">
              <Button disabled={isTesting} variant={isTesting ? "disabled" : "primary"}>
                Test
              </Button>
            </div>
          </div>
          <div className="mb-5 mt-2">
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Target Predict Result</span> <Question label="outcome variable" />
            </div>
            <div className="w-full grid grid-cols-2">
              <p>Weight</p>
              {result}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
