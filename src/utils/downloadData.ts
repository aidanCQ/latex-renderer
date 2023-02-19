export const downloadURL = (props: { url: string; fileName: string }) => {
  if (document !== undefined) {
    let link = document.createElement("a");
    link.download = props.fileName;
    link.href = props.url;
    link.click();
  }
};

export const downloader = (props: {
  data: ConstructorParameters<typeof Blob>[0];
  fileName: string;
  blobMimeType?: string;
}) => {
  if (window !== undefined) {
    let blob = new Blob(props.data, { type: props.blobMimeType ?? "" });
    let url = window.URL.createObjectURL(blob);
    downloadURL({ url, fileName: props.fileName });
    window.URL.revokeObjectURL(url);
  }
};
