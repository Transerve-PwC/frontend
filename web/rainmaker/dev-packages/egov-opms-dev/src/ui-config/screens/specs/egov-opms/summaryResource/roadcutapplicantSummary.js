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

export const roadcutapplicantSummary = getCommonGrayCard({
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
          md:4,
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
      className: "raodcutapplicant-summary",
      scheama: getCommonGrayCard({
        applicantContainer: getCommonContainer({
          mobileNo: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "NOC_APPLICATION_ID"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].nocnumber"

            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Applicant Name",
              labelKey: "NOC_APPLICANT_NAME_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicantname"

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
          applicanttype: getLabelWithValue(
            {
              labelName: "applicanttype",
              labelKey: "NOC_ROADCUT_TYPE_OF_APPLICANT"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicanttype = JSON.parse(value).hasOwnProperty('typeOfApplicant') ? JSON.parse(value)['typeOfApplicant'] : '';
                  return applicanttype;
                } else {
                  return '';
                }
              }
            }
          ),

          purpose: getLabelWithValue(
            {
              labelName: "applicanttype",
              labelKey: "NOC_ROADCUT_PURPOSE_OF_ROADCUTTING"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let purpose = JSON.parse(value).hasOwnProperty('purposeOfRoadCutting') ? JSON.parse(value)['purposeOfRoadCutting'] : '';
                  return purpose;
                } else {
                  return '';
                }
              }
            }
          )
          ,
        roadCutType: getLabelWithValue(
          {
            labelName: "Road Cut Type",
            labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
          },
          {
          jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if(value!=undefined){
              let purposeOfRoadCutting = JSON.parse(value).hasOwnProperty('roadCutType')?JSON.parse(value)['roadCutType']:'';
              return purposeOfRoadCutting;
              }
              else{
                return '';
              }
            }
          }
        ),
          divsion: getLabelWithValue(
            {
              labelName: "divsion",
              labelKey: "NOC_ROADCUT_DIVISION"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let divsion = JSON.parse(value).hasOwnProperty('division') ? JSON.parse(value)['division'] : '';
                  return divsion;
                } else {
                  return '';
                }
              }
            }
          ),
          ward: getLabelWithValue(
            {
              labelName: "divsion",
              labelKey: "NOC_ROADCUT_WARD"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let ward = JSON.parse(value).hasOwnProperty('ward') ? JSON.parse(value)['ward'] : '';
                  return ward;
                } else {
                  return '';
                }
              }
            }
          ),
          requestedLocation: getLabelWithValue(
            {
              labelName: "requestedLocation",
              labelKey: "NOC_ROADCUT_REQ_LOCATION"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let requestedLocation = JSON.parse(value).hasOwnProperty('requestedLocation') ? JSON.parse(value)['requestedLocation'] : '';
                  return requestedLocation;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantAddress: getLabelWithValue(
            {
              labelName: "Sector",
              labelKey: "NOC_DIVISION_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].sector"
            }
          ),
          landmark: getLabelWithValue(
            {
              labelName: "landmark",
              labelKey: "NOC_ROADCUT_LANDMARK"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let landmark = JSON.parse(value).hasOwnProperty('landmark') ? JSON.parse(value)['landmark'] : '';
                  return landmark;
                } else {
                  return '';
                }
              }
            }
          ),
          length: getLabelWithValue(
            {
              labelName: "landmark",
              labelKey: "ROADCUT_LENGTH_LABEL_NOC"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let length = JSON.parse(value).hasOwnProperty('length') ? Number(JSON.parse(value)['length']) : '';
                  return length;
                } else {
                  return '';
                }
              }
            }
          ),
          amount: getLabelWithValue(
            {
              labelName: "Amount",
              labelKey: "NOC_ROADCUT_AMOUNT"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].amount",
              callBack: value => {
                if (value > 0) {
                  return value;
                } else {
                  return '';
                }
              }

            }
          ),
          performanceBankGuaranteeCharges: getLabelWithValue(
            {
              labelName: "PBGC",
              labelKey: "NOC_ROADCUT_PBGC"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].performancebankguaranteecharges",
              callBack: value => {
                return value;
                // if (value > 0) {
                //   return value;
                // } else {
                //   return '';
                // }
              }

            }
          ),
          gstAmount: getLabelWithValue(
            {
              labelName: "GSTAMOUNT",
              labelKey: "NOC_ROADCUT_GSTAMOUNT"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].gstamount",
              callBack: value => {
                return value;
                // if(value>0){
                // return value;
                // }else{
                //   return '';
                // }
              }
            }
          ),
          totalAmount: getLabelWithValue(
            {
              labelName: "TOTALAMOUNT",
              labelKey: "NOC_ROADCUT_TOTALAMOUNT"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].totalamount",
              callBack: value => {
                if (value > 0) {
                  return value;
                } else {
                  return '';
                }
              }
            }
          ),
          isAnyChangeInRoadCutEstimation: getLabelWithValue(
            {
              labelName: "Is there is any change in Road cut estimation ?",
              labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_ISANYCHANGEINESTIMATION_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let isAnyChangeInRoadCutEstimation = JSON.parse(value).hasOwnProperty('isAnyChangeInRoadCutEstimation') ? JSON.parse(value)['isAnyChangeInRoadCutEstimation'] : '';
                  return isAnyChangeInRoadCutEstimation;
                } else {
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
