import { DoneAll, DoneAllRounded } from "@mui/icons-material";
import { Box, Button, FormLabel, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { useToken } from "graphql.hooks/token";
import { useUser } from "graphql.hooks/user";
import { IUser } from "graphql.queries/types";
import React, { CSSProperties, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "redux/hook";
import { displayNotice } from "redux/notice.core";
import { selectUser, setUser } from "redux/user.core";
import { AppTheme } from "utils";

const capitalize = "capitalize !important";
const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    padding: 10,
    paddingTop: 20,
  },
  header: {
    color: theme.colors.colorText,
    fontWeight: "bold",
    fontSize: theme.sizes.large,
  },
  body: {
    marginTop: 50,
  },
  notify: {
    fontSize: theme.sizes.medium,
    marginBottom: 20,
  },
  btnContainer: {
    marginTop: 10,
  },
  btn: {
    textTransform: capitalize as any,
    backgroundColor: `${theme.colors.colorPrimary} !important`,
  },
  btnOutline: {
    textTransform: capitalize as any,
    color: `${theme.colors.colorPrimary} !important`,
    borderColor: `${theme.colors.colorPrimary} !important`,
  },
  active: {
    color: theme.colors.colorPrimary,
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "80%",
    maxWidth: 200,
    // padding: 20,
  },
  field: {
    // margin: "10px !important",
    marginTop: 10,
  },
  formBtn: {
    marginTop: "10px !important",
    marginRight: "10px !important",
  },
  label: {
    fontSize: `${theme.sizes.medium}px !important`,
    marginBottom: `10px !important`,
  },
}));
const HomePage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { getProfile } = useUser();
  const user = useSelector(selectUser);
  const { sendSMSToken, sendVerificationEmail, verifyPhoneToken } = useToken();
  const [displayTokenBox, setTokenDisplay] = useState<boolean>();
  const [displayEmailNotice, setEmailNotification] = useState<boolean>();
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const verifyToken = useCallback(async () => {
    if (!token) {
      return dispatch(
        displayNotice({
          type: "error",
          message: "Token not found",
        })
      );
    }
    setLoading(true);
    const { data, errors } = await verifyPhoneToken({
      variables: {
        token: token as string,
      },
    });
    if (errors && errors.length > 0) {
      return dispatch(
        displayNotice({
          type: "error",
          message: errors[0].message,
        })
      );
    }
    const { data: pData, errors: pErrs } = await getProfile({});
    if (pErrs) {
      return dispatch(
        displayNotice({
          type: "error",
          message: pErrs[0].message,
        })
      );
    }
    dispatch(setUser(pData?.user as IUser));
    setLoading(false);
    setTokenDisplay(false);
    dispatch(
      displayNotice({
        type: "success",
        message: "Token Verified",
      })
    );
  }, [token]);
  const sendToken = useCallback(async () => {
    setTokenDisplay(true);
    const { data, errors } = await sendSMSToken({
      variables: {
        phone: user?.phone as string,
      },
    });
    if (errors && errors.length > 0) {
      return dispatch(
        displayNotice({
          type: "error",
          message: errors[0].message,
        })
      );
    }
    return dispatch(
      displayNotice({
        type: "success",
        message: "Token sent to your phone number",
      })
    );
  }, [JSON.stringify(user)]);
  const sendEmail = useCallback(async () => {
    setEmailNotification(true);
    const { data, errors } = await sendVerificationEmail({
      variables: {
        email: user?.email as string,
      },
    });
    if (errors && errors.length > 0) {
      return dispatch(
        displayNotice({
          type: "error",
          message: errors[0].message,
        })
      );
    }
    return dispatch(
      displayNotice({
        type: "success",
        message: "Link sent to your email!",
      })
    );
  }, [JSON.stringify(user)]);
  return (
    <div className={classes.root}>
      <div className={classes.header}>Welcome to Brillo-Connectz</div>

      <div className={classes.body}>
        {!user?.emailVerified &&
          (!displayEmailNotice ? (
            <div className={classes.notify}>
              Your Email is not verified. Please use the verify button (
              {user?.email})
              <div className={classes.btnContainer}>
                <Button
                  classes={{
                    contained: classes.btn,
                  }}
                  variant="contained"
                  size="small"
                  onClick={sendEmail}
                >
                  Verify Email
                </Button>
              </div>
            </div>
          ) : (
            <div className={classNames(classes.notify, classes.active)}>
              A link has been sent to your email.
            </div>
          ))}
        {!user?.phoneVerified &&
          (!displayTokenBox ? (
            <div className={classes.notify}>
              Your Phone number is not verified. Please use the verify button (
              {user?.phone})
              <div className={classes.btnContainer}>
                <Button
                  classes={{
                    contained: classes.btn,
                  }}
                  variant="contained"
                  size="small"
                  onClick={sendToken}
                >
                  Verify Phone Number
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                className={classes.box}
              >
                <FormLabel className={classes.label}>
                  Insert the token sent to your phone number {user?.phone}
                </FormLabel>
                <TextField
                  className={classes.field}
                  fullWidth
                  id="token"
                  name="token"
                  label="Token"
                  size="small"
                  onChange={({ target }) => {
                    setToken(target.value);
                  }}
                />
                <div>
                  <Button
                    className={classes.formBtn}
                    classes={{
                      outlined: classes.btnOutline,
                    }}
                    variant="outlined"
                    size="small"
                    onClick={() => setTokenDisplay(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={classes.formBtn}
                    classes={{
                      outlined: classes.btnOutline,
                    }}
                    variant="outlined"
                    size="small"
                    onClick={verifyToken}
                    disabled={loading}
                  >
                    Verify
                  </Button>
                </div>
              </Box>
            </div>
          ))}
      </div>
      {user?.emailVerified && user.phoneVerified && (
        <div className={classes.notify}>
          <DoneAllRounded color="success" /> Email and Phone number verified!
        </div>
      )}
    </div>
  );
};

export default HomePage;
