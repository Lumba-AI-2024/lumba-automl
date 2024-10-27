import React from "react";
import FormModalContextProvider from "../../../context/FormModalContext";
import FormModalWorkspaceTutorial from "./FormModalWorkspaceTutorial";
import Input from "../../Form/Input";
import Select from "../../Select/Select";
import Plus from "../../Icon/Plus";
import { Step, StepContent, StepTitle, StepDescription } from "../Steps";
import Button from "../../Button/Button";

function CustomButton({ onClick }) {
  return (
    <Step step={1}>
      <div className="relative">
        <Button onClick={onClick}>
          <div className="flex font-semibold items-center gap-1">
            <Plus />
            Create
          </div>
        </Button>
        <StepContent position="right">
          <StepTitle>Create Workspace</StepTitle>
          <StepDescription>Click this button to create your workspace.</StepDescription>
        </StepContent>
      </div>
    </Step>
  );
}

export default function CreateWorkspaceButtonTutorial({ open, setOpen }) {
  return (
    <FormModalContextProvider>
      <FormModalWorkspaceTutorial
        open={open}
        setOpen={setOpen}
        variant="create"
        formLabel="Create Workspace"
        CustomButton={CustomButton}
        submitLabel="Create"
      >
        <Input label={"Name"} name={"name"} placeholder="Workspace name" required />
        <Input
          label={"Description"}
          name={"description"}
          placeholder="Write description here"
          textarea={true}
          required
        />
        <p>Will Be Used For</p>
        <Step step={2}>
          <div className="relative ">
            <Select
              name="type"
              placeholder="- Select -"
              items={[
                { label: "Predicting", value: "predicting" },
                { label: "Forecasting", value: "forecasting" },
                { label: "Object Segmentation", value: "object_segmentation" },
              ]}
            />
            <StepContent
              position="center"
              executeFunction={[
                {
                  shouldExecuteOnStep: 1,
                  function: () => {
                    setOpen(false);
                  },
                },
                {
                  shouldExecuteOnStep: 2,
                  function: () => {
                    setOpen(true);
                  },
                },
              ]}
            >
              <StepTitle>Create workspace</StepTitle>
              <StepDescription>You can choose it for predicting or forecasting.</StepDescription>
            </StepContent>
          </div>
        </Step>
      </FormModalWorkspaceTutorial>
    </FormModalContextProvider>
  );
}
