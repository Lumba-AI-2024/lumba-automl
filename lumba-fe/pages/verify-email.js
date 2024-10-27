import React from "react";
import Seo from "../src/components/Seo";
import RegisterSuccess from "../src/components/RegisterSuccess";
import { setCookie } from "../src/helper/cookies";
import axios from "axios";

export default function VerifyEmail({ token, username }) {
  React.useEffect(() => {
    setCookie("token", token);
    setCookie("username", username);
  }, []);

  return (
    <>
      <Seo title="Register Success" />
      <main className="">
        <div className="fixed inset-0 w-screen h-screen">
          <img src="/assets/BgAuth.svg" className="w-full h-full object-cover object-left" alt="Lumba" />
          <img src="/assets/logo/LumbaAuth.svg" className="fixed top-4 left-4 h-[5vh]" alt="Lumba" />
          <img src="/assets/LumbaLumba.svg" className="fixed bottom-0 left-0 h-[70vh]" alt="Lumba" />
        </div>
        <div className="fixed top-0 right-0 w-[40vw] min-w-[320px] px-2 h-screen bg-white">
          <RegisterSuccess />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const token = ctx.query?.token;
  const username = ctx.query?.username;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/verify_account/?token=${token}`);

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
      token: res.data.token,
      username,
    },
  };
}
