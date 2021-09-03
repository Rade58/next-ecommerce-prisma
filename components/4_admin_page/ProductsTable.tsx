/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import Image from "next/image";

import type {
  FC,
  ChangeEventHandler,
  FormEvent,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { useState, Fragment, useCallback, useEffect } from "react";

import axios from "axios";

import { useSession } from "next-auth/client";

import { DataGrid, GridColDef } from "@material-ui/data-grid";
import type {
  GridSelectionModel,
  GridEditRowsModel,
} from "@material-ui/data-grid";

import {
  Card,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  CircularProgress,
  Snackbar,
  IconButton,
  Input,
  LinearProgress,
} from "@material-ui/core";

import { DeleteSweep as DelIcon, ExpandMore } from "@material-ui/icons";

import type { AlertProps } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";

import type { Product } from "@prisma/client";

import type { PropsI } from "../../pages/admin/[id]";

export type UpdateProductsDataRecord = Record<
  number,
  Record<
    string,
    { productId: string; noKey: number; propName: string; value: any }
  >
>;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "No", width: 110, hide: true, editable: false },
  {
    field: "productId",
    headerName: "Product Id",
    width: 229,
    editable: false,
    hide: true,
  },
  {
    field: "name",
    headerName: "Product Name",
    width: 190,
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
    editable: true,
  },
  {
    field: "brand",
    headerName: "Brand",
    width: 130,
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    width: 110,
    editable: true,
  },
  {
    field: "countInStock",
    headerName: "Stock",
    width: 130,
    editable: true,
  },
  {
    field: "image",
    headerName: "Image Url",
    width: 130,
    editable: true,
  },
  {
    field: "category",
    headerName: "Category",
    width: 130,
    editable: true,
  },
];

const ProductsTable: FC<{
  initialProducts: PropsI["products"];
  productsCount: PropsI["productsCount"];
}> = ({ initialProducts, productsCount: initialProductsCount }) => {
  const [session, loading] = useSession();

  const [productsCount, setProductsCount] =
    useState<number>(initialProductsCount);

  const [fetchedProoductsCount, setFetchedProductsCount] = useState<number>(
    initialProducts.length
  );
  const [products, setProducts] =
    useState<typeof initialProducts>(initialProducts);

  // FOR SEARCH (YOU CAN TRY IMPLEMENTING THIS IN FUTURE)
  /*   const [rows, setRows] = useState<any[]>(products);

  useEffect(() => {
    setRows(products);
  }, [products]); */

  //
  // IMAGE UPLOADING STUFF

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

  // ------------------------------------

  const [cursor, setCursor] = useState<string>(
    products[products.length - 1].productId
  );

  const [selectedProductsNos, setSelectedProductsNos] =
    useState<GridSelectionModel>([]);

  const [parametersForUpdate, setParametersForUpdate] =
    useState<UpdateProductsDataRecord>({});

  const [updateRequestStatus, setUpdateRequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");
  const [deleteRequestStatus, setDeleteRequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");
  const [load100RequestStatus, setLoad100RequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  useEffect(() => {
    setCursor(products[products.length - 1].productId);
  }, [products, setCursor]);

  // FOR DELETING

  const handleDeletingReq = useCallback(async () => {
    if (!session) {
      return;
    }

    if (loading) {
      return;
    }

    if (!session.profile || !(session as any).profile.id) {
      return;
    }

    const productsForDeletion = [];

    for (let no in selectedProductsNos) {
      console.log({ no });

      const item = selectedProductsNos[no];

      console.log({ item });
      if (products[Number(item) - 1] !== undefined) {
        productsForDeletion.push(products[Number(item) - 1].productId);
      }
    }

    console.log({ productsForDeletion });

    // MAKING REQUEST

    try {
      setDeleteRequestStatus("pending");

      setSelectedProductsNos([]);

      /* throw new Error("Hello World");
      setTimeout(() => {
        setSelectedProductsNos([]);

        setDeleteRequestStatus("idle");
      }, 3000); */

      const { data } = await axios.delete(
        `/api/admin/${(session as any).profile.id}`,
        {
          data: {
            data: productsForDeletion,
            model: "product",
            loadedProductCount: products.length,
          },
        }
      );

      setProducts(
        data.products.map((prod: Product, i: number) => {
          return {
            ...prod,
            createdAt: new Date(prod.createdAt).toISOString(),
            updatedAt: new Date(prod.updatedAt).toISOString(),
            id: i + 1,
          };
        })
      );
      setProductsCount(data.allProductsCount);

      // setCursor((data as Product[])[(data as Product[]).length - 1].productId);
      setDeleteRequestStatus("idle");

      setSelectedProductsNos([]);
    } catch (err) {
      console.error(err);
      setDeleteRequestStatus("rejected");

      setTimeout(() => {
        setDeleteRequestStatus("idle");
        setSelectedProductsNos([]);
      }, 5000);
    }
  }, [selectedProductsNos, products, session, loading]);

  // FOR UPDATING
  const handleUpdatingParams = useCallback(
    (oneUpdatingParameter: GridEditRowsModel) => {
      if (!Object.keys(oneUpdatingParameter).length) {
        return;
      }

      const noKey = Number(Object.keys(oneUpdatingParameter)[0]);

      if (!oneUpdatingParameter[noKey]) {
        return;
      }

      const propNameKeys = Object.keys(oneUpdatingParameter[noKey]);

      const propName = propNameKeys[0];

      if (!propName) {
        return;
      }

      const value = oneUpdatingParameter[noKey][propName]["value"];

      const productId = products[noKey - 1].productId;

      const data = { noKey, propName, value, productId };

      setParametersForUpdate((prev) => {
        const newParams = { ...prev };

        if (!prev[noKey]) {
          newParams[noKey] = {
            [`${propName}`]: data,
          };

          return newParams;
        }

        newParams[noKey][`${propName}`] = data;

        return newParams;
      });
    },
    [products]
  );

  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState<boolean>(true);

  const handleUpdatingSnackbarClose = (
    event?: SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateSnackbarOpen(false);
  };

  const handleUpdatingSnackbarOpen = () => {
    setUpdateSnackbarOpen(true);
  };

  useEffect(() => {
    if (Object.keys(parametersForUpdate).length) {
      handleUpdatingSnackbarOpen();
    }
  }, [parametersForUpdate]);

  const handleUpdateRequest = useCallback(async () => {
    if (!session) {
      return;
    }

    if (loading) {
      return;
    }

    if (!session.profile || !(session as any).profile.id) {
      return;
    }

    if (!Object.keys(parametersForUpdate).length) {
      return;
    }

    // SENDING REQUEST

    try {
      // SIMULATING REQUEST
      setUpdateRequestStatus("pending");

      // TESTING WITH ERROR
      /* throw new Error("Hello World");
      setTimeout(() => {
        setUpdateRequestStatus("idle");
        setParametersForUpdate({});
      }, 3000); */

      const { data } = await axios.put(
        `/api/admin/${(session as any).profile.id}`,
        {
          data: parametersForUpdate,
          model: "product",
          loadedProductCount: products.length,
        }
      );

      setProducts(
        data.products.map((prod: Product, i: number) => {
          return {
            ...prod,
            createdAt: new Date(prod.createdAt).toISOString(),
            updatedAt: new Date(prod.updatedAt).toISOString(),
            id: i + 1,
          };
        })
      );

      // setCursor((data as Product[])[(data as Product[]).length - 1].productId);

      setUpdateRequestStatus("idle");
      setParametersForUpdate({});
    } catch (err) {
      console.error(err);

      setUpdateRequestStatus("rejected");
      // I'LL LEAVE THIS TIMER HERE
      setTimeout(() => {
        setParametersForUpdate({});
        setUpdateRequestStatus("idle");
      }, 8000);

      // setParametersForUpdate({});
    }
  }, [
    parametersForUpdate,
    session,
    loading,
    setUpdateRequestStatus,
    setParametersForUpdate,
    products.length,
  ]);

  //

  // ___________________________________CREATING NEW PRODUCT_______________________________

  const [creationFields, setFields] = useState<{
    name: string;
    image: string;
    description: string;
    brand: string;
    price: number;
    countInStock: number;
    category: string;
  }>({
    brand: "",
    countInStock: 0,
    description: "",
    name: "",
    image: "",
    price: 0,
    category: "",
  });

  const { name, brand, countInStock, description, image, price, category } =
    creationFields;

  useEffect(() => {
    setFields((prev) => {
      return { ...prev, image: uploadedImagePath };
    });
  }, [uploadedImagePath, setFields]);

  const [creationReqStatus, setCreationReqStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  const handleChangeForCreation: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleCreationSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!session) {
        return;
      }

      if (loading) {
        return;
      }

      if (!session.profile || !(session as any).profile.id) {
        return;
      }

      try {
        setSelectedProductsNos([]);

        setParametersForUpdate({});

        setCreationReqStatus("pending");
        // throw new Error("Hello world");

        // AS YOU CAN SEE HERE WE ARE MAKING NETWORK REQUEST
        const { data } = await axios.post(
          `/api/admin/${(session as any).profile.id}`,
          {
            model: "product",
            data: {
              name,
              brand,
              countInStock,
              description,
              image,
              price,
              category,
            },
            loadedProductCount: products.length,
          }
        );

        setProducts(
          data.products.map((prod: Product, i: number) => {
            return {
              ...prod,
              createdAt: new Date(prod.createdAt).toISOString(),
              updatedAt: new Date(prod.updatedAt).toISOString(),
              id: i + 1,
            };
          })
        );
        setProductsCount(data.allProductsCount);

        // setCursor(products[products.length - 1].productId);
        setFields({
          brand: "",
          category: "",
          countInStock: 0,
          description: "",
          image: "",
          name: "",
          price: 0,
        });
        setCreationReqStatus("idle");
        // console.log({ data });
      } catch (err) {
        setCreationReqStatus("rejected");
        console.error({ err });
        setTimeout(() => {
          setCreationReqStatus("idle");
        }, 3000);
      }
    },
    [
      session,
      loading,
      name,
      brand,
      countInStock,
      description,
      price,
      image,
      category,
      setCreationReqStatus,
      products,
    ]
  );

  const handleLoading100MoreReq = useCallback(async () => {
    if (!session) {
      return;
    }

    if (loading) {
      return;
    }

    if (!session.profile || !(session as any).profile.id) {
      return;
    }

    try {
      setLoad100RequestStatus("pending");
      setSelectedProductsNos([]);

      setParametersForUpdate({});
      /* throw new Error("hello world");

      setTimeout(() => {
        setLoad100RequestStatus("idle");
      }, 3000); */

      const { data } = await axios.post(
        `/api/admin/load-more/${(session as any).profile.id}`,
        {
          cursor: cursor,
          model: "product",
        }
      );

      // console.log({ data });

      // setCursor(products[products.length - 1].productId);
      const newProducts = (data as Product[]).map((prod, i) => {
        return {
          ...prod,
          createdAt: new Date(prod.createdAt).toISOString(),
          updatedAt: new Date(prod.updatedAt).toISOString(),
          id: products.length - 1 + i + 1,
        };
      });

      setProducts((prev) => {
        return [...prev, ...newProducts];
      });

      setLoad100RequestStatus("idle");

      setSelectedProductsNos([]);

      setParametersForUpdate({});
    } catch (err) {
      console.error(err);
      setLoad100RequestStatus("rejected");
      setTimeout(() => {
        setLoad100RequestStatus("idle");
      }, 3000);
    }
  }, [cursor, session, loading, products]);

  const buttonDisabled =
    !name ||
    !brand ||
    !countInStock ||
    !description ||
    !price ||
    !image ||
    creationReqStatus === "pending"
      ? true
      : false;

  // __________________________________________________________________
  // __________________________________________________________________

  // console.log({ selectedProductsNos: JSON.stringify(selectedProductsNos) });
  // console.log({ parametersForUpdate: parametersForUpdate });

  /* useEffect(() => {

    if(updateSnackbarOpen){
      if(Object.keys(updateUpdatingParams).length){}
    }

  }, [updateUpdatingParams, updateSnackbarOpen]) */

  console.log({ selectedProductsNos });
  console.log({ parametersForUpdate });
  console.log({ products });

  return (
    <Fragment>
      <div>
        {deleteRequestStatus !== "pending" &&
          updateRequestStatus !== "pending" &&
          load100RequestStatus !== "pending" && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Add New Product</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <section
                  className="form-holder"
                  css={css`
                    /* padding-top: 10vh; */
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    align-content: center;

                    & div.field {
                      /* margin-top: 10vh; */
                      display: flex;
                      justify-content: center;
                    }

                    & button {
                      margin-top: 8vh;
                    }
                  `}
                >
                  <form onSubmit={handleCreationSubmit}>
                    <div className="field">
                      <TextField
                        onChange={handleChangeForCreation}
                        value={name}
                        name="name"
                        id="name-field"
                        label="Name"
                        placeholder="Name"
                        variant="filled"
                      />
                    </div>
                    <div className="field">
                      <TextField
                        onChange={handleChangeForCreation}
                        value={brand}
                        name="brand"
                        id="brand-field"
                        label="Brand"
                        placeholder="Brand"
                        variant="filled"
                      />
                    </div>
                    <div className="field">
                      <TextField
                        onChange={handleChangeForCreation}
                        value={price}
                        name="price"
                        id="price-field"
                        label="Price"
                        placeholder="Price"
                        variant="filled"
                        type="number"
                      />
                    </div>
                    <div className="field">
                      <TextField
                        onChange={handleChangeForCreation}
                        value={countInStock}
                        type="number"
                        name="countInStock"
                        id="countinstock-field"
                        label="Count In Stock"
                        placeholder="CountInStock"
                        variant="filled"
                      />
                    </div>

                    <div className="field">
                      <TextField
                        onChange={handleChangeForCreation}
                        value={category}
                        name="category"
                        id="category-field"
                        label="Category"
                        placeholder="Category"
                        variant="filled"
                      />
                    </div>
                    <div className="field file-input">
                      {/* <TextField
                        onChange={handleChangeForCreation}
                        value={image}
                        name="image"
                        id="image-field"
                        label="Image Url"
                        placeholder="Image Url"
                        variant="filled"
                        // type="file"
                      /> */}
                      <Input
                        disabled={uploadingStatus !== "idle"}
                        type="file"
                        onChange={(e) => {
                          // e.target.files
                          const ev =
                            e as unknown as ChangeEvent<HTMLInputElement>;

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
                        {uploadingStatus === "uploading" ? (
                          <CircularProgress size={8} />
                        ) : (
                          ""
                        )}
                      </Button>
                      {uploadingStatus === "failed" && (
                        <Alert severity="error">
                          Couldn{"'"}t upload (server error)
                        </Alert>
                      )}
                      {uploadedImagePath && (
                        <div
                          style={{
                            width: "200px",
                            height: "180px",
                            margin: "28px",
                          }}
                        >
                          <Image
                            src={uploadedImagePath}
                            layout="responsive"
                            width="100px"
                            height="68px"
                            alt="uploaded image"
                          />
                        </div>
                      )}
                      {uploadingStatus === "uploading" && (
                        <div>
                          <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className="field"
                      css={css`
                        align-self: flex-start;
                        width: 48vw;
                      `}
                    >
                      <TextField
                        onChange={handleChangeForCreation}
                        value={description}
                        name="description"
                        id="description-field"
                        label="Description"
                        placeholder="Description"
                        multiline
                        fullWidth
                      />
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={buttonDisabled}
                    >
                      {"Save New Product "}
                      {creationReqStatus === "pending" ||
                      creationReqStatus === "rejected" ? (
                        <div
                          css={css`
                            display: inline-block;
                            margin-left: 8px;
                          `}
                        >
                          <CircularProgress color="secondary" size={18} />
                        </div>
                      ) : (
                        ""
                      )}
                    </Button>
                    {creationReqStatus === "rejected" && (
                      <span
                        css={css`
                          color: tomato;
                          margin-left: 60px;
                          margin-top: 12px;
                        `}
                      >
                        Something went wrong
                      </span>
                    )}
                  </form>
                </section>
              </AccordionDetails>
            </Accordion>
          )}
        <Paper elevation={2}>
          <section
            style={{
              padding: "20px",
            }}
          >
            <div>
              total products manging:{" "}
              <span style={{ fontSize: "1.4em", fontWeight: 400 }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {productsCount}{" "}
              </span>
            </div>

            <div>
              loaded products count :{" "}
              <span style={{ fontSize: "1.4em", fontWeight: 400 }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {products.length}
              </span>
            </div>
          </section>
        </Paper>
        <div
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Card elevation={0}>
            {fetchedProoductsCount !== productsCount &&
              deleteRequestStatus !== "pending" &&
              updateRequestStatus !== "pending" &&
              creationReqStatus !== "pending" && (
                <Button
                  onClick={() => {
                    handleLoading100MoreReq();
                  }}
                  variant="contained"
                  color="primary"
                  disabled={load100RequestStatus !== "idle"}
                >
                  {load100RequestStatus === "rejected"
                    ? "Something went wrong (server error)"
                    : "Load 100 More Products"}{" "}
                  &nbsp;&nbsp;{" "}
                  {load100RequestStatus === "pending" && (
                    <CircularProgress size={8} />
                  )}
                </Button>
              )}
          </Card>
          {selectedProductsNos.length !== 0 && (
            <Card elevation={0}>
              {updateRequestStatus !== "pending" &&
                load100RequestStatus !== "pending" &&
                creationReqStatus !== "pending" && (
                  <Fragment>
                    <span style={{ color: "tomato" }}>danger zone: </span>
                    <Button
                      onClick={() => {
                        handleDeletingReq();
                      }}
                      color="primary"
                      variant="outlined"
                      disabled={
                        deleteRequestStatus === "pending" ||
                        deleteRequestStatus === "rejected"
                      }
                    >
                      <DelIcon />
                      {deleteRequestStatus === "rejected"
                        ? "Couldn't delete (server problem)"
                        : "Delete Selected Products"}{" "}
                      &nbsp;{" "}
                      {deleteRequestStatus === "pending" && (
                        <CircularProgress size={18} />
                      )}
                    </Button>
                  </Fragment>
                )}
            </Card>
          )}
        </div>
      </div>
      <div style={{ height: 466, width: "100%" }}>
        {deleteRequestStatus !== "pending" &&
        updateRequestStatus !== "pending" &&
        load100RequestStatus !== "pending" &&
        creationReqStatus !== "pending" ? (
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={6}
            checkboxSelection
            disableSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableColumnFilter
            onSelectionModelChange={(a, b) => {
              console.log(JSON.stringify({ a }, null, 2));

              setSelectedProductsNos(a);
            }}
            onEditRowsModelChange={(a, b) => {
              handleUpdatingParams(a);
            }}
          />
        ) : (
          <div
            css={css`
              margin-top: 120px;
              margin-left: auto;
              margin-right: auto;
              text-align: center;
            `}
          >
            <CircularProgress />
          </div>
        )}
      </div>
      {Object.keys(parametersForUpdate).length !== 0 ? (
        <div>
          <Snackbar
            open={updateSnackbarOpen}
            onClose={handleUpdatingSnackbarClose}
          >
            <Alert
              onClose={
                updateRequestStatus === "rejected"
                  ? handleUpdatingSnackbarClose
                  : undefined
              }
              severity={updateRequestStatus === "rejected" ? "error" : "info"}
            >
              {updateRequestStatus === "rejected"
                ? "Error"
                : "You changed some products!"}{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              {updateRequestStatus !== "rejected" &&
              deleteRequestStatus !== "pending" &&
              load100RequestStatus !== "pending" ? (
                <Button
                  disabled={updateRequestStatus === "pending"}
                  onClick={(e) => {
                    handleUpdateRequest();
                  }}
                  variant="contained"
                  color="primary"
                >
                  Save changes &nbsp;{" "}
                  {updateRequestStatus === "pending" && (
                    <CircularProgress size={18} />
                  )}
                </Button>
              ) : (
                "Something went wrong (problem with server)"
              )}
            </Alert>
          </Snackbar>
        </div>
      ) : null}
    </Fragment>
  );
};

export default ProductsTable;
