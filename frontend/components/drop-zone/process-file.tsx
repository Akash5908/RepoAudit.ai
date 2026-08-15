"use client";

import { X, FileArchive, ArrowRight } from "lucide-react";
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
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 relative shadow-sm text-slate-800 animate-in fade-in duration-200">
      
      {/* Remove File Button */}
      <button
        className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
        onClick={handleRemoveFile}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* File Icon */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
          <FileArchive className="h-10 w-10" />
        </div>

        {/* File Metadata */}
        <div className="space-y-1.5 w-full font-sans">
          <h3 className="font-bold text-lg text-slate-850 truncate px-4">
            {selectedFile.name}
          </h3>
          <p className="text-xs text-slate-500">
            Ready for static analysis scanning
          </p>
        </div>

        {/* Proceed Action */}
        <div className="w-full pt-2">
          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-6 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            onClick={handleFileUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>Processing Ingestion</span>
                <SpinnerCustom />
              </>
            ) : (
              <>
                <span>Proceed to Audit</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
