import React from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Toggle from "../Toggle";

export default function AccordionSelect({
  initialShow = false,
  disabled,
  label,
  names,
  children,
  top = false,
  bottom = false,
}) {
  const [show, setShow] = React.useState(initialShow);

  const { setFormData } = React.useContext(FormModalContext);

  React.useEffect(() => {
    if (!show) {
      setFormData((previous) => {
        const previousCopy = { ...previous };
        names.forEach((name) => delete previousCopy[name]);
        return previousCopy;
      });
    }
  }, [show]);

  return (
    <div
      className={`px-4 py-3 ${!top && "border-t-[1.5px] border-gray/30"} ${
        bottom && "border-b-[1.5px] border-gray/30"
      } ${disabled && "cursor-not-allowed"} relative`}
    >
      <div className={`${disabled && "pointer-events-none opacity-50"}`}>
        <div className="flex justify-between items-center bg-white">
          <h3 className="font-semibold text-sm">{label}</h3>
          <Toggle show={show} setShow={setShow} />
        </div>
        {show && <div className="h-[1.5px] bg-gray/30 w-full absolute left-0 mt-3"></div>}
        <div className="">{show && <div className="pt-8 pb-2 px-2">{children}</div>}</div>
      </div>
    </div>
  );
}
