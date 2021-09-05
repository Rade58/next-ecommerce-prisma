/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useState } from "react";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import {
  TextField,
  Paper,
  InputBase,
  Divider,
  IconButton,
  Modal,
  Fade,
  Backdrop,
} from "@material-ui/core";

import { Menu as MenuIcon, Search as SearchIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 20,
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
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const Search: FC = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="spring-modal-title">Spring modal</h2>
            <p id="spring-modal-description">react-spring animates me.</p>
          </div>
        </Fade>
      </Modal>
      <div
        css={css`
          position: relative;
          margin-left: auto;
        `}
      >
        <section
          className="search-box"
          css={css`
            & .se::after {
              content: "Search";
              display: inline;
              font-size: 16px;
              border: #413436 solid 1px;
              padding: 4px;
              border-radius: 4px;
            }

            @media screen and (max-width: 500px) {
              position: fixed;
              top: 62px;
              right: 10px;

              & .se {
                color: #57a5c9cc;
                background-color: #130e0eea;
              }

              & .se::after {
                content: "";
                display: inline;
                font-size: 16px;
                border: #413436 solid 0px;
                padding: 0px;
                border-radius: 0px;
              }
            }
          `}
        >
          <IconButton aria-label="search" className="se" onClick={handleOpen}>
            <SearchIcon />
          </IconButton>
          <Divider orientation="vertical" />
        </section>
      </div>
    </Fragment>
  );
};

export default Search;
