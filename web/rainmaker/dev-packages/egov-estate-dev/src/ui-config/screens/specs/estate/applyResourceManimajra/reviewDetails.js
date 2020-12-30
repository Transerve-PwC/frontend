import {
  getCommonCard,
  getCommonTitle,
  getLabelWithValue,
  getLabel,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
 fileNumberLabel,
 mohallaLabel,
 categoryLabel, 
 subCategoryLabel,
 siteNumberLabel, 
 sectorNumberLabel,
 header,
 headerDiv
} from "../applyResourceBuildingBranch/reviewDetails";
import {
  propertyTypeLabel,
  getReviewAdditional,
  getReviewMonthlyDetals,
  getReviewAnnualDetails
} from "../applyResource/reviewProperty";
import { editSection } from "../applyResourceBuildingBranch/reviewDetails";
import { changeStep } from "./footer";

export const masterEntryEditSection = (isEditable, step = 0) => ({
  ...editSection,
  visible: isEditable,
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      changeStep(state, dispatch, "apply-manimajra", "", step);
    }
  }
})


const houseNumberLabel = {
  labelName: "House/Shop Number",
  labelKey: "ES_HOUSE_SHOP_NUMBER_LABEL"
}
const streetLabel = {
  labelName: "Street",
  labelKey: "ES_STREET_LABEL"
}
const areaOfPropertyLabel = {
  labelName: "Area of the Property(in sq yds)",
  labelKey: "ES_AREA_YDS_LABEL"
}

export const getReviewPropertyDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      ...headerDiv,
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Property Details",
            labelKey: "ES_PROPERTY_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 0, "apply-manimajra")
      }
    },
    viewDetails: getCommonContainer({
      fileNumber: getLabelWithValue(
        fileNumberLabel, {
          jsonPath: "Properties[0].fileNumber"
        }
      ),
      houseNumber: getLabelWithValue(
        houseNumberLabel, {
          jsonPath: "Properties[0].propertyDetails.houseNumber"
        }
      ),
      mohalla: getLabelWithValue(
        mohallaLabel, {
          jsonPath: "Properties[0].propertyDetails.mohalla"
        }
      ),
      street: getLabelWithValue(
        streetLabel, {
          jsonPath: "Properties[0].propertyDetails.street"
        }
      ),
      areaOfProperty: getLabelWithValue(
        areaOfPropertyLabel, {
          jsonPath: "Properties[0].propertyDetails.areaSqft"
        }
      ),
      propertyType: getLabelWithValue(
        propertyTypeLabel, {
          jsonPath: "Properties[0].propertyDetails.propertyType"
        }
      ),
      category: getLabelWithValue(
        categoryLabel, {
          jsonPath: "Properties[0].category"
        }
      ),
      subCategory: getLabelWithValue(
        subCategoryLabel, {
          jsonPath: "Properties[0].subCategory"
        }
      ),
      siteNumber: getLabelWithValue(
        siteNumberLabel, {
          jsonPath: "Properties[0].siteNumber"
        }
      ),
      sectorNumber: getLabelWithValue(
        sectorNumberLabel, {
          jsonPath: "Properties[0].sectorNumber"
        }
      )
    })
  })
}

export const getPropertyInfoManimajra = (isEditable = true) => ({
  headerDiv: {
    ...headerDiv,
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: "Property Details",
          labelKey: "ES_PROPERTY_DETAILS_HEADER"
        })
      },
      editSection: masterEntryEditSection(isEditable, 0, "apply-manimajra")
    }
  },
  viewDetails: getCommonContainer({
    fileNumber: getLabelWithValue(
      fileNumberLabel, {
        jsonPath: "Properties[0].fileNumber"
      }
    ),
    houseNumber: getLabelWithValue(
      houseNumberLabel, {
        jsonPath: "Properties[0].propertyDetails.houseNumber"
      }
    ),
    mohalla: getLabelWithValue(
      mohallaLabel, {
        jsonPath: "Properties[0].propertyDetails.mohalla"
      }
    ),
    street: getLabelWithValue(
      streetLabel, {
        jsonPath: "Properties[0].propertyDetails.street"
      }
    ),
    areaOfProperty: getLabelWithValue(
      areaOfPropertyLabel, {
        jsonPath: "Properties[0].propertyDetails.areaSqft"
      }
    ),
    propertyType: getLabelWithValue(
      propertyTypeLabel, {
        jsonPath: "Properties[0].propertyDetails.propertyType"
      }
    ),
    category: getLabelWithValue(
      categoryLabel, {
        jsonPath: "Properties[0].category"
      }
    ),
    subCategory: getLabelWithValue(
      subCategoryLabel, {
        jsonPath: "Properties[0].subCategory"
      }
    ),
    siteNumber: getLabelWithValue(
      siteNumberLabel, {
        jsonPath: "Properties[0].siteNumber"
      }
    ),
    sectorNumber: getLabelWithValue(
      sectorNumberLabel, {
        jsonPath: "Properties[0].sectorNumber"
      }
    )
  })
})

export const reviewDetails = getCommonCard({
  header,
  reviewPropertyDetails: getReviewPropertyDetails(),
  reviewAdditional: getReviewAdditional(true, "apply-manimajra"),
  annualDetails: getReviewAnnualDetails(true,"apply-manimajra"),
  monthlyDetails: getReviewMonthlyDetals(true,"apply-manimajra")
})