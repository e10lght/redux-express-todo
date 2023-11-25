import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TasksState } from '../../../types/tasks';

export const TaskDetail = () => {
  const { taskId } = useParams();
  const tasks =
    useSelector((state: { task: TasksState }) => state.task.tasks) || {};
  const task = tasks.find(task => task.task_id === taskId);

  return (
    <div>
      <p>{task?.title}</p>
      <p>{task?.description}</p>
      <p>{task?.due_date}</p>
      <p>{task?.is_completed}</p>
      <p>{task?.createdAt}</p>
      <p>{task?.updatedAt}</p>
    </div>
  );
};
