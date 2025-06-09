import React from "react";
import AuthForm from "@/components/organisms/AuthForm";
import { useRouter } from "next/router";

const Register: React.FC = () => {
  const router = useRouter();
  const handleRegister = (values: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    router.push("/login");
    console.log(values);
  };

  return (
    <>
      <AuthForm isLogin={false} onSubmit={handleRegister} />
    </>
  );
};

export default Register;
