import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, theme } from "antd";
import { usePathname } from "next/navigation";
import AppHeader from "../Header";
import AppFooter from "../Footer";
const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState<object[]>([]);

  useEffect(() => {
    if (pathname) {
      const paths = pathname.split("/").filter((path) => path != "");
      setBreadcrumbItems(paths.map((path) => ({ title: path })));
    }
  }, [pathname]);

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "home" }, ...breadcrumbItems]}
        />
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
