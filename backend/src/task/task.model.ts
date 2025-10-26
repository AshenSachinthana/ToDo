import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'task',
  timestamps: true,
})
export class Task extends Model<Task> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'Id',
  })
  Id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'Title',
  })
  Title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'Description',
  })
  Description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'IsCompleted',
  })
  IsCompleted: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'CreatedAt',
  })
  CreatedAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'UpdatedAt',
  })
  UpdatedAt: Date;
}