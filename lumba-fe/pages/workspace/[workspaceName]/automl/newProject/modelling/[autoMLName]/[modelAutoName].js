import { useState } from "react";
import { useRouter } from "next/router";
import useDatasets from "../../../../../../../src/hooks/useDatasets";
import { useSearchParams } from "next/navigation";
import Seo from "../../../../../../../src/components/Seo";
import useCookie from "../../../../../../../src/hooks/useCookie";
import Model from "../../../../../../../src/components/Model";
import useModels from "../../../../../../../src/hooks/useModels";
import Breadcrumb from "../../../../../../../src/components/Breadcrumb";
import { useContext } from "react";
import { AutoMLContext } from "../../../../../../../src/context/AutoMLContext";
import useAutoML from "../../../../../../../src/hooks/useAutoML";

const explain = () => {
    const router = useRouter();
    const { workspaceName, autoMLName, modelAutoName } = router.query;

    const searchParams = useSearchParams();
    const type = searchParams.get("type");

    const username = useCookie("username");
    const projectTitle = autoMLName ? `${autoMLName} Project` : "AutoML Project";
    const { autoMLs, addAutoML } = useAutoML(workspaceName, username, type);
    const selectedAutoML = autoMLs.find((autoML) => autoML.name === autoMLName);
    const selectedModels = selectedAutoML?.automlmodels || [];
    const selectedModel = selectedModels.find((model) => model.name === modelAutoName);
    console.log("model", selectedModel)
    console.log("mode", selectedModel?.score);
    const score = selectedModel?.score;
    const shap = selectedModel?.shap_values;
    const name = selectedModel?.name.split('_').slice(0, 2).join(' & ');
    let metrics = null;
    let shapVal = null;
    let foto = null;
    let FeatureImportance = null;
    let parameter = null;
    if (score) {
        try {
            metrics = JSON.parse(score);
            console.log("metrics", metrics)
            parameter = metrics.best_hyperparams;
            console.log("parameter", parameter)
        } catch (e) {
            console.error("Failed to parse score:", e);
        }
    }
    if (shap) {
        try {
            shapVal = JSON.parse(shap);
            console.log("shapVal", shapVal);
            foto = shapVal.img_str;
            FeatureImportance = shapVal.feature_importance;
        } catch (e) {
            console.error("Failed to parse score:", e);
        }
    }

    const displayMetrics = (metrics) => {
        const keys = Object.keys(metrics);
        let displayKeys = null;
        if (selectedModel?.method === "CLUSTERING") {
            displayKeys = keys.slice(0, 1);
        } else if (selectedModel?.method === "CLASSIFICATION") {
            displayKeys = keys.slice(0, 4);
        } else {
            displayKeys = keys.slice(0, 3);
        }
        return displayKeys.map(key => (
            <tr key={key}>
                <td className="px-4 py-2 border-b">{key}</td>
                <td className="px-4 py-2 border-b">{metrics[key]}</td>
            </tr>
        ));
    };

    return (
        <>
            <Seo title={`${workspaceName} - AutoML`} />
            <div className="h-full flex flex-col">
                <div className="flex items-center">
                    <div className="flex-1">
                        <Breadcrumb links={[
                            { label: workspaceName },
                            { label: "AutoML", href: "/workspace/" + workspaceName + "/automl" },
                            { label: autoMLName, href: "/workspace/" + workspaceName + "/automl" + "/newProject" + "/modelling/" + autoMLName },
                            { label: "Explainability", href: router.asPath },
                        ]} active={"Explainability"} />
                    </div>
                </div>
                <div className="flex flex-col gap-6 my-5">
                    <h1>{projectTitle}</h1>
                </div>
                <div className="flex flex-col gap-6">
                    <h2>Explainability for {name}</h2>

                    <h3>Model Metrics</h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">Metrics</th>
                                    <th className="px-4 py-2 border-b">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics && displayMetrics(metrics)}
                            </tbody>
                        </table>
                    </div>

                    <h3>Used HyperParameter</h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">Parameter</th>
                                    <th className="px-4 py-2 border-b">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parameter && Object.entries(parameter).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="px-4 py-2 border-b">{key}</td>
                                        <td className="px-4 py-2 border-b">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 className="my-3">Shapley Plot</h3>
                        <img src={`data:image/png;base64,${foto}`} alt="SHAP Summary Plot" />
                    </div>

                    <div>
                        <h3 className="my-3">How to Read the SHAP Plot</h3>
                        {selectedModel?.method === "REGRESSION" && (
                            <p>
                                For regression models, the SHAP plot shows the impact of each feature on the prediction. The x-axis represents the SHAP value (impact on the model output), and each point represents a Shapley value for a particular feature and instance. Features with positive SHAP values increase the prediction, while those with negative values decrease it.
                            </p>
                        )}
                        {selectedModel?.method === "CLASSIFICATION" && (
                            <p>
                                For classification models, the SHAP plot indicates how each feature influences the probability of the target class. The bar plot shows the average impact of each feature on the model output for each class. The length of each bar represents the mean SHAP value (average impact on model output magnitude). Each color represents a different class, and longer bars indicate features with greater influence on the prediction for that class.                            </p>
                        )}
                        {selectedModel?.method === "CLUSTERING" && (
                            <p>
                                For clustering models, the SHAP plot indicates how each feature influences the probability of the target class. The bar plot shows the average impact of each feature on the model output for each class. The length of each bar represents the mean SHAP value (average impact on model output magnitude). Each color represents a different class, and longer bars indicate features with greater influence on the prediction for that class.                            
                            </p>
                        )}
                    </div>

                    <h3>Top Important Features on Target</h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">Feature</th>
                                    <th className="px-4 py-2 border-b">Importance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FeatureImportance && Object.entries(FeatureImportance).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="px-4 py-2 border-b">{key}</td>
                                        <td className="px-4 py-2 border-b">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default explain;
