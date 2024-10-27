import { useState } from "react";
import { useRouter } from "next/router";
// import Breadcrumb from "../../../../../src/components/Breadcrumb";
// import FormModalContextProvider from "../../../../../src/context/FormModalContext";
// import Plus from "../../../../../src/components/Icon/Plus";
// import UploadFile from "../../../../../src/components/Form/UploadFile";
// import Dataset from "../../../../../src/components/Dataset";
import useDatasets from "../../../../../../../src/hooks/useDatasets";
import { useSearchParams } from "next/navigation";
import Seo from "../../../../../../../src/components/Seo";
// import CheckData from "../../../../../src/components/CheckData";
import useCookie from "../../../../../../../src/hooks/useCookie";
import Model from "../../../../../../../src/components/Model";
import useModels from "../../../../../../../src/hooks/useModels";
import Breadcrumb from "../../../../../../../src/components/Breadcrumb";
import { useContext } from "react";
import { AutoMLContext } from "../../../../../../../src/context/AutoMLContext";
import useAutoML from "../../../../../../../src/hooks/useAutoML";
// import axios from "axios";



const modelling = () => {
    
    const router = useRouter();
    const { autoMLName, workspaceName } = router.query;
    const searchParams = useSearchParams();
    const username = useCookie("username");
    const type = searchParams.get("type");
    const { autoMLs, addAutoML } = useAutoML(workspaceName, username, type);
    const selectedAutoML = autoMLs.find((autoML) => autoML.name === autoMLName);
    const selectedModels = selectedAutoML?.automlmodels || [];    
    console.log(selectedModels)
    const projectTitle = autoMLName ? `${autoMLName} Project` : "AutoML Project";
    
    const parseAndSortModels = (models) => {
        return models.map((model) => {
            let parsedScore = null;
            try {
                parsedScore = JSON.parse(model.score);
                // if (selectedAutoML.method === 'CLUSTERING') {
                //     parsedScore = parseFloat(parsedScore)
                // }
            } catch (error) {
                console.error(`Failed to parse score for model ${model.name}:`, error);
            }
            return {
                ...model,
                parsedScore,
            };
        }).sort((a, b) => {
            if (selectedAutoML.method === 'REGRESSION') {
                console.log(a)
                return parseFloat(b.parsedScore.r2_score) - parseFloat(a.parsedScore.r2_score);
            } else if (selectedAutoML.method === 'CLASSIFICATION') {
                return parseFloat(b.parsedScore.accuracy_score) - parseFloat(a.parsedScore.accuracy_score);
            } else if (selectedAutoML.method === 'CLUSTERING') {
                console.log("bbb",b)
                return parseFloat(b.parsedScore.silhouette_score) - parseFloat(a.parsedScore.silhouette_score);
            }
        });
    };

    const sortedModels = parseAndSortModels(selectedModels);
    console.log(sortedModels)

    return (
        <>
            <Seo title={`${workspaceName} - AutoML`} />
            <div className="h-full flex flex-col">
                <div className="flex items-center">
                    <div className="flex-1">
                        <Breadcrumb links={[
                            { label: workspaceName },
                            { label: "AutoML", href: "/workspace/" + workspaceName + "/automl" },
                            { label: projectTitle, href: router.asPath },
                        ]} active={projectTitle} />
                    </div>
                </div>
                <div className="flex flex-col gap-6 my-6">
                    <h1>{projectTitle}</h1>
                </div>
                <div className="flex flex-col my-1">
                    <h2>Leaderboard Model Result</h2>
                </div>
                {selectedModels?.length > 0 ? (
                    <table className="mt-4">
                        <thead>
                            <tr>
                                <th className="px-4">Dataset & Model Name</th>
                                <th className="px-4">Metric & Score</th>
                                <th className="px-4">Prediction Time</th>
                                <th className="px-4">Method & Algorithm</th>
                                <th className="px-4">Train Date</th>
                                <th className="px-4">Actions</th>
                                <th className="px-4">Explain</th>
                                <th className="px-4">Status</th>
                            </tr>
                            <tr className="border-b border-gray/50">
                                <td colSpan="100%" className="pt-4"></td>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedModels.map((model) => (
                                <Model username={username} workspace={workspaceName} key={model.id} isAuto={true} file={model.model_file} {...model} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex-1 grid place-items-center">
                        <div className="flex flex-col items-center justify-center">
                            <img src="/assets/LumbaEmpty.svg" alt="No Datasets Found" className="w-[280px]" />
                            <div className="flex flex-col gap-4 mt-8 items-center">
                                <h1 className="font-medium">No Models Found</h1>
                                <span>Create your model to train and test it here</span>
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </>
    );
};

export default modelling;