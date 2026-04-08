import React from "react";
import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend: string;
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="statcard-root">
      <div className="statcard-icon">{icon}</div>
      <div className="statcard-info">
        <div className="statcard-label">{label}</div>
        <div className="statcard-value">{value}</div>
        <div className={`statcard-trend ${trend.startsWith("+") ? "up" : "down"}`}>{trend}</div>
      </div>
    </div>
  );
}
