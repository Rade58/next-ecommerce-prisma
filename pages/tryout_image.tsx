/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP } from "next";
import Image from "next/image";

import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

import { Input } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import axios from "axios";

const TryOutImagePage: NP = () => {
  const [uploadingStatus, setUploadingStatus] = useState<
    "idle" | "uploading" | "failed"
  >("idle");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");

  const sendRequest = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target?.files;

      if (!files) return;

      const file = files[0];

      if (!file) return;

      try {
        setUploadingStatus("uploading");

        const { data: imagePath } = await axios.post(
          "/api/admin/upload",
          { image: file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (ev) => {
              console.log(ev);

              const loadedVal = ev.loaded as number;
              const maxVal = ev.total as number;

              const loadedPercents = (100 / maxVal) * loadedVal;

              console.log(JSON.stringify({ progress: loadedPercents }));
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
    },
    [setUploadingStatus, setUploadedImagePath]
  );

  return (
    <div>
      <Input
        disabled={uploadingStatus !== "idle"}
        type="file"
        onChange={(e) => {
          // e.target.files
        }}
      />
      {uploadingStatus === "failed" && (
        <Alert severity="error">Couldn{"'"}t upload (server error)</Alert>
      )}
      {uploadedImagePath && (
        <div style={{ width: "200px", height: "180px", margin: "28px" }}>
          <Image
            src={uploadedImagePath}
            layout="responsive"
            alt="uploaded image"
          />
        </div>
      )}
    </div>
  );
};

export default TryOutImagePage;
