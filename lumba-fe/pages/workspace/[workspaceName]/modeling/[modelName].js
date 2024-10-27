import { useRouter } from "next/router";
import Breadcrumb from "../../../../src/components/Breadcrumb";
import Seo from "../../../../src/components/Seo";
import Delete from "../../../../src/components/Icon/Delete";
import FormModal from "../../../../src/components/Form/FormModal";
import FormModalContextProvider from "../../../../src/context/FormModalContext";
import * as React from "react";
import { generateTime } from "../../../../src/helper/generateTime";
import useCookie from "../../../../src/hooks/useCookie";
import { useSearchParams } from "next/navigation";
import useModels from "../../../../src/hooks/useModels";
import ApiKey from "../../../../src/components/Icon/ApiKey";
import useApiKey from "../../../../src/hooks/useApiKey";
import ChevronDownThick from "../../../../src/components/Icon/ChevronDownThick";
import { metricsName, metricsNameByMethod } from "../../../../src/components/Model";
import LineChart from "../../../../src/components/Forecasting/LineChart";
import useForecastingModel from "../../../../src/hooks/useForecastingModel";
import { useForecastingChart } from "../../../../src/hooks/useColumnInfo";

const ModelDetails = () => {
	const router = useRouter();
	const { modelName, workspaceName } = router.query;

	const username = useCookie("username");

	const searchParams = useSearchParams();
	const type = searchParams.get("type");

	const { models, deleteModel } =
		type === "predicting"
			? useModels({ username, workspace: workspaceName, type })
			: useForecastingModel({ workspace: workspaceName, username });

	//   todo: get model name
	const model = models.filter((m) => m.modelName === modelName)[0];
	const threshold = parseInt(model?.period);

	const metrics = model?.metrics_scores?.charAt(0) === "{" ? Object.keys(JSON.parse(model?.metrics_scores)) : [];
	const scores = model?.metrics_scores?.charAt(0) === "{" ? Object.values(JSON.parse(model?.metrics_scores)) : [];

	const [selected, setSelected] = React.useState(metrics[0]);
	const [selectedMetrics, setSelectedMetrics] = React.useState(0);
	const [isOpen, setIsOpen] = React.useState(false);

	const apiKey = useApiKey(model?.id);

	const { jsonData } = useForecastingChart({ id: model?.id, workspace: workspaceName, username });

	return (
		<>
			<Seo title={`${workspaceName} - Modeling`} />
			<div className="h-full flex flex-col">
				<Breadcrumb
					links={[
						{ label: workspaceName },
						{ label: "Modeling", href: "/workspace/" + workspaceName + "/modeling" },
						{ label: modelName, href: router.asPath },
					]}
					active={modelName}
				/>

				<div className="mt-6">
					{/* Row 1 */}
					<div className="flex justify-between items-center">
						<div className="flex gap-3 items-center">
							<h1 className="text-2xl">{model?.modelName.split(".")[0]}</h1>
						</div>
						<div className="flex gap-6">
							{type === "predicting" && <ApiKey apiKey={apiKey} />}
							<FormModalContextProvider>
								<FormModal
									variant="deleteModel"
									formLabel="Delete Model"
									buttonLabel="Delete"
									buttonVariant="error"
									CustomButton={Delete}
									submitLabel="Delete"
									handleSubmit={(formData) => {
										try {
											deleteModel({
												model_name: model?.modelName.split(".")[0],
												username: username,
												workspace: workspaceName,
												type: type,
											}).then(() => router.replace(`/workspace/${workspaceName}/modeling?type=${type}`));
										} catch (err) {}
									}}
								>
									<p>Are you sure you want to delete this model?</p>
								</FormModal>
							</FormModalContextProvider>
						</div>
					</div>

					{/* Row 2 */}
					<div className="mt-6">
						<div className="grid grid-cols-4 mt-4">
							<div>
								<h3 className="mb-3">From Dataset</h3>
								<p>{model?.file}</p>
							</div>
							<div>
								{metrics?.length > 1 ? (
									<div className="relative">
										<button onClick={() => setIsOpen(!isOpen)} className="mb-3 h3 flex items-center gap-2">
											{selected ? metricsName[selected] : metricsNameByMethod[model?.method]}
											<ChevronDownThick />
										</button>
										<div
											className={`${
												isOpen ? "absolute top-7 z-50 flex flex-col rounded bg-white overflow-hidden shadow" : "hidden"
											}`}
										>
											{metrics.map((m, i) => (
												<button
													key={m}
													className="hover:bg-blue relative hover:text-white text-left px-2 py-0.5"
													onClick={() => {
														setSelected(m);
														setSelectedMetrics(i);
														setIsOpen(false);
													}}
												>
													{m}
												</button>
											))}
										</div>
									</div>
								) : (
									<h3 className="mb-3 flex items-center gap-2">
										{selected ? metricsName[selected] : metricsNameByMethod[model?.method]}
									</h3>
								)}

								<p>{scores[selectedMetrics]}</p>
							</div>
							<div>
								<h3 className="mb-3">Forecasting Algorithm</h3>
								<p>{model?.algorithm}</p>
							</div>
							<div>
								<h3 className="mb-3">Date Trained</h3>
								<p>{generateTime(model?.trainDate)}</p>
							</div>
						</div>
					</div>

					{/* Row 3 */}
					<ul className="mt-8 flex gap-8 relative">
						<h3>Forecast Chart</h3>
						<span className="absolute left-0 -bottom-2 h-[3px] w-full rounded-md bg-gray/30"></span>
					</ul>

					{/* Row 4 */}
					<div className="mt-8 px-4 py-8 bg-white rounded mb-4">
						{jsonData && <LineChart jsonData={jsonData} threshold={threshold} />}
						{/* <img className="w-full" src="/assets/ForecastingDummy.svg" alt="ForecastingDummy" /> */}
						<p className="font-semibold mt-4 ml-9">The result of forecasting for the next {threshold} weeks:</p>
						<ul className="list-disc block ml-14 mt-1 space-y-1">
							{jsonData &&
								[...Array(threshold).keys()].map((i) => (
									<li key={i}>
										<span className="flex justify-between max-w-md">
											{getLabel(jsonData, i, threshold)} :{" "}
											{getValue(jsonData, i, threshold) ?? jsonData["data"][i].toFixed(2)}
											<span>
												(LB: {parseFloat(jsonData["lower_bound"]["lower_bound_qty"][i]).toFixed(2)}, UB:{" "}
												{parseFloat(jsonData["upper_bound"]["upper_bound_qty"][i]).toFixed(2)})
											</span>
										</span>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModelDetails;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const getLabel = (jsonData, i, threshold) => {
	// const threshold = getThreshold(jsonData);
	const labelX = Object.keys(jsonData.data)[0];
	const startIndex = Object.values(jsonData.data[labelX]).length - threshold + i;

	return `${capitalizeFirstLetter(labelX)} ${jsonData.data[labelX][startIndex]}`;
};

const getValue = (jsonData, i, threshold) => {
	// const threshold = getThreshold(jsonData);
	const labelY = Object.keys(jsonData.data)[1];
	const startIndex = Object.values(jsonData.data[labelY]).length - threshold + i;
	return jsonData.data[labelY][startIndex];
};

const getThreshold = (jsonData) => {
	return jsonData?.upper_bound?.length;
};
