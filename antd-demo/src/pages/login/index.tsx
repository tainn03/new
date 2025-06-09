import React from "react";
import AuthForm from "@/components/organisms/AuthForm";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const router = useRouter();
  const handleLogin = (values: { email: string; password: string }) => {
    router.push("/");
    console.log(values);
  };

  return (
    <>
      <AuthForm isLogin={true} onSubmit={handleLogin} />
    </>
  );
};

export default Login;
