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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Snackbar,
  IconButton,
} from "@material-ui/core";

import { DeleteSweep as DelIcon, ExpandMore } from "@material-ui/icons";

import type { AlertProps } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";

import { Role } from "@prisma/client";
import type { User, Profile } from "@prisma/client";

import type { PropsI } from "../../pages/admin/[id]";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Name",
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

const ProfilesTable: FC<{
  initialProfiles: PropsI["profiles"];
  profilesCount: PropsI["profilesCount"];
}> = ({ initialProfiles, profilesCount: initialProfilesCount }) => {
  const [session, loading] = useSession();

  const [profilesCount, setProfilesCount] =
    useState<number>(initialProfilesCount);

  const [fetchedProfilesCount, setFetchedProfilesCount] = useState<number>(
    initialProfiles.length
  );
  const [profiles, setProfiles] =
    useState<typeof initialProfiles>(initialProfiles);

  const [cursor, setCursor] = useState<string>(
    profiles[profiles.length - 1].profileId
  );

  const [load100RequestStatus, setLoad100RequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  useEffect(() => {
    setCursor(profiles[profiles.length - 1].profileId);
  }, [profiles, setCursor]);

  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const handleModalOpen = useCallback(() => {
    setModalOpened(true);
  }, [setModalOpened]);

  const handleModalClose = useCallback(() => {
    setModalOpened(false);
  }, [setModalOpened]);

  const [selectedUser, setSelectedUser] = useState<{
    noNum: number;
    email: string;
    profileId: string;
    currentRole: Role;
  }>({
    email: "",
    currentRole: "USER",
    profileId: "",
    noNum: 0,
  });

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
          model: "profile",
        }
      );

      /* .map((prof, i) => {
        const data = {
          ...prof,
          profileId: prof.id,
          ...prof.user,
          userId: prof.user.id,
          id: i + 1,
        };

        // @ts-ignore
        data.user = "";

        return data;
      }); */

      // console.log({ data });

      const newProfiles = (data as any).map((prof: any, i: number) => {
        const data = {
          ...prof,
          profileId: prof.id,
          ...prof.user,
          userId: prof.user.id,
          id: profiles.length - 1 + i + 1,
        };

        // @ts-ignore
        data.user = "";

        return data;
      });

      setProfiles((prev) => {
        return [...prev, ...newProfiles];
      });

      setLoad100RequestStatus("idle");
    } catch (err) {
      console.error(err);
      setLoad100RequestStatus("rejected");
      setTimeout(() => {
        setLoad100RequestStatus("idle");
      }, 3000);
    }
  }, [cursor, loading, session, setProfiles, profiles.length]);

  return (
    <Fragment>
      <Paper elevation={2}>
        <section
          style={{
            padding: "20px",
          }}
        >
          <div>
            total users manging:{" "}
            <span style={{ fontSize: "1.4em", fontWeight: 400 }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {profilesCount}{" "}
            </span>
          </div>

          <div>
            loaded users count :{" "}
            <span style={{ fontSize: "1.4em", fontWeight: 400 }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {profiles.length}
            </span>
          </div>
        </section>
      </Paper>
      <Card elevation={0}>
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
            : "Load 100 More Profiles"}{" "}
          &nbsp;&nbsp;{" "}
          {load100RequestStatus === "pending" && <CircularProgress size={8} />}
        </Button>
      </Card>

      <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
        {load100RequestStatus !== "pending" ? (
          <DataGrid
            rows={profiles}
            columns={columns}
            pageSize={10}
            checkboxSelection
            disableSelectionOnClick
            onRowClick={(a, b) => {
              console.log({ a, b });

              console.log(a.getValue(a.id, "role"));

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
          aria-labelledby="change-role-modal"
          aria-describedby="change user role modal"
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
                  background-color: crimson;
                }
              }
            `}
          >
            <Card>
              <Button onClick={handleModalClose}>x</Button>
              <h2 id="modal-email">User: {selectedUser.email}</h2>
              <h3>Current role: {selectedUser.currentRole}</h3>
              <h4>ChangeRole:</h4>
              <FormControl>
                <InputLabel htmlFor="age-native-simple">Age</InputLabel>
                <Select
                  native
                  value={selectedUser.currentRole}
                  onChange={(e) => {
                    //
                    setSelectedUser((prev) => {
                      return { ...prev, currentRole: e.target.value as Role };
                    });
                  }}
                  inputProps={{
                    name: "age",
                    id: "age-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={Role.USER}>{Role.USER}</option>
                  <option value={Role.BANNED}>{Role.BANNED}</option>
                </Select>
              </FormControl>
              <Button
                onClick={() => {
                  setTimeout(() => {
                    handleModalClose();
                  }, 3000);
                }}
              >
                Save
              </Button>
            </Card>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default ProfilesTable;
