import Input from "../Form/Input";
import Question from "../Icon/Question";

export default function NSteps() {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap">N_steps</span> <Question label="Input cannot be longer than data" />
      </div>
      <Input placeholder="Enter value of n_steps (cannot be longer than data)" name="steps" />
    </>
  );
}
