import React from "react";
import { connect } from "react-redux";
import { editTaskValue, removeTask, duplicateTask } from "./actions";
import { makeGetTask } from "./selectors";
import {
  calculateEstimate,
  calculateTaskTotalCost,
  getTaskRowFields
} from "./templates";
import TextInput from "../common/TextInput";
import { MOVE_TASK_DOWN, MOVE_TASK_UP } from "./types";
import { useTranslation } from "react-i18next";

const TaskRow = ({
  taskID,
  task,
  groups,
  phases,
  config,
  editTask,
  removeTask,
  duplicateTask,
  dispatch
}) => {
  const { t } = useTranslation();
  const taskRowFields = getTaskRowFields(t);
  // We'll display groupId & phaseId as dropdowns, not from taskRowFields
  const renderFields = Object.keys(taskRowFields).filter(
    field => field !== "groupId" && field !== "phaseId"
  );

  const moveUp = () => dispatch({ type: MOVE_TASK_UP, id: taskID });
  const moveDown = () => dispatch({ type: MOVE_TASK_DOWN, id: taskID });

  const estimate = calculateEstimate(task).toFixed(2);
  const cost = calculateTaskTotalCost(task, groups, phases, config.globalCost).toFixed(2);

  const handlePhaseChange = (e) => {
    const newPhaseId = e.target.value;
    editTask("phaseId", newPhaseId);

    // Find the first group of the new phase
    const firstGroupId = Object.keys(groups).find(gid => groups[gid].phaseId === newPhaseId);
    if (firstGroupId) {
      editTask("groupId", firstGroupId);
    }
  };

  return (
    <div className="form-row align-items-center mb-2 border-bottom pb-2">
      {renderFields.map(field => (
        <div key={field} className={"col-md-" + taskRowFields[field].size}>
          <TextInput
            value={task[field].value}
            validationMessage={task[field].validationMessage}
            onChange={e => editTask(field, e.target.value)}
            placeholder={taskRowFields[field].placeholder}
            disabled={taskRowFields[field].disabled}
            type={taskRowFields[field].type}
          />
        </div>
      ))}

      {/* Group dropdown */}
      <div className="col-md-1">
        <select
          className="form-control form-control-sm"
          value={task.groupId && (groups[task.groupId.value]?.phaseId === task.phaseId.value) ? task.groupId.value : undefined}
          onChange={e => editTask("groupId", e.target.value)}
        >
          <option value="">{t("None Group")}</option>
          {Object.keys(groups)
            .filter(gid => groups[gid].phaseId === task.phaseId.value)
            .map(gid => (
              <option key={gid} value={gid}>
                {groups[gid].name}
              </option>
            ))}
        </select>
      </div>

      {/* Phase dropdown */}
      <div className="col-md-1">
        <select
          className="form-control form-control-sm"
          value={task.phaseId.value}
          onChange={handlePhaseChange}
        >
          {Object.keys(phases).map(pid => (
            <option key={pid} value={pid}>
              {phases[pid].name}
            </option>
          ))}
        </select>
      </div>

      {/* Estimate */}
      <div className="col-md-1">
        <TextInput
          value={estimate}
          validationMessage=""
          onChange={() => { }}
          placeholder="Estimate"
          disabled
        />
      </div>

      {/* Cost */}
      <div className="col-md-1">
        <TextInput
          value={cost}
          validationMessage=""
          onChange={() => { }}
          placeholder="Cost"
          disabled
        />
      </div>

      {/* Reorder, Duplicate + Delete */}
      <div className="col-md-1 d-flex flex-column">
        <div className="mb-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary mr-1"
            onClick={moveUp}
            title="Move task up"
          >
            ↑
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={moveDown}
            title="Move task down"
          >
            ↓
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm btn-outline-info mr-1"
            onClick={() => duplicateTask(taskID)}
            title="Duplicate Task"
          >
            Duplicate
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={removeTask}
            title="Remove task"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  return (state, props) => ({
    task: getTask(state, props),
    groups: state.groups.groups,
    phases: state.phases.phases,
    config: state.config
  });
};

const mapDispatchToProps = (dispatch, props) => ({
  editTask: (key, value) => dispatch(editTaskValue(props.taskID, key, value)),
  removeTask: () => dispatch(removeTask(props.taskID)),
  duplicateTask: id => dispatch(duplicateTask(id)),
  dispatch
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(TaskRow);
