import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import { addTaskWithPhaseGroup, clearAllTasks } from "../tasks/actions";
import TaskStats from "../tasks/TaskStats";
import TaskHeadings from "../tasks/TaskHeadings";
import TaskRow from "../tasks/TaskRow";
import Controls from "./Controls";
import { calculateTaskTotalCost } from "../tasks/templates";

/**
 * Summation helper: returns cumulative bestCase, mostLikely, worstCase, cost, average estimate and count.
 * It skips tasks whose group or phase is marked to be ignored in computation.
 */
function calcSummary(taskIds, tasks, groups, phases, globalCost) {
  let sumBest = 0;
  let sumLikely = 0;
  let sumWorst = 0;
  let sumCost = 0;
  let sumEstimate = 0;
  let count = 0;

  taskIds.forEach(tid => {
    const t = tasks[tid];
    // Check if group or phase is ignored in computation:
    const group = groups[t.groupId.value];
    const phase = phases[t.phaseId.value];
    if ((group && group.includeInComputation === false) || (phase && phase.includeInComputation === false)) {
      return;
    }
    const best = parseFloat(t.bestCase.value) || 0;
    const likely = parseFloat(t.mostLikely.value) || 0;
    const worst = parseFloat(t.worstCase.value) || 0;
    sumBest += best;
    sumLikely += likely;
    sumWorst += worst;
    // Calculate weighted average estimate:
    const estimate = (best + 4 * likely + worst) / 6.0;
    sumEstimate += estimate;
    sumCost += calculateTaskTotalCost(t, groups, phases, globalCost);
    count++;
  });

  return { sumBest, sumLikely, sumWorst, sumCost, sumEstimate, count };
}

export const AppContainer = ({
  tasks,
  tasksOrder,
  config,
  groups,
  groupsOrder,
  phases,
  phasesOrder,
  addTaskWithPhaseGroup,
  clearAllTasks
}) => {
  const { t } = useTranslation();
  // Create an ordered list of [taskID, taskObj]
  const orderedTasks = tasksOrder.map(id => [id, tasks[id]]);

  const handleAddTask = () => {
    // If there are tasks, take phase and group from the last task.
    if (tasksOrder.length > 0) {
      const lastTaskId = tasksOrder[tasksOrder.length - 1];
      const lastTask = tasks[lastTaskId];
      addTaskWithPhaseGroup(lastTask.phaseId.value, lastTask.groupId.value);
    } else {
      addTaskWithPhaseGroup("default", "default");
    }
  };

  let content;
  if (config.showPhases && config.showGroups) {
    // Nested grouping: Phase > Group
    // Build a nested structure { phaseId: { groupId: [taskID, ...], ... }, ... }
    const nested = {};
    orderedTasks.forEach(([id, task]) => {
      const phaseId = task.phaseId.value;
      const groupId = task.groupId.value;
      if (!nested[phaseId]) nested[phaseId] = {};
      if (!nested[phaseId][groupId]) nested[phaseId][groupId] = [];
      nested[phaseId][groupId].push(id);
    });

    content = phasesOrder.map(phaseId => {
      const phaseGroups = nested[phaseId];
      if (!phaseGroups) return null; // no tasks in this phase

      // Gather all tasks in this phase to compute a summary
      const allPhaseTaskIDs = [];
      Object.values(phaseGroups).forEach(taskIds => {
        allPhaseTaskIDs.push(...taskIds);
      });
      const phaseSummary = calcSummary(
        allPhaseTaskIDs,
        tasks,
        groups,
        phases,
        config.globalCost
      );

      return (
        <div key={phaseId} className="border rounded p-3 mb-4">
          <h4>
            {t("Phase")}:{" "}
            {phases[phaseId] && phases[phaseId].name ? phases[phaseId].name : phaseId}
            {phases[phaseId] && phases[phaseId].description && (
              <div className="text-muted small">
                {phases[phaseId].description}
              </div>
            )}
            {phases[phaseId] && phases[phaseId].includeInComputation === false && (
              <span className="text-danger"> ({t("Ignored")})</span>
            )}
          </h4>

          {groupsOrder.map(groupId => {
            const groupTaskIDs = phaseGroups[groupId];
            if (!groupTaskIDs) return null; // no tasks in this group for this phase

            const groupSummary = calcSummary(
              groupTaskIDs,
              tasks,
              groups,
              phases,
              config.globalCost
            );

            return (
              <div key={groupId} className="border rounded p-2 mb-3">
                <h5 className="mb-3">
                  {t("Group")}:{" "}
                  {groups[groupId] && groups[groupId].name ? groups[groupId].name : groupId}
                  {groups[groupId] && groups[groupId].description && (
                    <div className="text-muted small">
                      {groups[groupId].description}
                    </div>
                  )}
                  {groups[groupId] && groups[groupId].includeInComputation === false && (
                    <span className="text-danger"> ({t("Ignored")})</span>
                  )}
                </h5>

                {groupTaskIDs.map(tid => (
                  <TaskRow key={tid} taskID={tid} />
                ))}

                {/* Group summary row */}
                <div className="border-top pt-2 mt-2 small text-muted">
                  <strong>{t("Group Summary")}:</strong>{" "}
                  <span className="ml-3">
                    <em>{t("Best Case")}:</em> {groupSummary.sumBest.toFixed(2)}
                  </span>
                  <span className="ml-3">
                    <em>{t("Most Likely")}:</em> {groupSummary.sumLikely.toFixed(2)}
                  </span>
                  <span className="ml-3">
                    <em>{t("Worst Case")}:</em> {groupSummary.sumWorst.toFixed(2)}
                  </span>
                  <span className="ml-3">
                    <em>{t("Estimate")}:</em>{" "}
                    {groupSummary.count > 0 ? (groupSummary.sumEstimate / groupSummary.count).toFixed(2) : "0.00"}
                  </span>
                  <span className="ml-3">
                    <em>{t("Cost Override")}:</em> {groupSummary.sumCost.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Phase summary row */}
          <div className="border-top pt-2 mt-2 small text-muted">
            <strong>{t("Phase Summary")}:</strong>{" "}
            <span className="ml-3">
              <em>{t("Best Case")}:</em> {phaseSummary.sumBest.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Most Likely")}:</em> {phaseSummary.sumLikely.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Worst Case")}:</em> {phaseSummary.sumWorst.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Estimate")}:</em>{" "}
              {phaseSummary.count > 0 ? (phaseSummary.sumEstimate / phaseSummary.count).toFixed(2) : "0.00"}
            </span>
            <span className="ml-3">
              <em>{t("Cost Override")}:</em> {phaseSummary.sumCost.toFixed(2)}
            </span>
          </div>
        </div>
      );
    });
  } else if (config.showPhases) {
    // Group by phase only
    const phasesMap = {};
    orderedTasks.forEach(([id, task]) => {
      const p = task.phaseId.value;
      if (!phasesMap[p]) phasesMap[p] = [];
      phasesMap[p].push(id);
    });

    content = phasesOrder.map(phaseId => {
      const tIDs = phasesMap[phaseId];
      if (!tIDs) return null;

      const summary = calcSummary(
        tIDs,
        tasks,
        groups,
        phases,
        config.globalCost
      );

      return (
        <div key={phaseId} className="border rounded p-3 mb-4">
          <h4>
            {t("Phase")}:{" "}
            {phases[phaseId] && phases[phaseId].name ? phases[phaseId].name : phaseId}
            {phases[phaseId] && phases[phaseId].description && (
              <div className="text-muted small">
                {phases[phaseId].description}
              </div>
            )}
            {phases[phaseId] && phases[phaseId].includeInComputation === false && (
              <span className="text-danger"> ({t("Ignored")})</span>
            )}
          </h4>

          {tIDs.map(tid => (
            <TaskRow key={tid} taskID={tid} />
          ))}

          <div className="border-top pt-2 mt-2 small text-muted">
            <strong>{t("Phase Summary")}:</strong>{" "}
            <span className="ml-3">
              <em>{t("Best Case")}:</em> {summary.sumBest.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Most Likely")}:</em> {summary.sumLikely.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Worst Case")}:</em> {summary.sumWorst.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Estimate")}:</em>{" "}
              {summary.count > 0 ? (summary.sumEstimate / summary.count).toFixed(2) : "0.00"}
            </span>
            <span className="ml-3">
              <em>{t("Cost Override")}:</em> {summary.sumCost.toFixed(2)}
            </span>
          </div>
        </div>
      );
    });
  } else if (config.showGroups) {
    // Group by group only
    const groupsMap = {};
    orderedTasks.forEach(([id, task]) => {
      const g = task.groupId.value;
      if (!groupsMap[g]) groupsMap[g] = [];
      groupsMap[g].push(id);
    });

    content = groupsOrder.map(groupId => {
      const tIDs = groupsMap[groupId];
      if (!tIDs) return null;

      const summary = calcSummary(
        tIDs,
        tasks,
        groups,
        phases,
        config.globalCost
      );

      return (
        <div key={groupId} className="border rounded p-3 mb-4">
          <h4>
            {t("Group")}:{" "}
            {groups[groupId] && groups[groupId].name ? groups[groupId].name : groupId}
            {groups[groupId] && groups[groupId].description && (
              <div className="text-muted small">
                {groups[groupId].description}
              </div>
            )}
            {groups[groupId] && groups[groupId].includeInComputation === false && (
              <span className="text-danger"> ({t("Ignored")})</span>
            )}
          </h4>

          {tIDs.map(tid => (
            <TaskRow key={tid} taskID={tid} />
          ))}

          <div className="border-top pt-2 mt-2 small text-muted">
            <strong>{t("Group Summary")}:</strong>{" "}
            <span className="ml-3">
              <em>{t("Best Case")}:</em> {summary.sumBest.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Most Likely")}:</em> {summary.sumLikely.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Worst Case")}:</em> {summary.sumWorst.toFixed(2)}
            </span>
            <span className="ml-3">
              <em>{t("Estimate")}:</em>{" "}
              {summary.count > 0 ? (summary.sumEstimate / summary.count).toFixed(2) : "0.00"}
            </span>
            <span className="ml-3">
              <em>{t("Cost Override")}:</em> {summary.sumCost.toFixed(2)}
            </span>
          </div>
        </div>
      );
    });
  } else {
    // No grouping => Just list tasks
    content = orderedTasks.map(([tid]) => (
      <TaskRow key={tid} taskID={tid} />
    ));
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

const mapStateToProps = state => ({
  tasks: state.tasks.tasks,
  tasksOrder: state.tasks.tasksOrder,
  config: state.config,
  groups: state.groups.groups,
  groupsOrder: state.groups.groupsOrder,
  phases: state.phases.phases,
  phasesOrder: state.phases.phasesOrder
});

const mapDispatchToProps = dispatch => ({
  addTaskWithPhaseGroup: (phaseId, groupId) =>
    dispatch(addTaskWithPhaseGroup(phaseId, groupId)),
  clearAllTasks: () => dispatch(clearAllTasks())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
