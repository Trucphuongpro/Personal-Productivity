import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TasksStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  status: TasksStatus;
  priority: TaskPriority;
}
