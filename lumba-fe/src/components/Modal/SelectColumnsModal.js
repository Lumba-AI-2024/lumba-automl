import { useState, useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";
import Close from "../Icon/Close";

export default function SelectColumnsModal({
  buttonLabel,
  formLabel,
  children,
  totalColumns,
  CustomButton,
  name,
  //   onClickAddition = () => {},
  values = [],
}) {
  const { isOpen, setIsOpen, setFormData, formData } = useContext(FormModalContext);

  const [checkedData, setCheckedData] = useState(() =>
    formData[name] && typeof formData[name] === "object"
      ? formData[name]
      : values.reduce((acc, value) => ({
          ...acc,
          [value]: { checked: false, rank: "" },
        }), {})
  );
  return (
    <>
      {CustomButton ? (
        <CustomButton onClick={() => setIsOpen(true)} notButton={true}>
          {buttonLabel}
        </CustomButton>
      ) : (
        <Button onClick={() => setIsOpen(true)} notButton={true}>
          {buttonLabel}
        </Button>
      )}
      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "block" : "hidden"
        } z-40 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } text-black/70 z-50 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}
      >
        <div className="relative bg-white z-50 rounded-md shadow px-4 py-3 w-[700px] mx-auto flex flex-col transition duration-300 overflow-x-hidden cursor-auto">
          <div className="pb-2 mb-4">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-50">{formLabel}</h4>
              <Close onClick={() => setIsOpen(false)} />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="pb-2 mb-4">
            <div className="flex flex-col justify-between relative">
              <h4 className="font-medium relative z-50 mb-2">Stats</h4>
              <div className="grid grid-cols-2">
                <p>Total Columns in Dataset</p>
                <p>{totalColumns}</p>
              </div>
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          {children}

          <div className="pb-2 mb-4">
            <div className="grid grid-cols-2 mb-2">
              <h4 className="font-medium relative z-50 mb-2">Choose Columns (exc. rank1,rank2,rank3)</h4>
            </div>
            <div className="h-full max-h-[calc(100vh-25rem)] overflow-y-auto">
              {values.map((value) => (
              <div key={value} className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    id={value}
                    name={value}
                    checked={checkedData[value].checked}
                    onChange={() =>
                      setCheckedData((prevData) => ({
                        ...prevData,
                        [value]: { ...prevData[value], checked: !prevData[value].checked },
                      }))
                    }
                  />
                  <label htmlFor={value} className="flex-1">{value}</label>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-1/4"
                  placeholder="Rank"
                  value={checkedData[value].rank}
                  onChange={(e) =>
                    setCheckedData((prevData) => ({
                      ...prevData,
                      [value]: { ...prevData[value], rank: e.target.value },
                    }))
                  }
                  disabled={!checkedData[value].checked}
                  required={checkedData[value].checked}
                />
              </div>
            ))}
            </div>
          </div>
          <div className="mb-5 mt-2">
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <div className="place-self-end flex gap-2">
            <div className="cursor-pointer">
              <Button variant="secondary" onClick={() => setIsOpen(false)} notButton={true}>
                Cancel
              </Button>
            </div>
            <div className="cursor-pointer">
              <Button
                isLoading={false}
                notButton={true}
                onClick={() => {
                  const allRanksFilled = Object.keys(checkedData).every(key => 
                    !checkedData[key].checked || (checkedData[key].checked && checkedData[key].rank.trim() !== '')
                  );
              
                  const anyChecked = Object.keys(checkedData).some(key => checkedData[key].checked);
              
                  if (!anyChecked) {
                    alert("Please select at least one column.");
                    return;
                  }
              
                  if (!allRanksFilled) {
                    alert("Please enter ranks for all checked items.");
                    return;
                  }
              
              
                  setIsOpen(false);
                  setFormData(prevData => ({
                    ...prevData,
                    [name]: checkedData
                  }));
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
