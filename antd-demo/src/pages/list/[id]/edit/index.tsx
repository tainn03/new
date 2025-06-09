import React, { useEffect } from "react";
import { Button, Form, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import moment from "moment";
import AppLayout from "@/components/organisms/Layout";
import Link from "next/link";
import { initialTasks } from "@/mock/tasks";
import { TaskFormValues } from "@/interface/entity";
import toast from "react-hot-toast";
import TaskCreationForm from "@/components/organisms/TaskCreationForm";

const { Title } = Typography;

const UpdateTask: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();

  const task = initialTasks.find((t) => t.key === id) || null;

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: moment(task.deadline),
      });
    }
  }, [task, form]);

  if (!task) {
    return (
      <AppLayout>
        <div className="p-6 max-w-2xl mx-auto">
          <Title level={3}>Task Not Found</Title>
          <Link href="/list">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              Back to Tasks
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const onUpdate = (values: TaskFormValues) => {
    console.log("Updated task values:", {
      ...values,
      deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
    });
    toast.success("Update task successfully");
    router.push("/list");
  };

  const onCancel = () => {
    router.push("/list");
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/list">
            <Button type="text" icon={<ArrowLeftOutlined />} className="mr-2">
              Back to Tasks
            </Button>
          </Link>
        </div>

        {/* Task Update Form */}
        <TaskCreationForm
          onSave={onUpdate}
          onClose={onCancel}
          isEdit
          taskId={id?.toString()}
        />
      </div>
    </AppLayout>
  );
};

export default UpdateTask;
