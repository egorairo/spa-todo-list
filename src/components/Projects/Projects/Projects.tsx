import React, { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import update from 'immutability-helper';

import s from './Projects.module.scss';
import Project from '../Project/Project';
import { Project as P } from '../../../d';

export default function Projects() {
  const cachedProjects = localStorage.getItem('projects');

  const [projects, setProjects] = useState<P[]>(
    cachedProjects ? JSON.parse(cachedProjects) : [],
  );
  const [name, setName] = useState('');

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleCreateProjectSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const newProject = {
      id: nanoid(),
      name,
      tasks: 0,
      dateCreated: new Date(),
    };

    setProjects([...projects, newProject]);
    setName('');
  };

  const handleProjectNameChange = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    setName(event.currentTarget.value);
  };

  const deleteProject = (id: string) => {
    const newProjects = projects.filter((project) => project.id !== id);

    setProjects(newProjects);

    localStorage.removeItem(`${id}`);
  };

  const editProjectName = (newName: string, id: string) => {
    const newProjects = projects.map((project) => {
      if (project.id === id) {
        project.name = newName;
      }

      return project;
    });

    setProjects(newProjects);
  };

  const moveProject = useCallback((dragIndex: number, hoverIndex: number) => {
    setProjects((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    );
  }, []);

  const renderProject = useCallback((project: P, index: number) => {
    return (
      <Project
        key={project.id}
        index={index}
        id={project.id}
        project={project}
        moveProject={moveProject}
        onDeleteProject={deleteProject}
        onEditProjectName={editProjectName}
      />
    );
  }, []);

  return (
    <>
      <div className={s.main}>
        <div className={s.container}>
          <h1>Our Projects</h1>
          <form
            onSubmit={handleCreateProjectSubmit}
            className={s.create_project_form}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter project name"
              className={s.create_input}
              value={name}
              onChange={handleProjectNameChange}
            />
            <button type="submit" className={s.create_button}>
              Create
            </button>
          </form>
          <div className={s.list}>
            {projects.map((project, index) => {
              return renderProject(project, index);
            })}
          </div>
        </div>
      </div>
    </>
  );
}
