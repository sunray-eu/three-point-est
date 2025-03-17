/**
 * @fileoverview Loads shared state from URL parameters.
 * Also checks for a language parameter and sets it accordingly.
 */
import { useEffect } from "react";
import { decodeStateFromUrl } from "../utils/stateUrl";
import { exportPDF } from "../exporters/pdfExporter";
import { exportExcel } from "../exporters/excelExporter";
import { useDispatch } from "react-redux";
import { SET_LANGUAGE } from "../config/types";

const SharedStateLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedStateEncoded = params.get("sharedState");
    let sharedState = null;
    if (sharedStateEncoded) {
      sharedState = decodeStateFromUrl(sharedStateEncoded);
      if (sharedState) {
        dispatch({ type: "LOAD_STATE", state: sharedState });
      }
    }
    // Set language from URL parameter if present
    const langParam = params.get("lang");
    if (langParam) {
      dispatch({ type: SET_LANGUAGE, language: langParam });
      // Also update i18n language
      import("../i18n").then((module) => {
        module.default.changeLanguage(langParam);
      });
    }
    const downloadType = params.get("download");
    if (downloadType && sharedState) {
      setTimeout(() => {
        if (downloadType === "pdf") {
          exportPDF(sharedState);
        } else if (downloadType === "excel") {
          exportExcel(sharedState);
        }
      }, 1000);
    }
  }, [dispatch]);

  return null;
};

export default SharedStateLoader;
