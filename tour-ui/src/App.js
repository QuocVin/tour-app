import React, { Suspense, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Layout from "./layouts";
import { PublicRoutes, RoutePaths } from "./routes/public-route";
import { ProtectRoutes, AdminPaths, EmployeeRoutes } from "./routes/protect-route";
import { getAuthLS, LS_KEY, clearAuthLS } from '../src/helpers/localStorage';
import cookies from 'react-cookies';

function App() {
  // const loggedIn = true;
  let loggedIn = getAuthLS(LS_KEY.AUTH_TOKEN) ? true : false;
  const check = getAuthLS(LS_KEY.AUTH_TOKEN)
  if (cookies.load("user") == null || !loggedIn) {
    loggedIn = false;
    clearAuthLS();
    cookies.remove("user");
    cookies.remove("access_token");
  };

  function GuestLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(PublicRoutes).map((route, idx) => {
            if (route.id !== 'Profile') {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  render={(props) => <route.component {...props} />}
                />
              );
            }
          })}
          <Redirect to={RoutePaths.Home} />
        </Switch>
      </Layout>
    );
  }

  function CustomerLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(PublicRoutes).map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={RoutePaths.Home} />
        </Switch>
      </Layout>
    );
  }

  function EmployeeLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(PublicRoutes).map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          {Object.values(EmployeeRoutes).map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={AdminPaths.NewsTour} />
        </Switch>
      </Layout>
    );
  }

  function AdminLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(PublicRoutes).map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          {Object.values(ProtectRoutes).map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={AdminPaths.Dashboard} />
        </Switch>
      </Layout>
    );
  }

  const rolePaths = {
    GUEST: 'KHACH',
    CUSTOMER: 'NGUOI DUNG',
    EMPLOYEE: 'NHAN VIEN',
    ADMIN: 'QUAN LY',
  }

  function ManageRoute({ role = rolePaths.GUEST }) {
    if (role === rolePaths.CUSTOMER) {
      return (
        <Route key={1} path="/" render={(props) => <CustomerLayout {...props} />} />
      );
    } else if (role === rolePaths.EMPLOYEE) {
      return (
        <Route key={2} path="/" render={(props) => <EmployeeLayout {...props} />} />
      );
    } else if (role === rolePaths.ADMIN) {
      return (
        <Route key={3} path="/" render={(props) => <AdminLayout {...props} />} />
      );
    } else {
      return (
        <Route key={1} path="/" render={(props) => <GuestLayout {...props} />} />
      );
    }
  }

  return (
    <Router>
      {loggedIn ? (
        <Switch>
          <ManageRoute role={check} />
        </Switch>
      ) : (
        <Switch>
          <Route key={0} path="/" render={(props) => <GuestLayout {...props} />} />
        </Switch>

      )}
      {/* {check === 'EMPLOYEE' ? (
      <Route key={2} path="/" render={(props) => <EmployeeLayout {...props} />} />
    ) : (
      <Route key={0} path="/" render={(props) => <GuestLayout {...props} />} />
    )} */}
    </Router>
  );
}

export default App;
{/* <Router>
        <Switch>
          {loggedIn ? (
            <Route path="/" render={(props) => <BasicLayout {...props} />} />

          ) : (
            <Route path="/" render={(props) => <ManageLayout {...props} />} />

          )}
          <Redirect from="*" to="/" />
        </Switch>
      </Router> */}