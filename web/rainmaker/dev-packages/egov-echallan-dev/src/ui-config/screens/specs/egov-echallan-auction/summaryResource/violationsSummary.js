import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";
import { showHideAdhocPopupAuction } from "../../utils/index";

export const violationsSummary = getCommonGrayCard({
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
          sm: 8
        },
        ...getCommonSubHeader({
          labelName: "Violations Details",
          labelKey: "EC_CHALLAN_VIOLATIONS_DETAILS_HEADER"
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
        visible:true,
        gridDefination: {
          xs: 12,
          sm: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "history"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "EC_AUCTION_HISTORY"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupAuction(state, dispatch, "search-preview")
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "Violation-details",
      scheama: getCommonGrayCard({
        voilationsContainer: getCommonContainer({
          encroachmentCatrgory: getLabelWithValue(
            {
              labelName: "Encroachment/Seizure Category",
              labelKey: "EC_ECHALLAN_ENCROACHMENT_SEIZURE_CATEGORY_LABEL"
            },
            {
              jsonPath: "eChallanDetail[0].encroachmentTypeName"
              // callBack: value => {
              //   return value.split(".")[0];
              // }
            }
          ),
          noofViolations: getLabelWithValue(
            {
              labelName: "No of Violation(s)",
              labelKey: "EC_ECHALLAN_NO_OF_VIOLATIONS_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].numberOfViolation"
              // callBack: value => {
              //   return value.split(".")[1];
              // }
            }
          ),
          sector: getLabelWithValue(
            {
              labelName: "Sector",
              labelKey: "EC_ECHALLAN_SECTOR_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].sector"
            }
          ),
          licenseNo: getLabelWithValue(
            {
              labelName: "License No",
              labelKey: "EC_ECHALLAN_LICENSE_NO_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].licenseNoCov"
            }
          ),
          date: getLabelWithValue(
            {
              labelName: "Date",
              labelKey: "EC_ECHALLAN_DATE_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].violationDate"
            },
          ),
          time: getLabelWithValue(
            {
              labelName: "Time",
              labelKey: "EC_ECHALLAN_VOILATOIONS_TIME_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].violationTime",

            }
          ),
          natureofViolation: getLabelWithValue(
            {
              labelName: "Nature of Violation",
              labelKey: "EC_ECHALLAN_NATURE_OF_VIOLATION_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].natureOfViolation"
            }
          ),

        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
       sourceJsonPath: "eChallanDetail",
      // prefixSourceJsonPath:
      //   "children.cardContent.children.fineContainer.children",
      // afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});

