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

export const advertisementapplicantSummary = getCommonGrayCard({
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
      className: "advertisementapplicant-summary",
      scheama: getCommonGrayCard({
        applicantContainer: getCommonContainer({
          applicatiantNumber: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "NOC_APPLICATION_ID"
            },
            { jsonPath: "nocApplicationDetail[0].nocnumber" }
          ),
          applicatiantName: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "NOC_APPLICATION_Name"
            },
            { jsonPath: "nocApplicationDetail[0].applicantname" }
          ),
          applicantType: getLabelWithValue(
            {
              labelName: "Applicant Category",
              labelKey: "NOC_APPLICANT_TYPE_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let typeOfApplicant = JSON.parse(value).hasOwnProperty('typeOfApplicant') ? JSON.parse(value)['typeOfApplicant'] : '';
                  return typeOfApplicant;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantTan: getLabelWithValue(
            {
              labelName: "TAN",
              labelKey: "NOC_ADV_TAN_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantTan = JSON.parse(value).hasOwnProperty('tan') ? JSON.parse(value)['tan'] : '';
                  return applicantTan;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantPan: getLabelWithValue(
            {
              labelName: "PAN",
              labelKey: "NOC_ADV_PAN_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantPan = JSON.parse(value).hasOwnProperty('pan') ? JSON.parse(value)['pan'] : '';
                  return applicantPan;
                } else {
                  return '';
                }
              }
            }
          ),
          cin: getLabelWithValue(
            {
              labelName: "cin",
              labelKey: "NOC_ADV_CIN_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantcin = JSON.parse(value).hasOwnProperty('cin') ? JSON.parse(value)['cin'] : '';
                  return applicantcin;
                } else {
                  return '';
                }
              }
            }
          ),
          gstin: getLabelWithValue(
            {
              labelName: "GSTIN",
              labelKey: "NOC_ADV_GSTIN_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicatantgstin = JSON.parse(value).hasOwnProperty('gstin') ? JSON.parse(value)['gstin'] : '';
                  return applicatantgstin;
                } else {
                  return '';
                }
              }
            }
          ),
          mobileNumber: getLabelWithValue(
            {
              labelName: "Mobile No",
              labelKey: "NOC_ADV_MOB_NO"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantMobile = JSON.parse(value).hasOwnProperty('mobileNo') ? JSON.parse(value)['mobileNo'] : '';
                  return applicantMobile;
                } else {
                  return '';
                }
              }
            }
          ),
          EmailId: getLabelWithValue(
            {
              labelName: "EmailId",
              labelKey: "NOC_ADV_EMAILID"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantEmail = JSON.parse(value).hasOwnProperty('emailId') ? JSON.parse(value)['emailId'] : '';
                  return applicantEmail;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantAddress: getLabelWithValue(
            {
              labelName: "LANDMARK",
              labelKey: "NOC_ADV_ADDRESS"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantAddress = JSON.parse(value).hasOwnProperty('applicantAddress') ? JSON.parse(value)['applicantAddress'] : '';
                  return applicantAddress;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantDivision: getLabelWithValue(
            {
              labelName: "LANDMARK",
              labelKey: "NOC_ADV_DIVISION"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantDivision = JSON.parse(value).hasOwnProperty('applicantDivision') ? JSON.parse(value)['applicantDivision'] : '';
                  return applicantDivision;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantLandmark: getLabelWithValue(
            {
              labelName: "LANDMARK",
              labelKey: "NOC_ADV_LANDMARK"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantLandmark = JSON.parse(value).hasOwnProperty('applicantLandmark') ? JSON.parse(value)['applicantLandmark'] : '';
                  return applicantLandmark;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantWard: getLabelWithValue(
            {
              labelName: "LANDMARK",
              labelKey: "NOC_ADV_WARD"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantWard = JSON.parse(value).hasOwnProperty('applicantWard') ? JSON.parse(value)['applicantWard'] : '';
                  return applicantWard;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantSector: getLabelWithValue(
            {
              labelName: "LANDMARK",
              labelKey: "NOC_ADV_SECTOR"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].sector",

            }
          ),
          applicantVillageSuSector: getLabelWithValue(
            {
              labelName: "LANDMARK",
              labelKey: "NOC_ADV_SUBSECTOR"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantVillageSuSector = JSON.parse(value).hasOwnProperty('applicantVillageSuSector') ? JSON.parse(value)['applicantVillageSuSector'] : '';
                  return applicantVillageSuSector;
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

export const detailSummary = getCommonGrayCard({
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
          md: 8
        },
        ...getCommonSubHeader({
          labelName: "Advertisement Detail",
          labelKey: "NOC_ADVERTISEMENT_DETAIL_LABEL"
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
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: getCommonContainer({
    advertisementType: getLabelWithValue(
      {
        labelName: "Advertisement Type",
        labelKey: "NOC_TYPE_OF_ADVERTISEMENT"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let advertisementType = JSON.parse(value).hasOwnProperty('typeOfAdvertisement') ? JSON.parse(value)['typeOfAdvertisement'] : '';
            return advertisementType;
          } else {
            return '';
          }
        }
      }
    ),
    subTypeOfAdvertisement: getLabelWithValue(
      {
        labelName: "Advertisement Sub Type",
        labelKey: "NOC_SUB_TYPE_OF_ADVERTISEMENT"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let subTypeOfAdvertisement = JSON.parse(value).hasOwnProperty('subTypeOfAdvertisement') ? JSON.parse(value)['subTypeOfAdvertisement'] : '';
            return subTypeOfAdvertisement;
          } else {
            return '';
          }
        }
      }
    ),

    fromDate: getLabelWithValue(
      {
        labelName: "fromDate",
        labelKey: "NOC_ADV_fromDate"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let fromDate = JSON.parse(value).hasOwnProperty('fromDateToDisplay') ? JSON.parse(value)['fromDateToDisplay'] : '';
            return fromDate;
          } else {
            return '';
          }
        }
      }
    ),
    toDate: getLabelWithValue(
      {
        labelName: "toDate",
        labelKey: "NOC_ADV_TODATE"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let toDate = JSON.parse(value).hasOwnProperty('toDateToDisplay') ? JSON.parse(value)['toDateToDisplay'] : '';
            return toDate;
          } else {
            return '';
          }
        }
      }
    ),
    duration: getLabelWithValue(
      {
        labelName: "Duration",
        labelKey: "NOC_ADV_DURATION"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let duration = JSON.parse(value).hasOwnProperty('duration') ? JSON.parse(value)['duration'] : '';
            return duration;
          } else {
            return '';
          }
        }
      }
    ),
    locationOfAdvertisement: getLabelWithValue(
      {
        labelName: "locationOfAdvertisement",
        labelKey: "NOC_ADV_LOACTION"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let locationOfAdvertisement = JSON.parse(value).hasOwnProperty('locationOfAdvertisement') ? JSON.parse(value)['locationOfAdvertisement'] : '';
            return locationOfAdvertisement;
          } else {
            return '';
          }
        }
      }
    ),
    applicantLandmark: getLabelWithValue(
      {
        labelName: "LANDMARK",
        labelKey: "NOC_ADV_LANDMARK"
      },
      {
        jsonPath:
          "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let applicantLandmark = JSON.parse(value).hasOwnProperty('advertisementLandmark') ? JSON.parse(value)['advertisementLandmark'] : '';
            return applicantLandmark;
          } else {
            return '';
          }
        }
      }
    ),
    advertisementSector: getLabelWithValue(
      {
        labelName: "LANDMARK",
        labelKey: "NOC_ADV_SECTOR"
      },
      {
        jsonPath:
          "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let advertisementSector = JSON.parse(value).hasOwnProperty('advertisementSector') ? JSON.parse(value)['advertisementSector'] : '';
            return advertisementSector;
          } else {
            return '';
          }
        }
      }
    ),


    village: getLabelWithValue(
      {
        labelName: "VILLAGE",
        labelKey: "NOC_ADV_VILLAGE"
      },
      {
        jsonPath:
          "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let village = JSON.parse(value).hasOwnProperty('advertisementVillageSubSector') ? JSON.parse(value)['advertisementVillageSubSector'] : '';
            return village;
          } else {
            return '';
          }
        }
      }
    ),
    matter: getLabelWithValue(
      {
        labelName: "ADV Matter",
        labelKey: "NOC_ADV_MATTER_DISCRIPTION"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let matter = JSON.parse(value).hasOwnProperty('advertisementMatterDescription') ? JSON.parse(value)['advertisementMatterDescription'] : '';
            return matter;
          } else {
            return '';
          }
        }
      }
    ),
    enteredSpace: getLabelWithValue(
      {
        labelName: "enteredSpace",
        labelKey: "NOC_ADV_ENTERED_SPACE"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let enteredSpace = JSON.parse(value).hasOwnProperty('space') ? Number(JSON.parse(value)['space']) : '';
            return enteredSpace;
          } else {
            return '';
          }
        }
      }
    ),
    exemptedCategory: getLabelWithValue(
      {
        labelName: "exemptedCategory",
        labelKey: "NOC_ADV_EXEMPTED_CATEGORY"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let exemptedCategory = JSON.parse(value).hasOwnProperty('exemptedCategory') ? JSON.parse(value)['exemptedCategory'] : '';

            return exemptedCategory == "0" ? 'NO' : 'YES';
          } else {
            return '';
          }
        }
      }
    ),
    date: getLabelWithValue(
      {
        labelName: "date",
        labelKey: "NOC_ADV_DATE"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let date = JSON.parse(value).hasOwnProperty('date') ? JSON.parse(value)['date'] : '';
            return date;
          } else {
            return '';
          }
        }
      }
    ),
    withdrawapprovalamount: getLabelWithValue(
      {
        labelName: "withdrawapprovalamount",
        labelKey: "NOC_ADV_WITHDRAWAPPROVALAMOUNT"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let withdrawapprovalamount = JSON.parse(value).hasOwnProperty('withdrawapprovalamount') ? JSON.parse(value)['withdrawapprovalamount'] : '';
            //return withdrawapprovalamount > 0 ? withdrawapprovalamount : '';
            return withdrawapprovalamount;
          } else {
            return '';
          }
        }
      }
    ),
    withdrawapprovaltaxamount: getLabelWithValue(
      {
        labelName: "withdrawapprovaltaxamount",
        labelKey: "NOC_ADV_WITHDRAWAPPROVALTAXAMOUNT"
      },
      {
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let withdrawapprovaltaxamount = JSON.parse(value).hasOwnProperty('withdrawapprovaltaxamount') ? JSON.parse(value)['withdrawapprovaltaxamount'] : '';
            //return withdrawapprovalamount > 0 ? withdrawapprovalamount : '';
            return withdrawapprovaltaxamount;
          } else {
            return '';
          }
        }
      }
    )
  })
});
