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
    field: "orderId",
    headerName: "Order Id",
    width: 280,
    editable: false,
  },
  {
    field: "buyer",
    headerName: "Buyer",
    width: 280,
    editable: false,
  },

  {
    field: "time",
    headerName: "Created At",
    width: 190,
    editable: false,
    valueGetter: (params) => {
      if (!params.getValue(params.id, "createdAt")) {
        return "undefinden";
      }

      return new Date(
        params.getValue(params.id, "createdAt") as string
      ).toDateString();
    },
  },
  {
    field: "deliver_time",
    headerName: "Delivered At",
    width: 190,
    editable: false,
    valueGetter: (params) => {
      if (!params.getValue(params.id, "deliveredAt")) {
        return "not delivered yet";
      }

      return new Date(
        params.getValue(params.id, "deliveredAt") as string
      ).toDateString();
    },
  },
  {
    field: "payed_at",
    headerName: "Payed At",
    width: 190,
    editable: false,
    valueGetter: (params) => {
      if (!params.getValue(params.id, "payedAt")) {
        return "not payed yet";
      }

      return new Date(
        params.getValue(params.id, "payedAt") as string
      ).toDateString();
    },
  },
  {
    field: "isDelivered",
    headerName: "Is Delivered",
    width: 190,
    editable: false,
  },
];

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
}> = ({ orders: ords }) => {
  const classes = useStyles();

  const [orders, setOrders] = useState(ords);

  console.log({ orders });

  const [session, loading] = useSession();

  const [ordersCount, setOrdersCount] = useState<number>(orders.length);

  const [deliveredStatus, setDeliveredSttus] = useState<"idle" | true | false>(
    "idle"
  );

  const [markDeliveredRequestStatus, setMarkDeliveredRequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const handleModalOpen = useCallback(() => {
    setModalOpened(true);
  }, [setModalOpened]);

  const handleModalClose = useCallback(() => {
    setModalOpened(false);
  }, [setModalOpened]);

  const [selectedOrder, setSelectedOrder] = useState<{
    noNum: number;
    orderId: string;
    isDeliveredCurrent: boolean;
    isDeliveredPrevious: boolean;
  }>({
    noNum: 0,
    orderId: "",
    isDeliveredCurrent: false,
    isDeliveredPrevious: false,
  });

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
          model: "order",
          orderId: selectedOrder.orderId,
          markDelivered: selectedOrder.isDeliveredCurrent,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log({ data });

      setOrders(data);

      setMarkDeliveredRequestStatus("idle");
      handleModalClose();

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
  }, [
    setMarkDeliveredRequestStatus,
    session,
    loading,
    selectedOrder,
    setOrders,
    handleModalClose,
  ]);

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
      <h2>Click on order row to mark order delivered.</h2>
      <div
        style={{ height: 640, width: "100%", marginTop: "20px" }}
        css={css`
          & .my-data-grid.my-data-grid input[type="checkbox"] {
            visibility: hidden !important;
          }

          & .my-data-grid.my-data-grid input svg {
            visibility: hidden !important;
          }
          & > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) svg {
            visibility: hidden !important;
          }
          &
            > div:nth-of-type(1)
            > div:nth-of-type(2)
            > div:nth-of-type(1)
            input {
            visibility: hidden !important;
          }
          &
            > div:nth-of-type(1)
            > div:nth-of-type(2)
            > div:nth-of-type(1)
            svg:hover {
            visibility: hidden !important;
          }
          &
            > div:nth-of-type(1)
            > div:nth-of-type(2)
            > div:nth-of-type(1)
            input:hover {
            visibility: hidden !important;
          }

          & * {
            cursor: default !important;
          }

          & div[data-id] > div:nth-of-type(1) {
            visibility: hidden;
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

              const noNum = (a.id as unknown as number) - 1;

              const isDeliveredCurrent = a.getValue(a.id, "isDelivered")
                ? true
                : false;
              // const email = a.getValue(a.id, "deliveredAt");
              const orderId = orders[noNum].orderId;

              console.log({ isDeliveredCurrent, orderId });

              setSelectedOrder({
                orderId,
                isDeliveredCurrent,
                isDeliveredPrevious: isDeliveredCurrent,
                noNum,
              });

              handleModalOpen();
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
      <div className="modal-stuff">
        <Modal
          open={modalOpened}
          onClose={handleModalClose}
          aria-labelledby="change-delivered-modal"
          aria-describedby="change delivered status modal"
        >
          <div
            css={css`
              /* background-color: crimson; */
              /* position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0; */
              width: fit-content;
              margin: 20vh auto;
              display: flex;
              justify-content: center;
              align-items: center;

              /* border: black solid 2px; */

              & > * {
                width: 60vw;

                @media screen and (max-width: 800px) {
                  width: 96vw;
                  /* background-color: crimson; */
                }

                padding: 28px;

                display: flex;
                flex-direction: column;

                & div.select-el {
                  /* border: crimson solid 2px; */

                  width: fit-content;
                  align-self: center;

                  margin-bottom: 26px;

                  display: flex;

                  & h4 {
                    margin-right: 12px;
                  }
                }

                & h3 {
                  text-align: center;
                }
              }
            `}
          >
            <Card>
              <div
                css={css`
                  text-align: center;
                `}
              >
                <Button onClick={handleModalClose}>
                  <CloseTwoTone />
                </Button>
              </div>
              <h2 id="modal-order">Order: {selectedOrder.orderId}</h2>
              <h3>
                Marked {selectedOrder.isDeliveredCurrent ? "" : "NOT"} DELIVERED
              </h3>
              <div className="select-el">
                <h4>Mark it delivered or not:</h4>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-native-simple">
                    Delivered Status
                  </InputLabel>
                  <Select
                    native
                    value={selectedOrder.isDeliveredCurrent}
                    onChange={(e) => {
                      //

                      const val: boolean =
                        (e.target.value as "yes" | "not") === "not"
                          ? false
                          : true;

                      setSelectedOrder((prev) => {
                        return { ...prev, isDeliveredCurrent: val };
                      });
                    }}
                    inputProps={{
                      name: "role",
                      id: "age-native-simple",
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value="yes">Delivered</option>
                    <option value="not">NOT Delivered</option>
                  </Select>
                </FormControl>
              </div>
              <div
                css={css`
                  margin-left: auto;

                  margin-top: 30px;
                `}
              >
                <Button
                  disabled={
                    markDeliveredRequestStatus === "pending" ||
                    selectedOrder.isDeliveredCurrent ===
                      selectedOrder.isDeliveredPrevious
                  }
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleMarkDeliveredRequest();
                  }}
                >
                  Save
                  {markDeliveredRequestStatus === "pending" && (
                    <span>
                      &nbsp; <CircularProgress size={8} />
                    </span>
                  )}
                </Button>
              </div>
              {markDeliveredRequestStatus === "rejected" && (
                <MuiAlert severity="error">
                  Something wet wrong, couldn{"'"}t change delivery status
                </MuiAlert>
              )}
            </Card>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default OrdersTable;
