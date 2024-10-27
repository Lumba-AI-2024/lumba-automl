import { useContext } from "react";
import { DetailsModalContext } from "../../context/DetailsModalContext";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";
import Close from "../Icon/Close";

export default function FormModal({
  buttonLabel,
  submitLabel,
  variant,
  formLabel,
  handleSubmit,
  children,
  CustomButton,
  CustomElement,
  buttonVariant = "primary",
}) {
  const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);
  const { setVariant, setIsDetailsOpen } = useContext(DetailsModalContext);

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
            setVariant(variant);
            handleSubmit(formData, setFormData);
            if (variant !== "modeling") {
              setIsDetailsOpen(true);
            }
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
          {children}
          <div className="mb-5 mt-2">
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="place-self-end flex gap-2">
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
            <Button variant={buttonVariant} isLoading={false}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
