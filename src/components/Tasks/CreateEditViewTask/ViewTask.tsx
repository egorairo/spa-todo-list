import React from 'react';

import s from './CreateEditViewTask.module.scss';
import { Task } from '../../../d';
import dayjs from 'dayjs';

export default function CreateTask({
  task,
  setIsTaskShown,
  setIsOnEdit,
}: {
  task: Task;
  setIsTaskShown: (isTaskShown: boolean) => void;
  setIsOnEdit: (isEdit: boolean) => void;
}) {
  const dateCreated = dayjs(task.dateCreated).fromNow();

  return (
    <>
      <form>
        <div
          role={'button'}
          className={s.close_button}
          onClick={() => setIsTaskShown(false)}
        >
          <img
            src={'../../../close.svg'}
            alt={'close'}
            className={s.close_svg}
          />
        </div>
        <div className={s.task_header}>
          <h1>
            {task.title}
            <span
              style={{
                fontSize: '16px',
                fontWeight: '400',
                marginLeft: '6px',
                textTransform: 'lowercase',
              }}
            >
              ({dateCreated})
            </span>
          </h1>
        </div>
        {task.status && (
          <div className={s.filed_block}>
            <div className={s.field_desc}>
              <img
                src={'../../../status.svg'}
                alt={'status'}
                className={s.svg}
                style={{ marginRight: '6px' }}
              />
              <div style={{ fontSize: '14px', color: '#939db8' }}>Status</div>
            </div>
            <span style={{ fontWeight: '500' }}>
              <div
                className={`${s.status} ${
                  task.status === 'queue'
                    ? s.queue_status
                    : task.status === 'done'
                    ? s.done_status
                    : s.development_status
                }`}
              >
                <div className={s.status_content}>
                  <div
                    className={`${s.circle} ${
                      task.status === 'queue'
                        ? s.queue_circle
                        : task.status === 'done'
                        ? s.done_circle
                        : s.development_circle
                    }`}
                  />
                  <div>{task.status}</div>
                </div>
              </div>
            </span>
          </div>
        )}
        {task.priority && (
          <div className={s.filed_block}>
            <div className={s.field_desc}>
              <img
                src={'../../../priority.svg'}
                alt={'priority'}
                className={s.svg}
                style={{ marginRight: '6px' }}
              />
              <div style={{ fontSize: '14px', color: '#939db8' }}>Priority</div>
            </div>
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
          </div>
        )}
        {task.deadline && (
          <div className={s.filed_block}>
            <div className={s.field_desc}>
              <img
                src={'../../../time.svg'}
                alt={'deadline'}
                className={s.svg}
                style={{ marginRight: '6px' }}
              />
              <div style={{ fontSize: '14px', color: '#939db8' }}>Deadline</div>
            </div>
            <span
              className={`${
                dayjs().isAfter(dayjs(task.deadline)) && s.overdue
              }`}
              style={{ fontSize: '14px' }}
            >
              {task.deadline}
            </span>
          </div>
        )}
        {task.description && (
          <div className={s.filed_block} style={{ alignItems: 'flex-start' }}>
            <div className={s.field_desc}>
              <img
                src={'../../../info.svg'}
                alt={'info'}
                className={s.svg}
                style={{ marginRight: '6px' }}
              />
              <div style={{ fontSize: '14px', color: '#939db8' }}>
                Description
              </div>
            </div>
            <div className={s.additional_info}>
              <div style={{ fontSize: '14px', maxWidth: '300px' }}>
                {task.description}
              </div>
            </div>
          </div>
        )}

        <div className={s.separator}></div>

        {task.subTasks.length !== 0 && (
          <div className={s.form_block}>
            <label>Subtasks:</label>
            {task.subTasks?.map((subTask) => {
              return (
                <div key={subTask.id} className={s.subTask}>
                  <div className={s.subTask_content}>
                    <input
                      checked={subTask.checked}
                      type="checkbox"
                      className={s.check_input}
                    />
                    <input
                      value={subTask.title}
                      maxLength={50}
                      placeholder="To-do"
                      className={s.todo_input}
                      style={{
                        textDecoration: subTask.checked
                          ? 'line-through'
                          : 'none',
                        color: subTask.checked ? '#939db8' : '#000',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {task.comments.length !== 0 && (
          <div className={s.form_block}>
            <label>Comments:</label>
            {task.comments?.map((comment) => {
              return (
                <div key={comment.id}>
                  <div className={s.view_comment}>
                    <p style={{ margin: 0, marginBottom: '16px' }}>
                      {comment.comment}
                    </p>
                    <span className={s.comment_name}>By {comment.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className={s.buttons_container}>
          <button
            type="button"
            className={`${s.button} ${s.cancel_edit_button}`}
            onClick={() => {
              setIsTaskShown(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${s.button} ${s.create_save_button}`}
            onClick={() => {
              setIsTaskShown(false);
              setIsOnEdit(true);
            }}
          >
            Edit
          </button>
        </div>
      </form>
    </>
  );
}
