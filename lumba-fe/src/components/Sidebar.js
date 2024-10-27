import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FormModalContextProvider from "../context/FormModalContext";
import Form from "./Form";
import Select from "./Select/Select";
import { WORKSPACE, getAllWorkspace } from "../hooks/useWorkspaces";
import useSWR from "swr";
import useCookie from "../hooks/useCookie";

const HomeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-house-door"
      viewBox="0 0 16 16"
    >
      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
    </svg>
  );
};

const DatasetsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-clipboard-data"
      viewBox="0 0 16 16"
    >
      <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z" />
      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
    </svg>
  );
};

const CleaningIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-eraser"
      viewBox="0 0 16 16"
    >
      <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
    </svg>
  );
};

const ModelingIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-diagram-2"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 5 7h2.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM3 11.5A1.5 1.5 0 0 1 4.5 10h1A1.5 1.5 0 0 1 7 11.5v1A1.5 1.5 0 0 1 5.5 14h-1A1.5 1.5 0 0 1 3 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
      />
    </svg>
  );
};
const RocketIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-rocket"
      viewBox="0 0 16 16"
    >
      <path d="M9.75245 6.19313C10.3508 6.79238 11.4826 6.63045 12.2804 5.83145C13.0782 5.03245 13.2398 3.89894 12.6415 3.29969C12.0432 2.70044 10.9114 2.86237 10.1136 3.66137C9.31579 4.46037 9.15411 5.59388 9.75245 6.19313Z" fill="black"/>
      <path d="M15.8112 3.31208C15.4485 4.8461 14.4768 6.93819 12.1705 9.52996L11.9314 11.9383C11.8673 12.5154 11.6091 13.0536 11.1991 13.4642L8.81673 15.8502C8.66128 16.0059 8.42382 16.0444 8.2272 15.946C8.03059 15.8475 7.91892 15.6341 7.95001 15.4162L8.22089 13.5171C8.26089 13.2367 8.20713 12.9239 8.08886 12.5609C8.01297 12.328 7.92902 12.1222 7.84006 11.9041C7.81316 11.8381 7.78581 11.7711 7.75808 11.7018C6.94285 11.5047 6.18017 11.0395 5.56655 10.425C4.95281 9.81031 4.48832 9.04629 4.29154 8.22962C4.22199 8.20174 4.15469 8.17424 4.08852 8.1472C3.87126 8.05842 3.66624 7.97463 3.43388 7.89875C3.07139 7.78038 2.75902 7.72656 2.47913 7.76661L0.58295 8.0379C0.365333 8.06904 0.152244 7.95721 0.0539342 7.76029C-0.0443756 7.56337 -0.00584799 7.32555 0.149594 7.16987L2.53193 4.78392C2.94194 4.37328 3.47928 4.11462 4.05558 4.05049L4.06165 4.04986L6.46179 3.8118C9.00472 1.55098 11.087 0.582121 12.6233 0.207845C13.5139 -0.00910254 14.2136 -0.0243084 14.7031 0.0202655C14.9474 0.0425107 15.1382 0.0795288 15.273 0.113075C15.3404 0.129842 15.3938 0.145724 15.4328 0.158432C15.6175 0.218514 15.7117 0.288877 15.7841 0.452645L15.7846 0.453753C15.7949 0.477324 15.8042 0.501424 15.813 0.525597C15.8271 0.564363 15.8447 0.61716 15.8634 0.683788C15.9009 0.817113 15.9428 1.0055 15.9702 1.24725C16.0251 1.73184 16.021 2.42489 15.8112 3.31208ZM10.9835 10.7867L11.0232 10.7468L10.9159 11.828C10.8769 12.1733 10.7222 12.4951 10.4768 12.7409L9.17785 14.0418L9.23206 13.6618C9.30429 13.1554 9.19807 12.6676 9.0599 12.2435C9.01248 12.098 8.95516 11.9442 8.89585 11.7923C9.63371 11.7277 10.3583 11.4128 10.9835 10.7867ZM5.20542 4.99979C4.58026 5.6259 4.26587 6.3515 4.20128 7.09042C4.04954 7.03102 3.89579 6.9736 3.75053 6.92617C3.32718 6.78791 2.84021 6.68157 2.33468 6.7539L1.95525 6.80819L3.25419 5.50728C3.49953 5.26156 3.82087 5.10654 4.16559 5.06754L5.24472 4.9605L5.20542 4.99979ZM14.6106 1.03905C14.2312 1.00451 13.6444 1.0119 12.8647 1.20185C11.3066 1.58143 8.94827 2.69797 5.92768 5.72315C5.3081 6.34367 5.12905 7.06374 5.24142 7.77407C5.34828 8.44962 5.72438 9.13634 6.28881 9.70163C6.85309 10.2668 7.53854 10.6434 8.21288 10.7505C8.92233 10.8633 9.64152 10.684 10.2612 10.0633C13.3399 6.97993 14.4526 4.61891 14.8173 3.07636C14.9997 2.30491 14.997 1.73067 14.9553 1.36262C14.9425 1.24954 14.9259 1.15534 14.9096 1.0803C14.8305 1.06516 14.7307 1.04998 14.6106 1.03905Z" fill="black"/>
      <path d="M7.00888 12.1388C6.36239 11.7966 5.74678 11.3289 5.20542 10.7867C4.6309 10.2113 4.14009 9.55215 3.79403 8.86118C2.69212 9.85303 1.82893 13.9153 1.95525 14.0418C2.08043 14.1672 5.89051 13.1455 7.00888 12.1388Z" fill="black"/>
    </svg>
  );
};
const ComponentsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-boxes"
      viewBox="0 0 16 16"
    >
      <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z" />
    </svg>
  );
};

const links = [
  { label: "Home", icon: <HomeIcon />, href: "" },
  { label: "Datasets", icon: <DatasetsIcon />, href: "datasets" },
  { label: "Cleaning", icon: <CleaningIcon />, href: "cleaning" },
  { label: "Modeling", icon: <ModelingIcon />, href: "modeling" },
  { label: "AutoML", icon: <RocketIcon />, href: "automl" },
];

const NavLink = ({ href, label, icon, active, setActive, workspaceName }) => {
  return (
    <Link href={`/workspace/${workspaceName}/${href}`}>
      <li
        onClick={() => setActive(href)}
        className={`flex gap-3 items-center font-medium hover:text-lightblue cursor-pointer transition duration-300 ${
          active === href && "text-lightblue"
        }`}
      >
        {active === href && <span className="absolute left-0 rounded-r-[4px] h-6 w-1.5 bg-lightblue"></span>}
        {icon}
        <span className="">{label}</span>
      </li>
    </Link>
  );
};

export default function Sidebar() {
  const router = useRouter();
  const { asPath } = router;

  const [active, setActive] = React.useState(() => (asPath.split("/")[3] ? asPath.split("/")[3] : ""));
  const username = useCookie("username");
  const { data: workspaces } = useSWR([WORKSPACE, username], ([WORKSPACE, username]) =>
    getAllWorkspace(WORKSPACE, username)
  );

  const { workspaceName } = router.query;

  const currentWorkspace = workspaces?.filter((ws) => ws.name === workspaceName)[0];

  React.useEffect(() => {
    setActive(asPath.split("/")[3] ? asPath.split("/")[3] : `?type=${currentWorkspace?.type}`);
  }, [asPath, currentWorkspace]);

  if (asPath.split("/")[1] !== "workspace") return null;

  return (
    <div className="relative py-4 pl-8 h-[calc(100vh-55px)] bg-white shadow pr-4">
      <Link
        href="/"
        className="hover:text-transparent hover:bg-clip-text bg-gradient-to-r hover:from-lightblue hover:to-blue block mb-3"
      >
        &lt; Back to workspace
      </Link>
      <FormModalContextProvider>
        <Form handleSubmit={() => {}}>
          <div className="flex gap-2 items-center mb-2">
            <Select
              placeholder="Select workspace..."
              name="workspace"
              defaultSelected={workspaceName}
              items={workspaces?.map((workspace) => ({
                value: workspace.name,
                label: workspace.name,
              }))}
              onChange={(workspace) => {
                const ws = workspaces?.filter((ws) => ws.name === workspace);
                const { name, type } = ws[0];
                router.push(`/workspace/${name}?type=${type}`);
              }}
            />
          </div>
        </Form>
      </FormModalContextProvider>
      <ul className="flex flex-col gap-8 py-4">
        {links.map((link) => (
          <NavLink
            key={link.label}
            href={link.href + `?type=${currentWorkspace?.type}`}
            workspaceName={workspaceName}
            label={link.label}
            icon={link.icon}
            active={active}
            setActive={setActive}
          />
        ))}
        {process.env.NEXT_PUBLIC_NODE_ENV === "DEVELOPMENT" && (
          <Link href="/components">
            <li
              className={`flex gap-3 items-center font-medium hover:text-lightblue cursor-pointer transition duration-300`}
            >
              <ComponentsIcon />
              <span className="">Components</span>
            </li>
          </Link>
        )}
      </ul>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20">
        <img src="/assets/LumbaSidebar.svg" alt="Lumba" />
      </div>
    </div>
  );
}
