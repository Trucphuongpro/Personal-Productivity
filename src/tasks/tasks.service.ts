import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
//import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TasksStatus } from './enums/task-status.enum';
import { TaskPriority } from './enums/task-priority.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, deadline } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      deadline,
      status: TasksStatus.TODO,
      priority: TaskPriority.HIGH,
      user,
    });
    return await this.taskRepository.save(task);
  }

  async findAll(filter: FilterTaskDTO, user: User): Promise<Task[]> {
    const { status, description } = filter;
    const query = this.taskRepository.createQueryBuilder('task');
    if (user) {
      query.where('task.userId = :userId', { user });
    }
    if (status) {
      query.andWhere('task.status = :status ', { status });
    }
    if (description) {
      query.andWhere(
        '(task.title LIKE :description OR task.description LIKE :description)',
        { description: `%${description}%` },
      );
    }
    return await query.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });
    console.log('Found: ', found);
    if (!found) {
      throw new NotFoundException('Task with id not found');
    }
    return found;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!task) {
      throw new NotFoundException('Task with id not found');
    }
    task.status = updateTaskDto.status;
    task.priority = updateTaskDto.priority;
    return this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      user: { id: user.id },
    }); //result {trả về object: raw:[] và affected :0 }
    if (result.affected === 0) {
      throw new NotFoundException('Task with id not found');
    }
  }
}
