/**
 * @fileoverview Exports the current state as a PDF report.
 * Reuses summary functions from summaryCalculator.js and helper functions to add tables.
 */
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import i18n from "../i18n";
import { calculateEstimate, calculateEffectiveCost } from "../tasks/templates";
import {
  computeOverallSummary,
  computePhaseSummaries,
  computeGroupSummaries,
} from "./summaryCalculator";
import "./charpentier-renaissance-normal";
import "./DejaVuSans-normal";

const addSummaryTable = (doc, startY, header, body, margin) => {
  autoTable(doc, {
    startY,
    head: [header],
    body,
    styles: { fontSize: 9, font: "DejaVuSans" },
    headStyles: { fillColor: [79, 129, 189], halign: "center", font: "DejaVuSans" },
    margin: { left: margin, right: margin },
  });
  return doc.lastAutoTable.finalY + 8;
};

const addDetailTable = (doc, startY, header, body, margin) => {
  autoTable(doc, {
    startY,
    head: [header],
    body,
    styles: { fontSize: 8, cellPadding: 2, font: "DejaVuSans" },
    headStyles: { fillColor: [79, 129, 189], halign: "center", font: "DejaVuSans" },
    theme: "grid",
    margin: { left: margin, right: margin },
    rowPageBreak: "avoid",
  });
  return doc.lastAutoTable.finalY + 6;
};

export const exportPDF = (state) => {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const overall = computeOverallSummary(state);
  const phaseSummaries = computePhaseSummaries(state);
  const groupSummaries = computeGroupSummaries(state);

  doc.setFont("DejaVuSans");
  doc.setFontSize(18);
  // Main header
  doc.text(i18n.t("Estimation Report Summary"), margin, margin);
  
  // Add project name just below the main header
  doc.setFontSize(12);
  doc.text(`${i18n.t('Project')}: ${state.config.projectName}`, margin, margin + 8);

  let currentY = margin + 16; // Adjust starting Y to account for project name

  const overallData = [
    [i18n.t("Total Tasks"), overall.count],
    [i18n.t("Total Estimate"), overall.sumEstimate.toFixed(2)],
    [i18n.t("Total Cost"), overall.sumCost.toFixed(2)],
    [
      i18n.t("Avg Estimate per Task"),
      overall.count ? (overall.sumEstimate / overall.count).toFixed(2) : "0.00",
    ],
    [i18n.t("Avg Hourly Rate"), overall.averageRate],
  ];
  autoTable(doc, {
    startY: currentY,
    head: [[i18n.t("Overall Summary"), ""]],
    body: overallData,
    theme: "plain",
    styles: { fontSize: 10, font: "DejaVuSans" },
    headStyles: { fontSize: 12, fontStyle: "bold", font: "DejaVuSans" },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 8;

  const phaseTableHeader = [
    i18n.t("Phase"),
    i18n.t("Best Case Sum"),
    i18n.t("Most Likely Sum"),
    i18n.t("Worst Case Sum"),
    i18n.t("Estimate Sum"),
    i18n.t("Average Estimate"),
    i18n.t("Average Hourly Rate"),
    i18n.t("Rate Override"),
    i18n.t("Total Cost"),
    i18n.t("Total Tasks"),
  ];
  const phaseTableBody = phaseSummaries.map((item) => [
    item.phaseName,
    item.sumBest.toFixed(2),
    item.sumLikely.toFixed(2),
    item.sumWorst.toFixed(2),
    item.sumEstimate.toFixed(2),
    item.count ? (item.sumEstimate / item.count).toFixed(2) : "0.00",
    item.averageRate,
    item.costOverride,
    item.sumCost.toFixed(2),
    item.count,
  ]);
  currentY = addSummaryTable(doc, currentY, phaseTableHeader, phaseTableBody, margin);

  const groupTableHeader = [
    i18n.t("Group"),
    i18n.t("Best Case Sum"),
    i18n.t("Most Likely Sum"),
    i18n.t("Worst Case Sum"),
    i18n.t("Estimate Sum"),
    i18n.t("Average Estimate"),
    i18n.t("Average Hourly Rate"),
    i18n.t("Rate Override"),
    i18n.t("Total Cost"),
    i18n.t("Total Tasks"),
  ];
  const groupTableBody = groupSummaries.map((item) => [
    item.groupName,
    item.sumBest.toFixed(2),
    item.sumLikely.toFixed(2),
    item.sumWorst.toFixed(2),
    item.sumEstimate.toFixed(2),
    item.count ? (item.sumEstimate / item.count).toFixed(2) : "0.00",
    item.averageRate,
    item.costOverride,
    item.sumCost.toFixed(2),
    item.count,
  ]);
  currentY = addSummaryTable(doc, currentY, groupTableHeader, groupTableBody, margin);

  doc.addPage();
  currentY = margin;
  const { phases, phasesOrder } = state.phases;
  const { groups } = state.groups;
  const tasksArr = Object.values(state.tasks.tasks);
  const globalCost = state.config.globalCost;

  phasesOrder.forEach((phaseId) => {
    const phase = phases[phaseId];
    const phaseTasks = tasksArr.filter((task) => task.phaseId.value === phaseId);
    if (!phaseTasks.length) return;
    const phaseHeaderHeight = 12;
    if (currentY + phaseHeaderHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
    doc.setFontSize(14);
    doc.text(`${i18n.t("Phase")}: ${phase.name}`, margin, currentY);
    if (phase.description) {
      doc.setFontSize(10);
      doc.text(phase.description, margin, currentY + 5);
    }
    if (phase.includeInComputation === false) {
      doc.setTextColor(255, 0, 0);
      doc.text(`(${i18n.t("Ignored")})`, margin + 60, currentY);
      doc.setTextColor(0, 0, 0);
    }
    currentY += phaseHeaderHeight;

    const groupsMap = {};
    phaseTasks.forEach((task) => {
      const groupId = task.groupId.value;
      groupsMap[groupId] = groupsMap[groupId] || [];
      groupsMap[groupId].push(task);
    });
    const groupsOrder = state.groups.groupsOrder;
    groupsOrder.forEach((groupId) => {
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
      doc.text(`${i18n.t("Group")}: ${groups[groupId]?.name || groupId}`, margin, currentY);
      if (groups[groupId]?.description) {
        doc.setFontSize(10);
        doc.text(groups[groupId].description, margin, currentY + 5);
        currentY += 10;
      } else {
        currentY += 8;
      }
      if (groups[groupId]?.includeInComputation === false) {
        doc.setTextColor(255, 0, 0);
        doc.text(`(${i18n.t("Ignored")})`, margin + 50, currentY - 8);
        doc.setTextColor(0, 0, 0);
      }
      const tableHeader = [
        i18n.t("ID"),
        i18n.t("Task Name"),
        i18n.t("Task Desc"),
        i18n.t("Best Case"),
        i18n.t("Most Likely"),
        i18n.t("Worst Case"),
        i18n.t("Estimate"),
        i18n.t("Rate Override"),
        i18n.t("Hourly Rate"),
        i18n.t("Cost"),
      ];
      const tableData = groupTasks.map((task) => {
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
        ];
      });
      currentY = addDetailTable(doc, currentY, tableHeader, tableData, margin);
    });
    currentY += 6;
  });

  doc.save(`${state.config.projectName}_estimation_report.pdf`);
};
