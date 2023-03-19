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
  verifyLink: "/email/verify/:id",
  passRecoveryLink: "/pass/recovery/:id",
};
const Profile = React.lazy(() => import("pages/Profile/Profile"));
const Home = React.lazy(() => import("pages/Home/Home"));
const Settings = React.lazy(() => import("pages/Settings/Settings"));
const Buddies = React.lazy(() => import("pages/Buddies/Buddies"));
const Discover = React.lazy(() => import("pages/Discover/Discover"));
const Login = React.lazy(() => import("pages/Auths/Login"));
const VerifyEmail = React.lazy(() => import("pages/Auths/VerifyEmail"));
const ForgotPass = React.lazy(() => import("pages/Auths/ForgotPass"));
const Signup = React.lazy(() => import("pages/Auths/Signup"));
export const routes: {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  { Component: Profile, path: routeNames.profile },
  { Component: Settings, path: routeNames.settings },
  { Component: Discover, path: routeNames.discover },
  { Component: Buddies, path: routeNames.buddies },
  { Component: Home, path: routeNames.home },
];
export const routesHeaderless: {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  { Component: Login, path: routeNames.login },
  { Component: Signup, path: routeNames.signup },
  { Component: VerifyEmail, path: routeNames.verifyLink },
  { Component: ForgotPass, path: routeNames.passRecoveryLink },
];
