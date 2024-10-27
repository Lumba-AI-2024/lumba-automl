import Link from "next/link";
import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";

export default function ChangePasswordForm({ isPasswordEditing, setIsPasswordEditing, handleSubmit, children }) {
  const { formData, setFormData } = useContext(FormModalContext);

  return (
    <>
      <form
        autoComplete="off"
        className="flex flex-col h-full transition duration-300 relative z-40"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleSubmit(formData, setFormData);
        }}
      >
        <div className="max-w-4xl w-full flex-1 flex flex-col justify-center mx-auto">
          <div className="px-2 flex flex-col gap-3">{children}</div>
          <div className="px-2 grid place-items-center mt-3">
            {isPasswordEditing ? (
              <div className="space-x-4">
                <Button type="button" onClick={() => setIsPasswordEditing(false)} variant="secondary">
                  Cancel
                </Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setIsPasswordEditing(true)} variant="primary">
                Edit Password
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
