import { calculateEstimate, calculateEffectiveCost } from "../tasks/templates";

export const buildExportData = state => {
  const { tasks } = state.tasks;
  const { groups } = state.groups;
  const { phases } = state.phases;
  const globalCost = state.config.globalCost;

  // Updated header: new column "Hourly Rate" after "Cost Override"
  const header = [
    "ID",
    "Task Name",
    "Task Desc",
    "Best Case",
    "Most Likely",
    "Worst Case",
    "Estimate",
    "Cost Override",
    "Hourly Rate",
    "Group",
    "Group Desc",
    "Phase",
    "Phase Desc"
  ];

  const rows = Object.values(tasks).map(task => {
    const groupObj = groups[task.groupId.value];
    const phaseObj = phases[task.phaseId.value];
    const effectiveRate = calculateEffectiveCost(task, groups, phases, globalCost).toFixed(2);
    return [
      task.id.value,
      task.taskName.value,
      task.taskDesc.value,
      task.bestCase.value,
      task.mostLikely.value,
      task.worstCase.value,
      calculateEstimate(task).toFixed(2),
      task.costOverride.value,
      effectiveRate,
      (groupObj && groupObj.name) || task.groupId.value,
      (groupObj && groupObj.description) || "",
      (phaseObj && phaseObj.name) || task.phaseId.value,
      (phaseObj && phaseObj.description) || ""
    ];
  });

  return { header, rows };
};
