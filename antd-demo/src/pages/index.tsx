import AppLayout from "@/components/organisms/Layout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/list");
  }, [router]);

  return <AppLayout>Wellcome to your dashboard</AppLayout>;
}
