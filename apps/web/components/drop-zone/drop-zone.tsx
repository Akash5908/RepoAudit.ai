"use client";
import { useState } from "react";
import { FileDropzone } from "./drop-zone-ui";

export const DropZone = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const handleFileAccept = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <>
      {selectedFile ? (
        <div>
          <div>{JSON.stringify(selectedFile)}</div>
        </div>
      ) : (
        <FileDropzone onFileAccepted={handleFileAccept} />
      )}
    </>
  );
};
