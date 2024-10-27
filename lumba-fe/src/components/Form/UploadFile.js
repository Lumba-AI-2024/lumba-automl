import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";
import Close from "../Icon/Close";
import FileInput from "./FileInput";
import { csvFileToArray } from "../../helper/csvFileReader";

export default function UploadFile({ buttonLabel, formLabel, CustomButton, handleSubmit, customButtonClass, workspaceType, uploadType }) {
  const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);

  return (
    <>
      {CustomButton ? (
        <CustomButton
          onClick={(e) => {
            setIsOpen(true);
          }}
        />
      ) : customButtonClass ? (
        <button className={customButtonClass} onClick={() => setIsOpen(true)}>
          {buttonLabel}
        </button>
      ) : (
        <Button onClick={() => setIsOpen(true)}>{buttonLabel}</Button>
      )}

      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "block" : "hidden"
        } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div className={`${isOpen ? "block" : "hidden"} z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}>
        <form
          action=""
          className="rounded-md shadow px-4 py-3 w-[450px] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40"
          onSubmit={(e) => {
            e.preventDefault();
            const fileReader = new FileReader();
            if (formData?.file) {
              fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
              };

              fileReader.readAsText(formData?.file);
            }
            handleSubmit(formData);
          }}
        >
          <div className="pb-2 mb-4">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-40">{formLabel}</h4>
              <Close onClick={() => setIsOpen(false)} type="button" />
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <FileInput workspaceType={workspaceType} setFormData={setFormData} setIsOpen={setIsOpen} uploadType={uploadType} />
        </form>
      </div>
    </>
  );
}


// import { useContext } from "react";
// import { FormModalContext} from "../../context/FormModalContext";
// import Button from "../Button/Button";
// import Close from "../Icon/Close";
// import FileInput from "./FileInput";

// export default function UploadFile({ buttonLabel, formLabel, CustomButton, handleSubmit, customButtonClass, workspaceType, uploadType }) {
//   const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);

//   // Separate handler for when the form data is fully ready to be submitted
//   const onFormSubmit = (e) => {
//     e.preventDefault();
//     handleSubmit(formData);
//     setIsOpen(false); // Close the modal after submitting
//   };

//   return (
//     <>
//       {CustomButton ? (
//         <CustomButton onClick={() => setIsOpen(true)} />
//       ) : customButtonClass ? (
//         <button className={customButtonClass} onClick={() => setIsOpen(true)}>
//           {buttonLabel}
//         </button>
//       ) : (
//         <Button onClick={() => setIsOpen(true)}>{buttonLabel}</Button>
//       )}

//       <div
//         onClick={() => setIsOpen(false)}
//         className={`${isOpen ? "block" : "hidden"} z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
//       ></div>
//       <div className={`${isOpen ? "block" : "hidden"} z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}>
//         <form
//           className="rounded-md shadow px-4 py-3 w-[450px] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40"
//           onSubmit={onFormSubmit}
//         >
//           <div className="pb-2 mb-4">
//             <div className="flex justify-between items-center">
//               <h4 className="font-medium">{formLabel}</h4>
//               <Close onClick={() => setIsOpen(false)} type="button" />
//             </div>
//             <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
//           </div>
//           <FileInput workspaceType={workspaceType} uploadType={uploadType} setFormData={setFormData} setIsOpen={setIsOpen} />
//         </form>
//       </div>
//     </>
//   );
// }
