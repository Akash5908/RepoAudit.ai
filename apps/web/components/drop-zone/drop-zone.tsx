"use client";
import { useState } from "react";
import { FileDropzone } from "./drop-zone-ui";
import { ProcessFile } from "./process-file";

export const DropZone = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
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
      setTimeout(() => {
        setFileUploaded(true);
      }, 2000);
    } catch (error) {
      setFileUploaded(false);
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
            handleFileUpload={handleFileUpload}
            selectedFile={selectedFile}
            loading={loading}
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
