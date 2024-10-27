import React, { useState } from "react";
import FormModalContextProvider from "../src/context/FormModalContext";
import ResetPasswordForm from "../src/components/Auth/ResetPasswordForm";
import PasswordInput from "../src/components/Form/PasswordInput";
import Seo from "../src/components/Seo";
import { useRouter } from "next/router";
import Key from "../src/components/Icon/Key";
import ResetPasswordSuccess from "../src/components/ResetPasswordSuccess";
import axios from "axios";

export default function ResetPassword({ token }) {
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
      <Seo title="Reset Password" />
      <main className="">
        <div className="fixed inset-0 w-screen h-screen">
          <img src="/assets/BgAuth.svg" className="w-full h-full object-cover object-left" alt="Lumba" />
          <img src="/assets/logo/LumbaAuth.svg" className="fixed top-4 left-4 h-[5vh]" alt="Lumba" />
          <img src="/assets/LumbaLumba.svg" className="fixed bottom-0 left-0 h-[70vh]" alt="Lumba" />
        </div>
        <div className="fixed top-0 right-0 w-[40vw] min-w-[320px] px-2 h-screen bg-white">
          {isSuccess ? (
            <ResetPasswordSuccess />
          ) : (
            <FormModalContextProvider>
              <ResetPasswordForm
                formLabel={<img src="/assets/logo/LumbaAuth.svg" alt="Lumba" />}
                buttonLabel="Show Modal"
                submitLabel="Save Changes"
                handleSubmit={async (formData, setFormData) => {
                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/password_reset/confirm/`,
                      {
                        token,
                        password: formData?.password,
                      }
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
                <h1 className="h2 text-black/60 flex gap-2 items-center mb-4">
                  Set New Password <Key />
                </h1>
                <PasswordInput label={"New Password"} name={"password"} placeholder="Type your password" required />
                <PasswordInput
                  label={"Confirm New Password"}
                  name={"password2"}
                  placeholder="Type your password"
                  required
                />
                {isError && <span className="text-pink mb-2 block">Wrong Email or Password.</span>}
              </ResetPasswordForm>
            </FormModalContextProvider>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const token = ctx.query?.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/password_reset/validate_token/`, {
    token,
  });

  if (res.status !== 200) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
}
