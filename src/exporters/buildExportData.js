import i18n from "../i18n";
import { calculateEstimate, calculateEffectiveCost } from "../tasks/templates";

export const buildExportData = state => {
  const { tasks } = state.tasks;
  const { groups } = state.groups;
  const { phases } = state.phases;
  const globalCost = state.config.globalCost;

  // Updated header: new column "Hourly Rate" after "Rate Override"
  const header = [
    i18n.t("ID"),
    i18n.t("Task Name"),
    i18n.t("Task Desc"),
    i18n.t("Best Case"),
    i18n.t("Most Likely"),
    i18n.t("Worst Case"),
    i18n.t("Estimate"),
    i18n.t("Rate Override"),
    i18n.t("Hourly Rate"),
    i18n.t("Group"),
    i18n.t("Group Desc"),
    i18n.t("Phase"),
    i18n.t("Phase Desc")
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
