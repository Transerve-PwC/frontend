import { getCommonGrayCard, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

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
          labelKey: "HC_DOCUMENTS_HEADER_LABEL"
        }),
      },

    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-hc",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "hc-review-documents"
    }
  }
});
