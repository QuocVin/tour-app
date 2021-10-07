import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// import { createStore } from 'redux';
// import { reducer } from './redux/reducers/userReducer';
// "Kho chứa" trung tâm, lưu trữ các biến cục bộ
import store from "../src/helpers/store";

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    primary: {
      // light: '#757ce8',
      main: "#ffd54f", //'#3f50b5',
      // dark: '#002884',
      // contrastText: '#fff',
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    }
  },
});

// const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();