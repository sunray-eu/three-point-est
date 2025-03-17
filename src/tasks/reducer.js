import * as types from "./types";
import { taskTemplate, inputTypes } from "./templates";

const initialState = {
  nextID: 2,
  tasks: {
    "1": taskTemplate("1")
  },
  tasksOrder: ["1"]
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_TASK:
    case types.ADD_TASK_WITH_PHASE_GROUP: {
      const newId = state.nextID.toString();
      const newTask = taskTemplate(newId);
      // set the chosen phase/group
      newTask.phaseId.value = action.phaseId;
      newTask.groupId.value = action.groupId;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [newId]: newTask
        },
        tasksOrder: [...state.tasksOrder, newId],
        nextID: state.nextID + 1
      };
    }

    case types.REMOVE_TASK: {
      const { [action.id]: value, ...tasks } = state.tasks;
      return {
        ...state,
        tasks,
        tasksOrder: state.tasksOrder.filter(tid => tid !== action.id)
      };
    }

    case types.CLEAR_ALL_TASKS:
      return initialState;

    case types.EDIT_TASK_VALUE: {
      const currentValue = state.tasks[action.id][action.key];
      const currentInputType = currentValue && inputTypes[currentValue.type];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.id]: {
            ...state.tasks[action.id],
            ...(action.key == "phaseId" ? {groupId: undefined}  :{}),
            [action.key]: {
              ...currentValue,
              value: action.value,
              validationMessage: currentInputType ? (currentInputType.validation.test(action.value)
                ? ""
                : currentInputType.errorMessage) : ""
            }
          }
        }
      };
    }

    case types.MOVE_TASK_UP: {
      const index = state.tasksOrder.indexOf(action.id);
      if (index < 1) return state;
      const newOrder = [...state.tasksOrder];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1]
      ];
      return { ...state, tasksOrder: newOrder };
    }

    case types.MOVE_TASK_DOWN: {
      const index = state.tasksOrder.indexOf(action.id);
      if (index === -1 || index === state.tasksOrder.length - 1) return state;
      const newOrder = [...state.tasksOrder];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index]
      ];
      return { ...state, tasksOrder: newOrder };
    }

    case types.DUPLICATE_TASK: {
      const original = state.tasks[action.id];
      const newId = state.nextID.toString();
      // Deep copy the task (simple JSON method suffices here)
      const newTask = JSON.parse(JSON.stringify(original));
      newTask.id.value = newId;
      newTask.taskName.value = "Copy of " + original.taskName.value;
      // Insert new task immediately after the original task in tasksOrder.
      const index = state.tasksOrder.indexOf(action.id);
      const newTasksOrder = [...state.tasksOrder];
      newTasksOrder.splice(index + 1, 0, newId);
      return {
        ...state,
        tasks: { ...state.tasks, [newId]: newTask },
        tasksOrder: newTasksOrder,
        nextID: state.nextID + 1
      };
    }

    case types.LOAD_STATE:
      return action.state.tasks || state;

    default:
      return state;
  }
}
