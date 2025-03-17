import React, { useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { exportJSON } from "../exporters/jsonExporter";
import { exportExcel } from "../exporters/excelExporter";
import { exportPDF } from "../exporters/pdfExporter";
import { encodeStateToUrl } from "../utils/stateUrl";

// Use unified LOAD_STATE action type from tasks
import { LOAD_STATE } from "../tasks/types";
import {
  SET_GLOBAL_COST,
  TOGGLE_GROUPS,
  TOGGLE_PHASES
} from "../config/types";
import {
  ADD_GROUP,
  EDIT_GROUP,
  MOVE_GROUP_DOWN,
  MOVE_GROUP_UP,
  REMOVE_GROUP
} from "../groups/types";
import {
  ADD_PHASE,
  EDIT_PHASE,
  MOVE_PHASE_DOWN,
  MOVE_PHASE_UP,
  REMOVE_PHASE
} from "../phases/types";

const Controls = ({ state, dispatch }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    exportJSON(state);
  };

  const handleLoad = event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const loadedState = JSON.parse(e.target.result);
        dispatch({ type: LOAD_STATE, state: loadedState });
      } catch (error) {
        console.error("Error loading state:", error);
        alert("Error loading JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportExcel = () => {
    exportExcel(state);
  };

  const handleExportPDF = () => {
    exportPDF(state);
  };

  // Global cost
  const handleGlobalCostChange = e => {
    dispatch({ type: SET_GLOBAL_COST, cost: parseFloat(e.target.value) || 0 });
  };

  // Group handlers
  const handleGroupNameChange = (groupId, value) => {
    dispatch({ type: EDIT_GROUP, id: groupId, updates: { name: value } });
  };

  const handleGroupDescChange = (groupId, value) => {
    dispatch({ type: EDIT_GROUP, id: groupId, updates: { description: value } });
  };

  const handleGroupCostChange = (groupId, value) => {
    dispatch({
      type: EDIT_GROUP,
      id: groupId,
      updates: { costOverride: value }
    });
  };

  const handleGroupIncludeChange = (groupId, value) => {
    dispatch({
      type: EDIT_GROUP,
      id: groupId,
      updates: { includeInComputation: value }
    });
  };

  const moveGroupUp = groupId => {
    dispatch({ type: MOVE_GROUP_UP, id: groupId });
  };
  const moveGroupDown = groupId => {
    dispatch({ type: MOVE_GROUP_DOWN, id: groupId });
  };

  // Phase handlers
  const handlePhaseNameChange = (phaseId, value) => {
    dispatch({ type: EDIT_PHASE, id: phaseId, updates: { name: value } });
  };

  const handlePhaseDescChange = (phaseId, value) => {
    dispatch({ type: EDIT_PHASE, id: phaseId, updates: { description: value } });
  };

  const handlePhaseCostChange = (phaseId, value) => {
    dispatch({
      type: EDIT_PHASE,
      id: phaseId,
      updates: { costOverride: value }
    });
  };

  const handlePhaseIncludeChange = (phaseId, value) => {
    dispatch({
      type: EDIT_PHASE,
      id: phaseId,
      updates: { includeInComputation: value }
    });
  };

  const movePhaseUp = phaseId => {
    dispatch({ type: MOVE_PHASE_UP, id: phaseId });
  };
  const movePhaseDown = phaseId => {
    dispatch({ type: MOVE_PHASE_DOWN, id: phaseId });
  };

  const { groups, groupsOrder } = state.groups;
  const { phases, phasesOrder } = state.phases;

  const currentUrl = window.location.origin + window.location.pathname;

  const copyToClipboard = (shareUrl) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Auto-hide notification after 2 sec
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  };

  const handleGenerateShareLink = () => {
    const encoded = encodeStateToUrl(state);
    const shareUrl = `${currentUrl}?sharedState=${encoded}`;
    copyToClipboard(shareUrl);
  };

  const handleGenerateShareLinkPDF = () => {
    const encoded = encodeStateToUrl(state);
    const shareUrl = `${currentUrl}?sharedState=${encoded}&download=pdf`;
    copyToClipboard(shareUrl);
  };

  const handleGenerateShareLinkExcel = () => {
    const encoded = encodeStateToUrl(state);
    const shareUrl = `${currentUrl}?sharedState=${encoded}&download=excel`;
    copyToClipboard(shareUrl);
  };

  return (
    <div>
      {/* Save/Load/Export Row */}
      <div className="form-row">
        <div className="col-md-3 mb-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-block"
            onClick={handleSave}
          >
            {t("Save")}
          </button>
        </div>
        <div className="col-md-3 mb-2">
          <input type="file" onChange={handleLoad} className="form-control" />
        </div>
        <div className="col-md-3 mb-2">
          <button
            type="button"
            className="btn btn-outline-success btn-block"
            onClick={handleExportExcel}
          >
            {t("Export to Excel")}
          </button>
        </div>
        <div className="col-md-3 mb-2">
          <button
            type="button"
            className="btn btn-outline-warning btn-block"
            onClick={handleExportPDF}
          >
            {t("Export to PDF")}
          </button>
        </div>
      </div>

      {/* Share Link Row */}
      <div>
      {/* Toast Notification */}
      <div className={`copy-toast ${copied ? "show" : ""}`}>
        {t("Link copied to clipboard!")}
      </div>

      {/* Share Link Row */}
      <div className="form-row">
        <div className="col-md-4 mb-2">
          <button
            type="button"
            className="btn btn-outline-info btn-block"
            onClick={handleGenerateShareLink}
          >
            {t("Generate Share Link")}
          </button>
        </div>
        <div className="col-md-4 mb-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-block"
            onClick={handleGenerateShareLinkPDF}
          >
            {t("Share Link with PDF Download")}
          </button>
        </div>
        <div className="col-md-4 mb-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-block"
            onClick={handleGenerateShareLinkExcel}
          >
            {t("Share Link with Excel Download")}
          </button>
        </div>
      </div>

      {/* Styles for toast notification */}
      <style>
        {`
          .copy-toast {
            position: fixed;
            z-index: 1000;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(40, 167, 69, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0px 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s ease, visibility 0.4s ease;
          }
          
          .copy-toast.show {
            opacity: 1;
            visibility: visible;
          }
        `}
      </style>
    </div>

      {/* Toggles */}
      <div className="form-row mb-3">
        <div className="col-md-6">
          <label className="mb-0">
            <input
              type="checkbox"
              className="mr-1"
              checked={state.config.showGroups}
              onChange={e =>
                dispatch({ type: TOGGLE_GROUPS, show: e.target.checked })
              }
            />
            {t("Show Groups")}
          </label>
        </div>
        <div className="col-md-6">
          <label className="mb-0">
            <input
              type="checkbox"
              className="mr-1"
              checked={state.config.showPhases}
              onChange={e =>
                dispatch({ type: TOGGLE_PHASES, show: e.target.checked })
              }
            />
            {t("Show Phases")}
          </label>
        </div>
      </div>

      {/* Global Cost Settings */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{t("Global Cost (EUR per hour)")}</h5>
          <div className="form-group mb-0">
            <input
              type="number"
              className="form-control"
              value={state.config.globalCost}
              onChange={handleGlobalCostChange}
            />
          </div>
        </div>
      </div>

      {/* Group Settings */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{t("Group Settings")}</h5>
          {groupsOrder.map(groupId => {
            const group = groups[groupId];
            return (
              <div key={group.id} className="form-row align-items-center mb-2">
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    value={group.name}
                    onChange={e =>
                      handleGroupNameChange(group.id, e.target.value)
                    }
                    placeholder={t("Task Name")}
                  />
                </div>
                {/* PHASE selection for this group */}
                <div className="col-md-2">
                  <select
                    className="form-control"
                    value={group.phaseId}
                    onChange={e =>
                      dispatch({
                        type: EDIT_GROUP,
                        id: group.id,
                        updates: { phaseId: e.target.value }
                      })
                    }
                  >
                    {phasesOrder.map(phaseId => {
                      const ph = phases[phaseId];
                      return (
                        <option key={phaseId} value={phaseId}>
                          {ph.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    value={group.description || ""}
                    onChange={e =>
                      handleGroupDescChange(group.id, e.target.value)
                    }
                    placeholder={t("Task Desc")}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={group.costOverride}
                    onChange={e =>
                      handleGroupCostChange(group.id, e.target.value)
                    }
                    placeholder={t("Rate Override")}
                  />
                </div>
                <div className="col-md-1 text-center">
                  <label className="mb-0 small">
                    <input
                      type="checkbox"
                      checked={group.includeInComputation}
                      onChange={e =>
                        handleGroupIncludeChange(group.id, e.target.checked)
                      }
                    />{" "}
                    {t("Include")}
                  </label>
                </div>
                <div className="col-md-1 text-right">
                  {group.id !== "default" && (
                    <div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mr-1"
                        onClick={() => moveGroupUp(group.id)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mr-2"
                        onClick={() => moveGroupDown(group.id)}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-md-2">
                  {group.id !== "default" && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-block"
                      onClick={() =>
                        dispatch({ type: REMOVE_GROUP, id: group.id })
                      }
                    >
                      {t("Remove")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className="btn btn-outline-primary btn-block"
            onClick={() => dispatch({ type: ADD_GROUP })}
          >
            {t("Add Group")}
          </button>
        </div>
      </div>

      {/* Phase Settings */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{t("Phase Settings")}</h5>
          {phasesOrder.map(phaseId => {
            const phase = phases[phaseId];
            return (
              <div key={phase.id} className="form-row align-items-center mb-2">
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    value={phase.name}
                    onChange={e =>
                      handlePhaseNameChange(phase.id, e.target.value)
                    }
                    placeholder={t("Task Name")}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    value={phase.description || ""}
                    onChange={e =>
                      handlePhaseDescChange(phase.id, e.target.value)
                    }
                    placeholder={t("Task Desc")}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={phase.costOverride}
                    onChange={e =>
                      handlePhaseCostChange(phase.id, e.target.value)
                    }
                    placeholder={t("Rate Override")}
                  />
                </div>
                <div className="col-md-1 text-center">
                  <label className="mb-0 small">
                    <input
                      type="checkbox"
                      checked={phase.includeInComputation}
                      onChange={e =>
                        handlePhaseIncludeChange(phase.id, e.target.checked)
                      }
                    />{" "}
                    {t("Include")}
                  </label>
                </div>
                <div className="col-md-2 text-right">
                  {phase.id !== "default" && (
                    <div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mr-1"
                        onClick={() => movePhaseUp(phase.id)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mr-2"
                        onClick={() => movePhaseDown(phase.id)}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-md-3">
                  {phase.id !== "default" && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-block"
                      onClick={() =>
                        dispatch({ type: REMOVE_PHASE, id: phase.id })
                      }
                    >
                      {t("Remove")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className="btn btn-outline-primary btn-block"
            onClick={() => dispatch({ type: ADD_PHASE })}
          >
            {t("Add Phase")}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({ state });
export default connect(mapStateToProps)(Controls);
