import Button from "../../Button/Button";
import Close from "../../Icon/Close";
import { Step, StepContent, StepTitle, StepDescription } from "../Steps";

export default function FormModalWorkspaceTutorial({
  open = false,
  setOpen,
  buttonLabel,
  submitLabel,
  formLabel,
  children,
  CustomButton,
  buttonVariant = "primary",
}) {
  return (
    <>
      {CustomButton ? (
        <CustomButton
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        />
      ) : (
        <Button
          disabled={true}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {buttonLabel}
        </Button>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${open ? "block" : "hidden"} z-10 fixed inset-0 w-full h-full grid items-center`}
      >
        <form
          action=""
          className="rounded-md shadow w-[32rem] mx-auto flex flex-col transition duration-300 relative bg-white z-10"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(false);
          }}
        >
          <div className="pb-2 mb-4 px-6 py-3 relative">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-10">{formLabel}</h4>
              <Close
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                type="button"
              />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="px-6">{children}</div>
          <div className="mb-5 mt-2">
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="place-self-end flex gap-2 px-6 py-3">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Step step={3}>
              <div className="relative">
                <Button variant={buttonVariant} isLoading={false}>
                  {submitLabel}
                </Button>
                <StepContent position="center">
                  <StepTitle>Create workspace</StepTitle>
                  <StepDescription>Click this button when you're done.</StepDescription>
                </StepContent>
              </div>
            </Step>
          </div>
        </form>
      </div>
    </>
  );
}
