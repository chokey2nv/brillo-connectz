import { IconButton, Popover, useMediaQuery, useTheme } from "@mui/material";
import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { routeNames } from "utils/routes";

import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material";
import { AppTheme } from "utils/theme";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";

const ILink = styled(Link)(() => ({
  margin: 10,
}));
const StyledLink = styled(ILink)(({ theme }) => ({
  color: "white",
  textDecoration: "none",
}));
const Image = styled("img")(() => ({
  height: 50,
}));
const Space = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
}));
export default function AppHeader() {
  const theme = useTheme();
  const onlyBigScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [anchorEl, setAnchorEl] = useState<Element>();
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Image src="/assets/b_logo.png" />
        <Space />
        {onlyBigScreen && (
          <div>
            <StyledLink to={routeNames.discover}>Discover</StyledLink>
            <StyledLink to={routeNames.buddies}>Buddies</StyledLink>
          </div>
        )}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(undefined)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClick={() => setAnchorEl(undefined)}
        style={{ width: 200 }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ILink to={routeNames.profile} style={{ color: "black" }}>
            Profile
          </ILink>
          <ILink to={routeNames.settings} style={{ color: "black" }}>
            Settings
          </ILink>
          <ILink to={routeNames.logout} style={{ color: "black" }}>
            Logout
          </ILink>
        </div>
      </Popover>
    </AppBar>
  );
}
