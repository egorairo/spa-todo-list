import React, { useState } from 'react';
import s from './CreateEditViewTask.module.scss';
import { Comments, Subtasks, Task as T } from '../../../d';
import { nanoid } from 'nanoid';

export default function EditTask({
  task,
  onEditTask,
  setIsOnEdit,
}: {
  task: T;
  onEditTask: (newTask: T) => void;
  setIsOnEdit: (isEdit: boolean) => void;
}) {
  const [editedTask, setEditedTask] = useState<T>(task);
  const [subTasks, setSubTasks] = useState<Subtasks[]>(editedTask.subTasks);
  const [comments, setComments] = useState<Comments[]>(editedTask.comments);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEditedTask = {
      ...editedTask,
      subTasks,
      comments,
    };

    onEditTask(newEditedTask);
    setIsOnEdit(false);
  };

  const handleAddSubtaskClick = () => {
    const newSubtask = {
      id: nanoid(),
      title: '',
      checked: false,
    };

    setSubTasks([...subTasks, newSubtask]);
    setEditedTask({ ...editedTask, subTasks: [...task.subTasks, newSubtask] });
  };

  const handleDeleteSubtaskClick = (id: string) => {
    const newSubtasks = subTasks.filter((subTask) => subTask.id !== id);

    setSubTasks(newSubtasks);
    setEditedTask({ ...editedTask, subTasks: newSubtasks });
  };

  const handleAddCommentClick = () => {
    const newComment = {
      id: nanoid(),
      title: '',
      name: '',
      comment: '',
      cascade: [],
    };

    setComments([...comments, newComment]);
    setEditedTask({ ...editedTask, comments: [...task.comments, newComment] });
  };

  const handleDeleteCommentClick = (id: string) => {
    const newComments = comments.filter((comment) => comment.id !== id);

    setComments(newComments);
    setEditedTask({ ...editedTask, comments: newComments });
  };

  const subTaskNumbers = 5 - editedTask.subTasks.length;

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col">
        <div
          role={'button'}
          className={s.close_button}
          onClick={() => setIsOnEdit(false)}
        >
          <img
            src={'../../../close.svg'}
            alt={'close'}
            className={s.close_svg}
          />
        </div>
        <div className={s.form_block}>
          <label>Title</label>
          <input
            type="text"
            required
            name="title"
            placeholder="Enter task title"
            className="main_input"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...task, title: e.target.value })}
          ></input>
        </div>
        <div className={s.form_block}>
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder="Enter task title"
            className="main_input"
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          ></input>
        </div>
        <div className={s.form_block}>
          <label>Deadline</label>
          <input
            name="date"
            type="date"
            className="main_input"
            value={editedTask.deadline}
            onChange={(e) =>
              setEditedTask({ ...editedTask, deadline: e.target.value })
            }
          />
        </div>
        <div className={s.form_block}>
          <label>Priority</label>
          <select
            name="select"
            defaultValue={editedTask.priority}
            onChange={(e) => {
              setEditedTask({
                ...editedTask,
                priority: e.target.value as 'high' | 'medium' | 'low',
              });
            }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className={s.form_block}>
          <label>Status</label>
          <select
            name="select"
            defaultValue={editedTask.status}
            onChange={(e) => {
              setEditedTask({
                ...editedTask,
                status: e.target.value as 'queue' | 'development' | 'done',
              });
            }}
          >
            <option value="queue">Queue</option>
            <option value="development">Development</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className={s.form_block}>
          <label>Subtasks:</label>
          {subTasks?.map((subTask) => {
            return (
              <div key={subTask.id} className={s.subTask}>
                <div className={s.subTask_content}>
                  <input
                    checked={subTask.checked}
                    type="checkbox"
                    className={s.check_input}
                    onChange={() => {
                      setSubTasks((prevState) =>
                        prevState.map((item) =>
                          item.id === subTask.id
                            ? { ...item, checked: !item.checked }
                            : item,
                        ),
                      );
                    }}
                  />
                  <input
                    value={subTask.title}
                    maxLength={50}
                    placeholder="To-do"
                    className={s.todo_input}
                    style={{
                      textDecoration: subTask.checked ? 'line-through' : 'none',
                      color: subTask.checked ? '#939db8' : '#000',
                    }}
                    onChange={(e) => {
                      setSubTasks((prevState) =>
                        prevState.map((item) =>
                          item.id === subTask.id
                            ? { ...item, title: e.target.value }
                            : item,
                        ),
                      );
                    }}
                  />
                </div>
                <div
                  role={'button'}
                  className={s.delete_button}
                  onClick={() => handleDeleteSubtaskClick(subTask.id)}
                >
                  <img
                    src={'../../../trash.svg'}
                    alt={'delete'}
                    className={s.delete_svg}
                  />
                </div>
              </div>
            );
          })}
          {subTaskNumbers !== 0 && (
            <div
              role="button"
              className={s.create_task_button}
              onClick={() => handleAddSubtaskClick()}
            >
              <img
                src={'../../../plus.svg'}
                alt={'plus'}
                className={s.plus_svg}
              />
              Add to-do (you can create {subTaskNumbers} more tasks)
            </div>
          )}
        </div>
        <div className={s.form_block}>
          <label>Comments:</label>
          {comments?.map((comment, index) => {
            return (
              <div key={comment.id} className={s.comment}>
                <div className={s.comment_header}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      margin: 0,
                      marginRight: '2px',
                    }}
                  >
                    Comment {index + 1}
                  </p>
                  <div
                    role={'button'}
                    className={s.delete_button}
                    onClick={() => handleDeleteCommentClick(comment.id)}
                  >
                    <img
                      src={'../../../trash.svg'}
                      alt={'delete'}
                      className={s.delete_svg}
                    />
                  </div>
                </div>
                <input
                  name="name"
                  autoComplete={'off'}
                  required
                  maxLength={25}
                  type={'text'}
                  placeholder="Name | Nickname"
                  value={comment.name}
                  className="main_input required"
                  style={{ marginBottom: '8px' }}
                  onChange={(e) => {
                    setComments((prevState) =>
                      prevState.map((item) =>
                        item.id === comment.id
                          ? { ...item, name: e.target.value }
                          : item,
                      ),
                    );
                  }}
                />
                <textarea
                  name="comment"
                  required
                  maxLength={210}
                  placeholder="Enter your comment"
                  value={comment.comment}
                  onChange={(e) => {
                    setComments((prevState) =>
                      prevState.map((item) =>
                        item.id === comment.id
                          ? { ...item, comment: e.target.value }
                          : item,
                      ),
                    );
                  }}
                />
              </div>
            );
          })}
          <div
            role="button"
            className={s.create_task_button}
            onClick={() => handleAddCommentClick()}
          >
            <img
              src={'../../../plus.svg'}
              alt={'plus'}
              className={s.plus_svg}
            />
            Add comment
          </div>
        </div>
        <div className={s.buttons_container}>
          <button
            type="button"
            className={`${s.button} ${s.cancel_edit_button}`}
            onClick={() => setIsOnEdit(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${s.button} ${s.create_save_button}`}
          >
            Apply
          </button>
        </div>
      </form>
    </>
  );
}
