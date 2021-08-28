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

/* const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
]; */

const ProductsTable: FC<{
  initialProducts: PropsI["products"];
  productsCount: PropsI["productsCount"];
}> = ({ initialProducts, productsCount }) => {
  const [products, setProducts] = useState(initialProducts);

  console.log({ prod: products[0] });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={(a, b) => {
          console.log({ a, b });
        }}
      />
    </div>
  );
};

export default ProductsTable;
