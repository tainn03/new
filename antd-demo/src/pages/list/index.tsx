import React, { useState } from "react";
import { Button, DatePicker, Input, Select, Space, Typography } from "antd";
import moment from "moment";
import AppLayout from "@/components/organisms/Layout";
import TaskTable from "./components/TaskTable";
import { Task } from "@/interface/entity";
import { initialTasks } from "@/mock/tasks";
import { useRouter } from "next/router";

export default function TaskList() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<Task[]>(initialTasks);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [deadlineFilter, setDeadlineFilter] = useState<string | null>(null);

  const filteredData = data.filter((task) => {
    const matchesSearchTitle = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesSearchDesc = task.description
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesDeadline = deadlineFilter
      ? moment(task.deadline).isSame(moment(deadlineFilter), "day")
      : true;
    return (
      (matchesSearchTitle || matchesSearchDesc) &&
      matchesStatus &&
      matchesDeadline
    );
  });

  const handleCreateTask = () => {
    router.push("/list/new");
  };

  return (
    <AppLayout>
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 16,
            paddingBottom: 16,
          }}
        >
          <Typography.Title level={3} className="mb-6">
            Task List
          </Typography.Title>
          <Space style={{ display: "plex", justifyContent: "space-between" }}>
            <Space>
              <Input
                placeholder="Search by title"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => setStatusFilter(value)}
              >
                <Select.Option value="OPEN">Open</Select.Option>
                <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
                <Select.Option value="IN_REVIEW">In Review</Select.Option>
                <Select.Option value="RESOLVED">Resolved</Select.Option>
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

        <TaskTable data={filteredData} />
      </div>
    </AppLayout>
  );
}
