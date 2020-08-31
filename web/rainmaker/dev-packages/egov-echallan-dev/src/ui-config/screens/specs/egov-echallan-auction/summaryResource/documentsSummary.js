import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";

export const documentsSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Documents",
          labelKey: "EC_ECHALLAN_SUMMARY_DOCUMENTS_HEADER"
        })
      },

    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-echallan",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
    }
  }
});
