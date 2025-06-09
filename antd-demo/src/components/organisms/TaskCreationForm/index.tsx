import { TaskFormValues } from "@/interface/entity";
import { Button, DatePicker, Form, Input, Select, Typography } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import AppLayout from "../Layout";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { initialTasks } from "@/mock/tasks";

const { TextArea } = Input;
const { Option } = Select;

interface TaskCreationFormProps {
  onSave?: (values: TaskFormValues) => void;
  onClose?: () => void;
  isEdit?: boolean;
  taskId?: string;
}

export default function TaskCreationForm({
  onSave,
  onClose,
  isEdit = false,
  taskId,
}: TaskCreationFormProps) {
  const [form] = Form.useForm();
  const task =
    (isEdit && taskId && initialTasks.find((t) => t.key === taskId)) || null;

  useEffect(() => {
    if (isEdit && task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: moment(task.deadline),
      });
    }
  }, [form, isEdit, task]);

  if (isEdit && !task) {
    return (
      <AppLayout>
        <div className="p-6 max-w-2xl mx-auto">
          <Typography.Title level={3}>Task Not Found</Typography.Title>
          <Link href="/list">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              Back to Tasks
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const onFinish = (values: TaskFormValues) => {
    if (onSave) onSave(values);
    form.resetFields();
  };

  const onCancel = () => {
    if (onClose) onClose();
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        name="task_form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: "OPEN",
          priority: "MEDIUM",
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the task title!" }]}
        >
          <Input placeholder="Enter task title" size="large" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea
            placeholder="Enter task description (optional)"
            rows={4}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select placeholder="Select status" size="large">
            <Option value="OPEN">Open</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="IN_REVIEW">In Review</Option>
            <Option value="RESOLVED">Resolved</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
          <Select placeholder="Select priority" size="large">
            <Option value="LOW">Low</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="HIGH">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: "Please select a deadline!" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="Select deadline"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between">
            <Button type="primary" htmlType="submit" size="large">
              Save
            </Button>
            <Button htmlType="button" size="large" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}
