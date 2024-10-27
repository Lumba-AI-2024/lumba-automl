import React from "react";
import Button from "../src/components/Button/Button";
import EditDelete from "../src/components/EditDelete";
import Delete from "../src/components/Icon/Delete";
import Download from "../src/components/Icon/Download";
import Pencil from "../src/components/Icon/Pencil";
import Plus from "../src/components/Icon/Plus";
import Test from "../src/components/Icon/Test";
import Train from "../src/components/Icon/Train";
import Input from "../src/components/Form/Input";
import Select from "../src/components/Select/Select";
import Toggle from "../src/components/Toggle";
import Tooltip from "../src/components/Tooltip";
import Seo from "../src/components/Seo";
import FormModal from "../src/components/Form/FormModal";
import FormModalContextProvider from "../src/context/FormModalContext";
import UploadFile from "../src/components/Form/UploadFile";
import Form from "../src/components/Form";
import AccordionSelect from "../src/components/Select/AccordionSelect";
import AccordionForm from "../src/components/Form/AccordionForm";
import DetailsModal from "../src/components/Modal/DetailsModal";
import SelectColumnsModal from "../src/components/Modal/SelectColumnsModal";
import MultiSelect from "../src/components/Select/MultiSelect";
import Model from "../src/components/Model";

const fonts = ["font-thin", "font-normal", "font-medium", "font-semibold", "font-bold"];
const texts = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

const Text = ({ label }) => {
  return (
    <div className="flex w-full flex-col items-start justify-between">
      <span className={`mr-4 font-normal ${label}`}>{label}</span>
    </div>
  );
};

const Font = ({ label }) => {
  return (
    <div className="flex w-full flex-col items-start justify-between">
      <span className={`mr-4 ${label}`}>{label}</span>
    </div>
  );
};

export default function Components() {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Seo title="Components" />
      <div className="flex gap-12">
        <div>
          <h2 className="mb-2 text-lightblue">Text & Font</h2>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5">
              {fonts.map((font) => (
                <Font key={font} label={font}></Font>
              ))}
            </div>
            <div>
              {texts.map((text) => (
                <Text key={text} label={text}></Text>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-2">
            <div>
              <h4 className="my-2 text-lightblue">Edit Delete</h4>
              <div className="mt-2 relative bg-gradient-to-r from-lightblue to-blue h-12 w-full rounded-md">
                <EditDelete />
              </div>
            </div>

            <div>
              <h4 className="my-2 text-lightblue">Toggle</h4>
              <div className="mt-2">
                <Toggle setShow={setShow} show={show} />
              </div>
            </div>

            <div>
              <h4 className="my-2 text-lightblue">Tooltip</h4>
              <div className="mt-2">
                <Tooltip label="Tooltip">
                  {" "}
                  <p className="border-gray border-2 px-2 py-1 rounded-sm">Hover me</p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="my-2 text-lightblue">Button</h4>
          <div className="flex gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="error">Error</Button>
            <Button variant="ghost">
              <div className="flex items-center gap-1">
                <Plus />
                Ghost
              </div>
            </Button>
          </div>

          <h4 className="mt-4 mb-2 text-lightblue">Input & Text Area</h4>
          <div className="flex flex-col gap-2">
            <FormModalContextProvider>
              <Input name="workspaceName" label="Name" placeholder="Workspace name" />
              <Input name="description" label="Description" placeholder="Write description here" textarea={true} />
            </FormModalContextProvider>
          </div>
        </div>

        <div>
          <div className="flex gap-4">
            <div>
              <h4 className="my-2 text-lightblue">Modal</h4>
              <div className="flex gap-4">
                <FormModalContextProvider>
                  <FormModal
                    formLabel="Edit Workspace"
                    buttonLabel="Show Modal"
                    submitLabel="Save Changes"
                    handleSubmit={(formData) => {
                      console.log(formData);
                    }}
                  >
                    <Input label={"Name"} name={"name"} placeholder="Workspace name" required />
                    <Input
                      label={"Description"}
                      name={"description"}
                      placeholder="Write description here"
                      textarea={true}
                      required
                    />
                  </FormModal>
                </FormModalContextProvider>
              </div>
            </div>

            <div>
              <h4 className="my-2 text-lightblue">Upload File</h4>
              <div className="flex gap-4">
                <FormModalContextProvider>
                  <UploadFile
                    buttonLabel="Upload File"
                    formLabel="Upload File Datasets"
                    handleSubmit={(formData) => {
                      console.log(formData);
                    }}
                  />
                </FormModalContextProvider>
              </div>
            </div>
          </div>

          <h4 className="my-2 text-lightblue">Icon Buttons</h4>
          <div className="flex gap-4">
            <Download />
            <Pencil />
            <Delete />
            <Train />
            <Test />
          </div>

          <h4 className="mt-2 text-lightblue">Select</h4>
          <div className="flex gap-4">
            <FormModalContextProvider>
              <Form handleSubmit={(formData) => console.log(formData)}>
                <div className="flex gap-2 items-center">
                  <Select
                    placeholder="Select dataset..."
                    name="dataset"
                    items={[
                      { value: "Data 1", label: "Data 1" },
                      { value: "Data 2", label: "Data 2" },
                      { value: "Data 3", label: "Data 3" },
                    ]}
                  />
                  <Button>console.log()</Button>
                </div>
              </Form>
            </FormModalContextProvider>
          </div>

          <div className="flex gap-4">
            <div>
              <h4 className="my-2 text-lightblue">Details Modal</h4>
              <FormModalContextProvider>
                <DetailsModal formLabel="Missing Data Details" buttonLabel="Details Modal" />
              </FormModalContextProvider>
            </div>

            <div>
              <h4 className="my-2 text-lightblue">Select Columns</h4>
              <FormModalContextProvider>
                <SelectColumnsModal formLabel="Select Columns" buttonLabel="Select Columns" totalColumns={6} />
              </FormModalContextProvider>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex gap-14">
          <div>
            <h4 className="my-2 text-lightblue">Accordion with Select</h4>
            <FormModalContextProvider>
              <AccordionForm handleSubmit={(formData) => console.log(formData)}>
                <AccordionSelect names={["dataset", "mode"]} label="Clean Missing Data" top={true}>
                  <p className="pb-1">Columns to be cleaned</p>
                  <Select
                    placeholder="Select dataset..."
                    name="dataset"
                    items={[
                      { value: "Data 1", label: "Data 1" },
                      { value: "Data 2", label: "Data 2" },
                      { value: "Data 3", label: "Data 3" },
                    ]}
                  />
                  <p className="mt-4 pb-1">Cleaning Mode</p>
                  <Select
                    placeholder="Select mode..."
                    name="mode"
                    items={[
                      { value: "Data 1", label: "Data 1" },
                      { value: "Data 2", label: "Data 2" },
                      { value: "Data 3", label: "Data 3" },
                    ]}
                  />
                </AccordionSelect>
                <AccordionSelect names={["duplicate"]} label="Remove Duplicate Data" bottom={true}>
                  <p className="pb-1">Columns to be cleaned</p>
                  <Select
                    placeholder="Select column..."
                    name="duplicate"
                    items={[
                      { value: "Data 1", label: "Data 1" },
                      { value: "Data 2", label: "Data 2" },
                      { value: "Data 3", label: "Data 3" },
                    ]}
                  />
                </AccordionSelect>
              </AccordionForm>
            </FormModalContextProvider>
          </div>

          <div>
            <div className="max-w-[220px]">
              <h4 className="my-2 text-lightblue">Multiple Select</h4>
              <FormModalContextProvider>
                <Form handleSubmit={(formData) => console.log(formData)}>
                  <div className="flex gap-2 items-center w-full">
                    <MultiSelect
                      instanceId="select-multiple"
                      placeholder={"Select one or more values..."}
                      name="colors"
                      defaultOptions={[
                        { value: "chocolate", label: "Chocolate" },
                        { value: "strawberry", label: "Strawberry" },
                        { value: "vanilla", label: "Vanilla" },
                        { value: "vanilla2", label: "Vanilla 2" },
                        { value: "vanilla3", label: "Vanilla 3" },
                      ]}
                    />
                  </div>
                </Form>
              </FormModalContextProvider>
            </div>
          </div>

          <div>
            <div className="">
              <h4 className="my-2 text-lightblue">Model</h4>

              {/* test */}
              <Model
                algorithm="KMEANS"
                method="CLUSTERING"
                features={["clock_speed", "clock_speed_2"]}
                trainDate="2023-03-09T00:46:37.331265Z"
                modelName="model.pkl"
                score={1}
                isDuplicate={true}
                metrics={["accuracy_score", "mean_absolute_error"]}
                file="model.csv"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
