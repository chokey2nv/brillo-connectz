import { makeStyles } from "@mui/styles";
import { appConfig } from "config/config";
import { useUser } from "graphql.hooks/user";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "redux/hook";
import { setUser } from "redux/user.core";
import { routeNames } from "utils";

const useStyles = makeStyles(() => ({
  loading: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 24,
    justifyContent: "center",
    flexDirection: "column",
  },
}));
interface IAppInitAdapter {
  children: React.ReactNode;
}
export const AppAdapter: React.FC<IAppInitAdapter> = ({ children }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { getProfile } = useUser();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>();
  const appToken = localStorage.getItem(appConfig.localStorageTokenAlias);
  const toLogin = () =>
    navigate(routeNames.login, {
      replace: true,
    });
  if (!appToken) {
    toLogin();
  }
  console.log(appToken);
  useEffect(() => {
    (async () => {
      if (appToken) {
        setLoading(true);
        const { data, errors } = await getProfile({});
        console.log(data);
        if ((errors && errors.length > 0) || !data?.user) {
          // show error
          toLogin();
        }
        if (data?.user) {
          setLoading(false);
          dispatch(setUser(data.user));
        }
      }
    })();
  }, [appToken]);
  if (loading) {
    return (
      <div className={classes.loading}>
        <img src="/assets/b_logo.png" style={{ height: 100 }} />
        <span>Loading...</span>
      </div>
    );
  }
  return <>{children}</>;
};
