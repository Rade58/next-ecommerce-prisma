/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, Fragment, memo } from "react";
import type { FC } from "react";

import type { Role } from "@prisma/client";

import { useSession } from "next-auth/client";

import {
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  CircularProgress,
} from "@material-ui/core";

// import type { PropsI as AdminPropsI } from "../../pages/admin/[id]";

import type { PropsI } from "../../pages/admin/[id]";

import UsersTable from "./UsersTable";
import ProductsTable from "./ProductsTable";
import OrdersTable from "./OrdersTable";

interface TabPanelPropsI {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel: FC<TabPanelPropsI> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MemoUsersTable: FC<{
  initialProfiles: PropsI["profiles"];
  profilesCount: PropsI["profilesCount"];
}> = memo((props) => <UsersTable {...props} />);

const MemoProductsTable: FC<{
  initialProducts: PropsI["products"];
  productsCount: PropsI["productsCount"];
}> = memo((props) => <ProductsTable {...props} />);

const TabsView: FC<PropsI> = (props) => {
  const [session, loading] = useSession();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  if (!session) {
    return null;
  }

  return loading ? (
    <div
      css={css`
        margin-top: 200px;
      `}
    >
      <CircularProgress size={38} />
    </div>
  ) : (
    <Fragment>
      <h1
        css={css`
          align-self: flex-start;
          font-size: 1.36em;
          font-weight: 400;

          margin-bottom: 38px;
          margin-top: 48px;
          margin-left: 8px;

          & > span {
            color: #5d4e9b;
          }
        `}
      >
        👩‍💻 admin: {session?.user?.name || session?.user?.email} (
        <span>{session?.user?.name && session?.user?.email})</span>
      </h1>
      <div
        css={css`
          width: fit-content;
        `}
      >
        <Paper square className="tabs-region">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Products" {...a11yProps(1)} />
            <Tab label="Orders" {...a11yProps(2)} />
            {/* <Tab label="Orders" {...a11yProps(2)} /> */}
          </Tabs>
        </Paper>
      </div>
      <div
        css={css`
          margin-top: 8px;
          width: 100%;
        `}
      >
        <Paper variant="outlined">
          <TabPanel value={value} index={0}>
            {/* Users: */}
            {/* THIS MEMOIZATION WAS IN VAIN
            (IT WORKS BUT NATURE OF MY COMPONENTS IS DIFFERENT
            MEMOIZATION CAN'T HELP ) */}
            <MemoUsersTable
              initialProfiles={props.profiles}
              profilesCount={props.profilesCount}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {/* Products: */}
            <MemoProductsTable
              initialProducts={props.products}
              productsCount={props.productsCount}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <OrdersTable />
          </TabPanel>
        </Paper>
      </div>
    </Fragment>
  );
};

export default TabsView;
