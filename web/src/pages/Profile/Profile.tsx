import { makeStyles } from "@mui/styles";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "redux/user.core";
import { AppTheme } from "utils";

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  header: {
    margin: 10,
    marginTop: 50,
    color: theme.colors.colorText,
    fontWeight: "bold",
    fontSize: theme.sizes.large,
  },
  cover: {
    [theme.breakpoints.up("sm")]: {
      minHeight: 200,
      // background: "gray",
      margin: -20,
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
      width: "calc(100% + 40px)",
      margin: -20,
    },

    background: `gray url('/assets/b_logo.png') no-repeat center center / cover`,
  },
  avatar: {
    borderRadius: 100,
    height: 200,
    width: 200,
    border: "solid 1px ",
    marginTop: -50,
    background: "white",
  },
  body: {},
  infoContainer: {
    display: "flex",
    margin: 10,
    fontSize: theme.sizes.medium,
    lineHeight: 2,
    [theme.breakpoints.down("sm")]: {},
  },
  label: {
    fontWeight: "bold",
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      width: 140,
    },
    [theme.breakpoints.down("sm")]: {
      width: 50,
    },
  },
  value: {},
}));
const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const { name, interests, phone, email } = user || {};
  return (
    <div className={classes.root}>
      <div className={classes.cover}></div>
      <img className={classes.avatar} src="/assets/profile.jpeg" />
      <div className={classes.header}>Profiles</div>
      <div className={classes.body}>
        <div className={classes.infoContainer}>
          <div className={classes.label}>Name:</div>
          <div className={classes.value}>{name}</div>
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.label}>Email:</div>
          <div className={classes.value}>{email}</div>
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.label}>Phone:</div>
          <div className={classes.value}>{phone}</div>
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.label}>Interests:</div>
          <div className={classes.value}>{interests?.map((i) => i.name)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
