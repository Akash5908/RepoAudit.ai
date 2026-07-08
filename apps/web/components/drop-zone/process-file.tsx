import { X } from "lucide-react";
import { Button } from "../ui/button";

export const ProcessFile = ({
  handleRemoveFile,
  selectedFile,
}: {
  handleRemoveFile: () => void;
  selectedFile: any;
}) => {
  return (
    <div className=" w-[30vw] h-[20vh] relative border rounded-md px-10">
      <div
        className="absolute top-0 right-0 cursor-pointer"
        onClick={handleRemoveFile}
      >
        <X />
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="text-center ">
          <div>{selectedFile.name}</div>
        </div>
        <div>
          <Button className="w-[5vw] rounded-xl">Proceed</Button>
        </div>
      </div>
    </div>
  );
};
