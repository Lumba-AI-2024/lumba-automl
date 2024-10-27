import { useRouter } from "next/router";
import Breadcrumb from "../../Breadcrumb";
import Seo from "../../Seo";
import FormModalContextProvider from "../../../context/FormModalContext";
import * as React from "react";
import Select from "../../Select/Select";
import Button from "../../Button/Button";
import AccordionForm from "../../Form/AccordionForm";
import AccordionSelect from "../../Select/AccordionSelect";
import Table from "../../Table";
import TableBody from "../../Table/TableBody";
import TableHead from "../../Table/TableHead";
import CheckData from "../../CheckData";
import axios from "axios";
import useDatasets from "../../../hooks/useDatasets";
import { getCookie } from "../../../../src/helper/cookies";
import MultiSelect from "../../../../src/components/Select/MultiSelect";
import useCookie from "../../../../src/hooks/useCookie";
import ChevronDoubleLeft from "../../../../src/components/Icon/ChevronDoubleLeft";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import CheckDataAuto from "../../CheckDataAuto";
import { AutoMLContext } from '../../../../src/context/AutoMLContext';
import { useState, useContext } from "react";


const CustomButton = ({ onClick }) => {
  return (
    <div className="w-full flex justify-between items-center" onClick={onClick}>
      Custom
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        fill="currentColor"
        className="bi bi-chevron-right"
        viewBox="0 0 16 16"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>
  );
};

const getKeysValues = (dataset) => {
  if (!dataset) {
    return { keys: [], values: [] };
  }

  const keys = [...Object.keys(dataset)];
  if (keys[0] === "Unnamed: 0" || !keys[0]) {
    keys.shift();
  }

  const k = keys[0];
  const value = Object.values(dataset[k]);

  const values = value.map((item, index) => {
    const obj = {};
    obj["#"] = index + 1;
    keys.forEach((key) => {
      if (dataset[key][index.toString()] != undefined) {
        obj[key] = dataset[key][index.toString()];
      }
    });
    return obj;
  });
  keys.unshift("#");

  return { keys, values };
};

const PreprocessPage = ({ onFormDataChange }) => {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = React.useState(null);
  const { selectedTargetColumn } = router.query;
  const { selectedTrainingColumns } = router.query;
  React.useEffect(() => {
    if (router.isReady && router.query !== null) {
      const { workspaceName } = router.query;

      setWorkspaceName(workspaceName);
    }
  }, [router.isReady]);

  console.log(workspaceName)

  const username = useCookie("username");
  const { datasets } = useDatasets(workspaceName, username);

  const [checkedDataset, setCheckedDataset] = React.useState(null);
  const [columns, setColumns] = React.useState([]);
  const [row,setRow] = React.useState(null)

  const [isChecked, setIsChecked] = React.useState(false);
  const [isCleaned, setIsCleaned] = React.useState(false);
  const [categoricalColumn, setCategoricalColumn] = React.useState([]);
  const { autoMLData, appendAutoMLData } = useContext(AutoMLContext);


  const handleCategoricalData = (data) => {
    setCategoricalColumn(data);
  };

  const [isOpen, setIsOpen] = React.useState(true);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  React.useEffect(() => {
    if (checkedDataset && type) {
      const fetchDataset = async () => {
        const DATASET = `${process.env.NEXT_PUBLIC_API_ROUTE}/file/?datasetname=${checkedDataset}&workspace=${workspaceName}&username=${username}&page=1&rowsperpage=15&type=${type}`;

        const { data } = await axios.get(DATASET, {
          headers: {
            Authorization: `Token ${getCookie("token")}`,
          },
        });
        console.log("data",data)
        const keys = [...Object.keys(data)];
        console.log("keys",keys)
        if (keys[0] === "Unnamed: 0") {
          keys.shift();
        }
        setColumns(keys);
      };
      fetchDataset();
    }
  }, [checkedDataset, username, type]);

  const [dataset, setDataset] = React.useState(null);

  const { keys, values } = getKeysValues(dataset);

  let columnsOrdinal = {};
  // const [columnsOrdinal, setColumnsOrdinal] = useState({});
  console.log(checkedDataset, "dan", isCleaned)

  return (
    <>
      <Seo title={`${workspaceName} - Cleaning`} />
      <div className="h-full flex flex-col">
        <Breadcrumb links={[
          { label: workspaceName },
          { label: "AutoML", href: "/workspace/" + workspaceName + "/automl" },
          { label: "New Project", href: "/workspace/" + workspaceName + "/automl" + "/newProject" + "/upload" },
          { label: "Preprocess", href: router.asPath }
        ]} active={"Preprocess"} />
        <FormModalContextProvider>
          <div className="mt-6">
            {/* Row 1 */}
            {/* <div className="flex gap-3 items-center">
              <div className="flex flex-col gap-1 w-full">
                <span className="font-semibold">Select Dataset</span>
                <Select
                  isDisabled={isChecked}
                  variant="withoutBorder"
                  placeholder="Select dataset..."
                  name="dataset"
                  items={datasets?.map((dataset) => ({ value: dataset.name, label: dataset.name })) || []}
                />
              </div>
            </div> */}

            {/* Row 2 */}
            <CheckDataAuto workspace={workspaceName} setCheckedDataset={setCheckedDataset} setIsChecked={setIsChecked} onColumnDataChange={handleCategoricalData} />

            {/* Row 3 */}
            <div className="mt-8 pb-4 flex overflow-hidden">
              {/* <AnimatePresence initial={false}> */}
              {/* {isOpen && ( */}
              <motion.div initial={false} animate={{ width: isOpen ? 280 : 0 }}>
                <AccordionForm
                  isDisabled={!checkedDataset || isCleaned}
                  handleSubmit={(formData, setIsSubmitting) => {
                    const submit = () => {
                      setIsSubmitting(true);
                      // const missing = formData?.missing ? 1 : 0;
                      // const duplication = formData?.duplication ? 1 : 0;
                      // const outlier = formData?.outlier ? 1 : 0;
                      // const convert = formData?.targetTypeConvert && formData?.columns ? 1 : 0;
                      // const normalize = formData?.methodNormalize ? 1 : 0;
                      // const oversampling = formData?.columnsOversampling ? 1 : 0;
                      const ordinal = formData?.ordinal ? 1 : 0;

                      // let columnsMissing =
                      //   typeof formData?.missing === "object"
                      //     ? Object.keys(formData.missing)
                      //         .filter((key) => formData.missing[key] === true)
                      //         .join(",")
                      //     : undefined;

                      // columnsMissing = formData?.missing === "all" ? "" : columnsMissing;


                      columnsOrdinal =
                        typeof formData?.ordinal === "object"
                          ?
                          Object.keys(formData.ordinal)
                            .filter(key => formData.ordinal[key].checked)  // Filter out only checked items
                            .reduce((acc, key) => {
                              // Split the rank string by commas and create an object where each item is keyed by its name with its rank as the value
                              const rankValues = formData.ordinal[key].rank.split(',').reduce((rankAcc, value, index) => {
                                rankAcc[value] = index + 1;
                                return rankAcc;
                              }, {});

                              acc[key] = rankValues;  // Assign the created object to the respective key
                              return acc;
                            }, {}) : {};

                      console.log(columnsOrdinal);
                      console.log(formData?.ordinal);
                      
                      const body = new FormData();
                      body.append("username", username);
                      body.append("workspace", workspaceName);
                      body.append("datasetname", checkedDataset);
                      body.append("ordinal", ordinal)
                      body.append("dict_ordinal_encoding", JSON.stringify(columnsOrdinal) ?? "")
                      body.append("type", type);
                      body.append("selectedTargetColumn", selectedTargetColumn);
                      body.append("selectedTrainingColumns", selectedTrainingColumns);

                      autoMLData.append("ordinal", ordinal)
                      autoMLData.append("ordinal_dict", JSON.stringify(columnsOrdinal) ?? "")
                      onFormDataChange(body);
                      console.log("body", body.get("dict_ordinal_encoding"));
                      console.log(columnsOrdinal)

                      setTimeout(() =>
                        axios
                          .post(`${process.env.NEXT_PUBLIC_API_ROUTE}/preprocess/clean/`, body)
                          .then((res) => {
                            console.log("response hasil",res.data)
                            const datasetWithoutRow = { ...res.data };
                            setRow(datasetWithoutRow.row)
                            delete datasetWithoutRow["row"]; // Remove the 'row' attribute
                            console.log("cobaa",datasetWithoutRow)
                            setDataset(datasetWithoutRow.preview);
                            setIsCleaned(true);
                          })
                          .catch((err) => console.log(err))
                          .finally(() => setIsSubmitting(false))
                      );
                      console.log(body);
                    };

                    submit();

                  }}
                >
                  <AccordionSelect names={["ordinal"]} label="Ordinal Columns">
                    <p className="pb-1">Columns to be ranked</p>
                    <Select
                      placeholder="Select column(s)"
                      name="ordinal"
                      defaultSelected={""}
                      items={[
                        {
                          value: "custom",
                          label: {
                            formLabel: "Select Columns",
                            buttonLabel: "Select Columns",
                            totalColumns: Object.keys(categoricalColumn).length,
                            CustomButton: CustomButton,
                            name: "ordinal",
                            values: Object.keys(categoricalColumn),
                          },
                        },
                      ]}
                    />
                  </AccordionSelect>
                </AccordionForm>
              </motion.div>
              {Object.keys(columnsOrdinal).length > 0 && (
                <div className="mt-4 ml-4">
                  <h3>Ordinal Data Rankings</h3>
                  {Object.entries(columnsOrdinal).map(([key, values]) => (
                    <div key={key}>
                      <h4>{key}</h4>
                      <ul>
                        {Object.entries(values).map(([item, rank]) => (
                          <li key={item}>{rank}. {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

              )}{console.log("disini 486", columnsOrdinal)}

              <div className="rounded-r-md shadow bg-white flex-1 min-h-[480px] overflow-auto">
                <div className="h-full flex flex-col w-full">
                  <div className="border-b-[1.5px] border-gray/30 py-3 px-4 flex gap-2 items-center">
                    <button onClick={() => setIsOpen((prev) => !prev)} className={`${!isOpen && "rotate-180"}`}>
                      <ChevronDoubleLeft />
                    </button>
                    <h3>Data Clean Result</h3>
                  </div>
                  {isCleaned ? (
                    <>
                      <div className="w-full h-full flex flex-col">
                        <div className="flex-1 px-4">
                          <div className="flex gap-48 mt-4">
                            <span className="text-xs">
                              Number of columns: <span className="font-bold text-sm">{columns.length}</span>
                            </span>
                            <span className="text-xs">
                              Number of rows: <span className="font-bold text-sm">{row}</span>
                            </span>
                          </div>
                          <div className="py-2 w-full overflow-auto">
                            <Table>
                              <TableHead cols={keys} />
                              <TableBody data={values} cols={keys} />
                            </Table>
                          </div>
                        </div>
                        <div className="text-end mb-2 mr-2 mt-3 pt-4 border-t-[1.5px] border-gray/30">
                          <div className="px-4">
                            <Button
                              onClick={() => {
                                router.push("/workspace/" + workspaceName + "/datasets?type=" + type);
                              }}
                            >
                              Save Data
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center flex-1">
                      <span>No Output</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FormModalContextProvider >
      </div >
    </>
  );
};

export default PreprocessPage;
