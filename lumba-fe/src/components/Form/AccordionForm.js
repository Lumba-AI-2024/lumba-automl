import { useContext, useState } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";

export default function AccordionForm({ handleSubmit, children, isDisabled }) {
  const { formData } = useContext(FormModalContext);
  const [isApplying, setIsApplying] = useState(false);

  return (
    <form
      action=""
      className={`scrollbar flex flex-col min-h-[480px] transition duration-300 shadow whitespace-nowrap overflow-x-hidden rounded-l-md h-full overflow-y-auto bg-white ${
        isDisabled && "cursor-not-allowed"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData, setIsApplying);
      }}
    >
      <div className={`${isDisabled && "pointer-events-none"} flex-1`}>{children}</div>
      <div className="text-center py-3 relative z-0">
        {isDisabled ? (
          <Button variant="disabled" disabled={true}>
            Apply
          </Button>
        ) : (
          <Button disabled={isApplying}>
            {isApplying ? <div className="race-by white mx-3 my-1.5"></div> : "Apply"}
          </Button>
        )}
      </div>
    </form>
  );
}
