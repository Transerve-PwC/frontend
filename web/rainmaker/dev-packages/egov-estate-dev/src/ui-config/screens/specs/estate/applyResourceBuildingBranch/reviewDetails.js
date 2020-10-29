import {
  getCommonCard,
  getCommonTitle,
  getLabelWithValue,
  getLabel,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate } from "../../utils";
import {
  changeStep
} from "./footer"

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "ES_SUMMARY_HEADER"
})

/* Property Details Review */
const possessionDateLabel = {
  labelName: "Possession Date",
  labelKey: "ES_POSSESSION_DATE_LABEL"
}
const categoryLabel = {
  labelName: "Category",
  labelKey: "ES_CATEGORY_LABEL"
}
const subCategoryLabel = {
  labelName: "Sub Category",
  labelKey: "ES_SUBCATEGORY_LABEL"
}
const siteNumberLabel = {
  labelName: "Site Number",
  labelKey: "ES_SITE_NUMBER_LABEL"
}
const sectorNumberLabel = {
  labelName: "Sector Number",
  labelKey: "ES_SECTOR_NUMBER_LABEL"
}
const fileNumberLabel = {
  labelName: "File Number",
  labelKey: "ES_FILE_NUMBER_LABEL"
}
const houseNumberLabel = {
  labelName: "House Number",
  labelKey: "ES_HOUSE_NUMBER_LABEL"
}
const mohallaLabel = {
  labelName: "Mohalla",
  labelKey: "ES_MOHALLA_LABEL"
}
const villageLabel = {
  labelName: "Village",
  labelKey: "ES_VILLAGE_LABEL"
}
const sizeOfAreaPurchasedLabel = {
  labelName: "Size of area purchased",
  labelKey: "ES_SIZE_OF_AREA_PURCHASED_LABEL"
}

export const editSection = {
  componentPath: "Button",
  props: {
    color: "primary"
  },
  gridDefination: {
    xs: 12,
    sm: 2,
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
      labelKey: "ES_SUMMARY_EDIT"
    })
  }
}

const masterEntryEditSection = (isEditable, step = 0) => ({
  ...editSection,
  visible: isEditable,
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      changeStep(state, dispatch, "apply-building-branch", "", step);
    }
  }
})

export const headerDiv = {
  uiFramework: "custom-atoms",
  componentPath: "Container",
  props: {
    style: {
      marginBottom: "10px"
    }
  }
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
        editSection: masterEntryEditSection(isEditable, 0, "apply-building-branch")
      }
    },
    viewDetails: getCommonContainer({
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
      ),
      fileNumber: getLabelWithValue(
        fileNumberLabel, {
          jsonPath: "Properties[0].fileNumber"
        }
      ),
      houseNumber: getLabelWithValue(
        houseNumberLabel, {
          jsonPath: "Properties[0].houseNumber"
        }
      ),
      mohalla: getLabelWithValue(
        mohallaLabel, {
          jsonPath: "Properties[0].mohalla"
        }
      ),
      village: getLabelWithValue(
        villageLabel, {
          jsonPath: "Properties[0].village"
        }
      ),
      sizeOfAreaPurchased: getLabelWithValue(
        sizeOfAreaPurchasedLabel, {
          jsonPath: "Properties[0].propertyDetails.sizeOfAreaPurchased"
        }
      )
    })
  })
}

/* Owner Details Review */
const ownerNameLabel = {
  labelName: "Name",
  labelKey: "ES_NAME_LABEL"
}
const fatherHusbandNameLabel = {
  labelName: "Father/Husband Name",
  labelKey: "ES_FATHER_HUSBAND_NAME_LABEL"
}
const relationshipLabel = {
  labelName: "Relationship",
  labelKey: "ES_RELATIONSHIP_LABEL"
}
const addressLabel = {
  labelName: "Address",
  labelKey: "ES_ADDRESS_LABEL"
}
const mobileNumberLabel = {
  labelName: "Mobile No.",
  labelKey: "ESTATE_MOBILE_NUMBER_LABEL"
}
const shareLabel = {
  labelName: "Share",
  labelKey: "ES_SHARE_LABEL"
}
const isCurrentOwnerLabel = {
  labelName: "Is Current Owner",
  labelKey: "ES_IS_CURRENT_OWNER_LABEL"
}

export const getReviewOwner = (isEditable = true, owner = 0) => {
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
            labelName: "Owner Details",
            labelKey: "ES_OWNER_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 2)
      }
    },
    viewFour: getCommonContainer({
      ownerName: getLabelWithValue(
        ownerNameLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.ownerName`
        }
      ),
      fatherHusbandName: getLabelWithValue(
        fatherHusbandNameLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.guardianName`
        }
      ),
      relationship: getLabelWithValue(
        relationshipLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.guardianRelation`
        }
      ),
      address: getLabelWithValue(
        addressLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.address`
        }
      ),
      mobileNumber: getLabelWithValue(
        mobileNumberLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.mobileNumber`
        }
      ),
      share: getLabelWithValue(
        shareLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].share`
        }
      ),
      isCurrentOwner: getLabelWithValue(
        isCurrentOwnerLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.isCurrentOwner`
        }
      ),
      possessionDate: getLabelWithValue(
        possessionDateLabel,
        {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.possesionDate`,
          callBack: convertEpochToDate
        }
      ),
    })
  })
}

export const reviewDetails = getCommonCard({
  header,
  reviewPropertyDetails: getReviewPropertyDetails()
})