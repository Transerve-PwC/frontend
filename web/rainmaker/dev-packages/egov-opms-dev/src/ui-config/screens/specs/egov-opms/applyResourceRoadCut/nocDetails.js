import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getTextField, getSelectField, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, furnishRoadcutNocResponse } from "../../../../../ui-utils/commons";
import { getOPMSPattern } from '../../utils/index'

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application Details",
      labelKey: "ROADCUT_NEW_NOC_DETAILS_HEADER_PET_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
    typeOfApplicant: {
      ...getSelectField({
        label: {
          labelName: "Type Of Applicant",
          labelKey: "ROADCUT_APPLICANT_TYPE_LABEL_NOC"
        },
        // localePrefix: {
        //   moduleName: "RoadCutNOC",
        //   masterName: "RoadCutTypeOfApplicant"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Type Of Applicant",
          labelKey: "ROADCUT_APPLICANT_TYPE_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.RoadCutTypeOfApplicant",
        jsonPath: "ROADCUTNOC.typeOfApplicant",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    purposeOfRoadCutting: {
      ...getSelectField({
        label: {
          labelName: "Purpose Of Road Cutting",
          labelKey: "ROADCUT_PURPOSE_OF_ROAD_CUTTING_LABEL_NOC"
        },
        // localePrefix: {
        //   moduleName: "RoadCutNOC",
        //   masterName: "purposeOfRoadCutting"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Purpose Of Road Cutting",
          labelKey: "ROADCUT_PURPOSE_OF_ROAD_CUTTING_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.purposeOfRoadCutting",
        jsonPath: "ROADCUTNOC.purposeOfRoadCutting",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    roadCutType: {
      ...getSelectField({
        label: {
          labelName: "Road Cut Type",
          labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
        },
        optionLabel: "name",
        placeholder: {
          labelName: "Enter Road Cut Type",
          labelKey: "ROADCUT_ROAD_CUT_TYPE_PLACEHOLDER"
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        sourceJsonPath: "applyScreenMdmsData.egpm.roadCutType",
        jsonPath: "ROADCUTNOC.roadCutType",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
        }
      })
    },
    // roadCutType: {
    //   ...getTextField({
    //     label: {
    //       labelName: "Road Cut Type",
    //       labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
    //     },
    //     placeholder: {
    //       labelName: "Enter Road Cut Type",
    //       labelKey: "ROADCUT_ROAD_CUT_TYPE_PLACEHOLDER"
    //     },
    //     pattern: getOPMSPattern("typeofroadcut"),
    //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //     required: false,
    //     jsonPath: "ROADCUTNOC.roadCutType"
    //   })
    // },
    applicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name/ Authorize Signatory",
          labelKey: "ROADCUT_APPLICANT_NAME_LABEL_NOC"
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "ROADCUT_APPLICANT_NAME_PLACEHOLDER"
        },
        pattern: getOPMSPattern("petnocApplicantName"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "ROADCUTNOC.applicantName"
      })
    },
    gstin: {
      ...getTextField({
        label: {
          labelName: "GSTIN",
          labelKey: "ROADCUT_GSTIN_NOC"
        },
        placeholder: {
          labelName: "GSTIN",
          labelKey: "ROADCUT_GSTIN_NOC_PLACEHOLDER"
        },
        props: {
          className: "TAN-CIN-GSTIN"
        },
        required: false,
        pattern: getPattern("GSTNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.gstin",
      })
    },
      applicantDivision: {
      ...getSelectField({
        
        optionLabel: "name",
        optionValue:"name",
        label: {
          labelName: "Division",
          labelKey: "ROADCUT_DIVISION_NOC"
        },
        placeholder: {
          labelName: "Enter Division",
          labelKey: "ROADCUT_DIVISION_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.roadCutDivision",
        jsonPath: "ROADCUTNOC.division",
        required: true,
        disabled: true,
        props: {
          className: "hr-generic-selectfield",
          optionLabel: "name",
          // hasLocalization: false
          disabled: true,

        },
        
      }),
    },
    ward: {
      ...getTextField({
        label: {
          labelName: "Ward",
          labelKey: "ROADCUT_WARD_NOC"
        },
        placeholder: {
          labelName: "Enter Ward",
          labelKey: "ROADCUT_WARD_PLACEHOLDER"
        },
        required: false,
        pattern: getOPMSPattern("Division"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.ward"
      })
    },
    sector: {
      ...getSelectField({
        label: { labelName: "Sector", labelKey: "ROADCUT_PROPERTY_SECTOR_LABEL_NOC" },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Sector",
          labelKey: "ROADCUT_PROPERTY_SECTOR_LABEL_NOC"
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        jsonPath: "ROADCUTNOC.sector",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
        afterFieldChange: (action, state, dispatch) => {
          try {
            

            let divisionData =
              get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.sector", []).find(
                item => item.code === action.value
              );

            dispatch(
              prepareFinalObject(
                "ROADCUTNOC.division", divisionData.division
              )
            );

            dispatch(
              handleField(
                "applyroadcuts",
                "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.applicantDivision",
                "props.value", divisionData.division));
 
          } catch (e) {
            console.log(e);
          }
        }
      }),
    },
    requestedLocation: {
      ...getTextField({
        label: {
          labelName: "Requested Location",
          labelKey: "ROADCUT_REQUESTED_LOCATION_NOC"
        },
        placeholder: {
          labelName: "Enter Requested Location",
          labelKey: "ROADCUT_REQUESTED_LOCATION_PLACEHOLDER"
        },
        required: false,
         pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.requestedLocation"
      })
    },
    landmark: {
      ...getTextField({
        label: {
          labelName: "Landmark",
          labelKey: "ROADCUT_LANDMARK_NOC"
        },
        placeholder: {
          labelName: "Enter Landmark",
          labelKey: "ROADCUT_LANDMARK_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.landmark"
      })
    },
    length: {
      ...getTextField({
        label: {
          labelName: "Length",
          labelKey: "ROADCUT_LENGTH_LABEL_NOC"

        },
        localePrefix: {
          moduleName: "egpm",
          masterName: "length"
        },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Length",
          labelKey: "ROADCUT_LENGTH_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.length",
        jsonPath: "ROADCUTNOC.length",
        required: true,
		    pattern: getOPMSPattern("Amount"),
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    }
  })
});