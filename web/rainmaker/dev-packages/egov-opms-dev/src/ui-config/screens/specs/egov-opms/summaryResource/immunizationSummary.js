import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getPattern,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import {
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";

const test = value => {
  value = value ? value.split(".")[0] : "";
  return value;
};

const tenantId = getQueryArg(window.location.href, "tenantId");

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-opms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const immunizationDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "noc-summary",
    scheama: getCommonGrayCard({
      propertyContainer: getCommonContainer({
        nameofVeterinaryDoctor: getLabelWithValue(
          {
            labelName: "Name of Veterinary Doctor",
            labelKey: "NOC_PET_DETAILS_NAME_OF_VETERINARY_DOCTOR_LABEL"
          },
          {
            // placeholder: {
            //   labelName: "Name of Veterinary Doctor",
            //   labelKey: "NOC_PET_DETAILS_NAME_OF_VETERINARY_DOCTOR_PLACEHOLDER"
            // },
            // required: true,
            // pattern: getPattern("TradeName"),
            // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              
              if (value != undefined) {
                let immunizationNameVeterinaryDoctor = JSON.parse(value).hasOwnProperty('immunizationNameVeterinaryDoctor') ? JSON.parse(value)['immunizationNameVeterinaryDoctor'] : '';
                return immunizationNameVeterinaryDoctor;
              } else {
                return '';
              }
            }
          }
        ),
        veterinaryCouncilRegistrationNo: getLabelWithValue(
          {
            labelName: "Veterinary Council Registration No",
            labelKey: "NOC_PET_DETAILS_VETERINARY_COUNCIL_REGISTRATION_NO_LABEL"
          },
          {
            // placeholder: {
            //   labelName: "Veterinary Council Registration No",
            //   labelKey: "NOC_PET_DETAILS_VETERINARY_COUNCIL_REGISTRATION_NO_PLACEHOLDER"
            // },
            // required: true,
            // pattern: getPattern("VeterinaryRegistrationNo"),
            // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if (value != undefined) {
                let veterinaryCouncilRegistrationNo = JSON.parse(value).hasOwnProperty('veterinaryCouncilRegistrationNo') ? JSON.parse(value)['veterinaryCouncilRegistrationNo'] : '';
                return veterinaryCouncilRegistrationNo;
              } else {
                return '';
              }
            }
          }
        ),
        contactDetail: getLabelWithValue(
          {
            labelName: "Veterinary Contact No",
            labelKey: "NOC_PET_DETAILS_VETERINARY_CONTACT_NO_LABEL"
          },
          {
            // required: true,
            // pattern: getPattern("MobileNo"),
            // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if (value != undefined) {
                let immunizationContactDetail = JSON.parse(value).hasOwnProperty('immunizationContactDetail') ? JSON.parse(value)['immunizationContactDetail'] : '';
                return immunizationContactDetail;
              } else {
                return '';
              }
            }
          }
        ),
        houseNo: getLabelWithValue(
          {
            labelName: "House/Clinic No.",
            labelKey: "NOC_PET_DETAILS_VETERINARY_CLINIC_NO_LABEL"

          },
          {
            // placeholder: {
            //   labelName: "Clinic No",
            //   labelKey: "NOC_PET_DETAILS_VETERINARY_CLINIC_NO_PLACEHOLDER"
            // },
            //  required: true,
            // pattern: getPattern("DoorHouseNo"),
            // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "nocApplicationDetail[0].applicationdetail",

            callBack: value => {
              
              if (value != undefined) {
                let immunizationClinicNo = JSON.parse(value).hasOwnProperty('immunizationClinicNo') ? JSON.parse(value)['immunizationClinicNo'] : '';
            
                let immunizationClinicNodetails = immunizationClinicNo.length === 1 ? Number.isInteger(JSON.parse(immunizationClinicNo)) 
                ? Number(immunizationClinicNo)  : immunizationClinicNo : immunizationClinicNo
                return immunizationClinicNodetails;
              } else {
                return '';
              }
            }

          }
        ),
        sector: getLabelWithValue(
          {
            labelName: "Sector",
            labelKey: "NOC_PET_DETAILS_VETERINARY_SECTOR_LABEL"
          },
          {
            // optionLabel: "name",
            // placeholder: {
            //   labelName: "Select Sector",
            //   labelKey: "NOC_PET_DETAILS_VETERINARY_SECTOR_PLACEHOLDER"
            // },
            // sourceJsonPath: "applyScreenMdmsData.egpm.sector",
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            //required: true,
            callBack: value => {
              if (value != undefined) {
                let immunizationSector = JSON.parse(value).hasOwnProperty('immunizationSector') ? JSON.parse(value)['immunizationSector'] : '';
                return immunizationSector;
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
      "children.cardContent.children.propertyContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};


export const immunizationSummary = getCommonGrayCard({
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
          labelName: "Immunization Record",
          labelKey: "IMMUNIZATION_RECORD_HEADER"
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
  //propertyDetailsHeader: getHeader("Property Details"),
  break: getBreak(),
  cardOne: immunizationDetails
  // propertyLocationDetailsHeader: getHeader("Property Location Details"),
  // cardTwo: propertyLocationDetails
});
