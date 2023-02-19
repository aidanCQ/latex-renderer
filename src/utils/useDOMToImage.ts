import domtoimage from "dom-to-image";
import React from "react";
import { downloader } from "./downloadData";
import { useDimensions } from "./useDimensions";
//
export const fileTypes = ["jpeg", "png", "svg"] as const;
type FileTypes = typeof fileTypes[number];
type Props = {
  fileName: string;
  scale: number;
  fileType?: FileTypes;
};
export const methodMap: {
  [k in FileTypes]: {
    method: keyof domtoimage;
    extension: string;
    mimeType: string;
  };
} = {
  jpeg: {
    method: "toJpeg",
    extension: ".jpeg",
    mimeType: "image/jpeg",
  },
  png: {
    method: "toPng",
    extension: ".png",
    mimeType: "image/png",
  },
  svg: {
    method: "toSvg",
    extension: ".svg",
    mimeType: "image/svg",
  },
};

export const useDOMToImage = <T extends HTMLElement>(props: Props) => {
  const [fileType, setFileType] = React.useState<FileTypes>(
    props.fileType ?? "jpeg"
  );

  const { ref, dimensions, node } = useDimensions<T>();
  const [fileName, setFileName] = React.useState<string>(props.fileName ?? "");
  const [scale, setScale] = React.useState<number>(props.scale);

  const height = Math.round(dimensions ? scale * dimensions.height : 0);
  const width = Math.round(dimensions ? scale * dimensions.width : 0);
  const type = methodMap[fileType];
  const download = async () => {
    try {
      if (node) {
        const result = await domtoimage[type.method](node, {
          quality: 1,
          height: Math.round(height),
          width: Math.round(width),
          bgcolor: fileType === "jpeg" ? "#ffffff" : "transparent",
          style: {
            // Setting just the width and height does not scale the image content.
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          },
        });
        if (typeof result === "string") {
          const blob = await fetch(result).then((d) => d.blob());
          downloader({
            data: [blob],
            fileName: `${fileName}${type.extension}`,
            blobMimeType: type.mimeType,
          });
          return blob;
        }
      }
    } catch (err) {
      console.error(
        `Failed to export file. Reason ${
          err instanceof Error ? err.message : JSON.stringify(err)
        }`
      );
    }
  };
  return {
    ref,
    download,
    fileType,
    setFileType,
    scale,
    setScale,
    fileName,
    setFileName,
    width,
    height,
  };
};
