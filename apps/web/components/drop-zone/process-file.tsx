import { X } from "lucide-react";
import { Button } from "../ui/button";
import { SpinnerCustom } from "../ui/custom-spinner";

export const ProcessFile = ({
  handleRemoveFile,
  handleFileUpload,
  selectedFile,
  loading,
}: {
  handleRemoveFile: () => void;
  handleFileUpload: () => void;
  selectedFile: any;
  loading: any;
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
          <Button
            className="w-auto px-10 rounded-xl"
            onClick={handleFileUpload}
          >
            {loading ? (
              <div className="min-w-[8vw] flex items-center justify-center gap-2 py-6">
                <span>Processing</span>
                <SpinnerCustom />
              </div>
            ) : (
              <div className="min-w-[5vw]">Proceed</div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
