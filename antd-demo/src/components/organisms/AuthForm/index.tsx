import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (values: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Title level={2} className="text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </Title>
        <Form
          name={isLogin ? "login" : "register"}
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>
          )}

          {isLogin && (
            <div className="flex justify-end mb-8">
              <Link href="/forgot-password">
                <Text className="text-blue-500 hover:text-blue-700">
                  Forgot Password?
                </Text>
              </Link>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="text-blue-500 hover:text-blue-700"
              >
                {isLogin ? "Register Now" : "Login"}
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
