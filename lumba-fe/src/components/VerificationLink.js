import Link from "next/link";
import Button from "./Button/Button";
import { useRouter } from "next/router";
import Mail from "./Icon/Mail";
import axios from "axios";
import * as React from "react";

export default function VerificationLink({ email, formData, setIsSuccess2 }) {
  const router = useRouter();
  const [success, setIsSuccess] = React.useState(false);
  return (
    <div className="flex flex-col h-full transition duration-300 overflow-x-hidden relative bg-white z-40">
      <div className="max-w-[375px] w-full flex-1 flex flex-col justify-center mx-auto">
        <div className="px-2 mb-4">
          {" "}
          <h1 className="h2 text-black/60 flex gap-2 items-center">
            Check your email <Mail />
          </h1>
          <span className="text-[11px] block mb-6">We sent you a verification link to</span>
          <span className="text-xs font-semibold block mb-6">{email}</span>
          <span className="text-xs block mb-4">
            Didn't receive the email?{" "}
            <button
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/register/`,
                    formData
                  );

                  const { status } = res;

                  if (status === 201) {
                    setIsSuccess(true);
                  }
                } catch (err) {
                  // setIsError(true);
                }
              }}
              type="button"
              className={`text-transparent bg-clip-text  ${success ? "bg-gray" : "bg-[#28a1c3]"}`}
              href="/"
              disabled={success}
            >
              {success ? "Email sent successfully" : "Click here to resend"}
            </button>
          </span>
        </div>
        <div className="px-2">
          <Button full variant="primary" onClick={() => router.push("/login")}>
            Check Email
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-5 mt-2">
          <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
        </div>
        <p className="text-center py-4">
          <button
            className="text-transparent bg-clip-text bg-[#54595e]"
            onClick={() => {
              setIsSuccess2(false);
              router.push("/register");
            }}
          >
            &lt; Back to registration page
          </button>
        </p>
      </div>
    </div>
  );
}
