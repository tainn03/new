import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import AppLayout from "@/components/organisms/Layout";
import Link from "next/link";
import toast from "react-hot-toast";
import { TaskFormValues } from "@/interface/entity";
import TaskCreationForm from "@/components/organisms/TaskCreationForm";
import { useRouter } from "next/router";

const CreateNewTask: React.FC = () => {
  const router = useRouter();

  const onSave = (values: TaskFormValues) => {
    console.log("Form values:", {
      ...values,
      deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
    });
    toast.success("Create new task successfully");
    router.push("/list");
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <Link href="/list">
            <Button type="text" icon={<ArrowLeftOutlined />} className="mr-2">
              Back to Tasks
            </Button>
          </Link>
        </div>

        {/* Task Creation Form */}
        <TaskCreationForm onSave={onSave} />
      </div>
    </AppLayout>
  );
};

export default CreateNewTask;
