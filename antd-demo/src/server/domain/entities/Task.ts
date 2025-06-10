import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  key!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: ["OPEN", "IN_PROGRESS", "IN_REVIEW", "RESOLVED"],
    default: "OPEN",
  })
  status!: "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "RESOLVED";

  @Column({
    type: "enum",
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM",
  })
  priority!: "LOW" | "MEDIUM" | "HIGH";

  @Column()
  deadline!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: string;
}