/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP } from "next";
import Image from "next/image";

import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

import {
  Input,
  Button,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import axios from "axios";

const TryOutImagePage: NP = () => {
  const [uploadingStatus, setUploadingStatus] = useState<
    "idle" | "uploading" | "failed"
  >("idle");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");

  const [fileForUpload, setFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const sendUploadRequest = useCallback(async () => {
    const formData = new FormData();

    if (!fileForUpload) return;

    formData.append("image", fileForUpload);

    try {
      setUploadingStatus("uploading");

      const { data: imagePath } = await axios.post(
        "/api/admin/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (ev) => {
            console.log(ev);

            const loadedVal = ev.loaded as number;
            const maxVal = ev.total as number;

            const loadedPercents = Math.round((100 / maxVal) * loadedVal);

            // console.log(JSON.stringify({ progress: loadedPercents }));
            setUploadProgress(loadedPercents);
          },
        }
      );

      setUploadedImagePath(imagePath as string);

      setUploadingStatus("idle");
    } catch (error) {
      setUploadingStatus("failed");

      console.error(error);

      setTimeout(() => {
        setUploadingStatus("idle");
      }, 3000);
    }
  }, [setUploadingStatus, setUploadedImagePath, fileForUpload]);

  return (
    <div>
      <Input
        disabled={uploadingStatus !== "idle"}
        type="file"
        onChange={(e) => {
          // e.target.files
          const ev = e as unknown as ChangeEvent<HTMLInputElement>;

          if (!ev) return;

          const files = ev.target.files;

          if (!files) return;

          const file = files[0];

          if (!file) return;

          setFile(file);
        }}
      />
      <Button
        disabled={uploadingStatus !== "idle" || !fileForUpload}
        onClick={() => {
          sendUploadRequest();
        }}
        variant="contained"
      >
        Upload{" "}
        {uploadingStatus === "uploading" ? <CircularProgress size={8} /> : ""}
      </Button>
      {uploadingStatus === "failed" && (
        <Alert severity="error">Couldn{"'"}t upload (server error)</Alert>
      )}
      {uploadedImagePath && (
        <div style={{ width: "200px", height: "180px", margin: "28px" }}>
          <Image
            src={uploadedImagePath}
            layout="responsive"
            width="200px"
            height="180px"
            alt="uploaded image"
          />
        </div>
      )}
      {uploadingStatus === "uploading" && (
        <div>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </div>
      )}
    </div>
  );
};

export default TryOutImagePage;
