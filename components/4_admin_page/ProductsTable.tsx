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
