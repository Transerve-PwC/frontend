import {  getBreak,  getCommonCard,  getCommonContainer,  getCommonTitle,  getTextField,  getSelectField,  getPattern} from "egov-ui-framework/ui-config/screens/specs/utils";
import {  handleScreenConfigurationFieldChange as handleField,  prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  furnishNocResponse,  getSearchResults} from "../../../../../ui-utils/commons";
import { getOPMSPattern } from "../../utils/index"

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application Details",
      labelKey: "SELLMEATNOC_NEW_NOC_DETAILS_HEADER_PET_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
 applicantName: {
    ...getTextField({
      label: {
        labelName: "Applicant Name",
        labelKey: "SELLMEAT_APPLICANT_NAME_LABEL_NOC"
      },
      placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "SELLMEAT_APPLICANT_NAME_PLACEHOLDER"
      },
      pattern: getOPMSPattern("petnocApplicantName"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,      
      jsonPath:"SELLMEATNOC.applicantName"
    })
  },
  fatherHusbandName:{
    ...getTextField({
       label:{
          labelName:"fatherHusbandName",
          labelKey:"SELLMEAT_FATHERHUSBANDNAME_NOC"
       },
       placeholder:{
          labelName:"Enter fatherHusbandName",
          labelKey:"SELLMEAT_FATHERHUSBANDNAME_PLACEHOLDER"
       },
       required:true,
       pattern:getOPMSPattern("petnocApplicantName"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SELLMEATNOC.fatherHusbandName"
    })
  },
  houseNo:{
    ...getTextField({
       label:{
          labelName:"houseNo",
          labelKey:"SELLMEAT_HOUSENO_NOC"
       },
       placeholder:{
          labelName:"Enter HouseNo",
          labelKey:"SELLMEAT_HOUSENO_PLACEHOLDER"
       },
       required:true,
       pattern:getOPMSPattern("DoorHouseNo"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SELLMEATNOC.houseNo"
    })
  },
  shopNumber:{
    ...getTextField({
       label:{
          labelName:"Shop Number",
          labelKey:"SELLMEAT_SHOPNO_NOC"
       },
       placeholder:{
          labelName:"Enter Shop Number",
          labelKey:"SELLMEAT_SHOPNO_PLACEHOLDER"
       },
       required:true,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SELLMEATNOC.shopNumber"
    })
  },
  wardDetails:{
    ...getTextField({
       label:{
          labelName:"Ward Details",
          labelKey:"SELLMEAT_WARD_NOC"
       },
       placeholder:{
          labelName:"Enter Ward Details",
          labelKey:"SELLMEAT_WARD_PLACEHOLDER"
       },
       required:true,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SELLMEATNOC.ward"
    })
  },
  division:{
    ...getTextField({
       label:{
          labelName:"Division Details",
          labelKey:"SELLMEAT_DIVISION_LABEL_NOC"
       },
       placeholder:{
          labelName:"Enter Division",
          labelKey:"SELLMEAT_DIVISION_PLACEHOLDER"
       },
       required:true,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SELLMEATNOC.division"
    })
  },
  sector: {
    ...getSelectField({
      label: {
        labelName: "sector",
        labelKey: "SELLMEAT_SECTOR_LABEL_NOC"
      },     
      optionLabel: "name",
      placeholder: {
        labelName: "Select Sector",
        labelKey: "SELLMEAT_SECTOR_PLACEHOLDER"
      },
      sourceJsonPath: "applyScreenMdmsData.egpm.sector",
      jsonPath: "SELLMEATNOC.sector",
      required: true,
      errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",

      props: {
        className: "applicant-details-error",
        required: true
        // disabled: true
      },
    })
  },
  nocSought: {
    ...getSelectField({
      label: {
        labelName: "nocSought",
        labelKey: "SELLMEAT_NOCSOUGHT_LABEL_NOC"
      },
      optionLabel: "name",
      placeholder: {
        labelName: "Select nocSought",
        labelKey: "SELLMEAT_NOCSOUGHT_PLACEHOLDER"
      },
      sourceJsonPath: "applyScreenMdmsData.egpm.nocSought",
      jsonPath: "SELLMEATNOC.nocSought",
      required: true,
      errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
      props: {
        className: "applicant-details-error",
        // disabled: true,
		required: true,
      },
    })
  }
  })
});

