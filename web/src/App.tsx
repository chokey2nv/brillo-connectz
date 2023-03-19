import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes, routesHeaderless } from "utils/routes";
import Layout from "components/Layout/Layout";
import { ThemeProvider, useTheme } from "@mui/material";
import { appTheme, routeNames } from "utils";
import { Logout } from "pages/Logout";
import { Notification } from "components/Notification";
function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={{ ...theme, ...appTheme }}>
      <>
        <Router>
          <Routes>
            {routes.map((route, index) => (
              <Route
                path={route.path}
                key={`route--${index}`}
                element={
                  <Layout>
                    <Suspense>
                      <route.Component />
                    </Suspense>
                  </Layout>
                }
              />
            ))}
            {routesHeaderless.map((route, index) => (
              <Route
                path={route.path}
                key={`route-no-header--${index}`}
                element={
                  <Suspense>
                    <route.Component />
                  </Suspense>
                }
              />
            ))}
            <Route
              path={routeNames.logout}
              key={`route-logout`}
              element={<Logout />}
            />
          </Routes>
        </Router>
        <Notification />
      </>
    </ThemeProvider>
  );
}

export default App;
