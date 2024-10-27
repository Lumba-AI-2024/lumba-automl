import React from "react";
import ThreeDotsVertical from "./Icon/ThreeDotsVertical";
import FormModalContextProvider from "../context/FormModalContext";
import FormModal from "./Form/FormModal";
import HiddenInput from "./Form/HiddenInput";
import Input from "./Form/Input";
import useWorkspace from "../hooks/useWorkspaces";
import Select from "./Select/Select";

const EditButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hover:bg-gradient-to-r hover:text-white from-lightblue to-blue px-3 py-1 text-[11px]"
    >
      Edit
    </button>
  );
};

const DeleteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hover:bg-gradient-to-r hover:text-white from-lightblue to-blue px-3 py-1 text-[11px]"
    >
      Delete
    </button>
  );
};

export default function EditDelete({ username, name, description, type }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const { updateWorkspace, deleteWorkspace } = useWorkspace();

  return (
    <>
      <div className="absolute top-2 right-2">
        <ThreeDotsVertical onClick={() => setIsVisible(true)} />
      </div>
      <div
        onClick={() => setIsVisible(false)}
        className={`${isVisible ? "block" : "hidden"} fixed z-30 inset-0 w-screen h-screen`}
      ></div>
      <div
        className={`${
          isVisible ? "block" : "hidden"
        } z-40 absolute top-2 -right-12 flex flex-col py-2 bg-white rounded-md shadow w-20 text-black/60`}
      >
        <FormModalContextProvider>
          <FormModal
            variant="edit"
            formLabel="Edit Workspace"
            buttonLabel="Edit"
            CustomButton={EditButton}
            submitLabel="Save Changes"
            handleSubmit={(formData) => {
              updateWorkspace({ name, username, type }, formData);
            }}
          >
            {/* {<HiddenInput name="username" defaultValue={username} />}
            {<HiddenInput name="type" defaultValue={type} />} */}
            <Input isEdit={true} label={"Name"} name={"name"} inputValue={name} placeholder="Workspace name" required />
            <Input
              isEdit={true}
              label={"Description"}
              name={"description"}
              inputValue={description}
              placeholder="Write description here"
              textarea={true}
              required
            />
            <p>Will Be Used For</p>
            <Select
              isDisabled={true}
              name="type"
              placeholder="- Select -"
              defaultSelected={type}
              items={[
                { label: "Predicting", value: "predicting" },
                { label: "Forecasting", value: "forecasting" },
                { label: "Object Segmentation", value: "object_segmentation" },
              ]}
            />
          </FormModal>
        </FormModalContextProvider>
        <FormModalContextProvider>
          <FormModal
            variant="delete"
            formLabel="Delete Workspace"
            buttonLabel="Delete"
            buttonVariant="error"
            CustomButton={DeleteButton}
            submitLabel="Delete"
            handleSubmit={() => {
              deleteWorkspace({ name, username, type });
            }}
          >
            <p>Are you sure you want to delete this workspace?</p>
          </FormModal>
        </FormModalContextProvider>
      </div>
    </>
  );
}
