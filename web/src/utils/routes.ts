import React from "react";

export const routeNames = {
  home: "/",
  signup: "/signup",
  login: "/login",
  forgotPassword: "/forgotpass",
  logout: "/logout",
  settings: "/settings",
  profile: "/profile",
  buddies: "/buddies",
  discover: "/discover",
};
const Profile = React.lazy(() => import("pages/Profile/Profile"));
const Settings = React.lazy(() => import("pages/Settings/Settings"));
const Buddies = React.lazy(() => import("pages/Buddies/Buddies"));
const Discover = React.lazy(() => import("pages/Discover/Discover"));
const Login = React.lazy(() => import("pages/Auths/Login"));
const Signup = React.lazy(() => import("pages/Auths/Signup"));
export const routes: {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  { Component: Profile, path: routeNames.profile },
  { Component: Settings, path: routeNames.settings },
  { Component: Discover, path: routeNames.discover },
  { Component: Buddies, path: routeNames.buddies },
];
export const routesHeaderless: {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  { Component: Login, path: routeNames.login },
  { Component: Signup, path: routeNames.signup },
];
