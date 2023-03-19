import { appConfig } from "config/config";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routeNames } from "utils";

export const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem(appConfig.localStorageTokenAlias);
    navigate(routeNames.login, { replace: true });
  }, []);
  return null;
};
