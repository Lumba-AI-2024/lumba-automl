import React, { useState } from "react";
import FormModalContextProvider from "../src/context/FormModalContext";
import Dolphin from "../src/components/Icon/Dolphin";
import Input from "../src/components/Form/Input";
import LoginForm from "../src/components/Auth/LoginForm";
import Link from "next/link";
import Checkbox from "../src/components/Form/Checkbox";
import PasswordInput from "../src/components/Form/PasswordInput";
import Seo from "../src/components/Seo";
import { useRouter } from "next/router";
import { setCookie } from "../src/helper/cookies";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [isError, setIsError] = useState(false);

  return (
    <>
      <Seo title="Login" />
      <main className="">
        <div className="fixed inset-0 w-screen h-screen">
          <img src="/assets/BgAuth.svg" className="w-full h-full object-cover object-left" alt="Lumba" />
          <img src="/assets/logo/LumbaAuth.svg" className="fixed top-4 left-4 h-[5vh]" alt="Lumba" />
          <img src="/assets/LumbaLumba.svg" className="fixed bottom-0 left-0 h-[70vh]" alt="Lumba" />
        </div>
        <div className="fixed top-0 right-0 w-[40vw] min-w-[320px] px-2 h-screen bg-white">
          <FormModalContextProvider>
            <LoginForm
              formLabel={<img src="/assets/logo/LumbaAuth.svg" alt="Lumba" />}
              buttonLabel="Show Modal"
              submitLabel="Save Changes"
              handleSubmit={async (formData, setFormData) => {
                setIsError(false);
                try {
                  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/login/`, formData);

                  const {
                    data: { token },
                    status,
                  } = res;

                  if (status === 200) {
                    rememberMe ? setCookie("token", token, 0.5) : setCookie("token", token);
                    rememberMe
                      ? setCookie("username", formData.username, 0.5)
                      : setCookie("username", formData.username);

                    setTimeout(() => {
                      router.push("/");
                    }, 500);
                  }
                } catch (err) {
                  // setIsError(true);
                  setIsError(true);
                } finally {
                  setFormData({});
                }
              }}
            >
              <h1 className="h2 text-black/60 flex gap-2 items-center mb-4">
                Welcome back to Lumba.ai! <Dolphin />
              </h1>
              <Input label={"Username"} name={"username"} placeholder="Type your username" required />
              <PasswordInput label={"Password"} name={"password"} placeholder="Type your password" required />
              {isError && <span className="text-pink mb-2 block">Wrong Username or Password.</span>}
              <div className="flex justify-between items-center mb-6">
                <Checkbox label="Remember me" name="rememberMe" />
                <Link className="text-transparent bg-clip-text bg-[#28a1c3]" href="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            </LoginForm>
          </FormModalContextProvider>
        </div>
      </main>
    </>
  );
}
