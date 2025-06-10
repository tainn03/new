import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Button,
  Card,
  Tag,
  Space,
  Typography,
  Input,
  Select,
  DatePicker,
  Popover,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRouter } from "next/router";
import AppLayout from "@/components/organisms/Layout";
import ConfirmDeleteModal from "@/components/organisms/ConfirmDeleteModal";
import { Task } from "@/interface/entity";

const { Title } = Typography;
const { Option } = Select;

const Kanban: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [deadlineFilter, setDeadlineFilter] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Organize tasks by status
  const columns: { [key: string]: Task[] } = {
    OPEN: tasks.filter((task) => task.status === "OPEN"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((task) => task.status === "IN_REVIEW"),
    RESOLVED: tasks.filter((task) => task.status === "RESOLVED"),
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId as Task["status"];
      movedTask.updatedAt = moment().toISOString();
    }

    updatedTasks.splice(destination.index, 0, movedTask);
    updatedTasks.forEach((task, index) => {
      task.key = String(index + 1);
    });

    setTasks(updatedTasks);

    // Update task status via API
    try {
      await fetch(`/ api / tasks / ${ movedTask.key } `, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: movedTask.status }),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteConfirm = async (taskId: string) => {
    try {
      await fetch(`/ api / tasks / ${ taskId } `, { method: "DELETE" });
      setTasks(tasks.filter((task) => task.key !== taskId));
      setIsDeleteModalVisible(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedTask(null);
  };

  const handleCreateTask = () => {
    router.push("/list/new");
  };

  const renderColumn = (status: string, tasks: Task[]) => (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className="bg-gray-100 p-4 rounded-lg min-h-[200px]"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <Title level={5} className="mb-4">
            {status.replace("_", " ")}
          </Title>
          {tasks.map((task, index) => {
            const shortDescription =
              task.description && task.description.length > 50
                ? task.description.slice(0, 50) + "..."
                : task.description || "No description";

            const actionContent = (
              <Space direction="vertical">
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => router.push(`/ list / ${ task.key } `)}
                >
                  View
                </Button>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/ list / ${ task.key }/edit`)}
                >
  Update
                </Button >
  <Button
    type="link"
    danger
    icon={<DeleteOutlined />}
    onClick={() => {
      setSelectedTask(task);
      setIsDeleteModalVisible(true);
    }}
  >
    Delete
  </Button>
              </Space >
            );

return (
  <Draggable key={task.key} draggableId={task.key} index={index}>
    {(provided, snapshot) => (
      <Card
        className="mb-2"
        style={{
          opacity: snapshot.isDragging ? 0.7 : 1,
          boxShadow: snapshot.isDragging
            ? "0 4px 8px rgba(0,0,0,0.2)"
            : "none",
        }}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="font-semibold">{task.title}</div>
            <div className="text-gray-500 text-xs">
              {shortDescription}
            </div>
            <div className="text-gray-500 text-xs">
              Due: {moment(task.deadline).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
          <div className="flex flex-col justify-between items-end h-full">
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
            <Popover
              content={actionContent}
              trigger="click"
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                aria-label={`More actions for ${task.title}`}
              />
            </Popover>
          </div>
        </div>
      </Card>
    )}
  </Draggable>
);
          })}
{ provided.placeholder }
        </div >
      )}
    </Droppable >
  );

useEffect(() => {
  const filteredData = tasks.filter((task) => {
    const matchesSearchTitle = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesSearchDesc = task.description
      ? task.description.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;
    const matchesDeadline = deadlineFilter
      ? moment(task.deadline).isSame(moment(deadlineFilter), "day")
      : true;
    return (
      (matchesSearchTitle || matchesSearchDesc) &&
      matchesPriority &&
      matchesDeadline
    );
  });
  setTasks(filteredData);
}, [searchText, priorityFilter, deadlineFilter, tasks]);

return (
  <AppLayout>
    <div className="p-6 max-w-full mx-auto">
      <Title level={3} className="mb-6">
        Kanban Board
      </Title>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 16,
          paddingBottom: 16,
        }}
      >
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Space>
            <Input
              placeholder="Search by title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filter by priority"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setPriorityFilter(value)}
            >
              <Option value="LOW">Low</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="HIGH">High</Option>
            </Select>
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Filter by deadline"
              onChange={(date) =>
                setDeadlineFilter(date ? date.format("YYYY-MM-DD") : null)
              }
            />
          </Space>
          <Button type="primary" onClick={handleCreateTask}>
            Create New Task
          </Button>
        </Space>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {Object.keys(columns).map((status) => (
            <div key={status} className="flex-1 min-w-[250px]">
              {renderColumn(status, columns[status])}
            </div>
          ))}
        </div>
      </DragDropContext>
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
  </AppLayout>
);
};

export default Kanban;