/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import {
  TextField,
  Paper,
  InputBase,
  Divider,
  IconButton,
} from "@material-ui/core";

import { Menu as MenuIcon, Search as SearchIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

const Search: FC = () => {
  const classes = useStyles();
  return (
    <section className="search-box">
      {/* <TextField /> */}
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search Products"
          inputProps={{ "aria-label": "search google maps" }}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
      </Paper>
    </section>
  );
};

export default Search;
