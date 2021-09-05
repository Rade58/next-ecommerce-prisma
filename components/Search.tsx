/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useState, useEffect } from "react";

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
  Button,
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
      // marginLeft: theme.spacing(1),
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
      backgroundColor: " #938dc9",
      // border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const Search: FC = () => {
  const classes = useStyles();

  const [searchValue, setSearchValue] = useState<string>("");

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (window) {
      window.onkeydown = (e) => {
        if (e.ctrlKey) {
          if (e.key === "k" || e.key === "K") {
            e.preventDefault();
            setOpen(true);
          }
        }
      };
    }

    return () => {
      window.onkeydown = null;
    };
  }, [setOpen]);

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
          timeout: 50,
        }}
      >
        <Fade in={open}>
          <div
            className={classes.paper}
            css={css`
              & form {
                display: flex;
                align-items: center;
              }
              /* justify-content: space-between; */
              & svg {
                margin-right: 12px;
              }
            `}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("submitting");
              }}
            >
              <Button type="submit">
                <SearchIcon />
              </Button>
              <TextField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                id="outlined-basic"
                label="Search Products"
                variant="outlined"
                autoFocus
              />
            </form>
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
          onClick={handleOpen}
          aria-label="search button"
          role="button"
          className="search-box"
          css={css`
            cursor: pointer;

            border: #413436 solid 1px;

            padding-right: 4px;
            border-radius: 4px;

            & .se {
              margin-top: 2px;
            }

            & .se::after {
              content: "Search";
              display: inline;
              font-size: 16px;
              /* border: #413436 solid 1px; */
              /* padding: 4px; */
              border-radius: 4px;
            }

            @media screen and (max-width: 500px) {
              border-width: 0;

              & kbd,
              & > span {
                display: none;
              }

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

            & kbd {
              box-shadow: 1px 1px 1px 1px white;
              padding: 2px;
              margin: 0;
              font-size: 12px;
              user-select: none;
            }

            & button {
              padding: 4px;
            }
          `}
        >
          <IconButton aria-label="search" className="se">
            <SearchIcon />
          </IconButton>
          <kbd>Ctrl</kbd> <span>+</span> <kbd>K</kbd>
          <Divider orientation="vertical" />
        </section>
      </div>
    </Fragment>
  );
};

export default Search;
