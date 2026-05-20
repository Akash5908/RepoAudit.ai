"use client";
import { useState } from "react";
import { FileDropzone } from "./drop-zone-ui";
import { X } from "lucide-react";

export const DropZone = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const handleFileAccept = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
  };

  return (
    <>
      {selectedFile ? (
        <div className=" w-screen h-screen flex justify-center items-center">
          <div className=" w-[30vw] h-[20vh] relative border rounded-md px-10">
            <div
              className="absolute top-0 right-0 cursor-pointer"
              onClick={handleRemoveFile}
            >
              <X />
            </div>
            <div className="w-full h-full flex flex-col justify-center">
              <div className="text-center ">
                <div>{selectedFile.name}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <FileDropzone onFileAccepted={handleFileAccept} />
        </>
      )}
    </>
  );
};
