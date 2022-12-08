import React from 'react';

import s from './Modal.module.scss';

export default function TaskModal({
  children,
  isOpen,
}: {
  children: JSX.Element;
  isOpen: boolean;
}) {
  return (
    <div className={`${s.modal} ${isOpen && s.modal_open}`}>
      <div
        className={`${s.modal_content} ${s.modal_animation} ${s.modal_shadow}`}
      >
        {children}
      </div>
    </div>
  );
}
