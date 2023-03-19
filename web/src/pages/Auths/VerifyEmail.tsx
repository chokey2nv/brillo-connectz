import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { AppTheme, routeNames } from "utils";
import { useToken } from "graphql.hooks/token";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 24,
    justifyContent: "center",
    flexDirection: "column",
  },
  header: {},
  formBtn: {
    marginTop: "10px !important",
  },
  btnOutline: {
    textTransform: "capitalize !important" as any,
    color: `${theme.colors.colorPrimary} !important`,
    borderColor: `${theme.colors.colorPrimary} !important`,
  },
}));

const VerifyEmailLink = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { verifyEmailLink } = useToken();
  const [errMessage, setMessage] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        await verifyEmailLink({
          variables: {
            link: id as string,
          },
        });
        window.location.href = routeNames.home;
      } catch (e) {
        setMessage((e as Error).message);
        console.log(e);
      }
    })();
  }, [id]);

  console.log(errMessage);
  return (
    <div className={classes.root}>
      <img src="/assets/b_logo.png" style={{ height: 100 }} />
      <span>{errMessage || `Verifying link ${id}....`}</span>
      <span>
        <Button
          className={classes.formBtn}
          classes={{
            outlined: classes.btnOutline,
          }}
          variant="outlined"
          size="small"
          onClick={() => (window.location.href = routeNames.home)}
        >
          Back to Home
        </Button>
      </span>
    </div>
  );
};
export default VerifyEmailLink;
