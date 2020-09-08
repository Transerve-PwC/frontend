import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const applicantSummary = getCommonGrayCard({
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
          labelName: "Applicant Details",
          labelKey: "ROADCUT_APPLICANT_DETAILS_HEADER_NOC"
        })
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
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 0);
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        applicantContainer: getCommonContainer({
          applicationId: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "ROADCUT_APPLICATION_ID_NOC"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].nocnumber"
              // callBack: value => {
              //   return value.split(".")[0];
              // }
            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Applicant Name",
              labelKey: "ROADCUT_APPLICANT_NAME_LABEL_NOC"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicantname"
              // callBack: value => {
              //   return value.split(".")[1];
              // }
            }
          ),
          gstNumber: getLabelWithValue(
            {
              labelName: "Applicant Name",
              labelKey: "ROADCUT_GSTNO_LABEL_NOC"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let gstin = JSON.parse(value).hasOwnProperty('gstin') ? JSON.parse(value)['gstin'] : '';
                  return gstin;
                } else {
                  return '';
                }
              }
            }
          ),
          typeOfApplicant: getLabelWithValue(
            {
              labelName: "Type of Applicant",
              labelKey: "ROADCUT_APPLICANT_TYPE_LABEL_NOC"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
                callBack: value => {
                  if(value!=undefined){
                  let typeOfApplicant = JSON.parse(value).hasOwnProperty('typeOfApplicant')?JSON.parse(value)['typeOfApplicant']:'';
                  return typeOfApplicant;
                  }
                  else{
                    return '';
                  }
                }
            }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "nocApplicationDetail",
      prefixSourceJsonPath:
        "children.cardContent.children.applicantContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});
