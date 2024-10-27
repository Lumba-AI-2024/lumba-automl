import React, { useEffect, useRef, useState } from "react";
import Seo from "../src/components/Seo";
import Breadcrumb from "../src/components/Breadcrumb";
import PencilFill from "../src/components/Icon/PencilFill";
import FormModalContextProvider from "../src/context/FormModalContext";
import SettingsForm from "../src/components/Auth/SettingsForm";
import ChangePasswordForm from "../src/components/Auth/ChangePasswordForm";
import axios from "axios";
import Input from "../src/components/Form/Input";
import PasswordInput from "../src/components/Form/PasswordInput";
import { getCookie, parseCookie, setCookie } from "../src/helper/cookies";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import { useUser } from "../src/context/UserContext";
import UserCircleLarge from "../src/components/Icon/UserCircleLarge";
import HiddenInput from "../src/components/Form/HiddenInput";

export default function Settings({ user }) {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  const { username, email, no_telp } = user;

  const { updatedUser, setUpdatedUser, changeProfile } = useUser();

  return (
    <>
      <Seo title="Profile Settings" />
      <main>
        <Toaster />
        <div className="relative">
          <div className="w-full">
            <div className="relative">
              <Image
                src="/assets/ProfileCard.svg"
                width={1440}
                height={225}
                aria-hidden="true"
                alt="background"
                className="w-full object-cover min-h-[10rem]"
              />
              <div className="w-48 h-48 rounded-full absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute rounded-full overflow-hidden ring ring-white">
                  {updatedUser && updatedUser["profile_picture"] ? (
                    <Image
                      src={`https://test.lumba-ai.tech${updatedUser["profile_picture"]}`}
                      className="object-cover w-48 h-48"
                      width={192}
                      height={192}
                      alt="profile"
                    />
                  ) : (
                    <div className="relative rounded-full overflow-hidden bg-blue">
                      <UserCircleLarge />
                    </div>
                  )}
                </div>
                <form
                  onChange={changeProfile}
                  className="bg-blue w-fit p-2 rounded-full relative top-36 left-36 ring ring-white"
                >
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <PencilFill />
                </form>
              </div>
            </div>
          </div>
          <div className="absolute top-4 left-10 text-white">
            <Breadcrumb
              links={[
                { label: "< Back to Workspace", href: "/" },
                { label: "Profile Settings", href: "/settings" },
              ]}
              active={"Settings"}
              noHoverColor
              custom
            />
          </div>
        </div>

        {/* Form */}
        <div className="relative mt-24 mb-16 px-24 flex flex-col gap-6">
          <FormModalContextProvider>
            <SettingsForm
              user={updatedUser}
              isProfileEditing={isProfileEditing}
              setIsProfileEditing={setIsProfileEditing}
              isPasswordEditing={isPasswordEditing}
              setIsPasswordEditing={setIsPasswordEditing}
              formLabel={<img src="/assets/logo/LumbaAuth.svg" alt="Lumba" />}
              buttonLabel="Show Modal"
              submitLabel="Save Changes"
              handleSubmit={async (formData, setFormData) => {
                try {
                  await axios.put(
                    `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/update_user_data/?username=${updatedUser.username}`,
                    formData,
                    {
                      headers: {
                        Authorization: `Token ${getCookie("token")}`,
                      },
                    }
                  );

                  toast.success("Changes saved.");

                  setUpdatedUser((prev) => ({
                    ...prev,
                    ...formData,
                  }));
                  setCookie("username", formData.username);
                } catch (err) {
                  const message = Object.values(err?.response?.data);
                  const errorMessage = message[0][0];
                  toast.error(errorMessage);
                } finally {
                  //   setFormData({});
                  setIsProfileEditing(false);
                }
              }}
            >
              <Input
                label={"Username"}
                name={"username"}
                placeholder="Type your username"
                inputValue={username}
                readOnly={!isProfileEditing}
                required
                boldLabel
              />
              <Input
                type="email"
                label={"Email"}
                name={"email"}
                placeholder="Type your email"
                inputValue={email}
                readOnly={!isProfileEditing}
                required
                boldLabel
              />
              <Input
                type="tel"
                pattern="[0-9]{4}[0-9]{4}[0-9]{4}"
                label={"Phone Number"}
                name={"no_telp"}
                placeholder="Type your phone number"
                inputValue={no_telp}
                readOnly={!isProfileEditing}
                required
                boldLabel
              />
              <HiddenInput name="profile_picture" defaultValue="" />
            </SettingsForm>
          </FormModalContextProvider>

          {isPasswordEditing && (
            <FormModalContextProvider>
              <ChangePasswordForm
                isPasswordEditing={isPasswordEditing}
                setIsPasswordEditing={setIsPasswordEditing}
                formLabel={<img src="/assets/logo/LumbaAuth.svg" alt="Lumba" />}
                buttonLabel="Show Modal"
                submitLabel="Save Changes"
                handleSubmit={async (formData, setFormData) => {
                  const { old_password, new_password, new_password2 } = formData;
                  if (new_password !== new_password2) {
                    toast.error("New password must match!");
                    return;
                  }
                  try {
                    await axios.put(
                      `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/update_user_password/?username=${updatedUser.username}`,
                      { old_password, new_password },
                      {
                        headers: {
                          Authorization: `Token ${getCookie("token")}`,
                        },
                      }
                    );

                    toast.success("Changes saved.");
                  } catch (err) {
                    const message = Object.values(err?.response?.data);
                    const errorMessage = message[0][0];
                    toast.error(errorMessage);
                  } finally {
                    //   setFormData({});
                    setIsPasswordEditing(false);
                  }
                }}
              >
                <PasswordInput
                  label={"Recent Password"}
                  name={"old_password"}
                  placeholder="Type your password"
                  readOnly={!isPasswordEditing}
                  required
                  boldLabel
                />

                <PasswordInput
                  label={"New Password"}
                  name={"new_password"}
                  placeholder="Type your password"
                  readOnly={!isPasswordEditing}
                  required
                  boldLabel
                />

                <PasswordInput
                  label={"Retype New Password"}
                  name={"new_password2"}
                  placeholder="Type your password"
                  readOnly={!isPasswordEditing}
                  required
                  boldLabel
                />
              </ChangePasswordForm>
            </FormModalContextProvider>
          )}
        </div>
      </main>
    </>
  );
}

export const getUser = async (username, token) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/get_user/?username=${username}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  const { data } = response;

  return data;
};

export async function getServerSideProps({ req }) {
  const username = parseCookie(req.headers.cookie, "username");
  const token = parseCookie(req.headers.cookie, "token");

  const user = await getUser(username, token);

  return {
    props: {
      user,
    },
  };
}
