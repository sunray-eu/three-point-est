import React from "react";
import { connect } from "react-redux";

import { calculateEstimate, calculateTaskTotalCost } from "./templates";
import StatCard from "../common/StatCard";

const TaskStats = ({ taskCount, totalEstimate, totalCost }) => {
  const avgEstimate = taskCount > 0 ? (totalEstimate / taskCount).toFixed(2) : "0.00";
  return (
    <div className="row">
      <StatCard stat={taskCount} title={"Total Tasks"} />
      <StatCard stat={totalEstimate.toFixed(2)} title={"Total Estimate"} />
      <StatCard stat={totalCost.toFixed(2)} title={"Total Cost (EUR)"} />
      <StatCard stat={avgEstimate} title={"Avg Estimate per Task"} />
    </div>
  );
};

const mapStateToProps = state => {
  const tasks = Object.values(state.tasks.tasks);
  const groups = state.groups.groups;
  const phases = state.phases.phases;
  const globalCost = state.config.globalCost;

  let taskCount = 0;
  let totalEstimate = 0.0;
  let totalCost = 0.0;

  tasks.forEach(task => {
    const group = groups[task.groupId.value];
    const phase = phases[task.phaseId.value];
    // Skip this task if its group or phase is marked to be ignored
    if ((group && group.includeInComputation === false) || (phase && phase.includeInComputation === false)) {
      return;
    }
    taskCount++;
    totalEstimate += calculateEstimate(task);
    totalCost += calculateTaskTotalCost(task, groups, phases, globalCost);
  });

  return { taskCount, totalEstimate, totalCost };
};

export default connect(mapStateToProps)(TaskStats);
