import type { FC } from "react";
import { useState } from "react";

import { DataGrid, GridColDef } from "@material-ui/data-grid";
import type { GridSelectionModel } from "@material-ui/data-grid";

import { Card, Button, Paper } from "@material-ui/core";

import { DeleteSweep as DelIcon } from "@material-ui/icons";

import type { PropsI } from "../../pages/admin/[id]";

const columns: GridColDef[] = [
  { field: "id", headerName: "No", width: 110 },
  { field: "productId", headerName: "Product Id", width: 160, editable: false },
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
    width: 110,
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
    headerName: "Count In Stock",
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

  console.log({ selectedProductsNos: JSON.stringify(selectedProductsNos) });

  return (
    <>
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
    </>
  );
};

export default ProductsTable;
