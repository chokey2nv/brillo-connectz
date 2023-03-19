import { Box, Button, FormLabel, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { useUser } from "graphql.hooks/user";
import { IUser } from "graphql.queries/types";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "redux/hook";
import { displayNotice } from "redux/notice.core";
import { selectUser, setUser } from "redux/user.core";
import { AppTheme } from "utils";

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    padding: 10,
    paddingTop: 20,
  },
  header: {
    color: theme.colors.colorText,
    fontWeight: "bold",
    fontSize: theme.sizes.large,
    marginLeft: 50,
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
    // alignItems: "center",
    width: "80%",
    padding: 20,
  },
  field: {
    margin: "10px !important",
    borderColor: "white",
  },
  btn: {
    marginTop: 20,
  },
  label: {
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  btnOutline: {
    textTransform: `capitalize !important` as any,
    color: `${theme.colors.colorPrimary} !important`,
    borderColor: `${theme.colors.colorPrimary} !important`,
  },
  formBtn: {
    marginTop: "10px !important",
    marginRight: "10px !important",
  },
}));
const SettingsPage: React.FC = () => {
  const classes = useStyles();
  const { updateUser, getProfile } = useUser();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const [state, _setState] = useState<Partial<IUser>>({
    email: "",
    phone: "",
    password: "",
    name: "",
  });
  const setState = (state: Partial<IUser>) =>
    _setState((_state: Partial<IUser>) => ({ ..._state, ...state }));
  const setFieldValue = (name: keyof IUser, value: string) =>
    setState({ [name]: value });

  const saveSetting = useCallback(async () => {
    const { name, email, phone, password } = state || {};
    const changedValues: Partial<IUser> = {};
    if (password) changedValues.password = password;
    if (name !== user.name) changedValues.name = name;
    if (phone !== user.phone) changedValues.phone = phone;
    if (email !== user.email) changedValues.email = email;
    if (Object.keys(changedValues).length === 0) {
      return dispatch(
        displayNotice({
          type: "error",
          message: "No changes made",
        })
      );
    }
    try {
      const { data, errors } = await updateUser({
        variables: {
          id: user.id as number,
          user: changedValues,
        },
      });
      if (errors) {
        return dispatch(
          displayNotice({
            type: "error",
            message: errors[0].message,
          })
        );
      }
      const { data: pData, errors: pErrors } = await getProfile({});
      if (pErrors) {
        return dispatch(
          displayNotice({
            type: "error",
            message: pErrors[0].message,
          })
        );
      }
      dispatch(setUser(pData?.user));
      return dispatch(
        displayNotice({
          type: "success",
          message: "Profile Updated",
        })
      );
    } catch (e) {
      dispatch(
        displayNotice({
          type: "error",
          message: (e as Error).message,
        })
      );
    }
  }, [JSON.stringify(state), JSON.stringify(user)]);
  useEffect(() => {
    if (user) {
      setState({
        email: user.email,
        phone: user.phone,
        name: user.name,
      });
    }
  }, [JSON.stringify(user)]);
  return (
    <div className={classes.root}>
      <div className={classes.header}>Settings</div>
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
          <FormLabel className={classes.label}>Name</FormLabel>
          <TextField
            className={classes.field}
            value={state.name}
            fullWidth
            id="name"
            name="name"
            // label="Full Name"
            onChange={(e) => {
              setFieldValue("name", e.target.value);
            }}
          />
          <FormLabel className={classes.label}>Email</FormLabel>
          <TextField
            className={classes.field}
            value={state.email}
            fullWidth
            id="email"
            name="email"
            // label="E-mail"
            onChange={(e) => {
              setFieldValue("email", e.target.value);
            }}
          />
          <FormLabel className={classes.label}>Phone</FormLabel>
          <TextField
            className={classes.field}
            value={state.phone}
            fullWidth
            id="phone"
            name="phone"
            // label="Phone Number"
            onChange={(e) => {
              setFieldValue("phone", e.target.value);
            }}
          />
          <FormLabel className={classes.label}>Password</FormLabel>
          <TextField
            className={classes.field}
            value={state.password}
            fullWidth
            id="password"
            type="password"
            // label="Password"
            onChange={(e) => {
              setFieldValue("password", e.target.value);
            }}
          />
          <div>
            <Button
              className={classNames(classes.field, classes.btn)}
              classes={{
                outlined: classes.btnOutline,
              }}
              variant="outlined"
              size="small"
              onClick={saveSetting}
            >
              Save Settings
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SettingsPage;
