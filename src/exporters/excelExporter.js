import * as XLSX from "xlsx";
import { buildExportData } from "./buildExportData";
import {
  computeOverallSummary,
  computePhaseSummaries,
  computeGroupSummaries
} from "./summaryCalculator";
import i18n from "../i18n";

export const exportExcel = state => {
  // Build Tasks sheet (including Hourly Rate column)
  const { header, rows } = buildExportData(state);
  const tasksData = [header, ...rows];
  const wsTasks = XLSX.utils.aoa_to_sheet(tasksData);
  wsTasks["!cols"] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 }
  ];
  // Style header row
  const range = XLSX.utils.decode_range(wsTasks["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
    if (wsTasks[cellRef]) {
      wsTasks[cellRef].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
  }

  // Build Summary sheet
  const overall = computeOverallSummary(state);
  const phaseSummaries = computePhaseSummaries(state);
  const groupSummaries = computeGroupSummaries(state);

  // Overall Summary table (key-value pairs) with Avg Hourly Rate
  const overallTable = [
    [i18n.t("Overall Summary")],
    [i18n.t("Total Tasks"), overall.count],
    [i18n.t("Total Estimate"), overall.sumEstimate.toFixed(2)],
    [i18n.t("Total Cost (EUR)"), overall.sumCost.toFixed(2)],
    [i18n.t("Avg Estimate per Task"), overall.count ? (overall.sumEstimate / overall.count).toFixed(2) : "0.00"],
    [i18n.t("Avg Hourly Rate"), overall.averageRate]
  ];

  // Per Phase Summary table: add new column "Hourly Rate"
  const phaseHeader = [
    i18n.t("Phase"),
    i18n.t("Best Case"),
    i18n.t("Most Likely"),
    i18n.t("Worst Case"),
    i18n.t("Estimate"),
    i18n.t("Hourly Rate"),
    i18n.t("Cost Override"),
    i18n.t("Total Tasks")
  ];
  const phaseRows = phaseSummaries.map(item => [
    item.phaseName,
    item.sumBest.toFixed(2),
    item.sumLikely.toFixed(2),
    item.sumWorst.toFixed(2),
    item.count ? (item.sumEstimate / item.count).toFixed(2) : "0.00",
    item.averageRate,
    item.sumCost.toFixed(2),
    item.count
  ]);
  const phaseTable = [[i18n.t("Per Phase Summary")], phaseHeader, ...phaseRows];

  // Per Group Summary table: add new column "Hourly Rate"
  const groupHeader = [
    i18n.t("Group"),
    i18n.t("Best Case"),
    i18n.t("Most Likely"),
    i18n.t("Worst Case"),
    i18n.t("Estimate"),
    i18n.t("Hourly Rate"),
    i18n.t("Cost Override"),
    i18n.t("Total Tasks")
  ];
  const groupRows = groupSummaries.map(item => [
    item.groupName,
    item.sumBest.toFixed(2),
    item.sumLikely.toFixed(2),
    item.sumWorst.toFixed(2),
    item.count ? (item.sumEstimate / item.count).toFixed(2) : "0.00",
    item.averageRate,
    item.sumCost.toFixed(2),
    item.count
  ]);
  const groupTable = [[i18n.t("Per Group Summary")], groupHeader, ...groupRows];

  // Combine summary tables into one sheet with blank rows between
  const summaryData = [
    ...overallTable,
    [],
    ...phaseTable,
    [],
    ...groupTable
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 }
  ];

  // Create workbook and add sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsTasks, i18n.t("Tasks"));
  XLSX.utils.book_append_sheet(wb, wsSummary, i18n.t("Summary"));
  XLSX.writeFile(wb, "tasks.xlsx", { bookType: "xlsx", cellStyles: true });
};
