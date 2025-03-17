/**
 * @fileoverview Renders a single task row with editable fields, dropdowns, and action buttons.
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editTaskValue, removeTask, duplicateTask } from "./actions";
import { makeGetTask } from "./selectors";
import {
  calculateEstimate,
  calculateTaskTotalCost,
  getTaskRowFields,
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
  dispatch,
}) => {
  const { t } = useTranslation();
  const taskRowFields = getTaskRowFields(t);
  const renderFields = Object.keys(taskRowFields).filter(
    (field) => field !== "groupId" && field !== "phaseId"
  );

  const moveUp = () => dispatch({ type: MOVE_TASK_UP, id: taskID });
  const moveDown = () => dispatch({ type: MOVE_TASK_DOWN, id: taskID });

  const estimate = calculateEstimate(task).toFixed(2);
  const cost = calculateTaskTotalCost(task, groups, phases, config.globalCost).toFixed(2);

  /**
   * Handles phase change and auto-selects the first available group for that phase.
   *
   * @param {Object} e - Event object.
   */
  const handlePhaseChange = (e) => {
    const newPhaseId = e.target.value;
    editTask("phaseId", newPhaseId);
    const firstGroupId = Object.keys(groups).find(
      (gid) => groups[gid].phaseId === newPhaseId
    );
    if (firstGroupId) {
      editTask("groupId", firstGroupId);
    }
  };

  return (
    <div className="form-row align-items-center mb-2 border-bottom pb-2">
      {renderFields.map((field) => (
        <div key={field} className={`col-md-${taskRowFields[field].size}`}>
          <TextInput
            value={task[field].value}
            validationMessage={task[field].validationMessage}
            onChange={(e) => editTask(field, e.target.value)}
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
          value={task.groupId?.value || ""}
          onChange={(e) => editTask("groupId", e.target.value)}
        >
          <option value="">{t("None Group")}</option>
          {Object.keys(groups)
            .filter((gid) => groups[gid].phaseId === task.phaseId.value)
            .map((gid) => (
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
          {Object.keys(phases).map((pid) => (
            <option key={pid} value={pid}>
              {phases[pid].name}
            </option>
          ))}
        </select>
      </div>

      {/* Estimate */}
      <div className="col-md-1">
        <TextInput value={estimate} validationMessage="" onChange={() => {}} placeholder={t("Estimate")} disabled />
      </div>

      {/* Cost */}
      <div className="col-md-1">
        <TextInput value={cost} validationMessage="" onChange={() => {}} placeholder={t("Cost")} disabled />
      </div>

      {/* Reorder, Duplicate & Delete */}
      <div className="col-md-1 d-flex flex-column">
        <div className="mb-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary mr-1"
            onClick={moveUp}
            title={t("Move task up")}
          >
            ↑
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={moveDown}
            title={t("Move task down")}
          >
            ↓
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm btn-outline-info mr-1"
            onClick={() => duplicateTask(taskID)}
            title={t("Duplicate Task")}
          >
            {t("Duplicate")}
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={removeTask}
            title={t("Remove task")}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

TaskRow.propTypes = {
  taskID: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  phases: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  duplicateTask: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  return (state, props) => ({
    task: getTask(state, props),
    groups: state.groups.groups,
    phases: state.phases.phases,
    config: state.config,
  });
};

const mapDispatchToProps = (dispatch, props) => ({
  editTask: (key, value) => dispatch(editTaskValue(props.taskID, key, value)),
  removeTask: () => dispatch(removeTask(props.taskID)),
  duplicateTask: (id) => dispatch(duplicateTask(id)),
  dispatch,
});

export default connect(makeMapStateToProps, mapDispatchToProps)(TaskRow);
