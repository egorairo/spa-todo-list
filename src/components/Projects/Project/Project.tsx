import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import type { XYCoord, Identifier } from 'dnd-core';

import { Project as P } from '../../../d';
import s from './Project.module.scss';
import Modal from '../../Modal/Modal';

interface Props {
  onDeleteProject: (id: string) => void;
  onEditProjectName: (name: string, id: string) => void;
  project: P;
  index: number;
  id: string;
  moveProject: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function Project({
  onDeleteProject,
  onEditProjectName,
  project,
  index,
  id,
  moveProject,
}: Props) {
  const cachedProject = localStorage.getItem(`${project.id}`);
  const ref = useRef<HTMLDivElement>(null);

  const [isOnHover, setIsOnHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onEditProjectName(name, project.id);
    setIsModalOpen(false);
  };

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'project',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveProject(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'project',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const opacity = isDragging ? 0 : 1;
  const dateCreated = dayjs(project.dateCreated).fromNow();

  const projectTasks = cachedProject ? JSON.parse(cachedProject) : null;
  let projectTasksSum = 0;
  let doneTasks = 0;

  if (projectTasks) {
    projectTasksSum +=
      projectTasks.queue.length +
      projectTasks.development.length +
      projectTasks.done.length;
    doneTasks += projectTasks.done.length;
  }

  return (
    <>
      {isModalOpen && (
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
              <label>Name</label>
              <input
                type="text"
                name="title"
                placeholder="Enter task description"
                className="main_input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
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
                Apply
              </button>
            </div>
          </form>
        </Modal>
      )}
      <div
        ref={ref}
        onMouseEnter={() => setIsOnHover(true)}
        onMouseLeave={() => setIsOnHover(false)}
        style={{ position: 'relative', opacity }}
        data-handler-id={handlerId}
      >
        {window.screen.width > 800 ? (
          <>
            {isOnHover && (
              <div className={s.edit_delete_container}>
                <div
                  role={'button'}
                  className={s.edit_button}
                  onClick={() => setIsModalOpen(true)}
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
                  onClick={() => onDeleteProject(project.id)}
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
              onClick={() => setIsModalOpen(true)}
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
              onClick={() => onDeleteProject(project.id)}
            >
              <img
                src={'../../../trash.svg'}
                alt={'delete'}
                className={s.edit_delete_svg}
              />
            </div>
          </div>
        )}
        <Link to={`/tasks/${project.id}`} style={{ textDecoration: 'none' }}>
          <div className={s.project_link}>
            <div className={s.project_ad_block}>
              <img
                src={process.env.PUBLIC_URL + 'project.svg'}
                alt={'project'}
                className={s.svg}
              />
              <div className={s.project_info}>
                {project.name === '' ? 'Untitled' : project.name}
              </div>
            </div>
            <div className={s.project_ad_block}>
              <img
                src={process.env.PUBLIC_URL + 'tasks.svg'}
                alt={'tasks'}
                className={s.svg}
              />
              <div className={s.project_info}>
                {doneTasks}/{projectTasksSum}
                <span style={{ marginLeft: '4px' }}>Done</span>
              </div>
            </div>
            <div className={s.project_ad_block}>
              <div className={`${s.project_info} ${s.project_time}`}>
                Created {dateCreated}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
