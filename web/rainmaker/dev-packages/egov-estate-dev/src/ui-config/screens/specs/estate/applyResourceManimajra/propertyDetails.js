import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { fileNumberField } from "../applyResource/propertyDetails";
import { mohallaField, categoryField, subCategoryField, siteNumberField, sectorNumberField, propertyDetailsHeader } from "../applyResourceBuildingBranch/propertyDetails";
import {
  displayDefaultErr,
  _getPattern,
  displayCustomErr
} from "../../utils";

let screenName = "apply-manimajra"

const houseNumberField = {
  label: {
    labelName: "House/Shop Number",
    labelKey: "ES_HOUSE_SHOP_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter House/Shop Number",
    labelKey: "ES_HOUSE_SHOP_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("fileNumber"),
  jsonPath: "Properties[0].propertyDetails.houseNumber",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", screenName);
    } else {
      displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const streetField = {
  label: {
    labelName: "Street",
    labelKey: "ES_STREET_LABEL"
  },
  placeholder: {
    labelName: "Enter Street Number",
    labelKey: "ES_STREET_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.street",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 100) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_100", screenName);
    } else {
      displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const areaofPropertyField = {
  label: {
      labelName: "Area of the Property(in sq yds)",
      labelKey: "ES_AREA_YDS_LABEL"
  },
  placeholder: {
      labelName: "Enter Area of the Property(in sq yds)",
      labelKey: "ES_AREA_YDS_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: "Properties[0].propertyDetails.areaSqft"
}

export const propertyTypeField = {
  label: {
      labelName: "Property Type",
      labelKey: "ES_PROPERTY_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Select Property Type",
      labelKey: "ES_PROPERTY_TYPE_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].propertyDetails.propertyType",
  sourceJsonPath: "applyScreenMdmsData.EstateServices.propertyTypeMM",
  gridDefination: {
      xs: 12,
      sm: 6
  },
  beforeFieldChange: (action, state, dispatch) => {
      
  }
}

export const propertyDetails = getCommonCard({
  header: propertyDetailsHeader,
  detailsContainer: getCommonContainer({
      fileNumber: getTextField(fileNumberField),
      houseNumber: getTextField(houseNumberField),
      mohalla: getTextField(mohallaField),
      street: getTextField(streetField),
      areaOfProperty: getTextField(areaofPropertyField),
      propertyType: getSelectField(propertyTypeField),
      category: getSelectField(categoryField),
      subCategory: getSelectField(subCategoryField),
      siteNumber: getTextField(siteNumberField),
      sectorNumber: getSelectField(sectorNumberField)
  })
})