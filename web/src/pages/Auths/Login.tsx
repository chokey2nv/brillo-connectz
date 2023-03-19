import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { Button, FormLabel, Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import { routeNames } from "utils";
import classNames from "classnames";
import { IFormLogin } from "./types";
import { useUser } from "graphql.hooks/user";
import { appConfig } from "config/config";
import { IUser } from "graphql.queries/types";
import { useToken } from "graphql.hooks/token";
import { useAppDispatch } from "redux/hook";
import { displayNotice } from "redux/notice.core";

const useStyle = makeStyles(() => ({
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
}));
export default function LoginPage() {
  const classes = useStyle();
  const dispatch = useAppDispatch();
  const { login } = useUser();
  const { sendRecoveryLink } = useToken();
  const [tab, _setTab] = useState<"email" | "phone">("email");
  const setTab = (tab: "email" | "phone") => {
    _setTab(tab);
    if (tab === "email") setState({ phone: "" });
    else setState({ email: "" });
  };
  const [state, _setState] = useState<Partial<IFormLogin>>({
    email: "",
    phone: "",
    password: "",
  });
  const [page, setPage] = useState<"login" | "recovery">("login");
  const setState = (state: Partial<IFormLogin>) =>
    _setState((_state: Partial<IFormLogin>) => ({ ..._state, ...state }));
  const setFieldValue = (name: keyof IFormLogin, value: string) =>
    setState({ [name]: value });
  const [invalidFields, setInvalidFields] = useState<(keyof IFormLogin)[]>();
  const [recoveryEmail, setRecoveryEmail] = useState<string>();
  const [recMessage, setRecMessage] = useState<string>();
  const validateValues = useCallback(
    (values: IFormLogin) => {
      const fields = invalidFields || [];
      for (const name in values) {
        if (Object.prototype.hasOwnProperty.call(values, name)) {
          const value = values[name as keyof IFormLogin];
          const key = name as keyof IFormLogin;
          if (tab === "email" && name === "phone") continue;
          if (tab === "phone" && name === "email") continue;
          if (value === "") {
            !fields.includes(key) && fields?.push(key);
          } else if (fields?.includes(key)) {
            fields.splice(fields.indexOf(key), 1);
          }
        }
      }
      setInvalidFields([...fields]);
      return fields?.length === 0;
    },
    [JSON.stringify(invalidFields), tab]
  );
  const onLogin = useCallback(async () => {
    try {
      if (validateValues(state as IFormLogin)) {
        const { data, errors } = await login({
          variables: {
            email: String(state.email),
            phone: String(state.phone),
            password: String(state.password),
          },
        });
        if (errors && errors.length > 0) {
          dispatch(
            displayNotice({
              type: "error",
              message: errors[0].message,
            })
          );
        }
        const user = data?.user as IUser;
        localStorage.setItem(
          appConfig.localStorageTokenAlias,
          user.userToken?.token as string
        );
        window.location.href = routeNames.home;
      }
    } catch (e) {
      dispatch(
        displayNotice({
          message: (e as Error).message,
          type: "error",
        })
      );
    }
  }, [JSON.stringify(state)]);
  const sendLink = useCallback(async () => {
    try {
      const { data, errors } = await sendRecoveryLink({
        variables: {
          email: recoveryEmail as string,
        },
      });
      if (errors) {
        setRecMessage(errors[0].message);
        return;
      }
      setRecMessage("Recovery link has been sent to your email!");
    } catch (e) {
      setRecMessage((e as Error).message);
    }
  }, [recoveryEmail]);
  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <img
          src="/assets/b_logo.png"
          className={classes.img}
          alt="brillianconnectz"
        />
        <strong>
          {page === "recovery" ? "Recover Your Password" : "Login"}
        </strong>
      </div>
      {page === "login" ? (
        <div className={classes.formContainer}>
          <Tabs
            value={tab}
            indicatorColor="primary"
            aria-label="login-tabs"
            onChange={(_, newValue) => setTab(newValue)}
            variant="fullWidth"
          >
            <Tab value="email" label="Email" />
            <Tab value="phone" label="Phone" />
          </Tabs>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 /* minWidth: "20ch" */ },
            }}
            noValidate
            autoComplete="off"
            className={classes.box}
          >
            {tab === "email" && (
              <TextField
                className={classes.field}
                fullWidth
                id="email"
                name="email"
                label="E-mail"
                error={invalidFields?.includes("email")}
                onChange={({ target }) => setFieldValue("email", target.value)}
              />
            )}
            {tab === "phone" && (
              <TextField
                className={classes.field}
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                error={invalidFields?.includes("phone")}
                onChange={({ target }) => setFieldValue("phone", target.value)}
              />
            )}
            <TextField
              className={classes.field}
              fullWidth
              id="password"
              type="password"
              label="Password"
              error={invalidFields?.includes("password")}
              onChange={({ target }) => setFieldValue("password", target.value)}
            />
            <Button
              className={classNames(classes.field, classes.btn)}
              fullWidth
              onClick={onLogin}
              color="primary"
              variant="contained"
            >
              Login
            </Button>
            <div className={classNames(classes.field, classes.btnContainer)}>
              <Link
                to="#"
                className={classes.link}
                onClick={() => setPage("recovery")}
              >
                Forgot Password?
              </Link>
              <Link className={classes.link} to={routeNames.signup}>
                Sign up
              </Link>
            </div>
          </Box>
        </div>
      ) : (
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
            <FormLabel style={{ marginBottom: 10, color: "#698236" }}>
              {recMessage}
            </FormLabel>
            <TextField
              className={classes.field}
              fullWidth
              id="email"
              label="Recovery Email"
              // error={invalidFields?.includes("password")}
              onChange={({ target }) => setRecoveryEmail(target.value)}
            />
            <Button
              className={classNames(classes.field, classes.btn)}
              fullWidth
              onClick={sendLink}
              color="primary"
              variant="contained"
            >
              Recover Password
            </Button>
            <div className={classNames(classes.field, classes.btnContainer)}>
              <Link
                to="#"
                className={classes.link}
                onClick={() => setPage("login")}
              >
                Back to Login
              </Link>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
}
