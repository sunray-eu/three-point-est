/**
 * @fileoverview Exports the current state as a JSON file.
 */

/**
 * Exports the given state as a JSON file.
 *
 * @param {Object} state - The current app state.
 */
export const exportJSON = (state) => {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.config.projectName}_state.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting JSON:", error);
    alert("Error exporting state to JSON.");
  }
};
