import React, { useState } from "react";
import { Button, Space, Table, TableProps, Tag } from "antd";
import { Task } from "@/interface/entity";
import moment from "moment";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/organisms/ConfirmDeleteModal";

type TaskTableProps = {
  data: Task[];
};

const TaskTable: React.FC<TaskTableProps> = ({ data }) => {
  const router = useRouter();
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

  const columns: TableProps<Task>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <a onClick={() => router.push(`/list/${record.key}`)}>{text}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Open", value: "OPEN" },
        { text: "In Progress", value: "IN_PROGRESS" },
        { text: "In Review", value: "IN_REVIEW" },
        { text: "Resolved", value: "RESOLVED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color =
          status === "OPEN"
            ? "blue"
            : status === "IN_PROGRESS"
            ? "orange"
            : status === "IN_REVIEW"
            ? "purple"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      filters: [
        { text: "Low", value: "LOW" },
        { text: "Medium", value: "MEDIUM" },
        { text: "High", value: "HIGH" },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority) => {
        const color =
          priority === "LOW"
            ? "green"
            : priority === "MEDIUM"
            ? "yellow"
            : "red";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
      render: (deadline) => moment(deadline).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      render: (updatedAt) => moment(updatedAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button onClick={() => router.push(`/list/${record.key}`)}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => router.push(`/list/${record.key}/edit`)}>
            <EditOutlined />
          </Button>
          <Button
            danger
            onClick={() => {
              setSelectedTask(record);
              setIsDeleteModalVisible(true);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table<Task> columns={columns} dataSource={data} />

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
    </div>
  );
};

export default TaskTable;
