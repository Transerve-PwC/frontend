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
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const gotoCreatePage = (state, dispatch) => {
  const createUrl =
  process.env.REACT_APP_SELF_RUNNING === "true"
  ? `/egov-ui-framework/egov-store-asset/createpricelist?step=1`
  : `/egov-store-asset/createpricelist?step=1`;
  dispatch(setRoute(createUrl));
};


// }
export const getDocumentView = (isReview = true) => {
  return getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: "Documents",
          labelKey: "STORE_SUMMARY_DOCUMENTS_HEADER"
        }),
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary"
        },
        visible: isReview,
        gridDefination: {
          xs: 12,
          sm: 2,
          align: "right"
        },
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
            labelKey: "STORE_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: gotoCreatePage
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
}
