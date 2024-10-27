import React, { useState } from "react";
import FormModalContextProvider from "../src/context/FormModalContext";
import Dolphin from "../src/components/Icon/Dolphin";
import Input from "../src/components/Form/Input";
import RegisterForm from "../src/components/Auth/RegisterForm";
import Link from "next/link";
import Checkbox from "../src/components/Form/Checkbox";
import PasswordInput from "../src/components/Form/PasswordInput";
import Seo from "../src/components/Seo";
import { useRouter } from "next/router";
import { setCookie } from "../src/helper/cookies";
import { isBothPasswordSame } from "../src/helper/formValidation";
import axios from "axios";
import VerificationLink from "../src/components/VerificationLink";

export default function Register() {
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const [data, setData] = useState({});

  return (
    <>
      <Seo title="Register" />
      <main className="">
        <div className="fixed inset-0 w-screen h-screen">
          <img src="/assets/BgAuth.svg" className="w-full h-full object-cover object-left" alt="Lumba" />
          <img src="/assets/logo/LumbaAuth.svg" className="fixed top-4 left-4 h-[5vh]" alt="Lumba" />
          <img src="/assets/LumbaLumba.svg" className="fixed bottom-0 left-0 h-[70vh]" alt="Lumba" />
        </div>
        <div className="fixed top-0 right-0 w-[40vw] min-w-[320px] px-2 h-screen bg-white">
          {isSuccess ? (
            <VerificationLink email={email} formData={data} setIsSuccess2={setIsSuccess} />
          ) : (
            <FormModalContextProvider>
              <RegisterForm
                formLabel={<img src="/assets/logo/LumbaAuth.svg" alt="Lumba" />}
                buttonLabel="Show Modal"
                submitLabel="Save Changes"
                handleSubmit={async (formData, setFormData) => {
                  setIsError(false);
                  if (!isBothPasswordSame(formData.password, formData.password2)) {
                    console.log(formData.password)
                    console.log(formData.password2)
                    setIsError(true);
                    return;
                  }
                  try {
                    const { email, username, password, phone: no_telp } = formData;
                    setEmail(email);

                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/register/`, {
                      email,
                      username,
                      password,
                      no_telp,
                    });

                    const { status } = res;
                    if (status === 201) {
                      setIsSuccess(true);
                      setCookie("token", token);
                      setCookie("username", formData.username);
                      router.push("/register-success");
                    }
                  } catch (err) {
                    console.log(err);
                    setIsError(true);
                  } finally {
                    setData(formData);
                    setFormData({});
                  }
                }}
              >
                <h1 className="h2 text-black/60 flex gap-2 items-center mb-4">
                  Create New Account <Dolphin />
                </h1>
                <Input label={"Username"} name={"username"} placeholder="Type your username" required />
                <Input type="email" label={"Email"} name={"email"} placeholder="Type your email" required />
                <Input
                  type="tel"
                  pattern="[0-9]{4}[0-9]{4}[0-9]{4}"
                  label={"Phone Number"}
                  name={"phone"}
                  placeholder="Type your phone number"
                  required
                />
                <PasswordInput label={"Password"} name={"password"} placeholder="Type your password" required />
                <PasswordInput label={"Repeat Password"} name={"password2"} placeholder="Type your password" required />
                {isError && <span className="text-pink mb-2 block">Password should match</span>}
                <div className="flex justify-center items-center gap-1 mb-6">
                  <Checkbox label="I agree to all statements in" name="tos" />
                  <Link className="text-transparent bg-clip-text bg-[#28a1c3]" href="/register">
                    Terms of Services
                  </Link>
                </div>
              </RegisterForm>
            </FormModalContextProvider>
          )}
        </div>
      </main>
    </>
  );
}
