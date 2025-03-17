/**
 * @fileoverview Contains templates, input types, and helper functions for task calculations.
 */

/**
 * Returns a field object.
 *
 * @param {*} value - The initial value.
 * @param {string} type - The type of field.
 * @returns {Object} Field object.
 */
const field = (value, type) => ({
  value,
  type,
  validationMessage: "",
});

/**
 * Input type definitions.
 */
export const inputTypes = {
  STRING: {
    validation: /^.+$/,
    errorMessage: "Field is expected to be not empty",
  },
  NUMBER: {
    validation: /^[0-9.]*$/,
    errorMessage: "Field is expected to be numeric (or empty for default)",
  },
};

/**
 * Template for creating a new task.
 *
 * @param {string} id - Task ID.
 * @returns {Object} New task object.
 */
export const taskTemplate = (id) => ({
  id: field(id, "STRING"),
  taskName: field("Task " + id, "STRING"),
  bestCase: field(0, "NUMBER"),
  mostLikely: field(0, "NUMBER"),
  worstCase: field(0, "NUMBER"),
  costOverride: field("", "NUMBER"),
  groupId: field("default", "STRING"),
  phaseId: field("default", "STRING"),
  taskDesc: field("", "STRING"),
});

/**
 * Returns the field definitions for a task row.
 *
 * @param {Function} t - Translation function.
 * @returns {Object} Field definitions.
 */
export const getTaskRowFields = (t) => ({
  taskName: { placeholder: t("Task Name"), size: "2" },
  taskDesc: { placeholder: t("Description"), size: "2" },
  bestCase: { placeholder: t("Best Case"), size: "1", type: "number" },
  mostLikely: { placeholder: t("Most Likely"), size: "1", type: "number" },
  worstCase: { placeholder: t("Worst Case"), size: "1", type: "number" },
  costOverride: { placeholder: t("Hourly Rate"), size: "1", type: "number" },
  groupId: { placeholder: t("Group"), size: "1" },
  phaseId: { placeholder: t("Phase"), size: "1" },
});

/**
 * Calculates the weighted estimate for a task.
 *
 * @param {Object} task - Task object.
 * @returns {number} The estimate.
 */
export const calculateEstimate = (task) =>
  (parseFloat(task.bestCase.value) +
    parseFloat(task.mostLikely.value) * 4 +
    parseFloat(task.worstCase.value)) /
  6.0;

/**
 * Calculates the effective hourly rate for a task.
 *
 * @param {Object} task - Task object.
 * @param {Object} groups - Groups keyed by their IDs.
 * @param {Object} phases - Phases keyed by their IDs.
 * @param {number} globalCost - Global hourly cost.
 * @returns {number} The effective cost.
 */
export const calculateEffectiveCost = (task, groups, phases, globalCost) => {
  if (task.costOverride.value !== "") {
    return parseFloat(task.costOverride.value);
  }
  const group = task.groupId && groups[task.groupId.value];
  if (group && group.costOverride !== "") {
    return parseFloat(group.costOverride);
  }
  const phase = phases[task.phaseId.value];
  if (phase && phase.costOverride !== "") {
    return parseFloat(phase.costOverride);
  }
  return globalCost;
};

/**
 * Calculates the total cost for a task.
 *
 * @param {Object} task - Task object.
 * @param {Object} groups - Groups keyed by their IDs.
 * @param {Object} phases - Phases keyed by their IDs.
 * @param {number} globalCost - Global hourly cost.
 * @returns {number} The total cost.
 */
export const calculateTaskTotalCost = (task, groups, phases, globalCost) => {
  const estimate = calculateEstimate(task);
  const rate = calculateEffectiveCost(task, groups, phases, globalCost);
  return estimate * rate;
};
