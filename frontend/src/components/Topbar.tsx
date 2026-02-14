import React from 'react';

interface TopbarProps {
  networkLabel: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({
  networkLabel,
  title,
  description,
  children
}) => {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Bitcoin Lending Protocol</p>
        <h1>{title}</h1>
        <p className="subhead">{description}</p>
      </div>
      {children}
    </header>
  );
};
