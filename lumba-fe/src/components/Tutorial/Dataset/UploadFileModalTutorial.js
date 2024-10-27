import Button from "../../Button/Button";
import Close from "../../Icon/Close";
import { Step, StepContent, StepTitle, StepDescription } from "../Steps";
import FileInputTutorial from "./FileInputTutorial";

export default function UploadFileModalTutorial({
  open,
  setOpen,
  buttonLabel,
  formLabel,
  CustomButton,
  customButtonClass,
}) {
  return (
    <>
      {CustomButton ? (
        <CustomButton
          onClick={(e) => {
            setOpen(true);
          }}
        />
      ) : customButtonClass ? (
        <button className={customButtonClass} onClick={() => setOpen(true)}>
          {buttonLabel}
        </button>
      ) : (
        <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      )}

      <div
        onClick={() => setOpen(false)}
        className={`${
          open ? "block" : "hidden"
        } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div className={`${open ? "block" : "hidden"} z-40 fixed grid inset-0 w-full h-full place-items-center`}>
        <form
          action=""
          className="rounded-md shadow w-[32rem] mx-auto flex flex-col transition duration-300 relative bg-white z-40"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="pb-2 mb-4 px-4 py-3">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-40">{formLabel}</h4>
              <Close onClick={() => setOpen(false)} type="button" />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <Step step={2}>
            <div className="relative px-4 pt-3">
              <FileInputTutorial>
                <StepContent
                  position="center"
                  executeFunction={[
                    {
                      shouldExecuteOnStep: 1,
                      function: () => {
                        setOpen(false);
                      },
                    },
                    {
                      shouldExecuteOnStep: 2,
                      function: () => {
                        setOpen(true);
                      },
                    },
                    {
                      shouldExecuteOnStep: 3,
                      function: () => {
                        setOpen(false);
                      },
                    },
                  ]}
                >
                  <StepTitle>Upload & View Dataset</StepTitle>
                  <StepDescription>You can browse or drag your CSV file in here.</StepDescription>
                </StepContent>
              </FileInputTutorial>
            </div>
          </Step>
        </form>
      </div>
    </>
  );
}
