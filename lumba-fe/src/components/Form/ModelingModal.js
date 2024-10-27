import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";
import Close from "../Icon/Close";

export default function FormModal({
  buttonLabel,
  submitLabel,
  formLabel,
  handleSubmit,
  children,
  CustomButton,
  buttonVariant = "primary",
  step2RequiredFields,
  step,
  setStep,
  type
}) {
  const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);
  return (
    <>
      {CustomButton ? (
        <CustomButton
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        />
      ) : (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          {buttonLabel}
        </Button>
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        className={`${
          isOpen ? "block" : "hidden"
        } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${isOpen ? "block" : "hidden"} z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}
      >
        <form
          action=""
          className="rounded-md shadow px-4 py-3 w-[450px] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleSubmit(formData, setFormData);
            setIsOpen(false);
          }}
        >
          <div className="pb-2 mb-4">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-40">{formLabel}</h4>
              <Close
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                type="button"
              />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="h-[300px] bg-white z-50">{children}</div>
          <div className="mb-5 mt-2">
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="place-self-end flex gap-2">
            {step === 1 && (
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                type="button"
              >
                Cancel
              </Button>
            )}
            {step === 2 && (
              <Button variant="secondary" onClick={() => setStep(1)} type="button">
                Back
              </Button>
            )}
            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={
                  type === "object_segmentation" ? 
                    !formData?.modelName || !formData?.dataset || !formData?.method : 
                    !formData?.modelName || !formData?.dataset || !formData?.method || !formData?.algorithm
                }
                type="button"
                variant={buttonVariant}
                isLoading={false}
              >
                Next
              </Button>
            )}
            {step === 2 && (
              <Button
                variant={buttonVariant}
                disabled={
                  type === "object_segmentation"  ?
                    false :
                    step2RequiredFields.some((field) => !formData[field])}
                isLoading={false}
              >
                {submitLabel}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
