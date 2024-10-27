import WorkspaceCard from "../src/components/Card/WorkspaceCard";
import Seo from "../src/components/Seo";

import * as React from "react";
import useWorkspace from "../src/hooks/useWorkspaces";
import useCookie from "../src/hooks/useCookie";

import MainCarousel from "../src/components/Tutorial/Workspace/MainCarousel";
import CreateWorkspaceButton from "../src/components/Tutorial/Workspace/CreateWorkspaceButton";
import { IsStepContent, NotStepContent, StepProvider } from "../src/components/Tutorial/Steps";
import CreateWorkspaceButtonTutorial from "../src/components/Tutorial/Workspace/CreateWorkspaceButtonTutorial";
import { useTutorial } from "../src/hooks/useTutorial";

export default function Home() {
  const username = useCookie("username");
  const { workspaces, addWorkspace } = useWorkspace();

  const [shouldPlay, setShouldPlay] = React.useState(false);
  const shouldPlayTutorial = useTutorial();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Seo title="Home" />
      <main className="flex flex-col gap-8">
        {shouldPlayTutorial && <MainCarousel onFinish={() => setShouldPlay(true)} />}

        <div className="flex items-center">
          <h1 className="h4 font-medium flex-1 text-center">Workspace</h1>
          <StepProvider
            totalStep={3}
            shouldPlay={shouldPlay}
            onReset={() => {
              setOpen(false);
            }}
          >
            <NotStepContent>
              <CreateWorkspaceButton />
            </NotStepContent>
            <IsStepContent>
              <CreateWorkspaceButtonTutorial open={open} setOpen={setOpen} />
            </IsStepContent>
          </StepProvider>
        </div>
        {!workspaces && (
          <div className="mx-auto relative right-11">
            <svg className="circle" viewBox="25 25 50 50" strokeWidth="5">
              <circle cx="50" cy="50" r="20" />
            </svg>
          </div>
        )}
        <div className="flex gap-12 flex-wrap">
          {workspaces?.map((workspace) => {
            return (
              <WorkspaceCard
                key={workspace.name}
                username={username}
                workspaceName={workspace.name}
                description={workspace.description}
                lastUpdated={workspace.updated_time}
                type={workspace.type}
                projectLink={`/workspace/${workspace.name}?type=${workspace.type}`}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}
