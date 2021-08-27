/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, Fragment } from "react";
import type { FC } from "react";

import { useSession } from "next-auth/client";

import { makeStyles, Theme } from "@material-ui/core/styles";

import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";

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

interface TabViewsCompPropsI {
  placeholder?: any;
}

const TabsView: FC<TabViewsCompPropsI> = () => {
  const [session, loading] = useSession();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <h1
        css={css`
          align-self: flex-start;
          font-size: 1.36em;
          font-weight: 400;

          margin-bottom: 28px;
        `}
      >
        👩‍💻 admin: {session?.user?.name || session?.user?.email}
      </h1>
      <div
        css={css`
          width: fit-content;
        `}
      >
        <Paper square>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Products" {...a11yProps(1)} />
            <Tab label="Orders" {...a11yProps(2)} />
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
            Users
          </TabPanel>
          <TabPanel value={value} index={1}>
            Products
          </TabPanel>
          <TabPanel value={value} index={2}>
            Orders
          </TabPanel>
        </Paper>
      </div>
    </Fragment>
  );
};

export default TabsView;
