import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import FormModalContextProvider from "../../../../../src/context/FormModalContext";
import Plus from "../../../../../src/components/Icon/Plus";
import UploadFile from "../../../../../src/components/Form/UploadFile";
import Dataset from "../../../../../src/components/Dataset";
import useDatasets from "../../../../../src/hooks/useDatasets";
import useCookie from "../../../../../src/hooks/useCookie";
import { useSearchParams } from "next/navigation";
import Seo from "../../../../../src/components/Seo";
import Button from "../../../../../src/components/Button/Button";
import SidebarAuto from "../../../../../src/components/SidebarAuto";
import FormModal from "../../../../../src/components/Form/FormModal";
import HiddenInput from "../../../../../src/components/Form/HiddenInput";
import Input from "../../../../../src/components/Form/Input";
import Select from "../../../../../src/components/Select/Select";
import * as React from "react";
import { FormModalContext } from "../../../../../src/context/FormModalContext";
import axios from "axios";
import { getCookie } from "../../../../../src/helper/cookies";
import useAutoML from "../../../../../src/hooks/useAutoML";
import { AutoMLContext } from '../../../../../src/context/AutoMLContext';




const upload = () => {

    const router = useRouter();
    const { formData } = React.useContext(FormModalContext);

    let searchParams = useSearchParams();
    const type = searchParams.get("type");

    const { workspaceName } = router.query;
    const [file, setFile] = useState(null);
    const username = useCookie("username");

    const { datasets, addDataset } = useDatasets(workspaceName, username, type);
    const { autoMLs, addAutoML } = useAutoML(workspaceName, username, type);
    const [isUploading, setIsUploading] = useState(false);

    const [isChecked, setIsChecked] = useState(false);
    const [dataset, setDataset] = useState(formData?.dataset);
    const [columns, setColumns] = useState([]);
    const [selectedTrainingColumns, setSelectedTrainingColumns] = useState(columns);
    const [selectedTargetColumn, setSelectedTargetColumn] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [autoMLName, setAutoMLName] = useState('');
    const { appendAutoMLData } = useContext(AutoMLContext);



    const back = () => {
        router.push(`/workspace/${workspaceName}/automl?type=${type}`);
    };

    const next = async () => {
        if (!dataset) {
            alert("Please select a dataset.");
            return;
        }
        else if (!selectedTargetColumn && selectedMethod !== "CLUSTERING") {
            alert("Please select a target column.");
            return;
        }
        console.log(dataset)
        const autoML = {
            username,
            workspace: workspaceName,
            datasetname: dataset,
            automlname: autoMLName,
            method: formData?.autoMlType,
            feature: selectedTrainingColumns,
            target: selectedTargetColumn,
            automlname: formData?.name,
          };
      

        appendAutoMLData(autoML);
        try {
            setIsUploading(false);
            setIsChecked(true);
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
        router.push(`/workspace/${workspaceName}/automl/newProject/preprocess?type=${type}&automlname=${formData?.name}&checkedDataset=${dataset}&selectedTargetColumn=${selectedTargetColumn}&selectedTrainingColumns=${selectedTrainingColumns}`);
    };

    // Update dataset when formData changes
    useEffect(() => {
        if (formData?.dataset && formData?.dataset !== dataset) {
            setDataset(formData?.dataset);
        }
    }, [formData, dataset]);

    // Fetch dataset details
    useEffect(() => {
        if (dataset && workspaceName && username && type) {
            fetchDataset();
        }
    }, [dataset, workspaceName, username, type]);

    useEffect(() => {
        if (formData.autoMlType) {
            setSelectedMethod(formData.autoMlType);
        }
    }, [formData.autoMlType]);

    const fetchDataset = async () => {
        const DATASET = `${process.env.NEXT_PUBLIC_API_ROUTE}/file/?datasetname=${dataset}&workspace=${workspaceName}&username=${username}&page=1&rowsperpage=15&type=${type}`;

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
    console.log(columns)

    // Function to handle selection of target column
    const handleSelectTargetColumn = (column) => {
        setSelectedTargetColumn(column);
        // Select all training columns except the target column
        setSelectedTrainingColumns(columns.filter(item => item !== column));
    };

    const handleSelectTrainingColumn = (column) => {
        if (selectedTrainingColumns.includes(column)) {
            setSelectedTrainingColumns(selectedTrainingColumns.filter(item => item !== column));
        } else {
            setSelectedTrainingColumns([...selectedTrainingColumns, column]);
        }
    };

    return (
        <>
            <Seo title={`${workspaceName} - AutoML`} />
            <div className="flex">
                <SidebarAuto />
                <div className="flex-1 p-8">  
                    <Breadcrumb links={[
                        { label: workspaceName },
                        { label: "AutoML", href: "/workspace/" + workspaceName + "/automl" },
                        { label: "New Project", href: router.asPath }
                    ]} active={"New Project"} />
                    <div className="flex flex-col gap-6 my-6">
                        <h1>Create a new automated ML Job</h1>
                    </div>
                    <div className="vertical-form-container">
                        <HiddenInput name="username" defaultValue={username} />

                        <div className="form-field">
                            <Input 
                                label={"Name"} 
                                name={"name"} 
                                placeholder="AutoML job name" 
                                required />
                        </div>

                        <div className="form-field">
                            <p className="form-label">Will Be Used For</p>
                            <Select
                                name="autoMlType"
                                placeholder="- Select -"
                                items={[
                                    { label: "Classification", value: "CLASSIFICATION" },
                                    { label: "Regression", value: "REGRESSION" },
                                    { label: "Clustering", value: "CLUSTERING", },
                                ]}
                                onChange={(e) => {
                                    setSelectedMethod(e.target.value); 
                                }}
                            />
                            {console.log(selectedMethod)}
                        </div>
                        <h4 className="mt-4">Please choose one either to upload or select dataset</h4>
                        <FormModalContextProvider>
                            <div className="mt-4 form-field upload-field">
                                <UploadFile
                                    buttonLabel={
                                        <div className="flex font-semibold items-center gap-1">
                                            <Plus />
                                            Upload
                                        </div>
                                    }
                                    formLabel="Upload File Datasets"
                                    handleSubmit={async (formData) => {
                                        setIsUploading(true);
                                        const dataset = new FormData();
                                        dataset.append("file", formData?.file);
                                        dataset.append("username", username);
                                        dataset.append("workspace", workspaceName);
                                        dataset.append("type", type);
                                        try {
                                            await addDataset(dataset);
                                            setIsUploading(false);
                                            setIsChecked(true);
                                            setDataset(formData?.file["name"]);
                                            console.log(formData?.file["name"]);
                                        } catch (error) {
                                            console.error('Upload failed:', error);
                                            setIsUploading(false);
                                        }
                                    }}
                                    workspaceType={type}
                                />
                            </div>
                        </FormModalContextProvider>
                        <div className="mt-4 flex gap-3 items-center">
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
                    </div>

                    {columns.length > 0 && (
                        <>
                            <h2 className="mt-4 mb-2">Select Columns for AutoML Job</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedMethod != "CLUSTERING" && (<div>
                                    <h4>Select Target Column</h4>
                                    {columns.map(column => (
                                        <div key={column}>
                                            <input
                                                className="mr-2"
                                                type="radio"
                                                name="targetColumn"
                                                checked={selectedTargetColumn === column}
                                                onChange={() => handleSelectTargetColumn(column)}
                                                disabled={selectedTrainingColumns.includes(column)}
                                                required={selectedTargetColumn === column}
                                            />
                                            {column}
                                        </div>
                                    ))}
                                </div>)}
                                <div>
                                    <h4>Select Columns to be Trained</h4>
                                    {columns.map(column => (
                                        <div key={column}>
                                            <input
                                                className="mr-2"
                                                type="checkbox"
                                                checked={
                                                    selectedTargetColumn === null ||
                                                    (selectedTargetColumn !== column && selectedTrainingColumns.includes(column))
                                                }
                                                onChange={() => handleSelectTrainingColumn(column)}
                                                disabled={selectedTargetColumn === column}
                                            />
                                            {column}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}


                    <div className="flex justify-between items-center my-6">
                        <div className="mr-4 flex items-center gap-1">
                            <Button onClick={back} className="flex items-center gap-1">
                                <div className="flex font-semibold items-center gap-1">
                                    Back
                                </div>
                            </Button>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button onClick={next} className="flex items-center gap-1">
                                <div className="flex font-semibold items-center gap-1">
                                    Next
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default upload;