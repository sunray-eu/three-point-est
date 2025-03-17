/**
 * @fileoverview Action creators for tasks.
 */
import * as types from "./types";

/**
 * Adds a new task with the given phase and group.
 *
 * @param {string} phaseId - Phase ID.
 * @param {string} groupId - Group ID.
 * @returns {Object} The action.
 */
export function addTaskWithPhaseGroup(phaseId, groupId) {
  return {
    type: types.ADD_TASK_WITH_PHASE_GROUP,
    phaseId,
    groupId,
  };
}

/**
 * Removes a task.
 *
 * @param {string} id - Task ID.
 * @returns {Object} The action.
 */
export function removeTask(id) {
  return {
    type: types.REMOVE_TASK,
    id,
  };
}

/**
 * Edits a task field.
 *
 * @param {string} id - Task ID.
 * @param {string} key - Field key.
 * @param {string} value - New value.
 * @returns {Object} The action.
 */
export function editTaskValue(id, key, value) {
  return {
    type: types.EDIT_TASK_VALUE,
    id,
    key,
    value,
  };
}

/**
 * Duplicates a task.
 *
 * @param {string} id - Task ID.
 * @returns {Object} The action.
 */
export function duplicateTask(id) {
  return {
    type: types.DUPLICATE_TASK,
    id,
  };
}

/**
 * Clears all tasks after user confirmation.
 *
 * @returns {Object} The action.
 */
export function clearAllTasks() {
  if (window.confirm("Are you sure you want to Remove All Tasks?")) {
    return {
      type: types.CLEAR_ALL_TASKS,
    };
  } else {
    return { type: "NOOP" };
  }
}
