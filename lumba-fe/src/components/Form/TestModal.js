import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";
import Close from "../Icon/Close";
import Question from "../Icon/Question";
import Input from "./Input";

export default function TestModal({ handleSubmit, CustomButton, features, predict, result, isTesting }) {
  const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);

  return (
    <>
      <CustomButton
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        className={`${isOpen ? "block" : "hidden"
          } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${isOpen ? "block" : "hidden"} z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}
      >
        <form
          action=""
          className="rounded-md shadow px-4 py-3 w-[600px] h-[70vh] mx-auto flex flex-col transition duration-300 overflow-hidden relative bg-white z-40"
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
                  setIsOpen(false);
                }}
                type="button"
              />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Feature to be trained</span> <Question label="predictor variable" />
            </div>
            {console.log(features)}
            {(() => {
              let parsedFeatures = [];
              if (typeof features === 'string') {
                parsedFeatures = features.split(',').map(feature => feature.trim());
              }

              return parsedFeatures.length > 0 ? (
                parsedFeatures?.map((feature) => (
                  <Input
                    key={feature}
                    name={feature}
                    label={feature}
                    // placeholder={feature.isNumeric ? "Enter numeric value" : "Enter categoric value"}
                  />
                ))
              ) : (
                <p>No features to be displayed</p>
              );
            })()}
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
            <div className="text-gray-500 text-sm">
              Note: The numerical prediction result corresponds to the<br />
              alphabetical order of target values.
            </div>
            <div className="w-full grid grid-cols-2">
              <p>{predict}</p>
              {result}
            </div>
          </div>
        </form >
      </div >
    </>
  );
}
