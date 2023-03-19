import { makeStyles } from "@mui/styles";
import React from "react";
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
  },
}));
const DiscoveryPage: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.header}>Discovers</div>
    </div>
  );
};

export default DiscoveryPage;
