import { useEffect } from "react";
import { decodeStateFromUrl } from "../utils/stateUrl";
import { exportPDF } from "../exporters/pdfExporter";
import { exportExcel } from "../exporters/excelExporter";
import { useDispatch } from "react-redux";

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
    const downloadType = params.get("download");
    if (downloadType && sharedState) {
      // Delay to allow the new state to load into Redux.
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
