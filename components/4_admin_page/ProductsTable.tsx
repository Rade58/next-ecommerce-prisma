import type { FC } from "react";
import { useState } from "react";

import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
} from "@material-ui/data-grid";

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
}> = ({ initialProducts, productsCount }) => {
  const [fetchedProoductsCount, setFetchedProductsCount] = useState<number>(
    initialProducts.length
  );
  const [products, setProducts] = useState(initialProducts);

  const [sellectedProductsIds, setSelectedProductsIds] = useState<string[]>([]);

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

  console.log({ prod: products[0] });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={10}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={(a, b) => {
          console.log({ a, b });
        }}
        onEditRowsModelChange={(a, b) => {
          console.log({ a, b });
        }}
      />
    </div>
  );
};

export default ProductsTable;
