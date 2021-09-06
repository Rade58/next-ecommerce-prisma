/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useState, useEffect, useCallback } from "react";

import { useRouter } from "next/router";

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

import Select from "react-select";

import axios from "axios";

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

  const { push: rPush } = useRouter();

  const [slugs, setSlugs] = useState<{ value: string; label: string }[]>([]);

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

  const [searchReqStatus, setSearchReqStatus] = useState<
    "idle" | "pending" | "failed"
  >("idle");

  const sendSearchReq = useCallback(
    async (text: string) => {
      try {
        setSearchReqStatus("pending");

        const { data } = await axios.get(`/api/products/search/${text}`);

        setSlugs(data);

        setSearchReqStatus("idle");
      } catch (error) {
        console.error(error);

        setSearchReqStatus("failed");

        setTimeout(() => {
          setSearchReqStatus("idle");
        }, 3000);
      }
    },
    [setSearchReqStatus, setSlugs]
  );

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

                & > div {
                  width: 220px;
                }
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

              <Select
                isLoading={searchReqStatus === "pending"}
                label="Single select"
                options={slugs}
                classNamePrefix="Products"
                autoFocus
                isSearchable
                placeholder="Search Products..."
                isClearable
                onInputChange={(a) => {
                  console.log(JSON.stringify({ a }, null, 2));

                  if (searchReqStatus === "idle") {
                    sendSearchReq(a as string);
                  }
                }}
                onChange={(a) => {
                  if (!a) {
                    return;
                  }

                  if (!a.value) return;
                  console.log({ a });

                  handleClose();

                  rPush(`/products/${a?.value}`);
                }}
              />
            </form>
          </div>
        </Fade>
      </Modal>
      {/* {slugs.length > 0 && ( */}
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
      {/* )} */}
    </Fragment>
  );
};

export default Search;
