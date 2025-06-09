import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import * as icons from "@ant-design/icons";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const header: ItemType<MenuItemType>[] = [
    {
      key: "list",
      label: "List",
      icon: <icons.UnorderedListOutlined />,
      onClick: () => {
        router.push("/list");
      },
    },
    {
      key: "kanban",
      label: "Kanban",
      icon: <icons.DashboardOutlined />,
      onClick: () => router.push("/kanban"),
    },
    {
      key: "login",
      label: "Login",
      icon: <icons.UserOutlined />,
      onClick: () => {
        router.push("/login");
      },
    },
    {
      key: "register",
      label: "Register",
      icon: <icons.UserAddOutlined />,
      onClick: () => {
        router.push("/register");
      },
    },
    {
      key: "logout",
      label: "Logout",
      icon: <icons.LogoutOutlined />,
      onClick: () => {
        router.push("/login");
      },
    },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <icons.HomeOutlined
        style={{ fontSize: 24, color: "white" }}
        className="cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={pathname?.split("/")}
        items={header}
        style={{ flex: 1, minWidth: 0, justifyContent: "flex-end" }}
      />
    </Header>
  );
}
