/**
 * @fileoverview Combines all reducers.
 */
import { combineReducers } from "redux";

import tasks from "./tasks/reducer";
import config from "./config/reducer";
import groups from "./groups/reducer";
import phases from "./phases/reducer";

export default combineReducers({
  tasks,
  config,
  groups,
  phases,
});
