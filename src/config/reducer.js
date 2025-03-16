import { SET_GLOBAL_COST, TOGGLE_GROUPS, TOGGLE_PHASES, LOAD_STATE } from "./types";
import { defaultConfig } from "./config";

export default function config(state = defaultConfig, action = {}) {
  switch (action.type) {
    case SET_GLOBAL_COST:
      return { ...state, globalCost: action.cost };
    case TOGGLE_GROUPS:
      return { ...state, showGroups: action.show };
    case TOGGLE_PHASES:
      return { ...state, showPhases: action.show };
    case LOAD_STATE:
      return action.state.config || state;
    default:
      return state;
  }
}
