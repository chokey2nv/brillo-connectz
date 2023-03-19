import {
  Button,
  IconButton,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { routeNames } from "utils/routes";

import { styled } from "@mui/material/styles";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "redux/user.core";

const ILink = styled(Link)(() => ({
  margin: 10,
  textDecoration: "none",
}));
const StyledLink = styled(ILink)(({ theme }) => ({
  color: "white",
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
  const user = useSelector(selectUser);
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Image src="/assets/b_logo.png" />
        <Space />
        {onlyBigScreen && (
          <div>
            <StyledLink to={routeNames.home}>Home</StyledLink>
            <StyledLink to={routeNames.discover}>Discover</StyledLink>
            <StyledLink to={routeNames.buddies}>Buddies</StyledLink>
          </div>
        )}
        <Button
          variant="text"
          style={{ background: "transparent", color: "white" }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <AccountCircle style={{ marginRight: 10 }} /> {user?.name}
        </Button>
      </Toolbar>
      <Popover
        PaperProps={{
          style: {
            width: 150,
          },
        }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(undefined)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClick={() => setAnchorEl(undefined)}
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
