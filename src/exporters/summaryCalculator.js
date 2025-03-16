/**
 * Helper to calculate summary for a given list of tasks.
 * Tasks whose associated group or phase are marked as not included are skipped.
 */
function calcSummary(tasksArr, groups, phases, globalCost) {
  let sumBest = 0,
    sumLikely = 0,
    sumWorst = 0,
    sumCost = 0,
    sumEstimate = 0,
    count = 0;

  tasksArr.forEach(task => {
    const group = groups[task.groupId.value];
    const phase = phases[task.phaseId.value];
    if (
      (group && group.includeInComputation === false) ||
      (phase && phase.includeInComputation === false)
    ) {
      return;
    }
    const best = parseFloat(task.bestCase.value) || 0;
    const likely = parseFloat(task.mostLikely.value) || 0;
    const worst = parseFloat(task.worstCase.value) || 0;
    const estimate = (best + 4 * likely + worst) / 6;
    // Effective cost (hourly rate) calculation is done in calculateEffectiveCost, but here we assume cost = estimate * rate
    let effectiveCost = globalCost;
    if (task.costOverride.value !== "") {
      effectiveCost = parseFloat(task.costOverride.value);
    } else if (group && group.costOverride !== "") {
      effectiveCost = parseFloat(group.costOverride);
    } else if (phase && phase.costOverride !== "") {
      effectiveCost = parseFloat(phase.costOverride);
    }
    sumBest += best;
    sumLikely += likely;
    sumWorst += worst;
    sumEstimate += estimate;
    sumCost += estimate * effectiveCost;
    count++;
  });
  return { sumBest, sumLikely, sumWorst, sumCost, sumEstimate, count };
};

export const computeOverallSummary = state => {
  const tasksArr = Object.values(state.tasks.tasks);
  const { groups } = state.groups;
  const { phases } = state.phases;
  const globalCost = state.config.globalCost;
  const overall = calcSummary(tasksArr, groups, phases, globalCost);
  overall.averageRate = overall.sumEstimate > 0 ? (overall.sumCost / overall.sumEstimate).toFixed(2) : "N/A";
  return overall;
};

export const computePhaseSummaries = state => {
  const tasksArr = Object.values(state.tasks.tasks);
  const { groups } = state.groups;
  const { phases, phasesOrder } = state.phases;
  const globalCost = state.config.globalCost;
  const phaseSummaries = phasesOrder.map(phaseId => {
    const phaseTasks = tasksArr.filter(task => task.phaseId.value === phaseId);
    const summary = calcSummary(phaseTasks, groups, phases, globalCost);
    summary.averageRate = summary.sumEstimate > 0 ? (summary.sumCost / summary.sumEstimate).toFixed(2) : "N/A";
    return {
      phaseName: (phases[phaseId] && phases[phaseId].name) || phaseId,
      ...summary
    };
  });
  return phaseSummaries;
};

export const computeGroupSummaries = state => {
  const tasksArr = Object.values(state.tasks.tasks);
  const { groups, groupsOrder } = state.groups;
  const { phases } = state.phases;
  const globalCost = state.config.globalCost;
  const groupSummaries = groupsOrder.map(groupId => {
    const groupTasks = tasksArr.filter(task => task.groupId.value === groupId);
    const summary = calcSummary(groupTasks, groups, phases, globalCost);
    summary.averageRate = summary.sumEstimate > 0 ? (summary.sumCost / summary.sumEstimate).toFixed(2) : "N/A";
    return {
      groupName: (groups[groupId] && groups[groupId].name) || groupId,
      ...summary
    };
  });
  return groupSummaries;
};
