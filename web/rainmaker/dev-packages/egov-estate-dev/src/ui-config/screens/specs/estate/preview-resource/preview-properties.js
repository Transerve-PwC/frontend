import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getDivider,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, } from "../../utils";
// import { changeStep } from "./footer";



const allocationTypeLabel = {
  labelName: "Type of Allocation",
  labelKey: "ES_ALLOCATION_TYPE_LABEL"
}
const auctionIdLabel = {
  labelName: "Auction Id",
  labelKey: "ES_AUCTION_ID_LABEL"
}
const modeOfAuctionLabel = {
  labelName: "Mode Of Auction",
  labelKey: "ES_MODE_OF_AUCTION_LABEL"
}
const schemeNameLabel = {
  labelName: "Scheme Name",
  labelKey: "ES_SCHEME_NAME_LABEL"
}
const dateOfAuctionLabel = {
  labelName: "Date of Auction",
  labelKey: "ES_DATE_OF_AUCTION_LABEL"
}
const emdAmountLabel = {
  labelName: "EMD Amount",
  labelKey: "ES_EMD_AMOUNT_LABEL"
}
const emdDateLabel = {
  labelName: "EMD Date",
  labelKey: "ES_EMD_DATE_LABEL"
}
const dateOfAllotmentLabel = {
  labelName: "Date of Allotment",
  labelKey: "ES_DATE_OF_ALLOTMENT_LABEL"
}
const allotmentNumberLabel = {
  labelName: "Allotment Number",
  labelKey: "ES_ALLOTMENT_NUMBER_LABEL"
}
const areaOfPropertyLabel = {
  labelName: "Area of Property",
  labelKey: "ES_AREA_OF_PROPERTY_LABEL"
}
const rateLabel = {
  labelName: "Rate",
  labelKey: "ES_RATE_LABEL"
}
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
const lastNocDateLabel = {
  labelName: "Last NOC Date",
  labelKey: "ES_LAST_NOC_DATE_LABEL"
}
const propertyTypeLabel = {
  labelName: "Property Type",
  labelKey: "ES_PROPERTY_TYPE_LABEL"
}
const serviceCategoryLabel = {
  labelName: "Service Category",
  labelKey: "ES_SERVICE_CATEGORY_LABEL"
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

const masterEntryEditSection = (isEditable) => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "apply", "", 0);
        }
    }
})

export const headerDiv = {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
        style: { marginBottom: "10px" }
    }
}

export const propertyInfo = (isEditable) => ({
  headerDiv: {
    ...headerDiv,
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: "Property INFO",
          labelKey: "ES_PROPERTY_INFO_HEADER"
        })
      },
      editSection: masterEntryEditSection(isEditable, 0)
    }
  },
  viewFour: getCommonContainer({
    fileNumber: getLabelWithValue(
      fileNumberLabel, {
        jsonPath: "Properties[0].fileNumber"
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
    ),
    areaOfProperty: getLabelWithValue(
      areaOfPropertyLabel, {
        jsonPath: "Properties[0].propertyDetails.areaSqft"
      }
    ),
    rate: getLabelWithValue(
      rateLabel, {
        jsonPath: "Properties[0].propertyDetails.ratePerSqft"
      }
    ),
    allocationType: getLabelWithValue(
      allocationTypeLabel, {
        jsonPath: "Properties[0].propertyDetails.allocationType"
      }
    )
  })
})

export const getPropertyDetails = (isEditable = true) => {
    return getCommonGrayCard(propertyInfo(isEditable))
  }


  export const getReviewAuction = (isEditable = true) => {
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
              labelName: "Auction Details",
              labelKey: "ES_AUCTION_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        auctionId: getLabelWithValue(
          auctionIdLabel, {
            jsonPath: `Properties[0].propertyDetails.bidders[0].auctionId`
          }
        ),
        modeOfAuction: getLabelWithValue(
          modeOfAuctionLabel, {
            jsonPath: "Properties[0].propertyDetails.modeOfAuction"
          }
        ),
        schemeName: getLabelWithValue(
          schemeNameLabel, {
            jsonPath: "Properties[0].propertyDetails.schemeName"
          }
        ),
        dateOfAuction: getLabelWithValue(
          dateOfAuctionLabel, {
            jsonPath: "Properties[0].propertyDetails.dateOfAuction",
            callBack: convertEpochToDate
          }
        ),
        emdAmount: getLabelWithValue(
          emdAmountLabel, {
            jsonPath: `Properties[0].propertyDetails.emdAmount`,
          }
        ),
        emdDate: getLabelWithValue(
          emdDateLabel, {
            jsonPath: "Properties[0].propertyDetails.emdDate",
            callBack: convertEpochToDate
          }
        ),
      })
    })
  }

  export const getAllotmentDetails = (isEditable = true, owner = 0) => {
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
              labelName: "Allotments Details",
              labelKey: "ES_ALLOTMENT_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 1)
        }
      },
      viewFour: getCommonContainer({
        dateOfAllotment: getLabelWithValue(
          dateOfAllotmentLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.dateOfAllotment`,
            callBack: convertEpochToDate
          }
        ),
        allotmentNumber: getLabelWithValue(
          allotmentNumberLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.allotmentNumber`
          }
        )
      })
    })
  }

  export const getAdditionalDetails = (isEditable = true) => {
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
              labelName: "Additional Details",
              labelKey: "ES_ADDITIONAL_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        lastNocDate: getLabelWithValue(
          lastNocDateLabel, {
            jsonPath: "Properties[0].propertyDetails.lastNocDate",
            callBack: convertEpochToDate
          }
        ),
        serviceCategory: getLabelWithValue(
          serviceCategoryLabel, {
            jsonPath: "Properties[0].propertyDetails.serviceCategory"
          }
        )
      })
    })
  }