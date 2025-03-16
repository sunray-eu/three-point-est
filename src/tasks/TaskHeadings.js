import React from "react";
import { taskRowFields } from "./templates";

const TaskHeadings = () => (
  <div className="form-row border-bottom pb-2 mb-2">
    {Object.keys(taskRowFields).map(field => (
      <div key={field} className={"col-md-" + taskRowFields[field].size}>
        <small>{taskRowFields[field].placeholder.toUpperCase()}</small>
      </div>
    ))}
    {/* Estimate column */}
    <div className="col-md-1">
      <small>ESTIMATE</small>
    </div>
    {/* Cost column */}
    <div className="col-md-1">
      <small>COST</small>
    </div>
    {/* Reorder/Delete/Duplicate buttons (no heading) */}
    <div className="col-md-1" />
  </div>
);

export default TaskHeadings;
