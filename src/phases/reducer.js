/**
 * @fileoverview Reducer for managing phases.
 */
import {
  ADD_PHASE,
  EDIT_PHASE,
  REMOVE_PHASE,
  TOGGLE_PHASE_VISIBILITY,
  LOAD_STATE,
  MOVE_PHASE_UP,
  MOVE_PHASE_DOWN,
} from "./types";

const initialState = {
  phases: {
    default: {
      id: "default",
      name: "Default Phase",
      costOverride: "",
      visible: true,
      description: "",
      includeInComputation: true,
    },
  },
  phasesOrder: ["default"],
  nextPhaseId: 1,
};

export default function phases(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PHASE: {
      const newId = "phase-" + state.nextPhaseId;
      return {
        ...state,
        phases: {
          ...state.phases,
          [newId]: {
            id: newId,
            name: "New Phase",
            costOverride: "",
            visible: true,
            description: "",
            includeInComputation: true,
          },
        },
        phasesOrder: [...state.phasesOrder, newId],
        nextPhaseId: state.nextPhaseId + 1,
      };
    }
    case EDIT_PHASE:
      return {
        ...state,
        phases: {
          ...state.phases,
          [action.id]: { ...state.phases[action.id], ...action.updates },
        },
      };
    case REMOVE_PHASE: {
      const { [action.id]: removed, ...remaining } = state.phases;
      return {
        ...state,
        phases: remaining,
        phasesOrder: state.phasesOrder.filter((pid) => pid !== action.id),
      };
    }
    case TOGGLE_PHASE_VISIBILITY:
      return {
        ...state,
        phases: {
          ...state.phases,
          [action.id]: { ...state.phases[action.id], visible: action.visible },
        },
      };
    case MOVE_PHASE_UP: {
      const index = state.phasesOrder.indexOf(action.id);
      if (index < 1) return state;
      const newOrder = [...state.phasesOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return { ...state, phasesOrder: newOrder };
    }
    case MOVE_PHASE_DOWN: {
      const index = state.phasesOrder.indexOf(action.id);
      if (index === -1 || index === state.phasesOrder.length - 1) return state;
      const newOrder = [...state.phasesOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return { ...state, phasesOrder: newOrder };
    }
    case LOAD_STATE:
      return action.state.phases || state;
    default:
      return state;
  }
}
