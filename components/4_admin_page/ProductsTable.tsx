/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
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

import {
  DataGrid,
  GridColDef,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
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
} from "@material-ui/core";

import {
  DeleteSweep as DelIcon,
  ExpandMore,
  ExpandLess,
  SearchSharp,
  ClearAll,
} from "@material-ui/icons";

import type { AlertProps } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";

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
    width: 160,
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

  // FOR SEARCH
  const [rows, setRows] = useState<any[]>(products);

  useEffect(() => {
    setRows(products);
  }, [products]);

  //

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
      productsForDeletion.push(products[no].productId);
    }

    // MAKING REQUEST

    try {
      setDeleteRequestStatus("pending");

      /* throw new Error("Hello World");
      setTimeout(() => {
        setSelectedProductsNos([]);

        setDeleteRequestStatus("idle");
      }, 3000); */

      const { data } = await axios.delete(
        `/api/admin/${(session as any).profile.id}`,
        {
          data: { data: productsForDeletion, model: "product" },
        }
      );

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

      const productId = products[noKey].productId;

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
      // TESTING WITH ERROR
      // SIMULATING REQUEST
      setUpdateRequestStatus("pending");

      /* throw new Error("Hello World");
      setTimeout(() => {
        setUpdateRequestStatus("idle");
        setParametersForUpdate({});
      }, 3000); */

      const { data } = await axios.put(
        `/api/admin/${(session as any).profile.id}`,
        { data: parametersForUpdate, model: "product" }
      );

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

    // RESETING
  }, [
    parametersForUpdate,
    session,
    loading,
    setUpdateRequestStatus,
    setParametersForUpdate,
  ]);

  //

  // FOR DELETING

  //

  // TREBA CE TI SAVE DUGME NAKON EDITA (I TU CES DA UPDATE-UJES
  // products I DA POSALJES REQUEST)

  // STO SE TICE REQUESTA ZA LOADING-OM MORE PRODUCTS
  // POSTOJECIM productsIMA CES PRIDODATI NOVE PRODUCTS

  // MI CEMO DODATI DELETE DUGME
  // KAD GA KORISNIK KLIKNE SALJEMO REQUEST SA selectedProducts IDS
  // DA UKLANJAMO PRODUCTS

  // VODI RACUNA O KURSORU PRI SVAKOM REQUESTU

  // SVAKI PUT KADA ZATRAZIS PRODUCTS NAZAD NEKA TO BUDE BROJ PROIZVODA
  // KOLIKO JE DO SADA USER LOAD-OVAO

  // MORAMO DA RERENDER-UJEMO TABELU, NAKON SVAAKOG REQUESTA
  // SA CIJIM PODACIMA POPULATE-UJEMO TABLE

  // SPINNER MOGU DA POKAZUJEM UMESTO TABELE, ONDA KADA SE SALJE REQUEST

  // API ROUTE MOZE DA BUDE ISTA ZA PRODUCTS ORDERS USERS

  // KADA SE DELETE-UJE MORA DA SE REFETCH-UJE DO SADA UKUPNO LOADED PRODUCTS

  // console.log({ prod: products[0] });

  // ___________________________________CRETING NEW PRODUCT_______________________________
  // __________________________________________________________________
  // __________________________________________________________________
  // __________________________________________________________________
  const [
    { name, brand, countInStock, description, image, price, category },
    setFields,
  ] = useState<{
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

  const [creationReqStatus, setCreationReqStatus] = useState<
    "idle" | "pending"
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

      setCreationReqStatus("pending");
      try {
        // AS YOU CAN SEE HERE WE ARE MAKING NETWORK REQUEST
        const res = await axios.post(
          `/api/admin/${(session as any).profile.id}`,
          {
            model: "product",
            fields: {
              name,
              brand,
              countInStock,
              description,
              image,
              price,
              category,
            },
          }
        );
        setCreationReqStatus("idle");
        console.log(res.data);
      } catch (err) {
        setCreationReqStatus("idle");
        console.log({ err });
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

      setLoad100RequestStatus("idle");
    } catch (err) {
      console.error(err);
      setLoad100RequestStatus("rejected");
      setTimeout(() => {
        setLoad100RequestStatus("idle");
      }, 3000);
    }
  }, [cursor, session, loading]);

  const buttonDisabled =
    !name ||
    !brand ||
    !countInStock ||
    !description ||
    !price ||
    creationReqStatus === "pending"
      ? true
      : false;

  // __________________________________________________________________
  // __________________________________________________________________
  // __________________________________________________________________
  // __________________________________________________________________

  // console.log({ selectedProductsNos: JSON.stringify(selectedProductsNos) });
  console.log({ parametersForUpdate: parametersForUpdate });

  /* useEffect(() => {

    if(updateSnackbarOpen){
      if(Object.keys(updateUpdatingParams).length){}
    }

  }, [updateUpdatingParams, updateSnackbarOpen]) */

  return (
    <Fragment>
      <div>
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
                <div className="field">
                  <TextField
                    onChange={handleChangeForCreation}
                    value={image}
                    name="image"
                    id="image-field"
                    label="Image Url"
                    placeholder="Image Url"
                    variant="filled"
                  />
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
                  {creationReqStatus === "pending" ? (
                    <div
                      css={css`
                        display: inline-block;
                        margin-left: 8px;
                      `}
                    >
                      <CircularProgress color="primary" size={18} />
                    </div>
                  ) : (
                    ""
                  )}
                </Button>
              </form>
            </section>
          </AccordionDetails>
        </Accordion>
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
            {fetchedProoductsCount !== productsCount && (
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
                  : "Load 100 More Products to manage"}{" "}
                &nbsp;&nbsp;{" "}
                {load100RequestStatus === "pending" && (
                  <CircularProgress size={8} />
                )}
              </Button>
            )}
          </Card>
          {selectedProductsNos.length !== 0 && (
            <Card elevation={0}>
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
            </Card>
          )}
        </div>
      </div>
      <div style={{ height: 466, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={6}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(a, b) => {
            setSelectedProductsNos(a);
          }}
          onEditRowsModelChange={(a, b) => {
            handleUpdatingParams(a);
          }}
        />
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
              {updateRequestStatus !== "rejected" ? (
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
