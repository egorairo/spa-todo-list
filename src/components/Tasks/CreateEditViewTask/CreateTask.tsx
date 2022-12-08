import React, { useState } from 'react';

import s from './CreateEditViewTask.module.scss';
import Modal from '../../Modal/Modal';
import { nanoid } from 'nanoid';
import { Task, Subtasks, Comments } from '../../../d';

export default function CreateTask({
  onAddNewTask,
  status,
}: {
  onAddNewTask: (task: Task, status: 'queue' | 'development' | 'done') => void;
  status: 'queue' | 'development' | 'done';
}) {
  const [task, setTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    dateCreated: new Date(),
    deadline: '',
    timeInDevelop: null,
    priority: 'medium',
    files: '',
    status: status,
    subTasks: [],
    comments: [],
  });
  const [subTasks, setSubTasks] = useState<Subtasks[]>([]);
  const [comments, setComments] = useState<Comments[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNewTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTask = {
      ...task,
      id: nanoid(),
      subTasks,
      comments,
    };

    onAddNewTask(newTask, task.status);

    setIsModalOpen(false);
    setTask({
      id: '',
      title: '',
      description: '',
      dateCreated: new Date(),
      deadline: '',
      timeInDevelop: null,
      priority: 'medium',
      files: '',
      status: status,
      subTasks: [],
      comments: [],
    });
  };

  const handleAddSubtaskClick = () => {
    const newSubtask = {
      id: nanoid(),
      title: '',
      checked: false,
    };

    setSubTasks([...subTasks, newSubtask]);
    setTask({ ...task, subTasks: [...task.subTasks, newSubtask] });
  };

  const handleDeleteSubtaskClick = (id: string) => {
    const newSubtasks = subTasks.filter((subTask) => subTask.id !== id);

    setSubTasks(newSubtasks);
    setTask({ ...task, subTasks: newSubtasks });
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
    setTask({ ...task, comments: [...task.comments, newComment] });
  };

  const handleDeleteCommentClick = (id: string) => {
    const newComments = comments.filter((comment) => comment.id !== id);

    setComments(newComments);
    setTask({ ...task, comments: newComments });
  };

  const subTaskNumbers = 5 - subTasks.length;

  return (
    <>
      {isModalOpen && (
        <>
          <Modal isOpen={isModalOpen}>
            <form onSubmit={handleFormSubmit}>
              <div
                role={'button'}
                className={s.close_button}
                onClick={() => setIsModalOpen(false)}
              >
                <img
                  src={'../../../close.svg'}
                  alt={'close'}
                  className={s.close_svg}
                />
              </div>
              <div className={s.form_block}>
                <label className="required">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  maxLength={35}
                  placeholder="Enter task title *"
                  className="main_input"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                ></input>
              </div>
              <div className={s.form_block}>
                <label>Description</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter task description"
                  className="main_input"
                  value={task.description}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                ></input>
              </div>
              <div className={s.form_block}>
                <label>Deadline</label>
                <input
                  name="date"
                  type="date"
                  className="main_input"
                  value={task.deadline}
                  onChange={(e) =>
                    setTask({ ...task, deadline: e.target.value })
                  }
                />
              </div>
              <div className={s.form_block}>
                <label>Priority</label>
                <select
                  name="select"
                  defaultValue={'medium'}
                  onChange={(e) => {
                    setTask({
                      ...task,
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
                  defaultValue={status}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      status: e.target.value
                        ? (e.target.value as 'queue' | 'development' | 'done')
                        : status,
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
                            textDecoration: subTask.checked
                              ? 'line-through'
                              : 'none',
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
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${s.button} ${s.create_save_button}`}
                >
                  Create
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
      <div
        role="button"
        className={s.create_task_button}
        onClick={() => handleCreateNewTaskClick()}
      >
        <img src={'../../../plus.svg'} alt={'plus'} className={s.plus_svg} />
        New
      </div>
    </>
  );
}
