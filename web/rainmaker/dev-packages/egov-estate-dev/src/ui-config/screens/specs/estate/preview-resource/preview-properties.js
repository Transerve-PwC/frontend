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
  labelKey: "EST_ALLOCATION_TYPE_LABEL"
}
const auctionIdLabel = {
  labelName: "Auction Id",
  labelKey: "EST_AUCTION_ID_LABEL"
}
const modeOfAuctionLabel = {
  labelName: "Mode Of Auction",
  labelKey: "EST_MODE_OF_AUCTION_LABEL"
}
const schemeNameLabel = {
  labelName: "Scheme Name",
  labelKey: "EST_SCHEME_NAME_LABEL"
}
const dateOfAuctionLabel = {
  labelName: "Date of Auction",
  labelKey: "EST_DATE_OF_AUCTION_LABEL"
}
const emdAmountLabel = {
  labelName: "EMD Amount",
  labelKey: "EST_EMD_AMOUNT_LABEL"
}
const emdDateLabel = {
  labelName: "EMD Date",
  labelKey: "EST_EMD_DATE_LABEL"
}
const dateOfAllotmentLabel = {
  labelName: "Date of Allotment",
  labelKey: "EST_DATE_OF_ALLOTMENT_LABEL"
}
const allotmentNumberLabel = {
  labelName: "Allotment Number",
  labelKey: "EST_ALLOTMENT_NUMBER_LABEL"
}
const areaOfPropertyLabel = {
  labelName: "Area of Property",
  labelKey: "EST_AREA_OF_PROPERTY_LABEL"
}
const rateLabel = {
  labelName: "Rate",
  labelKey: "EST_RATE_LABEL"
}
const possessionDateLabel = {
  labelName: "Possession Date",
  labelKey: "EST_POSSESSION_DATE_LABEL"
}
const categoryLabel = {
  labelName: "Category",
  labelKey: "EST_CATEGORY_LABEL"
}
const subCategoryLabel = {
  labelName: "Sub Category",
  labelKey: "EST_SUBCATEGORY_LABEL"
}
const siteNumberLabel = {
  labelName: "Site Number",
  labelKey: "EST_SITE_NUMBER_LABEL"
}
const sectorNumberLabel = {
  labelName: "Sector Number",
  labelKey: "EST_SECTOR_NUMBER_LABEL"
}
const fileNumberLabel = {
  labelName: "File Number",
  labelKey: "EST_FILE_NUMBER_LABEL"
}
const lastNocDateLabel = {
  labelName: "Last NOC Date",
  labelKey: "EST_LAST_NOC_DATE_LABEL"
}
const propertyTypeLabel = {
  labelName: "Property Type",
  labelKey: "EST_PROPERTY_TYPE_LABEL"
}
const serviceCategoryLabel = {
  labelName: "Service Category",
  labelKey: "EST_SERVICE_CATEGORY_LABEL"
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
            labelKey: "TL_SUMMARY_EDIT"
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

export const getPropertyDetails = (isEditable = true) => {
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
              labelName: "Property INFO",
              labelKey: "EST_PROPERTY_INFO_HEADER"
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
              labelKey: "EST_AUCTION_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        auctionId: getLabelWithValue(
          auctionIdLabel, {
            jsonPath: `Properties[0].propertyDetails.auctionId`
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
              labelKey: "EST_ALLOTMENT_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 1)
        }
      },
      viewFour: getCommonContainer({
        dateOfAllotment: getLabelWithValue(
          dateOfAllotmentLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.dateOfAllotment`
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
              labelKey: "EST_ADDITIONAL_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        lastNocDate: getLabelWithValue(
          lastNocDateLabel, {
            jsonPath: "Properties[0].propertyDetails.lastNocDate"
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