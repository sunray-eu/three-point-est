/**
 * @fileoverview Renders statistics about tasks.
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { calculateEstimate, calculateTaskTotalCost } from "./templates";
import StatCard from "../common/StatCard";
import { useTranslation } from "react-i18next";

const TaskStats = ({ taskCount, totalEstimate, totalCost }) => {
  const { t } = useTranslation();
  const avgEstimate = taskCount > 0 ? (totalEstimate / taskCount).toFixed(2) : "0.00";
  return (
    <div className="row">
      <StatCard stat={taskCount} title={t("Total Tasks")} />
      <StatCard stat={totalEstimate.toFixed(2)} title={t("Total Estimate")} />
      <StatCard stat={totalCost.toFixed(2)} title={t("Total Cost")} />
      <StatCard stat={avgEstimate} title={t("Avg Estimate per Task")} />
    </div>
  );
};

TaskStats.propTypes = {
  taskCount: PropTypes.number.isRequired,
  totalEstimate: PropTypes.number.isRequired,
  totalCost: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  const tasks = Object.values(state.tasks.tasks);
  const groups = state.groups.groups;
  const phases = state.phases.phases;
  const globalCost = state.config.globalCost;

  let taskCount = 0;
  let totalEstimate = 0.0;
  let totalCost = 0.0;

  tasks.forEach((task) => {
    if (!task.groupId || !task.groupId.value) return;
    const group = groups[task.groupId.value];
    const phase = phases[task.phaseId.value];
    if (
      (group && group.includeInComputation === false) ||
      (phase && phase.includeInComputation === false)
    ) {
      return;
    }
    taskCount++;
    totalEstimate += calculateEstimate(task);
    totalCost += calculateTaskTotalCost(task, groups, phases, globalCost);
  });

  return { taskCount, totalEstimate, totalCost };
};

export default connect(mapStateToProps)(TaskStats);
