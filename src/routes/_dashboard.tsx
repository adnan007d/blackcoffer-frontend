import {
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
  Link,
  useNavigate,
  RoutePaths,
} from "@tanstack/react-router";
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  theme as AntdTheme,
  Divider,
  App,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import React, { useMemo, useState } from "react";

import { Avatar, Space } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";

import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import HomeOutlined from "@ant-design/icons/HomeOutlined";
import { useAuth } from "../auth";
import { routeTree } from "../routeTree.gen";
import { flushSync } from "react-dom";

type RoutePath = Exclude<RoutePaths<typeof routeTree>, "/login">;
const paths: { path: RoutePath; icon: React.ReactNode; title: string }[] = [
  {
    path: "/",
    icon: <HomeOutlined />,
    title: "Home",
  },
];

export const Route = createFileRoute("/_dashboard")({
  component: LayoutComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function LayoutComponent() {
  const router = useRouterState();
  const pathname = router.location.pathname;
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = AntdTheme.useToken();

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 576);

  const menuItems: ItemType[] = paths.map((path) => ({
    key: path.path,
    icon: path.icon,
    title: path.title,
    label: (
      <Link to={path.path as string}>
        <span>{path.title}</span>
      </Link>
    ),
  }));

  const { user, setUser } = useAuth();
  const items: ItemType[] = useMemo(
    () => [
      {
        key: "1",
        label: (
          <Space>
            <UserOutlined className="mr-2" />
            {user?.email}
          </Space>
        ),
      },
      {
        key: "2",
        label: (
          <Divider
            style={{
              margin: 0,
            }}
          />
        ),
      },
      {
        key: "3",
        label: (
          <Button
            onClick={() => {
              flushSync(() => {
                setUser(null);
              })
              navigate({ to: "/login", search: { redirect: pathname } });
            }}
          >
            Logout
          </Button>
        ),
      },
    ],
    [user, setUser, navigate, pathname]
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        theme="light"
        collapsed={collapsed}
        breakpoint="sm"
        onBreakpoint={(broken) => {
          setIsSmallScreen(broken);
        }}
        collapsedWidth={isSmallScreen ? 0 : 80}
        className="relative w-[inherit]"
      >
        <div className="logo" />
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          className="fixed h-[calc(100%-64px)] !w-[inherit] !transition-none"
          items={menuItems}
          rootClassName="w-[inherit]"
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger flex-1",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="flex-1"></div>
          <Dropdown
            className="px-4"
            rootClassName="text-center"
            menu={{ items }}
          >
            <Space>
              {user?.email}
              <Avatar
                shape="circle"
                icon={<UserOutlined />}
                className="cursor-pointer"
              />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <App>
            <Outlet />
          </App>
        </Content>
      </Layout>
    </Layout>
  );
}
