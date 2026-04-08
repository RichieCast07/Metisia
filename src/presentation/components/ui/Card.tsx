import React, { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="card-root">
      <div className="card-title">{title}</div>
      <div className="card-content">{children}</div>
    </div>
  );
}
