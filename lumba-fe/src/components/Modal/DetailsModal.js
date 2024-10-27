import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import BoxPlot from "../BoxPlot";
import Button from "../Button/Button";
import Close from "../Icon/Close";

const stats = {
  missing: "Total Missing Data",
  duplicate: "Total Duplicate Data",
  categorical: "Total Categorical Columns",
};

const info = {
  missing: "Missing Data Count",
  duplicate: "Total Duplicate Data",
  categorical: "Unique Values",
};

export default function DetailsModal({
  buttonLabel,
  formLabel,
  children,
  CustomButton,
  variant = "missing",
  values = {},
  boxplotDatas = {},
}) {
  console.log(values)
  const { isOpen, setIsOpen } = useContext(FormModalContext);
  return (
    <>
      {CustomButton ? (
        <CustomButton onClick={() => setIsOpen(true)}>{buttonLabel}</CustomButton>
      ) : (
        <Button onClick={() => setIsOpen(true)}>{buttonLabel}</Button>
      )}
      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "block" : "hidden"
        } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } w-full z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}
      >
        <div
          className={`${
            variant !== "outlier" ? "max-w-[550px]" : "max-w-[750px]"
          } rounded-md shadow w-full px-4 py-3 h-[calc(100vh-100px)] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40`}
        >
          <div className="pb-2 mb-4">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-40">{formLabel}</h4>
              <Close onClick={() => setIsOpen(false)} type="button" />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="pb-2 mb-4">
            <div className="flex flex-col justify-between relative">
              <h4 className="font-medium relative z-40 mb-2">Stats</h4>
              <div className="grid grid-cols-2">
                <p>{stats[variant]}</p>
                <p>{buttonLabel}</p>
              </div>
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          {children}
          {variant !== "duplicate" && (
            <div className="pb-2">
              <div className="grid grid-cols-2 mb-2">
                <h4 className="font-medium relative z-40 mb-2">
                  {variant === "outlier" ? "Outliers Info" : "Columns Info"}
                </h4>
                <h4 className="font-medium relative z-40 mb-2">{info[variant]}</h4>
              </div>
              {variant === "missing" &&
                Object.entries(values).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 mb-3">
                    <p>{item[0]}</p>
                    <p>{item[1]}</p>
                  </div>
                ))}
              {variant === "categorical" &&
                Object.entries(values).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 mb-3">
                    <p>{item[0]}</p>
                    <p>{item[1].join(", ")}</p>
                  </div>
                ))}  
              {variant === "outlier" && <BoxPlot boxplotDatas={boxplotDatas} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
