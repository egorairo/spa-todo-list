import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ProjectsPage from './pages/ProjectsPage';
import ProjectTasksPage from './pages/ProjectTasksPage';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/tasks/:id" element={<ProjectTasksPage />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
