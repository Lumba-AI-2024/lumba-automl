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

const CleaningPage = () => {
  const router = useRouter();
  const { workspaceName } = router.query;

  const username = useCookie("username");
  const { datasets } = useDatasets(workspaceName, username);

  const [checkedDataset, setCheckedDataset] = React.useState(null);
  const [columns, setColumns] = React.useState([]);

  const [isChecked, setIsChecked] = React.useState(false);
  const [isCleaned, setIsCleaned] = React.useState(false);

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

        const keys = [...Object.keys(data)];
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

  return (
    <>
      <Seo title={`${workspaceName} - Cleaning`} />
      <div className="h-full flex flex-col">
        <Breadcrumb
          links={[{ label: workspaceName }, { label: "Cleaning", href: "/workspace/" + workspaceName + "/cleaning" }]}
          active={"Cleaning"}
        />
        <FormModalContextProvider>
          <div className="mt-6">
            {/* Row 1 */}
            <div className="flex gap-3 items-center">
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
            </div>

            {/* Row 2 */}
            <CheckData workspace={workspaceName} setCheckedDataset={setCheckedDataset} setIsChecked={setIsChecked} />

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
                      const missing = formData?.missing ? 1 : 0;
                      const duplication = formData?.duplication ? 1 : 0;
                      const outlier = formData?.outlier ? 1 : 0;
                      const convert = formData?.targetTypeConvert && formData?.columns ? 1 : 0;
                      const normalize = formData?.methodNormalize ? 1 : 0;
                      const oversampling = formData?.columnsOversampling ? 1 : 0;

                      let columnsMissing =
                        typeof formData?.missing === "object"
                          ? Object.keys(formData.missing)
                            .filter((key) => formData.missing[key] === true)
                            .join(",")
                          : undefined;

                      columnsMissing = formData?.missing === "all" ? "" : columnsMissing;

                      let columnsDuplication =
                        typeof formData?.duplication === "object"
                          ? Object.keys(formData.duplication)
                            .filter((key) => formData.duplication[key] === true)
                            .join(",")
                          : undefined;

                      columnsDuplication = formData?.duplication === "all" ? "" : columnsDuplication;

                      const columnsConvert = formData?.columns?.join(",") || "";

                      let columnsNormalize =
                        typeof formData?.columnsNormalize === "object"
                          ? Object.keys(formData.columnsNormalize)
                            .filter((key) => formData.columnsNormalize[key] === true)
                            .join(",")
                          : undefined;

                      columnsNormalize = formData?.columnsNormalize === "all" ? "" : columnsNormalize;

                      // const body = {
                      //   filename: formData?.dataset,
                      //   missing,
                      //   duplication,
                      //   outlier,
                      //   columnsMissing,
                      //   columnsDuplication,
                      //   convert,
                      //   columnsConvert,
                      //   targetTypeConvert: formData?.targetTypeConvert,
                      //   username: username,
                      //   workspace: workspaceName,
                      //   normalize,
                      //   methodNormalize: formData?.methodNormalize,
                      //   columnsNormalize,
                      //   oversampling,
                      //   columnsOversampling: formData?.columnsOversampling,
                      // };
                      const body = new FormData();
                      body.append("username", username);
                      body.append("workspace", workspaceName);
                      body.append("datasetname", formData?.dataset);
                      body.append("missing", missing);
                      body.append("duplication", duplication);
                      body.append("outlier", outlier);
                      body.append("normalize", normalize);
                      body.append("convert", convert);
                      body.append("oversampling", oversampling);
                      body.append("columns_missing", columnsMissing ?? "");
                      body.append("columns_duplication", columnsDuplication ?? "");
                      body.append("columns_convert", columnsConvert ?? "");
                      body.append("columns_normalize", columnsNormalize ?? "");
                      body.append("columns_oversampling", formData?.columnsOversampling ?? "");
                      body.append("target_type_convert", formData?.targetTypeConvert ?? "");
                      body.append("method_normalize", formData?.methodNormalize);
                      body.append("type", type);

                      setTimeout(() =>
                        axios
                          .post(`${process.env.NEXT_PUBLIC_API_ROUTE}/preprocess/handle/`, body)
                          .then((res) => {
                            setDataset(res.data);
                            setIsCleaned(true);
                          })
                          .catch((err) => console.log(err))
                          .finally(() => setIsSubmitting(false))
                      );
                    };

                    submit();
                  }}
                >
                  <AccordionSelect names={["missing", "missingMode"]} label="Clean Missing Data" top={true}>
                    <p className="pb-1">Columns to be cleaned</p>
                    <Select
                      placeholder="Select column(s)"
                      name="missing"
                      defaultSelected={"all"}
                      items={[
                        { value: "all", label: "All Columns" },
                        {
                          value: "custom",
                          label: {
                            formLabel: "Select Columns",
                            buttonLabel: "Select Columns",
                            totalColumns: columns.length,
                            CustomButton: CustomButton,
                            name: "missing",
                            values: columns,
                          },
                        },
                      ]}
                    />
                    {/* <p className="mt-4 pb-1">Cleaning Mode</p>
										<Select
											placeholder="Select mode"
											name="missingMode"
											items={[
												{ value: "mean", label: "Replace with mean" },
												{ value: "median", label: "Replace with median" },
												{ value: "mode", label: "Replace with mode" },
												{ value: "entireRow", label: "Remove entire row" },
												{ value: "entireColumn", label: "Remove entire column" },
											]}
										/> */}
                  </AccordionSelect>
                  <AccordionSelect names={["duplication"]} label="Remove Duplicate Data">
                    <p className="pb-1">Columns to be cleaned</p>
                    <Select
                      placeholder="Select column(s)"
                      name="duplication"
                      defaultSelected={"all"}
                      items={[
                        { value: "all", label: "All Columns" },
                        {
                          value: "custom",
                          label: {
                            formLabel: "Select Columns",
                            buttonLabel: "Select Columns",
                            totalColumns: columns.length,
                            CustomButton: CustomButton,
                            name: "duplication",
                            values: columns,
                          },
                        },
                      ]}
                    />
                  </AccordionSelect>
                  <AccordionSelect names={["outlier", "outlierMode"]} label="Handle Outlier Data">
                    <p className="pb-1">Columns to be cleaned</p>
                    <Select
                      placeholder="Select column(s)"
                      name="outlier"
                      defaultSelected={"all"}
                      items={[
                        { value: "all", label: "All Columns" },
                        {
                          value: "custom",
                          label: {
                            formLabel: "Select Columns",
                            buttonLabel: "Select Columns",
                            totalColumns: columns.length,
                            CustomButton: CustomButton,
                            name: "outlier",
                            values: columns,
                          },
                        },
                      ]}
                    />
                  </AccordionSelect>
                  <AccordionSelect names={["columnsNormalize", "methodNormalize"]} label="Normalize Data">
                    <p className="pb-1">Columns to be cleaned</p>
                    <Select
                      placeholder="Select column(s)"
                      name="columnsNormalize"
                      defaultSelected={"all"}
                      items={[
                        { value: "all", label: "All Columns" },
                        {
                          value: "custom",
                          label: {
                            formLabel: "Select Numerical Columns",
                            buttonLabel: "Select Columns",
                            totalColumns: columns.length,
                            CustomButton: CustomButton,
                            name: "columnsNormalize",
                            values: columns,
                          },
                        },
                      ]}
                    />
                    <p className="pb-1 mt-3">Normalize method</p>
                    <Select
                      placeholder="Select method"
                      name="methodNormalize"
                      items={[
                        { value: "min_max_scaling", label: "Min Max Scaling" },
                        { value: "z-score", label: "Z-Score" },
                      ]}
                    />
                  </AccordionSelect>
                  <AccordionSelect names={["convertion"]} label="Convert Data Type">
                    <p className="pb-1">Columns to be converted</p>
                    <MultiSelect
                      variant="withBorder"
                      instanceId="select-multiple"
                      placeholder={"Select column(s)"}
                      name="columns"
                      defaultOptions={columns?.map((column) => ({ value: column, label: column }))}
                    />
                    <p className="pb-1 mt-3">Convertion</p>
                    <Select
                      placeholder="Select data type"
                      name="targetTypeConvert"
                      items={[
                        { value: "integer", label: "Integer" },
                        { value: "float", label: "Float" },
                        { value: "string", label: "String" },
                      ]}
                    />
                  </AccordionSelect>
                  <AccordionSelect
                    names={["columnsOversampling"]}
                    label="SMOTE"
                    bottom={true}
                    disabled={type === "forecasting"}
                  >
                    <p className="pb-1">Columns to be transformed</p>
                    <Select
                      placeholder="Select a column"
                      name="columnsOversampling"
                      items={columns?.map((column) => ({ value: column, label: column }))}
                      disabled={type === "forecasting"}
                    />
                  </AccordionSelect>
                </AccordionForm>
              </motion.div>
              {/* )} */}
              {/* </AnimatePresence> */}

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
                              Number of rows: <span className="font-bold text-sm">10</span>
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
        </FormModalContextProvider>
      </div>
    </>
  );
};

export default CleaningPage;
