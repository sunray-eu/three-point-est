const field = (value, type) => ({
  value,
  type,
  validationMessage: ""
});

export const inputTypes = {
  STRING: {
    validation: /^.+$/,
    errorMessage: "Field is expected to be not empty"
  },
  NUMBER: {
    validation: /^[0-9.]*$/,
    errorMessage: "Field is expected to be numeric (or empty for default)"
  }
};

export const taskTemplate = id => ({
  id: field(id, "STRING"),
  taskName: field("Task " + id, "STRING"),
  bestCase: field(0, "NUMBER"),
  mostLikely: field(0, "NUMBER"),
  worstCase: field(0, "NUMBER"),
  costOverride: field("", "NUMBER"), // if left empty, uses group/phase/global cost
  groupId: field("default", "STRING"),
  phaseId: field("default", "STRING"),
  // NEW: Description
  taskDesc: field("", "STRING")
});

// Update headings to include new fields
export const getTaskRowFields = (t) => ({
  id: { placeholder: t("ID"), size: "1", disabled: true },
  taskName: { placeholder: t("Task Name"), size: "2" },
  taskDesc: { placeholder: t("Description"), size: "2" },
  bestCase: { placeholder: t("Best Case"), size: "1", type: "number" },
  mostLikely: { placeholder: t("Most Likely"), size: "1", type: "number" },
  worstCase: { placeholder: t("Worst Case"), size: "1", type: "number" },
  costOverride: { placeholder: t("Cost (EUR)"), size: "1", type: "number" },
  groupId: { placeholder: t("Group"), size: "1" },
  phaseId: { placeholder: t("Phase"), size: "1" }
});

export const calculateEstimate = task =>
  (parseFloat(task.bestCase.value) +
    parseFloat(task.mostLikely.value) * 4 +
    parseFloat(task.worstCase.value)) /
  6.0;

export const calculateEffectiveCost = (task, groups, phases, globalCost) => {
  if (task.costOverride.value !== "") {
    return parseFloat(task.costOverride.value);
  }
  const group = groups[task.groupId.value];
  if (group && group.costOverride !== "") {
    return parseFloat(group.costOverride);
  }
  const phase = phases[task.phaseId.value];
  if (phase && phase.costOverride !== "") {
    return parseFloat(phase.costOverride);
  }
  return globalCost;
};

export const calculateTaskTotalCost = (task, groups, phases, globalCost) => {
  const estimate = calculateEstimate(task);
  const rate = calculateEffectiveCost(task, groups, phases, globalCost);
  return estimate * rate;
};
