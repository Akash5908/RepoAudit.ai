"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";
import { FileDropzone } from "@/components/drop-zone/drop-zone";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className="w-screen h-screen " >
      {/* Container */}
      <main className="flex  w-full h-full flex-col justify-center items-center">
        <div className="flex justify-center h-auto ">
          <h1>Drop your project to Start!</h1>
        </div>
        {/* Dropzone  */}
        {/* <div className="w-[50vw] h-[50vh] bg-blue-500 rounded-md flex justify-center items-center">
          <Button size="lg" className="border border-white rounded-md cursor-pointer w-[10vw] bg-slate-600">
            <span className="text-xl px-[10vw]">Drop .zip</span>
          </Button>
        </div> */}
        <FileDropzone onFileAccepted={(file) => console.log(file)} />
      </main>
    </div>
  );
}
