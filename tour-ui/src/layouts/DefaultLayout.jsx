import React, { useEffect, useRef, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import DrawerComponent from "./components/Drawer-component";
import MainComponent from "./components/Main-component";
import HeaderComponent from "./components/Header-component";
import { useStyles } from "./DefaultLayout-styles";
import { Box, useScrollTrigger } from "@material-ui/core";
// import { AppAlert, AppSnackbar } from "../../components";
// import { useSelector, useDispatch } from "react-redux";
// import { layoutActions } from "../../redux/actions";
import _ from "lodash";

export default function ({ children, setToken, ...rest }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mainRef, setMainRef] = useState();
  const trigger = useScrollTrigger({ target: mainRef });
  // const { alert, snackbar } = useSelector((state) => state.layout);
  // const dispath = useDispatch();

  useEffect(() => {
    if (trigger) {
      setOpenDrawer(false)
    }
  },[trigger])

  /**
   * actions
   */
  // function handleSnackbarClose_click() {
  //   dispath(layoutActions.hideSnackbar());
  // }

  /**
   * renders
   */
  return (
    <Box className={classes.root}>
      <CssBaseline />

      {/*  */}
      <HeaderComponent
        classes={classes}
        setToken={setToken}
        open={openDrawer}
        setOpen={setOpenDrawer}
        {...rest}
        mainRef={mainRef}
      />

      {/*  */}
      <DrawerComponent classes={classes} open={openDrawer} />

      {/*  */}
      <MainComponent classes={classes} children={children} open={openDrawer} setRef={setMainRef}/>

      {/*  */}
    </Box>
  );
}
