import * as React from "react";
import {
  createFileRoute,
  getRouteApi,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import { Button, Form, Input, Layout } from "antd";
import { message } from "antd";

import { useAuth } from "../auth";
import { flushSync } from "react-dom";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().catch("/"),
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: {},
      });
    }
  },
  component: LoginComponent,
});

const routeApi = getRouteApi("/login");

interface FormState {
  email: string;
  password: string;
}

function LoginComponent() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const search = routeApi.useSearch();

  const onFinish = async (values: FormState) => {
    setIsSubmitting(true);
    try {
      if (values.email !== "admin@admin.com" || values.password !== "admin") {
        throw new Error("Invalid email or password");
      }
      flushSync(() => auth.setUser(values.email));
      setIsSubmitting(false);
      navigate({ to: search.redirect });
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else if (error && typeof error === "object" && "message" in error) {
        messageApi.error(error.message as string);
      } else {
        messageApi.error("An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error(errorInfo);
    setIsSubmitting(false);
  };

  return (
    <Layout className="grid min-h-screen place-items-center">
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        style={{ maxWidth: 600, width: "90%", marginInline: "auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateTrigger="onSubmit"
      >
        <h1 className="mb-4 text-center text-3xl font-bold">Login</h1>
        <Form.Item
          initialValue={""}
          label="Email"
          name="email"
          className="w-full"
          extra="admin@admin.com"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          initialValue={""}
          label="Password"
          extra="admin"
          name={"password"}
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 3, message: "Password must be at least 3 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div className="mx-auto w-max">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Submit
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
