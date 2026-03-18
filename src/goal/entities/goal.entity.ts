import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('goal')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  targetDate: string;

  @Column({ default: 0 })
  progress: number;

  @CreateDateColumn()
  create: Date;

  @UpdateDateColumn()
  update: Date;

  @OneToMany(() => Task, (task) => task.goal)
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.goals)
  user: User;
}
