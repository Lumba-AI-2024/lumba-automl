import React, { useState } from "react";
import FormModalContextProvider from "../src/context/FormModalContext";
import Input from "../src/components/Form/Input";
import ForgotPasswordForm from "../src/components/Auth/ForgotPasswordForm";
import Seo from "../src/components/Seo";
import Key from "../src/components/Icon/Key";
import ForgotPasswordSuccess from "../src/components/ForgotPasswordSuccess";
import axios from "axios";

export default function ForgotPassword() {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      <Seo title="Forgot Password" />
      <main className="">
        <div className="fixed inset-0 w-screen h-screen">
          <img src="/assets/BgAuth.svg" className="w-full h-full object-cover object-left" alt="Lumba" />
          <img src="/assets/logo/LumbaAuth.svg" className="fixed top-4 left-4 h-[5vh]" alt="Lumba" />
          <img src="/assets/LumbaLumba.svg" className="fixed bottom-0 left-0 h-[70vh]" alt="Lumba" />
        </div>
        <div className="fixed top-0 right-0 w-[40vw] min-w-[320px] px-2 h-screen bg-white">
          {isSuccess ? (
            <ForgotPasswordSuccess email={email} />
          ) : (
            <FormModalContextProvider>
              <ForgotPasswordForm
                formLabel={<img src="/assets/logo/LumbaAuth.svg" alt="Lumba" />}
                buttonLabel="Show Modal"
                submitLabel="Save Changes"
                handleSubmit={async (formData, setFormData) => {
                  const { email } = formData;
                  setEmail(email);

                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/password_reset/`,
                      formData
                    );

                    const { status } = res;

                    if (status === 200) {
                      setIsSuccess(true);
                    }
                  } catch (err) {
                    setIsError(true);
                  } finally {
                    setFormData({});
                  }
                }}
              >
                <h1 className="h2 text-black/60 flex gap-2 items-center">
                  Forgot your password? <Key />
                </h1>
                <span className="text-[11px] block mb-4">No worries, we will send you reset instructions.</span>
                <Input type="email" label={"Email"} name={"email"} placeholder="Type your email" required />
                {isError && <span className="text-pink mb-2 block">Wrong Email or Password.</span>}
              </ForgotPasswordForm>
            </FormModalContextProvider>
          )}
        </div>
      </main>
    </>
  );
}
