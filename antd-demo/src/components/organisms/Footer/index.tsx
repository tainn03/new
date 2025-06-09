import { Footer } from "antd/es/layout/layout";
import React from "react";

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </Footer>
  );
}
