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
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {
  displayDefaultErr,
  displayMaxLengthErr,
  _getPattern,
  getTodaysDateInYMD
} from "../../utils";

let screenName = "apply-building-branch";

const categoryField = {
  label: {
    labelName: "Category",
    labelKey: "ES_CATEGORY_LABEL"
  },
  placeholder: {
    labelName: "Select Category",
    labelKey: "ES_CATEGORY_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].category",
  sourceJsonPath: "applyScreenMdmsData.EstateServices.categories",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        screenName,
        `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
        "props.value",
        ""
      )
    )

    if (action.value == "CAT.RESIDENTIAL" || action.value == "CAT.COMMERCIAL") {
      dispatch(
        handleField(
          screenName,
          `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "visible",
          true
        )
      );

      const categories = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreenMdmsData.EstateServices.categories"
      )

      const filteredCategory = categories.filter(item => item.code === action.value);
      dispatch(
        handleField(
          screenName,
          `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "props.data",
          filteredCategory[0].SubCategory
        )
      )
    } else {
      dispatch(
        handleField(
          screenName,
          `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "visible",
          false
        )
      );
    }
  }
}

const subCategoryField = {
  label: {
    labelName: "Sub Category",
    labelKey: "ES_SUBCATEGORY_LABEL"
  },
  placeholder: {
    labelName: "Select Sub Category",
    labelKey: "ES_SUBCATEGORY_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].subCategory",
  visible: false,
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

const siteNumberField = {
  label: {
    labelName: "Site Number/SCO/Booth",
    labelKey: "ES_SITE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Site Number",
    labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("fileNumber"),
  jsonPath: "Properties[0].siteNumber",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", screenName);
    } else {
      displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const sectorNumberField = {
  label: {
    labelName: "Sector Number",
    labelKey: "ES_SECTOR_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Select Sector Number",
    labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].sectorNumber",
  sourceJsonPath: "applyScreenMdmsData.EstateServices.sector",
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

const fileNumberField = {
  label: {
    labelName: "File Number",
    labelKey: "ES_FILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter File Number",
    labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("fileNumber"),
  jsonPath: "Properties[0].fileNumber",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", screenName);
    } else {
      displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const houseNumberField = {
  label: {
    labelName: "House Number",
    labelKey: "ES_HOUSE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter House Number",
    labelKey: "ES_HOUSE_NUMBER_PLACEHOLDER"
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

const mohallaField = {
  label: {
      labelName: "Mohalla",
      labelKey: "ES_MOHALLA_LABEL"
  },
  placeholder: {
      labelName: "Enter Mohalla",
      labelKey: "ES_MOHALLA_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: true,
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.mohalla",
  afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 150) {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", screenName);
      }
      else {
          displayDefaultErr(action.componentJsonpath, dispatch, screenName);
      }
  }
}

const villageField = {
  label: {
      labelName: "Village",
      labelKey: "ES_VILLAGE_LABEL"
  },
  placeholder: {
      labelName: "Enter Village",
      labelKey: "ES_VILLAGE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: true,
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.village",
  afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 150) {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", screenName);
      }
      else {
          displayDefaultErr(action.componentJsonpath, dispatch, screenName);
      }
  }
}

const sizeOfAreaPurchasedField = {
  label: {
      labelName: "The size of area purchased",
      labelKey: "ES_SIZE_OF_AREA_PURCHASED_LABEL"
  },
  placeholder: {
      labelName: "Enter the size of area purchased",
      labelKey: "ES_SIZE_OF_AREA_PURCHASED_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: "Properties[0].propertyDetails.areaSqft"
}

const propertyDetailsHeader = getCommonTitle({
  labelName: "Property Details",
  labelKey: "ES_PROPERTY_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})
export const propertyDetails = getCommonCard({
  header: propertyDetailsHeader,
  detailsContainer: getCommonContainer({
    fileNumber: getTextField(fileNumberField),
    category: getSelectField(categoryField),
    subCategory: getSelectField(subCategoryField),
    siteNumber: getTextField(siteNumberField),
    sectorNumber: getSelectField(sectorNumberField),
    houseNumber: getTextField(houseNumberField),
    mohalla: getTextField(mohallaField),
    village: getTextField(villageField),
    sizeOfAreaPurchase: getTextField(sizeOfAreaPurchasedField)
  })
})