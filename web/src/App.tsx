import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppBottomNavigation from "../../web/src/components/BottomNavigation/BottomNavigation";
import { routes, routesHeaderless } from "utils/routes";
import Layout from "components/Layout/Layout";
import { ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import { appTheme } from "utils";
function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={{ ...theme, colors: appTheme }}>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route
              path={route.path}
              element={
                <Layout>
                  <Suspense>
                    <route.Component />
                  </Suspense>
                </Layout>
              }
            />
          ))}
          {routesHeaderless.map((route) => (
            <Route
              path={route.path}
              element={
                <Suspense>
                  <route.Component />
                </Suspense>
              }
            />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
