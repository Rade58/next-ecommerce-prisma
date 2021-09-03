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

import { DataGrid, GridColDef } from "@material-ui/data-grid";
import type {
  GridSelectionModel,
  GridEditRowsModel,
} from "@material-ui/data-grid";

import {
  Card,
  Button,
  Paper,
  CircularProgress,
  Modal,
  FormControl,
  InputLabel,
  Select,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Snackbar,
  IconButton,
} from "@material-ui/core";

import {
  DeleteSweep as DelIcon,
  ExpandMore,
  CloseTwoTone,
} from "@material-ui/icons";

import type { AlertProps } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";

import { Role } from "@prisma/client";
import type { User, Profile } from "@prisma/client";

import type { PropsI } from "../../pages/admin/[id]";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, hide: true },
  {
    field: "name",
    headerName: "Name",
    width: 190,
    editable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 188,
    editable: false,
  },
  {
    field: "role",
    headerName: "Role",
    width: 190,
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

/* export type ProfilesI = {
  userId: string;
  id: number;
  email: string | null;
  name: string | null;
  profileId: string;
  addrss: string | null;
  city: string | null;
  country: string | null;
  paymentMethod: string | null;
  postalCode: string | null;
  role: Role;
  taxPrice: number | null;
  user: "";
}[]; */

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const OrdersTable: FC<{
  orders: PropsI["orders"];
}> = ({ orders }) => {
  const classes = useStyles();

  const [session, loading] = useSession();

  const [ordersCount, setOrdersCount] = useState<number>(orders.length);

  const [markDeliveredRequestStatus, setMarkDeliveredRequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  const handleMarkDeliveredRequest = useCallback(async () => {
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
      setMarkDeliveredRequestStatus("pending");
      const { data } = await axios.put(
        `/api/admin/${(session as any).profile.id}`,
        {
          data: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log({ data });

      setMarkDeliveredRequestStatus("idle");

      // throw new Error("hello world");
      /* setTimeout(() => {
        handleModalClose();
        setMarkDeliveredRequestStatus("idle");
      }, 3000); */
    } catch (err) {
      console.error(err);

      setMarkDeliveredRequestStatus("rejected");

      setTimeout(() => {
        setMarkDeliveredRequestStatus("idle");
      }, 3000);
    }
  }, [setMarkDeliveredRequestStatus, session, loading]);

  return (
    <Fragment>
      <Paper elevation={2}>
        <section
          style={{
            padding: "20px",
          }}
        >
          <div>
            total orders manging:{" "}
            <span style={{ fontSize: "1.4em", fontWeight: 400 }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {ordersCount}{" "}
            </span>
          </div>

          <div>
            loaded orders count :{" "}
            <span style={{ fontSize: "1.4em", fontWeight: 400 }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {orders.length}
            </span>
          </div>
        </section>
      </Paper>
      <h2>Click on order row to make order delivered.</h2>
      <div
        style={{ height: 640, width: "100%", marginTop: "20px" }}
        css={css`
          & .my-data-grid.my-data-grid input[type="checkbox"] {
            visibility: hidden !important;
          }

          & .my-data-grid.my-data-grid input svg {
            visibility: hidden !important;
          }

          & * {
            cursor: default !important;
          }

          & div[data-id] > div:nth-of-type(1) {
            display: none;
          }
        `}
      >
        {markDeliveredRequestStatus !== "pending" ? (
          <DataGrid
            className="my-data-grid"
            rows={orders}
            columns={columns}
            pageSize={9}
            checkboxSelection
            disableSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableColumnFilter
            onRowClick={(a, b) => {
              console.log({ a, b });

              console.log(typeof a.id);

              const id = (a.id as unknown as number) - 1;

              const isDelivered = a.getValue(a.id, "isDelivered");
              // const email = a.getValue(a.id, "deliveredAt");
              const orderId = orders[id].id;

              console.log({ isDelivered, orderId });
            }}
          />
        ) : (
          <div
            css={css`
              text-align: center;

              margin-top: 25px;
              margin-left: auto;
              margin-right: auto;
              width: fit-content;
            `}
          >
            <CircularProgress size={18} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default OrdersTable;
