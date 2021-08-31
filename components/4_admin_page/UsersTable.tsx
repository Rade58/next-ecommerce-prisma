import type { FC } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
} from "@material-ui/data-grid";

import type { PropsI } from "../../pages/admin/[id]";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 180,
    editable: false,
  },
  {
    field: "role",
    headerName: "Role",
    width: 120,
    editable: false,
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

const ProfilesTable: FC<{
  initialProfiles: PropsI["profiles"];
  profilesCount: PropsI["profilesCount"];
}> = ({ initialProfiles, profilesCount }) => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={initialProfiles}
        columns={columns}
        pageSize={6}
        checkboxSelection
        disableSelectionOnClick
        onRowClick={(a, b) => {
          console.log({ a, b });
        }}
      />
    </div>
  );
};

export default ProfilesTable;
