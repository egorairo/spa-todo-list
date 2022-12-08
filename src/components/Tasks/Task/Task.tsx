import React, { useState } from 'react';
import dayjs from 'dayjs';

import s from './Task.module.scss';
import { Task as T } from '../../../d';
import ViewTask from '../CreateEditViewTask/ViewTask';
import EditTask from '../CreateEditViewTask/EditTask';
import Modal from '../../Modal/Modal';

interface Props {
  task: T;
  onDeleteTask: (
    taskId: string,
    status: 'queue' | 'development' | 'done',
  ) => void;
  status: string;
  onEditTask: (task: T, currStatus: 'queue' | 'development' | 'done') => void;
}

export default function Task({ task, onDeleteTask, onEditTask }: Props) {
  const [isOnEdit, setIsOnEdit] = useState(false);
  const [isOnHover, setIsOnHover] = useState(false);
  const [isTaskShown, setIsTaskShown] = useState(false);

  const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    setIsOnEdit(true);
  };

  const editTask = (editedTask: T) => {
    console.log(task.status);
    onEditTask(editedTask, task.status);
  };

  return (
    <>
      {isOnEdit && (
        <Modal isOpen={isOnEdit}>
          <EditTask
            task={task}
            onEditTask={editTask}
            setIsOnEdit={setIsOnEdit}
          />
        </Modal>
      )}
      {isTaskShown && (
        <Modal isOpen={isTaskShown}>
          <ViewTask
            task={task}
            setIsTaskShown={setIsTaskShown}
            setIsOnEdit={setIsOnEdit}
          />
        </Modal>
      )}
      <div className={s.draggable_task}>
        <div
          className={s.task}
          onMouseEnter={() => setIsOnHover(true)}
          onMouseLeave={() => setIsOnHover(false)}
          onClick={() => {
            setIsOnHover(false);
            setIsTaskShown(true);
          }}
        >
          <>
            {window.screen.width >= 800 ? (
              <>
                {isOnHover && (
                  <div className={s.edit_delete_container}>
                    <div
                      role={'button'}
                      className={s.edit_button}
                      onClick={handleEditClick}
                    >
                      <img
                        src={'../../../pencil.svg'}
                        alt={'edit'}
                        className={s.edit_delete_svg}
                      />
                    </div>
                    <div
                      role={'button'}
                      className={s.delete_button}
                      onClick={() =>
                        onDeleteTask(
                          task.id,
                          task.status as 'queue' | 'development' | 'done',
                        )
                      }
                    >
                      <img
                        src={'../../../trash.svg'}
                        alt={'delete'}
                        className={s.edit_delete_svg}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={s.edit_delete_container}>
                <div
                  role={'button'}
                  className={s.edit_button}
                  onClick={handleEditClick}
                >
                  <img
                    src={'../../../pencil.svg'}
                    alt={'edit'}
                    className={s.edit_delete_svg}
                  />
                </div>
                <div
                  role={'button'}
                  className={s.delete_button}
                  onClick={() =>
                    onDeleteTask(
                      task.id,
                      task.status as 'queue' | 'development' | 'done',
                    )
                  }
                >
                  <img
                    src={'../../../trash.svg'}
                    alt={'delete'}
                    className={s.edit_delete_svg}
                  />
                </div>
              </div>
            )}
            <div className={s.task_header}>
              <div className={s.task_title}>{task.title}</div>
            </div>
            <div className={s.task_content}>
              <div className={s.additional_info}>
                <div
                  className={`${s.priority} ${
                    task.priority === 'high'
                      ? s.high_priority
                      : task.priority === 'low'
                      ? s.low_priority
                      : s.medium_priority
                  }`}
                >
                  <div className={s.priority_content}>{task.priority}</div>
                </div>
              </div>
              {task.deadline && (
                <div className={s.additional_info}>
                  <div className={s.deadline}>
                    Deadline:{' '}
                    <span
                      className={`${
                        dayjs().isAfter(dayjs(task.deadline)) && s.overdue
                      }`}
                      style={{ fontWeight: '400' }}
                    >
                      {task.deadline}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
}
