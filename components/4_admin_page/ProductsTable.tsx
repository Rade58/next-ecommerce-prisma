/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC, ChangeEventHandler } from "react";
import { useState, Fragment, useCallback, FormEvent } from "react";

import axios from "axios";

import { DataGrid, GridColDef } from "@material-ui/data-grid";
import type { GridSelectionModel } from "@material-ui/data-grid";

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
} from "@material-ui/core";

import {
  DeleteSweep as DelIcon,
  ExpandMore,
  ExpandLess,
} from "@material-ui/icons";

import type { PropsI } from "../../pages/admin/[id]";

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
];

const ProductsTable: FC<{
  initialProducts: PropsI["products"];
  productsCount: PropsI["productsCount"];
}> = ({ initialProducts, productsCount: initialProductsCount }) => {
  const [productsCount, setProductsCount] =
    useState<number>(initialProductsCount);

  const [fetchedProoductsCount, setFetchedProductsCount] = useState<number>(
    initialProducts.length
  );
  const [products, setProducts] =
    useState<typeof initialProducts>(initialProducts);

  const [selectedProductsNos, setSelectedProductsNos] =
    useState<GridSelectionModel>([]);

  const [productsToBeUpdated, setProductsYoBeUpdated] = useState<
    typeof products
  >([]);

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
  const [{ name, email, message }, setFields] = useState<{
    name: string;
    email: string;
    message: string;
  }>({
    name: "",
    email: "",
    message: "",
  });

  const [reqStatus, setReqStatus] = useState<"idle" | "pending">("idle");

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setReqStatus("pending");
      try {
        // AS YOU CAN SEE HERE WE ARE MAKING NETWORK REQUEST
        const res = await axios.post("/api/mail", { name, email, message });
        setReqStatus("idle");
        console.log(res.data);
      } catch (err) {
        setReqStatus("idle");
        console.log({ err });
      }
    },
    [name, email, message, setReqStatus]
  );

  const buttonDisabled =
    !name || !email || !message || reqStatus === "pending" ? true : false;

  // __________________________________________________________________
  // __________________________________________________________________
  // __________________________________________________________________
  // __________________________________________________________________

  console.log({ selectedProductsNos: JSON.stringify(selectedProductsNos) });

  return (
    <Fragment>
      <div>
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
                padding-top: 10vh;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                align-content: center;

                & div.field {
                  margin-top: 10vh;
                  display: flex;
                  justify-content: center;
                }

                & button {
                  margin-top: 8vh;
                }
              `}
            >
              <form onSubmit={handleSubmit}>
                <div className="field">
                  {/* THIS IS GOING TO BE INPUT FOR SENDERS MAIL  */}
                  <TextField
                    onChange={handleChange}
                    value={name}
                    name="name"
                    id="name-field"
                    label="Your Name"
                    placeholder="Your Name"
                    variant="filled"
                  />
                </div>
                <div className="field">
                  {/* THIS IS GOING TO BE EMAIL USER IS SENDDING TO */}
                  <TextField
                    onChange={handleChange}
                    value={email}
                    type="email"
                    name="email"
                    id="email-field"
                    label="Send To Email Address"
                    placeholder="Send To Email address"
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
                  {/* AND THIS IS MESSAGE, USER IS SENDING */}
                  <TextField
                    onChange={handleChange}
                    value={message}
                    name="message"
                    id="message-field"
                    label="Message"
                    placeholder="Message"
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
                  {"Send "}
                  {reqStatus === "pending" ? (
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
              <Button variant="contained" color="primary">
                Load 100 More Products
              </Button>
            )}
          </Card>
          {selectedProductsNos.length !== 0 && (
            <Card elevation={0}>
              <span style={{ color: "tomato" }}>danger zone: </span>
              <Button color="primary" variant="outlined">
                <DelIcon />
                Delete Selected Products
              </Button>
            </Card>
          )}
        </div>
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(a, b) => {
            // console.log({ a, b });

            setSelectedProductsNos(a);
          }}
          onEditRowsModelChange={(a, b) => {
            console.log({ a, b });
          }}
        />
      </div>
    </Fragment>
  );
};

export default ProductsTable;
