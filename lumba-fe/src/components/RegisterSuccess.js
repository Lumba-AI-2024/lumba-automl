import Link from "next/link";
import Button from "./Button/Button";
import { useRouter } from "next/router";
import Registered from "./Icon/Registered";

export default function RegisterSuccess() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full transition duration-300 overflow-x-hidden relative bg-white z-40">
      <div className="max-w-[375px] w-full flex-1 flex flex-col justify-center mx-auto">
        <div className="px-2 mb-4">
          {" "}
          <h1 className="h2 text-black/60 flex gap-2 items-center">
            You're Successfully Registered <Registered />
          </h1>
          <span className="text-[11px] block mb-4">Your account has been successfully created and verified.</span>
          <img src="/assets/LumbaSuccess.svg" alt="Reset Password Successful" className="mx-auto mb-2" />
        </div>
        <div className="px-2">
          <Button full variant="primary" onClick={() => router.push("/login")}>
            Continue to Lumba.ai
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-5 mt-2">
          <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
        </div>
        <p className="text-center py-4">
          <Link className="text-transparent bg-clip-text bg-[#54595e]" href="/login">
            &lt; Back to sign in page
          </Link>
        </p>
      </div>
    </div>
  );
}
