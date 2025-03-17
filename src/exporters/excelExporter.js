/**
 * @fileoverview Exports the current state into an Excel file.
 */
import ExcelJS from "exceljs";
import { buildExportData } from "./buildExportData";
import {
  computeOverallSummary,
  computePhaseSummaries,
  computeGroupSummaries,
} from "./summaryCalculator";
import i18n from "../i18n";

/**
 * Exports the given state as an Excel file.
 *
 * @param {Object} state - The current app state.
 */
export const exportExcel = async (state) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sunray Group";
  workbook.created = new Date();
  workbook.views = [{ x: 0, y: 0, width: 20000, height: 10000 }];

  // Tasks Sheet
  const worksheetTasks = workbook.addWorksheet(i18n.t("Tasks"), {
    properties: { tabColor: { argb: "FF4F81BD" } },
    views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
  });

  const { header, rows } = buildExportData(state);
  worksheetTasks.columns = header.map((h, index) => ({
    header: h,
    key: `col${index}`,
    width: h.length + 5,
  }));

  const headerRow = worksheetTasks.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F81BD" },
  };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.border = {
    bottom: { style: "thick", color: { argb: "FFFFFFFF" } },
  };

  rows.forEach((row) => worksheetTasks.addRow(row));
  worksheetTasks.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.alignment = { vertical: "middle", horizontal: "left" };
      row.font = { size: 11 };
      row.border = {
        bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
      };
    }
  });

  // Summary Sheet
  const worksheetSummary = workbook.addWorksheet(i18n.t("Summary"), {
    properties: { tabColor: { argb: "FF4CAF50" } },
    views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
  });

  const overall = computeOverallSummary(state);
  const phaseSummaries = computePhaseSummaries(state);
  const groupSummaries = computeGroupSummaries(state);

  /**
   * Helper to add a table to a worksheet.
   *
   * @param {ExcelJS.Worksheet} worksheet - The worksheet to add the table.
   * @param {string} title - The title of the table.
   * @param {string[]} headers - Column headers.
   * @param {Array[]} data - Table data.
   * @param {number} startRow - The starting row.
   * @returns {number} The new row position.
   */
  const addTable = (worksheet, title, headers, data, startRow) => {
    worksheet.getCell(`A${startRow}`).value = title;
    worksheet.getCell(`A${startRow}`).font = { bold: true, size: 14 };
    worksheet.getCell(`A${startRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" },
    };
    worksheet.getRow(startRow).alignment = { horizontal: "center" };

    const headerRowIndex = startRow + 1;
    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF388E3C" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.border = {
      bottom: { style: "thick", color: { argb: "FFFFFFFF" } },
    };

    data.forEach((row) => worksheet.addRow(row));
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > headerRowIndex) {
        row.alignment = { vertical: "middle", horizontal: "left" };
        row.font = { size: 11 };
        row.border = {
          bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
        };
      }
    });

    return startRow + data.length + 3;
  };

  let rowPosition = 1;
  rowPosition = addTable(
    worksheetSummary,
    i18n.t("Overall Summary"),
    [i18n.t("Metric"), i18n.t("Value")],
    [
      [i18n.t("Total Tasks"), overall.count],
      [i18n.t("Total Estimate"), overall.sumEstimate.toFixed(2)],
      [i18n.t("Total Cost"), overall.sumCost.toFixed(2)],
      [i18n.t("Avg Estimate per Task"), overall.count ? (overall.sumEstimate / overall.count).toFixed(2) : "0.00"],
      [i18n.t("Avg Hourly Rate"), overall.averageRate],
    ],
    rowPosition
  );

  rowPosition = addTable(
    worksheetSummary,
    i18n.t("Per Phase Summary"),
    [
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
    ],
    phaseSummaries.map((item) => [
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
    ]),
    rowPosition
  );

  addTable(
    worksheetSummary,
    i18n.t("Per Group Summary"),
    [
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
    ],
    groupSummaries.map((item) => [
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
    ]),
    rowPosition
  );

  worksheetSummary.getColumn(1).width = 25;
  worksheetSummary.columns.forEach((col, index) => {
    if (index > 0) col.width = 15;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${state.config.projectName}_tasks.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
