import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { Button, FormLabel, Tab, Tabs } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppTheme, routeNames } from "utils";
import classNames from "classnames";
import { IFormLogin } from "./types";
import { useUser } from "graphql.hooks/user";
import { appConfig } from "config/config";
import { IUser } from "graphql.queries/types";
import { useToken } from "graphql.hooks/token";
import { useDispatch } from "react-redux";
import { displayNotice } from "redux/notice.core";

const useStyle = makeStyles((theme: AppTheme) => ({
  root: {
    paddingTop: 50,
    height: "100vh",
    background: "url('/assets/b_bg.svg') no-repeat center center / cover",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  loading: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 24,
    justifyContent: "center",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 50,
  },
  img: {
    width: 200,
  },
  formContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    maxWidth: 450,
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
    padding: 20,
  },
  field: {
    margin: "10px !important",
  },
  btn: {
    marginTop: 20,
  },
  LinkContainer: {},
  btnContainer: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    textDecoration: "none",
  },
  btnOutline: {
    textTransform: "capitalize !important" as any,
    color: `${theme.colors.colorPrimary} !important`,
    borderColor: `${theme.colors.colorPrimary} !important`,
  },
  formBtn: {
    marginTop: "10px !important",
    marginRight: "10px !important",
  },
}));
interface IFormNewPassword {
  password: string;
  cPassword: string;
  email: string;
}
export default function LoginPage() {
  const classes = useStyle();
  const dispatch = useDispatch();
  const { resetPassword } = useUser();
  const { verifyRecoveryToken } = useToken();
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, _setState] = useState<Partial<IFormNewPassword>>({
    cPassword: "",
    password: "",
    email: "",
  });
  const setState = (state: Partial<IFormNewPassword>) =>
    _setState((_state: Partial<IFormNewPassword>) => ({ ..._state, ...state }));
  const setFieldValue = (name: keyof IFormNewPassword, value: string) =>
    setState({ [name]: value });

  const [page, setPage] = useState<"verify" | "recover">("verify");
  const [errMessage, setErrMessage] = useState<string>();
  console.log(state);
  const onResetPassword = useCallback(async () => {
    if (!state.email) {
      return dispatch(
        displayNotice({
          type: "error",
          message: "Missing email",
        })
      );
    } else if (state.cPassword !== state.password) {
      return dispatch(
        displayNotice({
          type: "error",
          message: "Missing password",
        })
      );
    }
    try {
      const { errors } = await resetPassword({
        variables: {
          password: String(state.password),
          email: String(state.email),
        },
      });
      if (errors) {
        return dispatch(
          displayNotice({
            type: "error",
            message: errors[0].message,
          })
        );
        return;
      }
      setErrMessage("Password reset successful!");
      setPage("verify");
      return dispatch(
        displayNotice({
          type: "success",
          message: "Password Reset Successful",
        })
      );
      // navigate(routeNames.login, { replace: true });
    } catch (e) {
      return dispatch(
        displayNotice({
          type: "error",
          message: (e as Error).message,
        })
      );
    }
  }, [JSON.stringify(state)]);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const { errors } = await verifyRecoveryToken({
            variables: {
              token: id.toString(),
            },
          });
          if (errors) {
            setErrMessage(errors[0].message);
            return;
          }
          setPage("recover");
        } catch (e) {
          setErrMessage((e as Error).message);
        }
      }
    })();
  }, [id]);
  return page === "verify" ? (
    <div className={classes.loading}>
      <img src="/assets/b_logo.png" style={{ height: 100 }} />
      <span>{errMessage || "Verifying link..."}</span>
      {errMessage && (
        <span>
          <Button
            className={classes.formBtn}
            classes={{
              outlined: classes.btnOutline,
            }}
            variant="outlined"
            size="small"
            onClick={() => navigate(routeNames.login)}
          >
            Back to login
          </Button>
        </span>
      )}
    </div>
  ) : (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <img
          src="/assets/b_logo.png"
          className={classes.img}
          alt="brillianconnectz"
        />
        <strong>Reset Password</strong>
      </div>

      <div className={classes.formContainer}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 /* minWidth: "20ch" */ },
          }}
          noValidate
          autoComplete="off"
          className={classes.box}
        >
          <TextField
            className={classes.field}
            fullWidth
            id="email"
            label="Email"
            type="email"
            value={state.email}
            // error={invalidFields?.includes("password")}
            onChange={({ target }) => setFieldValue("email", target.value)}
          />
          <TextField
            className={classes.field}
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={state.password}
            // error={invalidFields?.includes("password")}
            onChange={({ target }) => setFieldValue("password", target.value)}
          />
          <TextField
            className={classes.field}
            fullWidth
            id="cPassword"
            label="Confirm Password"
            type="password"
            value={state.cPassword}
            // error={invalidFields?.includes("password")}
            onChange={({ target }) => setFieldValue("cPassword", target.value)}
          />
          <Button
            className={classNames(classes.field, classes.btn)}
            fullWidth
            // onClick={sendLink}
            color="primary"
            variant="contained"
            onClick={onResetPassword}
          >
            Recover Password
          </Button>
          <div className={classNames(classes.field, classes.btnContainer)}>
            <Link
              to="#"
              className={classes.link}
              onClick={() => navigate(routeNames.login)}
            >
              Back to Login
            </Link>
          </div>
        </Box>
      </div>
    </div>
  );
}
