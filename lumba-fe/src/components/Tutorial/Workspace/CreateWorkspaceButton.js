import React from "react";
import useCookie from "../../../hooks/useCookie";
import useWorkspaces from "../../../hooks/useWorkspaces";
import FormModalContextProvider from "../../../context/FormModalContext";
import FormModal from "../../Form/FormModal";
import Input from "../../Form/Input";
import HiddenInput from "../../Form/HiddenInput";
import Select from "../../Select/Select";
import Plus from "../../Icon/Plus";

export default function CreateWorkspaceButton() {
  const username = useCookie("username");
  const { addWorkspace } = useWorkspaces();

  return (
    <FormModalContextProvider>
      <FormModal
        variant="create"
        formLabel="Create Workspace"
        buttonLabel={
          <div className="flex font-semibold items-center gap-1">
            <Plus />
            Create
          </div>
        }
        submitLabel="Create"
        handleSubmit={(formData) => {
          addWorkspace(formData);
        }}
      >
        {<HiddenInput name="username" defaultValue={username} />}
        <Input label={"Name"} name={"name"} placeholder="Workspace name" required />
        <Input
          label={"Description"}
          name={"description"}
          placeholder="Write description here"
          textarea={true}
          required
        />
        <p>Will Be Used For</p>
        <Select
          name="type"
          placeholder="- Select -"
          items={[
            { label: "Predicting", value: "predicting" },
            { label: "Forecasting", value: "forecasting" },
            { label: "Object Segmentation", value: "object_segmentation" },
          ]}
        />
      </FormModal>
    </FormModalContextProvider>
  );
}
