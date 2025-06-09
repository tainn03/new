import React, { useState } from "react";
import { Button, Card, Descriptions, Tag, Typography } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import AppLayout from "@/components/organisms/Layout";
import { initialTasks } from "@/mock/tasks";
import { Task } from "@/interface/entity";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/organisms/ConfirmDeleteModal";

const { Title } = Typography;

const TaskDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const task = initialTasks.find((t) => t.key === id) || null;

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDeleteConfirm = (taskId: string) => {
    toast.success(`Deleting task with ID: ${taskId}`);
    // Replace with API call (e.g., DELETE /api/tasks/${taskId})
    // Example: fetch(`/api/tasks/${taskId}`, { method: "DELETE" }).then(() => refreshData());
    setIsDeleteModalVisible(false);
    setSelectedTask(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedTask(null);
  };

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

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/list">
            <Button type="text" icon={<ArrowLeftOutlined />} className="mr-2">
              Back to Tasks
            </Button>
          </Link>
        </div>

        {/* Task Details */}
        <Card>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
            <Descriptions.Item label="Description">
              {task.description || "No description provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  task.status === "OPEN"
                    ? "blue"
                    : task.status === "IN_PROGRESS"
                    ? "orange"
                    : task.status === "IN_REVIEW"
                    ? "purple"
                    : "green"
                }
              >
                {task.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag
                color={
                  task.priority === "LOW"
                    ? "green"
                    : task.priority === "MEDIUM"
                    ? "yellow"
                    : "red"
                }
              >
                {task.priority}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Deadline">
              {moment(task.deadline).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(task.createdAt).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {moment(task.updatedAt).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
          </Descriptions>
          <div className="my-6">
            <div className="flex justify-between">
              <Link href={`/list/${id}/edit`}>
                <Button type="primary" icon={<EditOutlined />}>
                  Update
                </Button>
              </Link>
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedTask(task);
                  setIsDeleteModalVisible(true);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {selectedTask && (
        <ConfirmDeleteModal
          visible={isDeleteModalVisible}
          itemName={selectedTask.title}
          itemId={selectedTask.key}
          entityType="Task"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </AppLayout>
  );
};

export default TaskDetail;
