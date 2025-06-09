export interface Task {
  key: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  status: "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline: moment.Moment;
}
