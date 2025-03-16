import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { calculateEstimate, calculateEffectiveCost } from "../tasks/templates";
import "./charpentier-renaissance-normal";
import "./DejaVuSans-normal";

// --- Summary Calculation Helpers (similar to summaryCalculator.js) ---
const calcSummary = (tasksArr, groups, phases, globalCost) => {
  let sumBest = 0,
    sumLikely = 0,
    sumWorst = 0,
    sumCost = 0,
    sumEstimate = 0,
    count = 0;
  tasksArr.forEach(task => {
    const group = groups[task.groupId.value];
    const phase = phases[task.phaseId.value];
    if (
      (group && group.includeInComputation === false) ||
      (phase && phase.includeInComputation === false)
    ) {
      return;
    }
    const best = parseFloat(task.bestCase.value) || 0;
    const likely = parseFloat(task.mostLikely.value) || 0;
    const worst = parseFloat(task.worstCase.value) || 0;
    const estimate = (best + 4 * likely + worst) / 6;
    let effectiveCost = globalCost;
    if (task.costOverride.value !== "") {
      effectiveCost = parseFloat(task.costOverride.value);
    } else if (group && group.costOverride !== "") {
      effectiveCost = parseFloat(group.costOverride);
    } else if (phase && phase.costOverride !== "") {
      effectiveCost = parseFloat(phase.costOverride);
    }
    sumBest += best;
    sumLikely += likely;
    sumWorst += worst;
    sumEstimate += estimate;
    sumCost += estimate * effectiveCost;
    count++;
  });
  return { sumBest, sumLikely, sumWorst, sumCost, sumEstimate, count };
};

const computeSummaryData = state => {
  const tasksArr = Object.values(state.tasks.tasks);
  const { groups } = state.groups;
  const { phases, phasesOrder } = state.phases;
  const globalCost = state.config.globalCost;

  // Overall summary
  const overall = calcSummary(tasksArr, groups, phases, globalCost);
  overall.averageRate = overall.sumEstimate > 0 ? (overall.sumCost / overall.sumEstimate).toFixed(2) : "N/A";

  // Per Phase summary
  const phaseSummaries = phasesOrder.map(phaseId => {
    const phaseTasks = tasksArr.filter(task => task.phaseId.value === phaseId);
    const summary = calcSummary(phaseTasks, groups, phases, globalCost);
    summary.averageRate = summary.sumEstimate > 0 ? (summary.sumCost / summary.sumEstimate).toFixed(2) : "N/A";
    return {
      name: (phases[phaseId] && phases[phaseId].name) || phaseId,
      ...summary
    };
  });

  // Per Group summary
  const { groupsOrder, groups: groupsData } = state.groups;
  const groupSummaries = groupsOrder.map(groupId => {
    const groupTasks = tasksArr.filter(task => task.groupId.value === groupId);
    const summary = calcSummary(groupTasks, groups, phases, globalCost);
    summary.averageRate = summary.sumEstimate > 0 ? (summary.sumCost / summary.sumEstimate).toFixed(2) : "N/A";
    return {
      name: (groupsData[groupId] && groupsData[groupId].name) || groupId,
      ...summary
    };
  });

  return { overall, phaseSummaries, groupSummaries };
};

export const exportPDF = state => {
  // Use landscape orientation for more columns
  const doc = new jsPDF({ orientation: "landscape" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // --- Build Summary Page ---
  const { overall, phaseSummaries, groupSummaries } = computeSummaryData(state);

  // Set custom fonts if needed (assumes fonts are loaded)
  doc.setFont("DejaVuSans");
  doc.setFontSize(18);
  doc.text("Estimation Report Summary", margin, margin);
  let currentY = margin + 10;

  // Overall Summary table (with Avg Hourly Rate)
  const overallData = [
    ["Total Tasks", overall.count],
    ["Total Estimate", overall.sumEstimate.toFixed(2)],
    ["Total Cost (EUR)", overall.sumCost.toFixed(2)],
    ["Avg Estimate per Task", overall.count ? (overall.sumEstimate / overall.count).toFixed(2) : "0.00"],
    ["Avg Hourly Rate", overall.averageRate]
  ];
  autoTable(doc, {
    startY: currentY,
    head: [["Overall Summary", ""]],
    body: overallData,
    theme: "plain",
    styles: { fontSize: 10, font: "DejaVuSans" },
    headStyles: { fontSize: 12, fontStyle: "bold" },
    margin: { left: margin, right: margin }
  });
  currentY = doc.lastAutoTable.finalY + 8;

  // Per Phase Summary table with extra "Hourly Rate" column
  const phaseTableHeader = [
    "Phase",
    "Best Case",
    "Most Likely",
    "Worst Case",
    "Average",
    "Hourly Rate",
    "Cost",
    "Count"
  ];
  const phaseTableBody = phaseSummaries.map(item => [
    item.name,
    item.sumBest.toFixed(2),
    item.sumLikely.toFixed(2),
    item.sumWorst.toFixed(2),
    item.count ? (item.sumEstimate / item.count).toFixed(2) : "0.00",
    item.averageRate,
    item.sumCost.toFixed(2),
    item.count
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [phaseTableHeader],
    body: phaseTableBody,
    styles: { fontSize: 9, font: "DejaVuSans" },
    headStyles: { fillColor: [79, 129, 189], halign: "center" },
    margin: { left: margin, right: margin }
  });
  currentY = doc.lastAutoTable.finalY + 8;

  // Per Group Summary table with extra "Hourly Rate" column
  const groupTableHeader = [
    "Group",
    "Best Case",
    "Most Likely",
    "Worst Case",
    "Average",
    "Hourly Rate",
    "Cost",
    "Count"
  ];
  const groupTableBody = groupSummaries.map(item => [
    item.name,
    item.sumBest.toFixed(2),
    item.sumLikely.toFixed(2),
    item.sumWorst.toFixed(2),
    item.count ? (item.sumEstimate / item.count).toFixed(2) : "0.00",
    item.averageRate,
    item.sumCost.toFixed(2),
    item.count
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [groupTableHeader],
    body: groupTableBody,
    styles: { fontSize: 9, font: "DejaVuSans" },
    headStyles: { fillColor: [79, 129, 189], halign: "center" },
    margin: { left: margin, right: margin }
  });

  // --- Detailed Report: Grouped by Phase and Group ---
  doc.addPage();
  currentY = margin;
  const { phases, phasesOrder } = state.phases;
  const { groups } = state.groups;
  const tasksArr = Object.values(state.tasks.tasks);
  const globalCost = state.config.globalCost;

  phasesOrder.forEach(phaseId => {
    const phase = phases[phaseId];
    const phaseTasks = tasksArr.filter(task => task.phaseId.value === phaseId);
    if (!phaseTasks.length) return;

    const phaseHeaderHeight = 12;
    if (currentY + phaseHeaderHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
    doc.setFontSize(14);
    doc.text(`Phase: ${phase.name}`, margin, currentY);
    if (phase.description) {
      doc.setFontSize(10);
      doc.text(phase.description, margin, currentY + 5);
    }
    if (phase.includeInComputation === false) {
      doc.setTextColor(255, 0, 0);
      doc.text("(Ignored)", margin + 60, currentY);
      doc.setTextColor(0, 0, 0);
    }
    currentY += phaseHeaderHeight;

    // Group tasks by groupId
    const groupsMap = {};
    phaseTasks.forEach(task => {
      const groupId = task.groupId.value;
      if (!groupsMap[groupId]) groupsMap[groupId] = [];
      groupsMap[groupId].push(task);
    });
    const groupsOrder = state.groups.groupsOrder;
    groupsOrder.forEach(groupId => {
      if (!groupsMap[groupId]) return;
      const groupTasks = groupsMap[groupId];
      const groupHeaderHeight = 10;
      const tableHeaderHeight = 10;
      const rowHeight = 8;
      const estimatedTableHeight = tableHeaderHeight + rowHeight * groupTasks.length + 4;
      const estimatedGroupHeight = groupHeaderHeight + estimatedTableHeight;
      if (currentY + estimatedGroupHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }
      doc.setFontSize(12);
      doc.text(`Group: ${(groups[groupId] && groups[groupId].name) || groupId}`, margin, currentY);
      if (groups[groupId] && groups[groupId].description) {
        doc.setFontSize(10);
        doc.text(groups[groupId].description, margin, currentY + 5);
        currentY += 10;
      } else {
        currentY += 8;
      }
      if (groups[groupId] && groups[groupId].includeInComputation === false) {
        doc.setTextColor(255, 0, 0);
        doc.text("(Ignored)", margin + 50, currentY - 8);
        doc.setTextColor(0, 0, 0);
      }

      // Build table data for tasks in the group (including Hourly Rate)
      const tableHeader = [
        "ID",
        "Task Name",
        "Task Desc",
        "Best",
        "Likely",
        "Worst",
        "Estimate",
        "HR Override",
        "Hourly Rate",
        "Cost",
        "Group",
        "Phase",
      ];
      const tableData = groupTasks.map(task => {
        const grpObj = groups[task.groupId.value];
        const phObj = phases[task.phaseId.value];
        const effectiveRate = calculateEffectiveCost(task, groups, phases, globalCost).toFixed(2);
        const cost = (calculateEstimate(task) * effectiveRate).toFixed(2);
        return [
          task.id.value,
          task.taskName.value,
          task.taskDesc.value,
          task.bestCase.value,
          task.mostLikely.value,
          task.worstCase.value,
          calculateEstimate(task).toFixed(2),
          task.costOverride.value,
          effectiveRate,
          cost,
          (grpObj && grpObj.name) || task.groupId.value,
          (phObj && phObj.name) || task.phaseId.value,
        ];
      });
      autoTable(doc, {
        startY: currentY,
        head: [tableHeader],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 2, font: "DejaVuSans" },
        headStyles: { fillColor: [79, 129, 189], halign: "center" },
        theme: "grid",
        margin: { left: margin, right: margin },
        rowPageBreak: "avoid"
      });
      currentY = doc.lastAutoTable.finalY + 6;
    });
    currentY += 6;
  });

  doc.save("estimation_report.pdf");
};
