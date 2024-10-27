import { useRouter } from "next/router";
import Breadcrumb from "../../../../src/components/Breadcrumb";
import Seo from "../../../../src/components/Seo";
import Download from "../../../../src/components/Icon/Download";
import Pencil from "../../../../src/components/Icon/Pencil";
import Delete from "../../../../src/components/Icon/Delete";
import FormModal from "../../../../src/components/Form/FormModal";
import FormModalContextProvider from "../../../../src/context/FormModalContext";
import Input from "../../../../src/components/Form/Input";
import * as React from "react";
import Table from "../../../../src/components/Table";
import TableHead from "../../../../src/components/Table/TableHead";
import TableBody from "../../../../src/components/Table/TableBody";
import axios from "axios";
import { generateTime } from "../../../../src/helper/generateTime";
import { parseCookie } from "../../../../src/helper/cookies";
import useDatasets from "../../../../src/hooks/useDatasets";
import useCookie from "../../../../src/hooks/useCookie";
import { useColumnInfo } from "../../../../src/hooks/useColumnInfo";
import ColumnInfoGenerator from "../../../../src/components/ColumnInfo/ColumnInfoGenerator";
import { useSearchParams } from "next/navigation";

const Dataset = ({ fetchedDataset }) => {
  const router = useRouter();
  const { datasetName, workspaceName } = router.query;

  const username = useCookie("username");

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const { updateDataset, deleteDataset } = useDatasets(workspaceName, username, type);

  const [isPreview, setIsPreview] = React.useState(true);

  const { details, data } = fetchedDataset;

  const { columnInfo } = useColumnInfo(details.file, workspaceName, username, type);

  if (columnInfo && columnInfo[0]?.column_name === "Unnamed: 0") {
    delete columnInfo[0];
  }

  const keys = [...Object.keys(data)];
  if (keys[0] === "Unnamed: 0") {
    keys.shift();
  }

  const columns = keys.length;
  const k = keys[0];
  const value = Object.values(data[k]);

  const values = value.map((item, index) => {
    const obj = {};
    obj["#"] = index + 1;

    keys.forEach((key) => {
      if (data[key][index.toString()] != undefined) {
        obj[key] = data[key][index.toString()];
      }
    });
    return obj;
  });
  keys.unshift("#");

  return (
    <>
      <Seo title={`${workspaceName} - Datasets`} />
      <div className="h-full flex flex-col">
        <Breadcrumb
          links={[
            { label: workspaceName },
            { label: "Datasets", href: "/workspace/" + workspaceName + "/datasets" },
            { label: datasetName, href: router.asPath },
          ]}
          active={datasetName}
        />

        <div className="mt-6">
          {/* Row 1 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <img className="w-6 h-6" src="/assets/CSVIcon.svg" alt="csv" />
              <h1 className="text-2xl">{details.name}</h1>
            </div>
            <div className="flex gap-6">
              <Download />
              <FormModalContextProvider>
                <FormModal
                  variant="editDataset"
                  formLabel="Edit Dataset"
                  CustomButton={Pencil}
                  submitLabel="Save Changes"
                  handleSubmit={(formData) => {
                    const newFormData = new FormData();
                    newFormData.append("newfilename", formData.datasetname);
                    updateDataset(details.file, formData.datasetname).then(() =>
                      router.replace(`/workspace/${workspaceName}/datasets`)
                    );
                  }}
                >
                  <Input label={"Name"} name={"datasetname"} placeholder="Workspace name" required />
                </FormModal>
              </FormModalContextProvider>
              <FormModalContextProvider>
                <FormModal
                  variant="deleteDataset"
                  formLabel="Delete Dataset"
                  buttonLabel="Delete"
                  buttonVariant="error"
                  CustomButton={Delete}
                  submitLabel="Delete"
                  handleSubmit={(formData) => {
                    const newFormData = new FormData();
                    newFormData.append("datasetname", datasetName);
                    newFormData.append("workspace", workspaceName);
                    newFormData.append("username", username);
                    newFormData.append("type", type);

                    deleteDataset(newFormData).then(() =>
                      router.replace(`/workspace/${workspaceName}/datasets?type=${type}`)
                    );
                  }}
                >
                  <p>Are you sure you want to delete this dataset?</p>
                </FormModal>
              </FormModalContextProvider>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-6">
            <h2>About Dataset</h2>
            <div className="grid grid-cols-3 mt-4">
              <div>
                <h3 className="mb-3">Size</h3>
                <p>{details.size} MB</p>
              </div>
              <div>
                <h3 className="mb-3">Date Created</h3>
                <p>{generateTime(details.created_time)}</p>
              </div>
              <div>
                <h3 className="mb-3">Date Modified</h3>
                <p>{generateTime(details.updated_time)}</p>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <ul className="mt-8 flex gap-8 relative px-2">
            <button
              className="font-bold h3"
              onClick={() => {
                setIsPreview(true);
              }}
            >
              Preview
            </button>
            <button
              className="font-bold h3"
              onClick={() => {
                setIsPreview(false);
              }}
            >
              Column Info
            </button>
            <span className="absolute left-0 -bottom-2 h-[3px] w-full rounded-md bg-gray/30"></span>
            <div
              className={`absolute transition-all duration-300 -bottom-2 h-[3px] w-20 rounded-md bg-gradient-to-r from-lightblue to-blue ${
                isPreview ? "left-0" : "left-[96px] w-28"
              }`}
            ></div>
          </ul>

          {/* Row 4 */}
          {isPreview ? (
            <div className="mt-8">
              <div className="flex gap-48">
                <span className="text-sm">
                  Number of columns: <span className="font-bold text-sm">{columns}</span>
                </span>
                <span className="text-sm">
                  Number of rows: <span className="font-bold text-sm">15</span>
                </span>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHead cols={keys} />
                  <TableBody data={values} cols={keys} />
                </Table>
              </div>
            </div>
          ) : (
            <div className="my-8">
              <div className="flex gap-48">
                <span className="text-sm">
                  Number of columns: <span className="font-bold text-sm">{columns}</span>
                </span>
                <span className="text-sm">
                  Number of rows: <span className="font-bold text-sm">15</span>
                </span>
              </div>
              {columnInfo && <ColumnInfoGenerator columnInfo={columnInfo} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dataset;

export async function getServerSideProps({ query, req, params, resolvedUrl }) {
  const { datasetName } = params;
  const token = parseCookie(req.headers.cookie, "token");
  const username = parseCookie(req.headers.cookie, "username");

  const urlArray = resolvedUrl.split("/");
  const workspace = urlArray[urlArray.length - 3];

  const type = query.type;

  const DATASET = `${process.env.NEXT_PUBLIC_API_ROUTE}/file/?datasetname=${datasetName}&workspace=${workspace}&username=${username}&page=1&rowsperpage=15&type=${type}`;

  const { data } = await axios.get(DATASET, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  let { data: details } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ROUTE}/file/list/?workspace=${workspace}&username=${username}&type=${type}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  details = details.filter((dataset) => dataset.name === datasetName);

  const fetchedDataset = {
    details: details[0],
    data,
  };

  return { props: { fetchedDataset } };
}
