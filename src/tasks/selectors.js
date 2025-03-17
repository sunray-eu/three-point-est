/**
 * @fileoverview Selector functions for tasks.
 */
import { createSelector } from "reselect";

/**
 * Retrieves a task by taskID.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} props - Component props containing taskID.
 * @returns {Object} The task.
 */
const getTask = (state, props) => state.tasks.tasks[props.taskID];

/**
 * Creates a memoized selector for a task.
 *
 * @returns {Function} The selector.
 */
export const makeGetTask = () => createSelector([getTask], (task) => task);
