import * as types from "./types";

export function addTaskWithPhaseGroup(phaseId, groupId) {
  return {
    type: types.ADD_TASK_WITH_PHASE_GROUP,
    phaseId,
    groupId
  };
}

export function removeTask(id) {
  return {
    type: types.REMOVE_TASK,
    id
  };
}

export function editTaskValue(id, key, value) {
  return {
    type: types.EDIT_TASK_VALUE,
    id,
    key,
    value
  };
}

export function duplicateTask(id) {
  return {
    type: types.DUPLICATE_TASK,
    id
  };
}

export function clearAllTasks() {
  if (window.confirm("Are you sure you want to Remove All Tasks?")) {
    return {
      type: types.CLEAR_ALL_TASKS
    };
  } else {
    return { type: "NOOP" };
  }
}
