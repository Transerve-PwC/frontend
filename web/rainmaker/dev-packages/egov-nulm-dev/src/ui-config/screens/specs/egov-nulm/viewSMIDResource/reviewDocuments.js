import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

export const reviewDocuments = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Documents",
            labelKey: "WS_COMMON_DOCS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          visible: isEditable,
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              const createUrl = `/egov-nulm/create-smid?step=1`;
              dispatch(setRoute(createUrl));
            }
          }
        },
        documents: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-nulm",
          componentPath: "DownloadFileContainer",
          props: {
            sourceJsonPath: "documentsPreview",
            className: "review-documents"
          } 
        }
      }
    }
  });
};
