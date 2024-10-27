import Link from "next/link";
import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";

export default function LoginForm({ formLabel, handleSubmit, children }) {
  const { formData, setFormData } = useContext(FormModalContext);

  return (
    <>
      <form
        autoComplete="off"
        className="flex flex-col h-full transition duration-300 overflow-x-hidden relative bg-white z-40"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleSubmit(formData, setFormData);
        }}
      >
        <div className="max-w-[375px] w-full flex-1 flex flex-col justify-center mx-auto">
          <div className="px-2">{children}</div>
          <div className="px-2">
            <Button full variant="primary">
              Sign In
            </Button>
          </div>
        </div>
        <div>
          <div className="mb-5 mt-2">
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <p className="text-center py-4">
            New here?{" "}
            <Link className="text-transparent bg-clip-text bg-[#28a1c3]" href="/register">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
