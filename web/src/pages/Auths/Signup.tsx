import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { routeNames } from "utils";
import classNames from "classnames";
import { IFormSignUp } from "./types";
import { useCallback } from "react";

const useStyle = makeStyles(() => ({
  root: {
    background: "url('/assets/b_bg.svg') no-repeat center center / cover",
    paddingTop: 50,
    height: "100%",
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
    borderColor: "white",
  },
  input: {},
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
  const [state, _setState] = useState<Partial<IFormSignUp>>({
    interests: [],
    email: "",
    phone: "",
    password: "",
  });
  const setState = (state: Partial<IFormSignUp>) =>
    _setState((_state: Partial<IFormSignUp>) => ({ ..._state, ...state }));
  const setFieldValue = (name: keyof IFormSignUp, value: string) =>
    setState({ [name]: value });
  const [invalidFields, setInvalidFields] = useState<(keyof IFormSignUp)[]>();
  const validateValues = useCallback(
    (values: IFormSignUp) => {
      const fields = invalidFields || [];
      for (const name in values) {
        if (Object.prototype.hasOwnProperty.call(values, name)) {
          const value = values[name as keyof IFormSignUp];
          const key = name as keyof IFormSignUp;
          if (typeof value === "string") {
            if (value === "") {
              !fields.includes(key) && fields?.push(key);
            } else if (fields?.includes(key)) {
              fields.splice(fields.indexOf(key), 1);
            }
          } else if (Array.isArray(value)) {
            if (value?.length === 0) {
              !fields.includes(key) && fields?.push(key);
            } else {
              fields?.splice(fields?.indexOf(key), 1);
            }
          }
        }
      }
      setInvalidFields([...fields]);
      return fields?.length === 0;
    },
    [JSON.stringify(invalidFields)]
  );
  const signup = useCallback(() => {
    if (validateValues(state as IFormSignUp)) {
    }
  }, [JSON.stringify(state)]);
  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <img
          src="/assets/b_logo.png"
          className={classes.img}
          alt="brilliantConnectz"
        />
        <strong>Sign Up</strong>
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
            error={invalidFields?.includes("email")}
            fullWidth
            id="email"
            name="email"
            label="E-mail"
            onChange={(e) => {
              setFieldValue("email", e.target.value);
            }}
          />
          <TextField
            className={classes.field}
            error={invalidFields?.includes("phone")}
            fullWidth
            id="phone"
            name="phone"
            label="Phone Number"
            onChange={(e) => {
              setFieldValue("phone", e.target.value);
            }}
          />
          <TextField
            className={classes.field}
            error={invalidFields?.includes("password")}
            fullWidth
            id="password"
            type="password"
            label="Password"
            onChange={(e) => {
              setFieldValue("password", e.target.value);
            }}
          />
          <FormControl
            fullWidth
            className={classes.field}
            error={invalidFields?.includes("interests")}
          >
            <FormLabel>Select your interests</FormLabel>
            <FormGroup>
              {hobbies.map((hobby, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={state?.interests?.includes(hobby)}
                        value={hobby}
                        onChange={({ target }) => {
                          const interests = state.interests || [];
                          if (target.checked) {
                            interests?.push(hobby);
                          } else interests?.splice(interests.indexOf(hobby), 1);
                          setState({ interests });
                        }}
                      />
                    }
                    label={hobby}
                    value={hobby}
                    onChange={(e) => {
                      console.log(e.target);
                    }}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
          <Button
            className={classNames(classes.field, classes.btn)}
            fullWidth
            color="primary"
            variant="contained"
            onClick={signup}
          >
            Sign Up
          </Button>
          <div className={classNames(classes.field, classes.btnContainer)}>
            <Link className={classes.link} to={routeNames.login}>
              Login
            </Link>
          </div>
        </Box>
      </div>
    </div>
  );
}

const hobbies: string[] = [
  "Football",
  "Basketball",
  "Ice Hockey",
  "Motorsports",
  "Bandy",
  "Rugby",
  "Skiing",
  "Shooting",
];
