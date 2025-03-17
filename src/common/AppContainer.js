/**
 * @fileoverview Main container for the Three Point Estimation App.
 * Renders the task list (optionally grouped by phase and/or group), summary rows and controls.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import { addTaskWithPhaseGroup, clearAllTasks } from "../tasks/actions";
import TaskStats from "../tasks/TaskStats";
import TaskHeadings from "../tasks/TaskHeadings";
import TaskRow from "../tasks/TaskRow";
import Controls from "./Controls";
import { calculateTaskTotalCost } from "../tasks/templates";
import { mapStateToProps } from "../utils/common";

/**
 * Calculates cumulative summary values for a list of task IDs.
 * Skips tasks whose group or phase is marked to be ignored.
 *
 * @param {string[]} taskIds - Array of task IDs.
 * @param {Object} tasks - Tasks keyed by their ID.
 * @param {Object} groups - Groups keyed by their ID.
 * @param {Object} phases - Phases keyed by their ID.
 * @param {number} globalCost - Global hourly cost.
 * @returns {Object} The summary object.
 */
export function calcSummary(taskIds, tasks, groups, phases, globalCost) {
  let sumBest = 0;
  let sumLikely = 0;
  let sumWorst = 0;
  let sumCost = 0;
  let sumEstimate = 0;
  let count = 0;

  taskIds.forEach((tid) => {
    const t = tasks[tid];
    if (!t.groupId || !t.groupId.value) return;
    const group = groups[t.groupId.value];
    const phase = phases[t.phaseId.value];
    if (
      (group && group.includeInComputation === false) ||
      (phase && phase.includeInComputation === false)
    ) {
      return;
    }
    const best = parseFloat(t.bestCase.value) || 0;
    const likely = parseFloat(t.mostLikely.value) || 0;
    const worst = parseFloat(t.worstCase.value) || 0;
    sumBest += best;
    sumLikely += likely;
    sumWorst += worst;
    const estimate = (best + 4 * likely + worst) / 6.0;
    sumEstimate += estimate;
    sumCost += calculateTaskTotalCost(t, groups, phases, globalCost);
    count++;
  });

  return { sumBest, sumLikely, sumWorst, sumCost, sumEstimate, count };
}

/**
 * Renders a summary row given a summary object.
 *
 * @param {Object} props
 * @param {Object} props.summary - The summary data.
 * @param {string} props.label - The label for the summary (e.g. "Group Summary" or "Phase Summary").
 * @param {function} props.t - The translation function.
 * @returns {JSX.Element}
 */
const SummaryRow = ({ summary, label, t }) => (
  <div className="border-top pt-2 mt-2 small text-muted">
    <strong>{t(label)}:</strong>{" "}
    <span className="ml-3">
      <em>{t("Best Case Sum")}:</em> {summary.sumBest.toFixed(2)}
    </span>
    <span className="ml-3">
      <em>{t("Most Likely Sum")}:</em> {summary.sumLikely.toFixed(2)}
    </span>
    <span className="ml-3">
      <em>{t("Worst Case Sum")}:</em> {summary.sumWorst.toFixed(2)}
    </span>
    <span className="ml-3">
      <em>{t("Estimate Sum")}:</em> {summary.sumEstimate.toFixed(2)}
    </span>
    <span className="ml-3">
      <em>{t("Average Estimate")}:</em>{" "}
      {summary.count > 0 ? (summary.sumEstimate / summary.count).toFixed(2) : "0.00"}
    </span>
    <span className="ml-3">
      <em>{t("Total Cost")}:</em> {summary.sumCost.toFixed(2)}
    </span>
  </div>
);

SummaryRow.propTypes = {
  summary: PropTypes.shape({
    sumBest: PropTypes.number.isRequired,
    sumLikely: PropTypes.number.isRequired,
    sumWorst: PropTypes.number.isRequired,
    sumEstimate: PropTypes.number.isRequired,
    sumCost: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export const AppContainer = ({
  tasks,
  tasksOrder,
  config,
  groups,
  groupsOrder,
  phases,
  phasesOrder,
  addTaskWithPhaseGroup,
  clearAllTasks,
}) => {
  const { t, i18n } = useTranslation();
  const orderedTasks = tasksOrder.map((id) => [id, tasks[id]]);

  useEffect(() => {
    i18n.changeLanguage(config.language);
  }, []);

  const handleAddTask = () => {
    if (tasksOrder.length > 0) {
      const lastTaskId = tasksOrder[tasksOrder.length - 1];
      const lastTask = tasks[lastTaskId];
      addTaskWithPhaseGroup(lastTask.phaseId.value, lastTask.groupId?.value);
    } else {
      addTaskWithPhaseGroup("default", "default");
    }
  };

  let content = null;

  if (config.showPhases && config.showGroups) {
    // Nested grouping: Phase > Group
    const nested = {};
    orderedTasks.forEach(([id, task]) => {
      const phaseId = task.phaseId.value;
      const groupId = task.groupId?.value || "No Group";
      nested[phaseId] = nested[phaseId] || {};
      nested[phaseId][groupId] = nested[phaseId][groupId] || [];
      nested[phaseId][groupId].push(id);
    });

    content = phasesOrder.map((phaseId) => {
      const phaseGroups = nested[phaseId];
      if (!phaseGroups) return null;
      const allPhaseTaskIDs = Object.values(phaseGroups).flat();
      const phaseSummary = calcSummary(allPhaseTaskIDs, tasks, groups, phases, config.globalCost);

      return (
        <div key={phaseId} className="border rounded p-3 mb-4">
          <h4>
            {t("Phase")}: {phases[phaseId]?.name || phaseId}
            {phases[phaseId]?.description && (
              <div className="text-muted small">{phases[phaseId].description}</div>
            )}
            {phases[phaseId]?.includeInComputation === false && (
              <span className="text-danger"> ({t("Ignored")})</span>
            )}
          </h4>

          {[...groupsOrder, "No Group"].map((groupId) => {
            const groupTaskIDs = phaseGroups[groupId];
            if (!groupTaskIDs) return null;
            const groupSummary = calcSummary(groupTaskIDs, tasks, groups, phases, config.globalCost);

            return (
              <div key={groupId} className="border rounded p-2 mb-3">
                <h5 className="mb-3">
                  {t("Group")}: {groups[groupId]?.name || groupId}
                  {groups[groupId]?.description && (
                    <div className="text-muted small">{groups[groupId].description}</div>
                  )}
                  {groups[groupId]?.includeInComputation === false && (
                    <span className="text-danger"> ({t("Ignored")})</span>
                  )}
                </h5>

                {groupTaskIDs.map((tid) => (
                  <TaskRow key={tid} taskID={tid} />
                ))}

                <SummaryRow summary={groupSummary} label="Group Summary" t={t} />
              </div>
            );
          })}

          <SummaryRow summary={phaseSummary} label="Phase Summary" t={t} />
        </div>
      );
    });
  } else if (config.showPhases) {
    // Group by phase only
    const phasesMap = {};
    orderedTasks.forEach(([id, task]) => {
      const p = task.phaseId.value;
      phasesMap[p] = phasesMap[p] || [];
      phasesMap[p].push(id);
    });

    content = phasesOrder.map((phaseId) => {
      const tIDs = phasesMap[phaseId];
      if (!tIDs) return null;
      const summary = calcSummary(tIDs, tasks, groups, phases, config.globalCost);

      return (
        <div key={phaseId} className="border rounded p-3 mb-4">
          <h4>
            {t("Phase")}: {phases[phaseId]?.name || phaseId}
            {phases[phaseId]?.description && (
              <div className="text-muted small">{phases[phaseId].description}</div>
            )}
            {phases[phaseId]?.includeInComputation === false && (
              <span className="text-danger"> ({t("Ignored")})</span>
            )}
          </h4>

          {tIDs.map((tid) => (
            <TaskRow key={tid} taskID={tid} />
          ))}

          <SummaryRow summary={summary} label="Phase Summary" t={t} />
        </div>
      );
    });
  } else if (config.showGroups) {
    // Group by group only
    const groupsMap = {};
    orderedTasks.forEach(([id, task]) => {
      const g = task.groupId?.value || "No Group";
      groupsMap[g] = groupsMap[g] || [];
      groupsMap[g].push(id);
    });

    content = [...groupsOrder, "No Group"].map((groupId) => {
      const tIDs = groupsMap[groupId];
      if (!tIDs) return null;
      const summary = calcSummary(tIDs, tasks, groups, phases, config.globalCost);

      return (
        <div key={groupId} className="border rounded p-3 mb-4">
          <h4>
            {t("Group")}: {groups[groupId]?.name || groupId}
            {groups[groupId]?.description && (
              <div className="text-muted small">{groups[groupId].description}</div>
            )}
            {groups[groupId]?.includeInComputation === false && (
              <span className="text-danger"> ({t("Ignored")})</span>
            )}
          </h4>

          {tIDs.map((tid) => (
            <TaskRow key={tid} taskID={tid} />
          ))}

          <SummaryRow summary={summary} label="Group Summary" t={t} />
        </div>
      );
    });
  } else {
    // No grouping – just list tasks
    content = orderedTasks.map(([tid]) => <TaskRow key={tid} taskID={tid} />);
  }

  return (
    <div className="container-fluid mt-5">
      <TaskStats />
      <div className="py-3" />
      <Controls />
      <div className="py-3" />
      <form>
        <TaskHeadings />
        {content}
        <div className="py-3" />
        <div className="form-row">
          <div className="col-md-8" />
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-block"
              onClick={handleAddTask}
            >
              {t("Add New Task")}
            </button>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={clearAllTasks}
            >
              {t("Clear All")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

AppContainer.propTypes = {
  tasks: PropTypes.object.isRequired,
  tasksOrder: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  groupsOrder: PropTypes.array.isRequired,
  phases: PropTypes.object.isRequired,
  phasesOrder: PropTypes.array.isRequired,
  addTaskWithPhaseGroup: PropTypes.func.isRequired,
  clearAllTasks: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addTaskWithPhaseGroup: (phaseId, groupId) =>
    dispatch(addTaskWithPhaseGroup(phaseId, groupId)),
  clearAllTasks: () => dispatch(clearAllTasks()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
