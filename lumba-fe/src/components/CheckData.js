import * as React from "react";
import { FormModalContext } from "../context/FormModalContext";
import Button from "./Button/Button";
import FormModalContextProvider from "../context/FormModalContext";
import DetailsModal from "./Modal/DetailsModal";
import Spinner from "./Spinner";
import useCookie from "../hooks/useCookie";
import { useSearchParams } from "next/navigation";

const MissingDataIcon = () => {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2320_15090)">
        <path
          d="M17.8017 18.365C17.6855 18.2488 17.5475 18.1566 17.3957 18.0937C17.2439 18.0308 17.0811 17.9984 16.9167 17.9984C16.7524 17.9984 16.5896 18.0308 16.4378 18.0937C16.2859 18.1566 16.148 18.2488 16.0317 18.365C15.9155 18.4812 15.8233 18.6192 15.7604 18.771C15.6975 18.9229 15.6652 19.0856 15.6652 19.25C15.6652 19.4144 15.6975 19.5771 15.7604 19.729C15.8233 19.8808 15.9155 20.0188 16.0317 20.135L18.8992 23L16.0317 25.865C15.797 26.0997 15.6652 26.4181 15.6652 26.75C15.6652 27.0819 15.797 27.4003 16.0317 27.635C16.2665 27.8697 16.5848 28.0016 16.9167 28.0016C17.2487 28.0016 17.567 27.8697 17.8017 27.635L20.6667 24.7675L23.5317 27.635C23.7665 27.8697 24.0848 28.0016 24.4167 28.0016C24.7487 28.0016 25.067 27.8697 25.3017 27.635C25.5365 27.4003 25.6683 27.0819 25.6683 26.75C25.6683 26.4181 25.5365 26.0997 25.3017 25.865L22.4342 23L25.3017 20.135C25.5365 19.9003 25.6683 19.5819 25.6683 19.25C25.6683 18.9181 25.5365 18.5997 25.3017 18.365C25.067 18.1303 24.7487 17.9984 24.4167 17.9984C24.0848 17.9984 23.7665 18.1303 23.5317 18.365L20.6667 21.2325L17.8017 18.365Z"
          fill="currentColor"
        />
        <path
          d="M35.6667 35.5V11.75L24.4167 0.5H10.6667C9.34067 0.5 8.0689 1.02678 7.13121 1.96447C6.19353 2.90215 5.66675 4.17392 5.66675 5.5V35.5C5.66675 36.8261 6.19353 38.0979 7.13121 39.0355C8.0689 39.9732 9.34067 40.5 10.6667 40.5H30.6667C31.9928 40.5 33.2646 39.9732 34.2023 39.0355C35.14 38.0979 35.6667 36.8261 35.6667 35.5ZM24.4167 8C24.4167 8.99456 24.8118 9.94839 25.5151 10.6517C26.2184 11.3549 27.1722 11.75 28.1667 11.75H33.1667V35.5C33.1667 36.163 32.9034 36.7989 32.4345 37.2678C31.9657 37.7366 31.3298 38 30.6667 38H10.6667C10.0037 38 9.36782 37.7366 8.89898 37.2678C8.43014 36.7989 8.16675 36.163 8.16675 35.5V5.5C8.16675 4.83696 8.43014 4.20107 8.89898 3.73223C9.36782 3.26339 10.0037 3 10.6667 3H24.4167V8Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2320_15090">
          <rect width="40" height="40" fill="currentColor" transform="translate(0.666748 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const OutlierDataIcon = () => {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2320_15116)">
        <path
          d="M1.91675 0.5C2.24827 0.5 2.56621 0.631696 2.80063 0.866117C3.03505 1.10054 3.16675 1.41848 3.16675 1.75V39.25C3.16675 39.5815 3.03505 39.8995 2.80063 40.1339C2.56621 40.3683 2.24827 40.5 1.91675 40.5C1.58523 40.5 1.26729 40.3683 1.03286 40.1339C0.798444 39.8995 0.666748 39.5815 0.666748 39.25V1.75C0.666748 1.41848 0.798444 1.10054 1.03286 0.866117C1.26729 0.631696 1.58523 0.5 1.91675 0.5V0.5ZM5.66675 4.25C5.66675 3.91848 5.79844 3.60054 6.03286 3.36612C6.26729 3.1317 6.58523 3 6.91675 3H16.9167C17.2483 3 17.5662 3.1317 17.8006 3.36612C18.0351 3.60054 18.1667 3.91848 18.1667 4.25V6.75C18.1667 7.08152 18.0351 7.39946 17.8006 7.63388C17.5662 7.8683 17.2483 8 16.9167 8H6.91675C6.58523 8 6.26729 7.8683 6.03286 7.63388C5.79844 7.39946 5.66675 7.08152 5.66675 6.75V4.25ZM10.6667 14.25C10.6667 13.9185 10.7984 13.6005 11.0329 13.3661C11.2673 13.1317 11.5852 13 11.9167 13H29.4167C29.7483 13 30.0662 13.1317 30.3006 13.3661C30.5351 13.6005 30.6667 13.9185 30.6667 14.25V16.75C30.6667 17.0815 30.5351 17.3995 30.3006 17.6339C30.0662 17.8683 29.7483 18 29.4167 18H11.9167C11.5852 18 11.2673 17.8683 11.0329 17.6339C10.7984 17.3995 10.6667 17.0815 10.6667 16.75V14.25ZM15.6667 24.25C15.6667 23.9185 15.7984 23.6005 16.0329 23.3661C16.2673 23.1317 16.5852 23 16.9167 23H31.9167C32.2483 23 32.5662 23.1317 32.8006 23.3661C33.0351 23.6005 33.1667 23.9185 33.1667 24.25V26.75C33.1667 27.0815 33.0351 27.3995 32.8006 27.6339C32.5662 27.8683 32.2483 28 31.9167 28H16.9167C16.5852 28 16.2673 27.8683 16.0329 27.6339C15.7984 27.3995 15.6667 27.0815 15.6667 26.75V24.25ZM20.6667 34.25C20.6667 33.9185 20.7984 33.6005 21.0329 33.3661C21.2673 33.1317 21.5852 33 21.9167 33H39.4167C39.7483 33 40.0662 33.1317 40.3006 33.3661C40.5351 33.6005 40.6667 33.9185 40.6667 34.25V36.75C40.6667 37.0815 40.5351 37.3995 40.3006 37.6339C40.0662 37.8683 39.7483 38 39.4167 38H21.9167C21.5852 38 21.2673 37.8683 21.0329 37.6339C20.7984 37.3995 20.6667 37.0815 20.6667 36.75V34.25Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2320_15116">
          <rect width="40" height="40" fill="currentColor" transform="translate(0.666748 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const DuplicateDataIcon = () => {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2320_15103)">
        <path
          d="M8.16675 40.5H25.6667C26.9928 40.5 28.2646 39.9732 29.2023 39.0355C30.14 38.0979 30.6667 36.8261 30.6667 35.5C31.9928 35.5 33.2646 34.9732 34.2023 34.0355C35.14 33.0979 35.6667 31.8261 35.6667 30.5V5.5C35.6667 4.17392 35.14 2.90215 34.2023 1.96447C33.2646 1.02679 31.9928 0.5 30.6667 0.5H13.1667C11.8407 0.5 10.5689 1.02679 9.63121 1.96447C8.69353 2.90215 8.16675 4.17392 8.16675 5.5C6.84067 5.5 5.5689 6.02679 4.63121 6.96447C3.69353 7.90215 3.16675 9.17392 3.16675 10.5V35.5C3.16675 36.8261 3.69353 38.0979 4.63121 39.0355C5.5689 39.9732 6.84067 40.5 8.16675 40.5V40.5ZM8.16675 8V30.5C8.16675 31.8261 8.69353 33.0979 9.63121 34.0355C10.5689 34.9732 11.8407 35.5 13.1667 35.5H28.1667C28.1667 36.163 27.9034 36.7989 27.4345 37.2678C26.9657 37.7366 26.3298 38 25.6667 38H8.16675C7.50371 38 6.86782 37.7366 6.39898 37.2678C5.93014 36.7989 5.66675 36.163 5.66675 35.5V10.5C5.66675 9.83696 5.93014 9.20107 6.39898 8.73223C6.86782 8.26339 7.50371 8 8.16675 8ZM33.1667 30.5C33.1667 31.163 32.9034 31.7989 32.4345 32.2678C31.9657 32.7366 31.3298 33 30.6667 33H13.1667C12.5037 33 11.8678 32.7366 11.399 32.2678C10.9301 31.7989 10.6667 31.163 10.6667 30.5V5.5C10.6667 4.83696 10.9301 4.20107 11.399 3.73223C11.8678 3.26339 12.5037 3 13.1667 3H30.6667C31.3298 3 31.9657 3.26339 32.4345 3.73223C32.9034 4.20107 33.1667 4.83696 33.1667 5.5V30.5Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2320_15103">
          <rect width="40" height="40" fill="currentColor" transform="matrix(-1 0 0 -1 40.6667 40.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const BoxArrowUpRightIcon = () => {
  return (
    <svg width="9" height="8" viewBox="0 0 9 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2320_15122)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.98475 1.75C4.98475 1.6837 4.95841 1.62011 4.91152 1.57322C4.86464 1.52634 4.80105 1.5 4.73475 1.5H1.41675C1.21784 1.5 1.02707 1.57902 0.886418 1.71967C0.745766 1.86032 0.666748 2.05109 0.666748 2.25L0.666748 7.25C0.666748 7.44891 0.745766 7.63968 0.886418 7.78033C1.02707 7.92098 1.21784 8 1.41675 8H6.41675C6.61566 8 6.80643 7.92098 6.94708 7.78033C7.08773 7.63968 7.16675 7.44891 7.16675 7.25V3.932C7.16675 3.8657 7.14041 3.80211 7.09352 3.75522C7.04664 3.70834 6.98305 3.682 6.91675 3.682C6.85044 3.682 6.78686 3.70834 6.73997 3.75522C6.69309 3.80211 6.66675 3.8657 6.66675 3.932V7.25C6.66675 7.3163 6.64041 7.37989 6.59352 7.42678C6.54664 7.47366 6.48305 7.5 6.41675 7.5H1.41675C1.35044 7.5 1.28686 7.47366 1.23997 7.42678C1.19309 7.37989 1.16675 7.3163 1.16675 7.25V2.25C1.16675 2.1837 1.19309 2.12011 1.23997 2.07322C1.28686 2.02634 1.35044 2 1.41675 2H4.73475C4.80105 2 4.86464 1.97366 4.91152 1.92678C4.95841 1.87989 4.98475 1.8163 4.98475 1.75Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="0.5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.6667 0.25C8.6667 0.183696 8.64036 0.120107 8.59347 0.0732233C8.54659 0.0263392 8.483 0 8.4167 0L5.9167 0C5.85039 0 5.78681 0.0263392 5.73992 0.0732233C5.69304 0.120107 5.6667 0.183696 5.6667 0.25C5.6667 0.316304 5.69304 0.379893 5.73992 0.426777C5.78681 0.473661 5.85039 0.5 5.9167 0.5H7.8132L3.7397 4.573C3.71645 4.59624 3.69802 4.62384 3.68544 4.65421C3.67286 4.68458 3.66638 4.71713 3.66638 4.75C3.66638 4.78287 3.67286 4.81542 3.68544 4.84579C3.69802 4.87616 3.71645 4.90376 3.7397 4.927C3.76294 4.95024 3.79054 4.96868 3.82091 4.98126C3.85128 4.99384 3.88383 5.00032 3.9167 5.00032C3.94957 5.00032 3.98212 4.99384 4.01249 4.98126C4.04286 4.96868 4.07045 4.95024 4.0937 4.927L8.1667 0.8535V2.75C8.1667 2.8163 8.19304 2.87989 8.23992 2.92678C8.28681 2.97366 8.35039 3 8.4167 3C8.483 3 8.54659 2.97366 8.59347 2.92678C8.64036 2.87989 8.6667 2.8163 8.6667 2.75V0.25Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="0.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_2320_15122">
          <rect width="8" height="8" fill="white" transform="translate(0.666748)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const MissingDataButton = ({ onClick, children }) => {
  return (
    <button
      className="border-gray/30 border-r-[1.5px] w-full py-5 items-center gap-2 from-lightblue to-blue hover:bg-gradient-to-r cursor-pointer hover:text-white flex justify-center group"
      onClick={onClick}
    >
      <div className="text-[#C72C41] group-hover:text-white">
        <MissingDataIcon />
      </div>
      {/* {Object.values(missingData)[0]} */}
      <div>
        <span className="block text-left font-bold text-2xl">{children}</span>
        <span className="block text-left text-xs">Total Missing Data</span>
      </div>
      <div className="self-end mb-1.5 text-[#ABB5BE] group-hover:text-white">
        <BoxArrowUpRightIcon />
      </div>
    </button>
  );
};

const DuplicateDataButton = ({ onClick, children }) => {
  return (
    <button
      className="border-gray/30 border-r-[1.5px] w-full py-5 items-center gap-2 from-lightblue to-blue hover:bg-gradient-to-r cursor-pointer hover:text-white flex justify-center group"
      onClick={onClick}
    >
      <div className="text-[#C72C41] group-hover:text-white">
        <DuplicateDataIcon />
      </div>
      <div>
        <span className="block text-left font-bold text-2xl">{children}</span>
        <span className="block text-left text-xs">Total Duplicate Data</span>
      </div>
      <div className="self-end mb-1.5 text-[#ABB5BE] group-hover:text-white">
        <BoxArrowUpRightIcon />
      </div>
    </button>
  );
};

const OutlierDataButton = ({ onClick, children }) => {
  return (
    <button
      className=" w-full py-5 items-center gap-2 from-lightblue to-blue hover:bg-gradient-to-r cursor-pointer hover:text-white flex justify-center group"
      onClick={onClick}
    >
      <div className="text-[#C72C41] group-hover:text-white">
        <OutlierDataIcon />
      </div>
      <div>
        <span className="block text-left font-bold text-2xl">{children}</span>
        <span className="block text-left text-xs">Total Outlier Data</span>
      </div>
      <div className="self-end mb-1.5 text-[#ABB5BE] group-hover:text-white">
        <BoxArrowUpRightIcon />
      </div>
    </button>
  );
};

export default function CheckData({ workspace, setCheckedDataset, setIsChecked }) {
  const { formData } = React.useContext(FormModalContext);
  const [missingData, setMissingData] = React.useState(null);
  const [duplicateData, setDuplicateData] = React.useState(null);
  const [outlierData, setOutlierData] = React.useState(null);
  const [boxplotDatas, setBoxplotDatas] = React.useState(null);
  const [isChecking, setIsChecking] = React.useState(false);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const username = useCookie("username");
  React.useEffect(() => {
    if (missingData != null && duplicateData != null && outlierData != null && boxplotDatas != null) {
      setCheckedDataset(formData?.dataset);
      setIsChecked(true);
    }
  }, [missingData, duplicateData, outlierData, boxplotDatas]);

  return (
    <div className="mt-6 rounded-md shadow bg-white">
      <div className="relative p-4">
        <h3 className="font-semibold text-sm">Check Data</h3>
        <div className="h-[1.5px] bg-gray/30 w-full absolute left-0 mt-2"></div>
      </div>
      {missingData != null && duplicateData != null && outlierData != null ? (
        <div className="grid grid-cols-3 -mt-2">
          <FormModalContextProvider>
            <DetailsModal
              CustomButton={MissingDataButton}
              formLabel="Missing Data Details"
              buttonLabel={Object.values(missingData).reduce((a, b) => a + b, 0)}
              values={missingData}
              variant="missing"
            ></DetailsModal>
          </FormModalContextProvider>

          <FormModalContextProvider>
            <DetailsModal
              CustomButton={DuplicateDataButton}
              formLabel="Duplicate Data Details"
              buttonLabel={duplicateData}
              values={duplicateData}
              variant="duplicate"
            ></DetailsModal>
          </FormModalContextProvider>

          <FormModalContextProvider>
            <DetailsModal
              CustomButton={OutlierDataButton}
              formLabel="Outlier Data Details"
              buttonLabel={Object.values(outlierData).reduce((a, b) => a + b, 0)}
              values={outlierData}
              boxplotDatas={boxplotDatas}
              variant="outlier"
            ></DetailsModal>
          </FormModalContextProvider>
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="mb-4">
            Check data before cleaning to see information of missing data, duplicate data, and outliers
          </p>
          {formData?.dataset ? (
            <Button
              disabled={isChecking}
              onClick={() => {
                setIsChecking(true);
                const check = async () => {
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/checking?filename=${formData?.dataset}&username=${username}&workspace=${workspace}&type=${type}`
                  );
                  const { missingData, duplicateData, outlierData, boxplotDatas } = await res.json();
                  setMissingData(missingData);
                  setDuplicateData(duplicateData);
                  setOutlierData(outlierData);
                  setBoxplotDatas(boxplotDatas);
                };

                check();
              }}
            >
              {isChecking ? <div className="race-by white mx-3 my-1.5"></div> : "Check"}
            </Button>
          ) : (
            <Button variant="disabled" disabled={true}>
              Check
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
