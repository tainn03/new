import "@/styles/globals.css";
import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import theme from "../theme";
import { Toaster } from "react-hot-toast";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Toaster position="top-center" />
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
