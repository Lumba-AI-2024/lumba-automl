import Button from "../Button/Button";

const variants = {
  create: "New workspace has been created",
  edit: "Workspace has been edited",
  delete: "Workspace has been deleted",
  createDataset: "New dataset has been created",
  editDataset: "Dataset has been edited",
  deleteDataset: "Dataset has been deleted",
  deleteModel: "Model has been deleted",
  error: "An error occurred",
};

export default function StatusModal({
  isLoading,
  withButton = false,
  buttonLabel,
  variant = "create",
  isOpen,
  setIsOpen,
  customMessage,
  setCustomMessage,
}) {
  return (
    <>
      {withButton && <Button onClick={() => setIsOpen(true)}>{buttonLabel}</Button>}
      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "block" : "hidden"
        } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
      ></div>
      <div className={`${isOpen ? "block" : "hidden"} z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}>
        <div className="bg-white pt-6 pb-8 px-10 rounded-md">
          <img src="/assets/LumbaSuccess.svg" alt="Create Successful" />
          <div className="mt-4 flex flex-col items-center">
            {isLoading ? (
              <div className="race-by mt-4"></div>
            ) : (
              <>
                <h2 className="mb-2">{variant === "error" ? "Error" : "Successful"}</h2>
                <span className={`text-[11px] mb-4 ${variant === "error" && "text-pink"}`}>
                  {customMessage ? customMessage : variants[variant]}
                </span>
                <Button
                  onClick={() => {
                    setCustomMessage("");
                    setIsOpen(false);
                  }}
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
