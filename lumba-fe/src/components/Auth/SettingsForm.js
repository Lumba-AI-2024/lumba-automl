import Link from "next/link";
import { useContext, useState } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";

export default function SettingsForm({
  isProfileEditing,
  setIsProfileEditing,
  isPasswordEditing,
  setIsPasswordEditing,
  handleSubmit,
  user,
  children,
}) {
  const { formData, setFormData } = useContext(FormModalContext);
  const [isLoading, setIsLoading] = useState(false);

  if (isPasswordEditing) {
    return null;
  }

  return (
    <>
      <form
        autoComplete="off"
        className="flex flex-col h-full transition duration-300 relative z-40"
        onSubmit={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsLoading(true);
          await handleSubmit(formData, setFormData);
          setIsLoading(false);
        }}
      >
        <div className="max-w-4xl w-full flex-1 flex flex-col justify-center mx-auto">
          <div className="px-2 flex flex-col gap-3">{children}</div>
          <div className="px-2 grid place-items-center mt-3">
            {isProfileEditing ? (
              <div className="space-x-4">
                <Button
                  type="button"
                  onClick={() => {
                    setIsProfileEditing(false);
                    setFormData(user);
                  }}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button variant="primary" disabled={isLoading}>
                  {isLoading ? <div className="race-by white mx-3 my-1.5"></div> : "Save Changes"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button type="button" onClick={() => setIsProfileEditing(true)} variant="primary">
                  Edit Profile
                </Button>
                {isPasswordEditing ? (
                  <></>
                ) : (
                  <Button type="button" onClick={() => setIsPasswordEditing(true)} variant="primary">
                    Edit Password
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
