import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.model';

@Module({
    imports: [SequelizeModule.forFeature([Task])],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}