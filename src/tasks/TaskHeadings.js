import React from "react";
import { getTaskRowFields } from "./templates";
import { useTranslation } from "react-i18next";

const TaskHeadings = () => {
    const { t } = useTranslation();
    const taskRowFields = getTaskRowFields(t);
  
  return (
  <div className="form-row border-bottom pb-2 mb-2">
    {Object.keys(taskRowFields).map(field => (
      <div key={field} className={"col-md-" + taskRowFields[field].size}>
        <small>{taskRowFields[field].placeholder.toUpperCase()}</small>
      </div>
    ))}
    {/* Estimate column */}
    <div className="col-md-1">
      <small>{t('Estimate').toUpperCase()}</small>
    </div>
    {/* Cost column */}
    <div className="col-md-1">
      <small>{t('Cost').toUpperCase()}</small>
    </div>
    {/* Reorder/Delete/Duplicate buttons (no heading) */}
    <div className="col-md-1" />
  </div>
)};

export default TaskHeadings;
