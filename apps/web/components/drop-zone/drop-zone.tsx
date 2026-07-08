"use client";
import { useState } from "react";
import { FileDropzone } from "./drop-zone-ui";
import { ProcessFile } from "./process-file";

export const DropZone = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const handleFileAccept = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
  };

  const handleFileUpload = () => {
    if (selectedFile == undefined) {
      setLoading(true);
    }
    try {
      // will add logic to target the file uploading endpoint.
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {selectedFile ? (
        <div className=" w-screen h-screen flex justify-center items-center">
          <ProcessFile
            handleRemoveFile={handleRemoveFile}
            selectedFile={selectedFile}
          />
        </div>
      ) : (
        <>
          <FileDropzone onFileAccepted={handleFileAccept} />
        </>
      )}
    </>
  );
};
