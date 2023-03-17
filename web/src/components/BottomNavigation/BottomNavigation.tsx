import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NetworkIcon from "@mui/icons-material/Sensors";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import { Paper } from "@mui/material";
import { routeNames } from "utils/routes";

const AppBottomNavigation: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_event: any, value: React.SetStateAction<number>) =>
          setValue(value)
        }
      >
        <BottomNavigationAction
          label="Profile"
          icon={<AccountCircleIcon />}
          value="profile"
          onClick={() => navigate(routeNames.profile)}
        />
        <BottomNavigationAction
          label="Buddies"
          value="buddies"
          icon={<PeopleIcon />}
          onClick={() => navigate(routeNames.buddies)}
        />
        <BottomNavigationAction
          label="Discover"
          value="discover"
          icon={<NetworkIcon />}
          onClick={() => navigate(routeNames.discover)}
        />
        <BottomNavigationAction
          label="Settings"
          value="settings"
          icon={<SettingsIcon />}
          onClick={() => navigate(routeNames.settings)}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default AppBottomNavigation;
