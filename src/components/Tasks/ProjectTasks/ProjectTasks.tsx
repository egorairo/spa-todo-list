import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Task from '../Task/Task';
import CreateTask from '../CreateEditViewTask/CreateTask';

import s from './ProjectTasks.module.scss';
import { Task as T } from '../../../d';

interface Tasks {
  queue: T[];
  development: T[];
  done: T[];
}

const findCurrentProjectName = (
  projects: { name: string; id: string }[],
  paramId?: string,
) => projects.find(({ id }) => id === paramId);

export default function ProjectTasks() {
  const { id } = useParams();

  const cachedProjects = localStorage.getItem('projects');
  const cachedProjectTasks = localStorage.getItem(`${id}`);

  const project = findCurrentProjectName(
    cachedProjects && JSON.parse(cachedProjects),
    id,
  );

  const [tasks, setTasks] = useState<Tasks>(
    cachedProjectTasks
      ? JSON.parse(cachedProjectTasks)
      : {
          queue: [],
          development: [],
          done: [],
        },
  );

  useEffect(() => {
    localStorage.setItem(`${id}`, JSON.stringify(tasks));
  }, [tasks, id]);

  const addNewTask = (task: T, status: 'queue' | 'development' | 'done') => {
    setTasks({
      ...tasks,
      [status]: [...tasks[status], task],
    });
  };

  const deleteTask = (
    taskId: string,
    status: 'queue' | 'development' | 'done',
  ) => {
    const newTasks = tasks[status].filter((task: T) => task.id !== taskId);

    setTasks({ ...tasks, [status]: newTasks });
  };

  const editTask = (
    editedTask: T,
    currStatus: 'queue' | 'development' | 'done',
  ) => {
    const status = editedTask.status;
    console.log(status, currStatus);
    if (status === currStatus) {
      const newTasks = tasks[status].map((task: T) => {
        if (editedTask.id === task.id) {
          console.log(editedTask, status);
          task.title = editedTask.title;
          task.description = editedTask.description;
          task.deadline = editedTask.deadline;
          task.priority = editedTask.priority;
          task.subTasks = editedTask.subTasks;
          task.comments = editedTask.comments;
        }
        return task;
      });
      console.log(newTasks);
      setTasks({ ...tasks, [status]: newTasks });
    } else {
      const newTasks = tasks[currStatus].filter(
        (task: T) => editedTask.id !== task.id,
      );
      setTasks({
        ...tasks,
        [currStatus]: newTasks,
        [status]: [...tasks[status], editedTask],
      });
    }
  };

  return (
    <>
      <div className={s.main}>
        <div className={s.container}>
          <div className={s.back_to_projects}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <a className={s.back_to_projects_lik}>← Back to projects</a>
            </Link>
          </div>
          <div className={s.task_section}>
            <h1>{project?.name ? project.name : 'Untitled'}</h1>
            <div>
              <div className={s.tasks_container}>
                <div className={s.task_container}>
                  <div className={s.task_status}>
                    <span style={{ fontWeight: '500' }}>
                      <div className={`${s.status} ${s.queue_status}`}>
                        <div className={s.status_content}>
                          <div className={`${s.circle} ${s.queue_circle}`} />
                          <div>Queue</div>
                        </div>
                      </div>
                    </span>
                    <div className={s.task_count}>
                      {tasks?.queue.length || 0}
                    </div>
                  </div>
                  <div className={s.tasks_list}>
                    <div style={{ height: '3px' }}></div>
                    {tasks?.queue.map((task) => {
                      return (
                        <Task
                          key={task.id}
                          task={task}
                          onDeleteTask={deleteTask}
                          onEditTask={editTask}
                          status={task.status}
                        />
                      );
                    })}
                    <CreateTask onAddNewTask={addNewTask} status={'queue'} />
                  </div>
                </div>

                <div className={s.task_container}>
                  <div className={s.task_status}>
                    <span style={{ fontWeight: '500' }}>
                      <div className={`${s.status} ${s.development_status}`}>
                        <div className={s.status_content}>
                          <div
                            className={`${s.circle} ${s.development_circle}`}
                          />
                          <div>Development</div>
                        </div>
                      </div>
                    </span>
                    <div className={s.task_count}>
                      {tasks?.development.length || 0}
                    </div>
                  </div>
                  <div className={s.tasks_list}>
                    <div style={{ height: '3px' }}></div>
                    {tasks?.development.map((task) => {
                      return (
                        <Task
                          task={task}
                          key={task.id}
                          onDeleteTask={deleteTask}
                          onEditTask={editTask}
                          status={task.status}
                        />
                      );
                    })}
                    <CreateTask
                      onAddNewTask={addNewTask}
                      status={'development'}
                    />
                  </div>
                </div>

                <div className={s.task_container}>
                  <div className={s.task_status}>
                    <span style={{ fontWeight: '500' }}>
                      <div className={`${s.status} ${s.done_status}`}>
                        <div className={s.status_content}>
                          <div className={`${s.circle} ${s.done_circle}`} />
                          <div>Done</div>
                        </div>
                      </div>
                    </span>
                    <div className={s.task_count}>
                      {tasks?.done.length || 0}
                    </div>
                  </div>
                  <div className={s.tasks_list}>
                    <div style={{ height: '3px' }}></div>
                    {tasks?.done.map((task) => {
                      return (
                        <Task
                          task={task}
                          key={task.id}
                          onDeleteTask={deleteTask}
                          onEditTask={editTask}
                          status={task.status}
                        />
                      );
                    })}
                    <CreateTask onAddNewTask={addNewTask} status={'done'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
