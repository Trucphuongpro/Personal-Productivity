import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority } from '../enums/task-priority.enum';
import { TasksStatus } from '../enums/task-status.enum';
import { Goal } from 'src/goal/entities/goal.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TasksStatus;

  @Column()
  deadline: string;

  @Column()
  priority: TaskPriority;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Goal, (goal) => goal.tasks)
  goal: Goal;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
