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
          xs: 9,
          md: 8
        },
        ...getCommonSubHeader({
          labelName: "Applicant Details",
          labelKey: "NOC_APPLICANT_DETAILS_HEADER"
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
          xs: 3,
          md: 4,
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
          mobileNo: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "NOC_APPLICATION_ID"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].nocnumber",
              callBack: value => {
                return value;//.split(".")[0];
              }
            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Applicant Name",
              labelKey: "NOC_APPLICANT_NAME_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicantname",
              callBack: value => {

                return value;//.split(".")[1];
              }
            }
          ),
          applicantGender: getLabelWithValue(
            {
              labelName: "House No.",
              labelKey: "NOC_HOUSE_NO"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].housenumber", 
                callBack: value => {
                  if(value!=undefined){
                  // let housenumber = value.length === 1 ? Number.isInteger(JSON.parse(value)) ? 
                  // Number(value) : value : value;
                  let housenumber = value.length === 1 ? JSON.parse(value) ? 
                  value: value : value;
                  return housenumber;
                  }else{
                    return '';
                  }
                }
            }
          ),
          applicantFatherHusbandName: getLabelWithValue(
            {
              labelName: "Sector",
              labelKey: "NOC_SECTOR"
            },
            {
              jsonPath: "nocApplicationDetail[0].sector"
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
