import {
    ADD_GROUP,
    EDIT_GROUP,
    REMOVE_GROUP,
    TOGGLE_GROUP_VISIBILITY,
    LOAD_STATE,
    MOVE_GROUP_UP,
    MOVE_GROUP_DOWN
} from "./types";

const initialState = {
    groups: {
        default: {
            id: "default",
            name: "Default Group",
            costOverride: "",
            visible: true,
            description: "",
            phaseId: "default", // NEW
            includeInComputation: true // NEW: include in summary computations by default
        }
    },
    groupsOrder: ["default"],
    nextGroupId: 1
};

export default function groups(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_GROUP: {
            const newId = "group-" + state.nextGroupId;
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [newId]: {
                        id: newId,
                        name: "New Group",
                        costOverride: "",
                        visible: true,
                        description: "",
                        phaseId: "default", // by default
                        includeInComputation: true // NEW
                    }
                },
                groupsOrder: [...state.groupsOrder, newId],
                nextGroupId: state.nextGroupId + 1
            };
        }

        case EDIT_GROUP:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [action.id]: { ...state.groups[action.id], ...action.updates }
                }
            };

        case REMOVE_GROUP: {
            const { [action.id]: removed, ...remaining } = state.groups;
            return {
                ...state,
                groups: remaining,
                groupsOrder: state.groupsOrder.filter(gid => gid !== action.id)
            };
        }

        case TOGGLE_GROUP_VISIBILITY:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [action.id]: {
                        ...state.groups[action.id],
                        visible: action.visible
                    }
                }
            };

        case MOVE_GROUP_UP: {
            const index = state.groupsOrder.indexOf(action.id);
            if (index < 1) return state;
            const newOrder = [...state.groupsOrder];
            [newOrder[index - 1], newOrder[index]] = [
                newOrder[index],
                newOrder[index - 1]
            ];
            return {
                ...state,
                groupsOrder: newOrder
            };
        }

        case MOVE_GROUP_DOWN: {
            const index = state.groupsOrder.indexOf(action.id);
            if (index === -1 || index === state.groupsOrder.length - 1) return state;
            const newOrder = [...state.groupsOrder];
            [newOrder[index], newOrder[index + 1]] = [
                newOrder[index + 1],
                newOrder[index]
            ];
            return {
                ...state,
                groupsOrder: newOrder
            };
        }

        case LOAD_STATE:
            return action.state.groups || state;

        default:
            return state;
    }
}
