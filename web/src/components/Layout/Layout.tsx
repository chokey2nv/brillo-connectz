import React from "react";
import classNames from "classnames";
import makeStyles from "@mui/styles/makeStyles";
import AppHeader from "./Header";
import { AppTheme } from "utils";
import { useMediaQuery, useTheme } from "@mui/material";
import AppBottomNavigation from "components/BottomNavigation/BottomNavigation";
const style = makeStyles(({ breakpoints }: AppTheme) => {
  return {
    root: {},
    display: {},
    appPager: {
      margin: "0px 20px",
      minHeight: 300,
    },
    stage: {
      marginTop: 70,
      marginBottom: 50,
      minHeight: 200,
    },
  };
});
function Layout({ children }: { children: React.ReactNode }) {
  const classes = style();
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className={classes.display}>
      <AppHeader />
      <div className={classNames(classes.appPager, classes.stage)}>
        {/* <CustomBreadCrumb/> */}
        {children}
      </div>
      {onlySmallScreen && <AppBottomNavigation />}
    </div>
  );
}
Layout.propTypes = {};
export default Layout;
export { Layout };
