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
const propertyRegisteredToLabel = {
  labelName: "Property Registered To",
  labelKey: "ES_PROPERTY_REGISTERED_TO_LABEL"
}
const entityTypeLabel = {
  labelName: "Entity Type",
  labelKey: "ES_ENTITY_TYPE_LABEL"
}

const totalPenaltyLabel = {
  labelName: "Total Penalty",
  labelKey: "ES_TOTAL_PENALTY_LABEL"
}

const totalPenaltyDueLabel = {
  labelName: "Total Penalty Due",
  labelKey: "ES_TOTAL_PENALTY_DUE_LABEL"
}

const totalPenaltyPaidLabel = {
  labelName: "Total Penalty Paid",
  labelKey: "ES_TOTAL_PENALTY_PAID_LABEL"
}

const totalSecurityFeeLabel = {
  labelName: "Total Security Fee ",
  labelKey: "ES_TOTAL_SECURITY_FEE_LABEL"
}

const totalSecurityFeeCollectedLabel = {
  labelName: "Security Fee collected",
  labelKey: "ES_TOTAL_SECURITY_FEE_COLLECTED_LABEL"
}

const totalSecurityFeeDueLabel = {
  labelName: "Security Fee Due",
  labelKey: "ES_SECURITY_FEE_DUE_LABEL"
}

const totalExtensionFeeLabel = {
  labelName: "Total Extension Fee ",
  labelKey: "ES_TOTAL_EXTENSION_FEE_LABEL"
}

const totalExtensionFeePaidLabel = {
  labelName: "Extension Fee collected",
  labelKey: "ES_TOTAL_EXTENSION_FEE_COLLECTED_LABEL"
}

const totalExtensionFeeDueLabel = {
  labelName: "Extension Fee Due",
  labelKey: "ES_EXTENSION_FEE_DUE_LABEL"
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

export const masterEntryEditSection = (isEditable) => ({
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
        jsonPath: "Properties[0].propertyDetails.typeOfAllocation"
      }
    ),
    propertyRegisteredTo: getLabelWithValue(
      propertyRegisteredToLabel, {
        jsonPath: "Properties[0].propertyDetails.propertyRegisteredTo"
      }
    ),
    entityType: getLabelWithValue(
      entityTypeLabel, {
        jsonPath: "Properties[0].propertyDetails.entityType"
      }
    )
  })
})

export const penaltyInfo = (isEditable) => ({
  headerDiv: {
    ...headerDiv,
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: "Penalty Summary",
          labelKey: "ES_PENALTY_SUMMARY"
        })
      },
      editSection: masterEntryEditSection(isEditable, 0)
    }
  },
  viewFour: getCommonContainer({
    totalPenalty: getLabelWithValue(
      totalPenaltyLabel, {
        jsonPath: "PenaltyStatementSummary.totalPenalty"
      }
    ),
    totalPenaltyDue: getLabelWithValue(
      totalPenaltyDueLabel, {
        jsonPath: "PenaltyStatementSummary.totalPenaltyDue"
      }
    ),
    totalPenaltyPaid: getLabelWithValue(
      totalPenaltyPaidLabel, {
        jsonPath: "PenaltyStatementSummary.totalPenaltyPaid"
      }
    )
  })
})

export const securityInfo = (isEditable) => ({
  headerDiv: {
    ...headerDiv,
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: "Security Fee Summary",
          labelKey: "ES_SECURITY_FEE_SUMMARY"
        })
      },
      editSection: masterEntryEditSection(isEditable, 0)
    }
  },
  viewFour: getCommonContainer({
    totalSecurityFee: getLabelWithValue(
      totalSecurityFeeLabel, {
        jsonPath: "Properties[0].propertyDetails.paymentConfig.securityAmount"
      }
    ),
    totalSecurityFeeCollected: getLabelWithValue(
      totalSecurityFeeCollectedLabel, {
        jsonPath: ""
      }
    ),
    totalSecurityFeeDue: getLabelWithValue(
      totalSecurityFeeDueLabel, {
        jsonPath: "SecurityFee.totalPenaltyPaid"
      }
    )
  })
})

export const extensionFeeInfo = (isEditable) => ({
  headerDiv: {
    ...headerDiv,
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: " Extension Fee Summary",
          labelKey: "ES_EXTENSION_FEE_SUMMARY"
        })
      },
      editSection: masterEntryEditSection(isEditable, 0)
    }
  },
  viewFour: getCommonContainer({
    totalExtensionFee: getLabelWithValue(
      totalExtensionFeeLabel, {
        jsonPath: "ExtensionStatementSummary.totalExtensionFee"
      }
    ),
    totalExtensionFeeDue: getLabelWithValue(
      totalExtensionFeeDueLabel, {
        jsonPath: "ExtensionStatementSummary.totalExtensionFeeDue"
      }
    ),
    totalExtensionFeePaid: getLabelWithValue(
      totalExtensionFeePaidLabel, {
        jsonPath: "ExtensionStatementSummary.totalExtensionFeePaid"
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

  export const getReviewRentSummary = (isEditable = true) => {
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
                        labelName: "Rent Summary",
                        labelKey: "ES_RENT_SUMMARY_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable, 2)
            }
        },
        viewFour: getCommonContainer({
                totalDue: getLabelWithValue(
                    {
                        labelName: "Total Due ",
                        labelKey: "ES_TOTAL_DUE_LABEL"
                    },
                    { jsonPath: "Properties[0].estateRentSummary.balanceRent" }
                ),
                amountPaid: getLabelWithValue(
                    {
                        labelName: "Amount Paid",
                        labelKey: "ES_AMOUNT_PAID_LABEL"
                    },
                    { jsonPath: "Properties[0].estateRentSummary.collectedRent" }
                ),
                balanceGST: getLabelWithValue(
                  {
                      labelName: "Balance GST",
                      labelKey: "ES_BALANCE_GST_LABEL"
                  },
                  { jsonPath: "Properties[0].estateRentSummary.balanceGST" }
              ),
              balanceGSTPenalty: getLabelWithValue(
                  {
                      labelName: "Balance GST Penalty",
                      labelKey: "ES_BALANCE_GST_PENALTY_LABEL"
                  },
                  { jsonPath: "Properties[0].estateRentSummary.balanceGSTPenalty" }
              ),
              balanceRentPenalty: getLabelWithValue(
                  {
                      labelName: "Balance Rent Penalty",
                      labelKey: "ES_BALANCE_RENT_PENALTY_LABEL"
                  },
                  { jsonPath: "Properties[0].estateRentSummary.balanceRentPenalty" }
              ),
                outstanding: getLabelWithValue(
                    {
                        labelName: "Outstanding",
                        labelKey: "ES_OUTSTANDING_LABEL"
                    },
                    { jsonPath: "Properties[0].estateRentSummary.outstanding" }
                )
        })
    })
  } 