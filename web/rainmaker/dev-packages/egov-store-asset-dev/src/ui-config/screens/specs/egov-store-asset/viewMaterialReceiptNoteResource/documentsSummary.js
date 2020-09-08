import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
//import { gotoApplyWithStep } from "../../utils/index";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";

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
          labelKey: "STORE_SUMMARY_DOCUMENTS_HEADER"
        }),
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            // uiFramework: "custom-atoms",
            // componentPath: "Icon",
            // props: {
            //   iconName: "edit"
            // }
          },
          // buttonLabel: getLabel({
          //   labelName: "Edit",
          //   labelKey: "NOC_SUMMARY_EDIT"
          // })
        },
        onClickDefination: {
          action: "condition",
          // callBack: (state, dispatch) => {
          //   let applicationType = getapplicationType(); 
          //   let steplevel = 2;
          //   steplevel =  applicationType === 'SELLMEATNOC' ? 1 :  applicationType === 'ROADCUTNOC' ? 1 : applicationType === 'ADVERTISEMENTNOC' ? 2 : steplevel;           
          //   gotoApplyWithStep(state, dispatch, steplevel);
          // }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-opms",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "noc-review-documents"
    }
  }
});
