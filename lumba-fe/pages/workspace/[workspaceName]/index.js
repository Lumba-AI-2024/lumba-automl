import { useRouter } from "next/router";
import Breadcrumb from "../../../src/components/Breadcrumb";
import RecentDatasets from "../../../src/components/Home/RecentDatasets";
import RecentModels from "../../../src/components/Home/RecentModels";
import Seo from "../../../src/components/Seo";
import useModels from "../../../src/hooks/useModels";
import useWorkspace from "../../../src/hooks/useWorkspaces";
import useDatasets from "../../../src/hooks/useDatasets";
import useCookie from "../../../src/hooks/useCookie";
import { useSearchParams } from "next/navigation";
import useForecastingModel from "../../../src/hooks/useForecastingModel";

const WorkspaceHome = () => {
  const router = useRouter();
  const { workspaceName } = router.query;
  const { workspaces } = useWorkspace();

  const username = useCookie("username");

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const { datasets: data } = useDatasets(workspaceName, username, type);
  const datasets = data.length > 3 ? data.slice(-3) : data;

  const { models: dataModels } =
    type === "predicting"
      ? useModels({ username, workspace: workspaceName, type })
      : useForecastingModel({ workspace: workspaceName, username });
  const models = dataModels.length > 3 ? dataModels.slice(-3) : dataModels;

  const desc = workspaces?.filter((ws) => ws.name === workspaceName)[0]?.description;

  return (
    <>
      <Seo title={`${workspaceName} - Home`} />
      <Breadcrumb links={[{ label: workspaceName }, { label: "Home", href: router.asPath }]} active={"Home"} />
      <div className="flex flex-col gap-6 my-6">
        <div className="space-y-2">
          <h1>{workspaceName}</h1>
          <p>{desc}</p>
        </div>
        {
          type !== "object_segmentation" &&
            <RecentDatasets workspaceName={workspaceName} datasets={datasets} type={type} />
        }
        <RecentModels workspaceName={workspaceName} models={models} type={type} />
      </div>
    </>
  );
};

export default WorkspaceHome;

// export async function getServerSideProps({ query, req, resolvedUrl }) {
//   const token = parseCookie(req.headers.cookie, "token");
//   const urlArray = resolvedUrl.split("/");
//   const workspace = urlArray[urlArray.length - 1];
//   const username = parseCookie(req.headers.cookie, "username");

//   const type = query.type;

//   const datasets = await getAllDatasets(
//     process.env.NEXT_PUBLIC_API_ROUTE + `/file/list/?workspace=${workspace}&username=${username}&type=${type}`,
//     token
//   );

//   const models = await getAllModels({ token, username, workspace, type });

//   return {
//     props: {
//       datasets: datasets.length > 3 ? datasets.slice(-3).reverse() : datasets.reverse(),
//       models: models.length > 3 ? models.slice(-3).reverse() : models.reverse(),
//     },
//   };
// }
