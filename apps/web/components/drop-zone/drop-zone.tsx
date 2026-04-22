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

  const handleFileUpload = async () => {
    if (selectedFile == undefined) return;
    console.log("File upload", selectedFile);

    setLoading(true);

    const formData = new FormData();
    // Grab the first file from the state array
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`http://localhost:5001/api/v1/file-upload`, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
      });
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

  const dashboard = [
    { label: "Seo", value: 10 },
    { label: "Code writting", value: 20 },
    { label: "estimate price", value: 40 },
  ];

  return (
    <>
      {fileUploaded ? (
        <div className="w-screen h-screen">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="h-[5vh]  flex items-center">
              <span>Your file got uploaded :)</span>
            </div>
            <div className="grid grid-cols-3 gap-4 my-9">
              {dashboard.map((item) => (
                <div
                  className="border w-[20vw] h-[10vh] flex flex-col rounded-sm "
                  key={item.label}
                >
                  {" "}
                  <div className=" h-full flex justify-center items-center">
                    {item.label}
                  </div>
                  <div className=" h-full flex justify-center items-center">
                    {item.value}/100
                  </div>
                </div>
              ))}
            </div>
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
