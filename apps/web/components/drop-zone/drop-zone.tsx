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
    if (selectedFile == undefined) return;
    console.log("File upload", selectedFile);
    setLoading(true);
    try {
      // will add logic to target the file uploading endpoint.
      setTimeout(() => {
        setLoading(false);
        setFileUploaded(true);
      }, 2000);
    } catch (error) {
      setFileUploaded(false);
      setLoading(false);
    }
  };

  const dashboard = ["Seo", "Code writting", "estimate price"];

  return (
    <>
      {fileUploaded ? (
        <div>
          <div>
            Your file got uploaded :)
            {dashboard.map((item) => (
              <div className="border w-[20vw] h-[10vh] rounded-sm">
                {" "}
                <div className=" h-full flex justify-center items-center">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </>
  );
};
