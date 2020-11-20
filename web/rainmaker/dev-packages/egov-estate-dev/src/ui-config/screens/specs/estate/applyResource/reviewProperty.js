import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getDivider,
  getLabel,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  convertEpochToDate,
} from "../../utils";
import {
  changeStep
} from "./footer";
import {
  changeStep as changeStepAllotment
}
from "./footerAllotment"
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { changeStep as changeStepManimajra} from "../applyResourceManimajra/footer";

const allocationTypeLabel = {
  labelName: "Type of Allocation",
  labelKey: "ES_ALLOCATION_TYPE_LABEL"
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
export const propertyTypeLabel = {
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

const masterEntryEditSection = (isEditable, step = 0, screenkey = "apply") => ({
  ...editSection,
  visible: isEditable,
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      switch(screenkey) {
        case "apply":
          changeStep(state, dispatch, screenkey, "", step);
          break;
        case "allotment":
          changeStepAllotment(state, dispatch, screenkey, "", step);
          break;
        case "apply-manimajra": 
          changeStepManimajra(state, dispatch, screenkey, "", step);
          break;
        default:
          break;
      }
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

export const getReviewPropertyInfo = (isEditable = true, screenkey = "apply") => {
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
            labelKey: "ES_PROPERTY_INFO_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 0, screenkey)
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
}

export const getReviewAdditional = (isEditable = true, screenkey = "apply") => {
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
            labelName: "NOC Details",
            labelKey: "ES_NOC_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 0, screenkey)
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

/* Owner review */
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
const dobLabel = {
  labelName: "Date of Birth",
  labelKey: "ES_DOB_LABEL"
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
const cpNumberLabel = {
  labelName: "CP No.",
  labelKey: "ES_CP_NUMBER_LABEL"
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
            labelName: "Owner/Partner Details",
            labelKey: "ES_OWNER_PARTNER_DETAILS_HEADER"
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
      dob: getLabelWithValue(
        dobLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.dob`,
          callBack: convertEpochToDate
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
      cpNumber: getLabelWithValue(
        cpNumberLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].cpNumber`
        }
      ),
      possessionDate: getLabelWithValue(
        possessionDateLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.possesionDate`,
          callBack: convertEpochToDate
        }
      ),
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

/* purchaser review */
const newOwnerNameLabel = {
  labelName: "Previous Owner Name",
  labelKey: "ES_PREVIOUS_OWNER_NAME_LABEL"
}
const newOwnerFatherHusbandNameLabel = {
  labelName: "Previous Owner Father/Husband Name",
  labelKey: "ES_PREVIOUS_OWNER_FATHER_HUSBAND_NAME_LABEL"
}
const newOwnerAddressLabel = {
  labelName: "Previous Owner Address",
  labelKey: "ES_PREVIOUS_OWNER_ADDRESS_LABEL"
}
const newOwnerMobileNumberLabel = {
  labelName: "Previous Owner Mobile No.",
  labelKey: "ES_PREVIOUS_OWNER_MOBILE_NUMBER_LABEL"
}
const sellerNameLabel = {
  labelName: "Seller Name",
  labelKey: "ES_SELLER_NAME_LABEL"
}
const sellerFatherHusbandNameLabel = {
  labelName: "Seller Father/Husband Name",
  labelKey: "ES_SELLER_FATHER_HUSBAND_NAME_LABEL"
}
const percentShareLabel = {
  labelName: "% Share",
  labelKey: "ES_PERCENT_SHARE_LABEL"
}
const modeOfTransferLabel = {
  labelName: "Mode of Transfer",
  labelKey: "ES_MODE_OF_TRANSFER_LABEL"
}

export const getReviewPurchaser = (isEditable = true, purchaser = 0, step = 4, screenKey = "apply") => {
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
            labelName: "Previous Owner Details",
            labelKey: "ES_PREVIOUS_OWNER_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, step, screenKey)
      }
    },
    viewFour: getCommonContainer({
      newOwnerName: getLabelWithValue(
        newOwnerNameLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.ownerName`
        }
      ),
      newOwnerFatherHusbandName: getLabelWithValue(
        newOwnerFatherHusbandNameLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.guardianName`
        }
      ),
      relationship: getLabelWithValue(
        relationshipLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.guardianRelation`
        }
      ),
      dob: getLabelWithValue(
        dobLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.dob`,
          callBack: convertEpochToDate
        }
      ),
      newOwnerAddress: getLabelWithValue(
        newOwnerAddressLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.address`
        }
      ),
      newOwnerMobileNumber: getLabelWithValue(
        newOwnerMobileNumberLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.mobileNumber`
        }
      ),
      sellerName: getLabelWithValue(
        sellerNameLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.sellerName`
        }
      ),
      sellerFatherHusbandName: getLabelWithValue(
        sellerFatherHusbandNameLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.sellerGuardianName`
        }
      ),
      sellerRelationship: getLabelWithValue(
        relationshipLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.sellerRelation`
        }
      ),
      percentShare: getLabelWithValue(
        percentShareLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].share`
        }
      ),
      modeOfTransfer: getLabelWithValue(
        modeOfTransferLabel, {
          jsonPath: `Properties[0].propertyDetails.purchaser[${purchaser}].ownerDetails.modeOfTransfer`
        }
      )
    })
  })
}

/* Ground rent review */
/* const dueDateOfPaymentLabel = {
  labelName: "Due Date of payment",
  labelKey: "ES_DUE_DATE_OF_PAYMENT_LABEL"
}
const payableLabel = {
  labelName: "Payable",
  labelKey: "ES_PAYABLE_LABEL"
}
const amountOfGRLabel = {
  labelName: "Amount of GR",
  labelKey: "ES_AMOUNT_OF_GR_LABEL"
}
const totalGRLabel = {
  labelName: "Total GR",
  labelKey: "ES_TOTAL_GR_LABEL"
}
const dateOfDepositLabel = {
  labelName: "Date of Deposit",
  labelKey: "ES_DATE_OF_DEPOSIT_LABEL"
}
const delayInPaymentLabel = {
  labelName: "Delay in Payment",
  labelKey: "ES_DELAY_IN_PAYMENT_LABEL"
}
const interestForDelayLabel = {
  labelName: "Interest for Delay",
  labelKey: "ES_INTERES_FOR_DELAY_LABEL"
}
const totalAmountDueWithInterestLabel = {
  labelName: "Total Amount Due with Interest",
  labelKey: "ES_TOTAL_AMOUNT_DUE_WITH_INTERES_LABEL"
}
const amountDepositedGRLabel = {
  labelName: "Amount Deposited GR",
  labelKey: "ES_AMOUNT_DEPOSITED_GR_LABEL"
}
const amountDepositedInttLabel = {
  labelName: "Amount Deposited Intt",
  labelKey: "ES_AMOUNT_DEPOSITED_INTT_LABEL"
}
const balanceGRLabel = {
  labelName: "Balance(+due, -excess) GR",
  labelKey: "ES_BALANCE_GR_LABEL"
}
const balanceInttLabel = {
  labelName: "Balance(+due, -excess) Intt",
  labelKey: "ES_BALANCE_INTT_LABEL"
}
const totalDueLabel = {
  labelName: "Total Due",
  labelKey: "ES_TOTAL_DUE_LABEL"
}
const receiptNumberLabel = {
  labelName: "Receipt No.",
  labelKey: "ES_RECEIPT_NUMBER_LABEL"
}
const receiptDateLabel = {
  labelName: "Receipt Date",
  labelKey: "ES_RECEIPT_DATE_LABEL"
}

export const groundRentHeader = getCommonTitle({
  labelName: "Ground Rent Details",
  labelKey: "ES_GROUND_RENT_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18,
    width: "100%"
  }
})

export const serviceTaxHeader = getCommonTitle({
  labelName: "Service Tax/GST Details",
  labelKey: "ES_SERVICE_TAX_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18,
    width: "100%"
  }
})*/

/* Service tax review */
/* const rateOfStOrGstLabel = {
  labelName: "Rate of ST/GST",
  labelKey: "ES_RATE_ST_GST_LABEL"
}
const amountOfGstLabel = {
  labelName: "Amount of GST",
  labelKey: "ES_AMOUNT_OF_GST_LABEL"
}
const amountDueLabel = {
  labelName: "Amount Due",
  labelKey: "ES_AMOUNT_DUE_LABEL"
}
const amountDepositedSTLabel = {
  labelName: "Amount Deposited ST/GST",
  labelKey: "ES_AMOUNT_DEPOSITED_ST_LABEL"
}
const balanceStLabel = {
  labelName: "Balance ST/GST",
  labelKey: "ES_BALANCE_ST_LABEL"
}
const balanceInttLabelST = {
  labelName: "Balance Intt",
  labelKey: "ES_BALANCE_INTT_LABEL"
}
const paymentMadeByLabel = {
  labelName: "Payment Made By",
  labelKey: "ES_PAYMENT_MADE_BY_LABEL"
}

export const getReviewPayment = (isEditable = true, owner) => {
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
            labelName: "Payment Details",
            labelKey: "ES_PAYMENT_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 7)
      }
    },
    viewGroundRent: getCommonContainer({
      header: groundRentHeader,
      dueDateOfPayment: getLabelWithValue(
        dueDateOfPaymentLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grDueDateOfPayment`,
          callBack: convertEpochToDate
        }
      ),
      payable: getLabelWithValue(
        payableLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grPayable`
        }
      ),
      amountOfGR: getLabelWithValue(
        amountOfGRLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grAmountOfGr`
        }
      ),
      totalGR: getLabelWithValue(
        totalGRLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grTotalGr`
        }
      ),
      dateOfDeposit: getLabelWithValue(
        dateOfDepositLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grDateOfDeposit`,
          callBack: convertEpochToDate
        }
      ),
      delayInPayment: getLabelWithValue(
        delayInPaymentLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grDelayInPayment`
        }
      ),
      interestForDelay: getLabelWithValue(
        interestForDelayLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grInterestForDelay`
        }
      ),
      totalAmountDueWithInterest: getLabelWithValue(
        totalAmountDueWithInterestLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grTotalAmountDueWithInterest`
        }
      ),
      amountDepositedGR: getLabelWithValue(
        amountDepositedGRLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grAmountDepositedGr`
        }
      ),
      amountDepositedIntt: getLabelWithValue(
        amountDepositedInttLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grAmountDepositedIntt`
        }
      ),
      balanceGR: getLabelWithValue(
        balanceGRLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grBalanceGr`
        }
      ),
      balanceIntt: getLabelWithValue(
        balanceInttLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grBalanceIntt`
        }
      ),
      totalDue: getLabelWithValue(
        totalDueLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grTotalDue`
        }
      ),
      receiptNumber: getLabelWithValue(
        receiptNumberLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grReceiptNumber`
        }
      ),
      receiptDate: getLabelWithValue(
        receiptDateLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].grReceiptDate`,
          callBack: convertEpochToDate
        }
      )
    }),
    viewServiceTax: getCommonContainer({
      header: serviceTaxHeader,
      rateOfStOrGst: getLabelWithValue(
        rateOfStOrGstLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stRateOfStGst`
        }
      ),
      amountOfGst: getLabelWithValue(
        amountOfGstLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stAmountOfGst`
        }
      ),
      amountDue: getLabelWithValue(
        amountDueLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stAmountDue`
        }
      ),
      dateOfDeposit: getLabelWithValue(
        dateOfDepositLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stDateOfDeposit`,
          callBack: convertEpochToDate
        }
      ),
      delayInPayment: getLabelWithValue(
        delayInPaymentLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stDelayInPayment`
        }
      ),
      interestForDelay: getLabelWithValue(
        interestForDelayLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stInterestForDelay`
        }
      ),
      totalAmountDueWithInterest: getLabelWithValue(
        totalAmountDueWithInterestLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stTotalAmountDueWithInterest`
        }
      ),
      amountDepositedSt: getLabelWithValue(
        amountDepositedSTLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stAmountDepositedStGst`
        }
      ),
      amountDepositedIntt: getLabelWithValue(
        amountDepositedInttLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stAmountDepositedIntt`
        }
      ),
      balanceSt: getLabelWithValue(
        balanceStLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stBalanceStGst`
        }
      ),
      balanceIntt: getLabelWithValue(
        balanceInttLabelST, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stBalanceIntt`
        }
      ),
      totalDue: getLabelWithValue(
        totalDueLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stTotalDue`
        }
      ),
      receiptNumber: getLabelWithValue(
        receiptNumberLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stReceiptNumber`
        }
      ),
      receiptDate: getLabelWithValue(
        receiptDateLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stReceiptDate`,
          callBack: convertEpochToDate
        }
      ),
      paymentMadeBy: getLabelWithValue(
        paymentMadeByLabel, {
          jsonPath: `Properties[0].propertyDetails.owners[${owner}].ownerDetails.paymentDetails[0].stPaymentMadeBy`
        }
      )
    })
  })
} */


/* Court case review */
const estateOfficerCourtLabel = {
  labelName: "Estate Officer Court",
  labelKey: "ES_ESTATE_OFFICER_COURT_LABEL"
}
const commissionersCourtLabel = {
  labelName: "Commissioners Court",
  labelKey: "ES_COMMISSIONERS_COURT_LABEL"
}
const chiefAdministratorsCourtLabel = {
  labelName: "Chief Administrators Court",
  labelKey: "ES_CHIEF_ADMINISTRATORS_COURT_LABEL"
}
const advisorToAdminCourtLabel = {
  labelName: "Advisor to Admin Court",
  labelKey: "ES_ADVISOR_TO_ADMIN_COURT_LABEL"
}
const honbleDistrictCourtLabel = {
  labelName: "Hon'ble District Court",
  labelKey: "ES_HONBLE_DISTRICT_COURT_LABEL"
}
const honbleHighCourtLabel = {
  labelName: "Hon'ble High Court",
  labelKey: "ES_HONBLE_HIGH_COURT_LABEL"
}
const honbleSupremeCourtLabel = {
  labelName: "Hon'ble Supreme Court",
  labelKey: "ES_HONBLE_SUPREME_COURT_LABEL"
}

export const getReviewCourtCase = (isEditable = true, owner = 0, step = 6, screenKey = "apply") => {
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
            labelName: "Court Case Details",
            labelKey: "ES_COURT_CASE_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, step, screenKey)
      }
    },
    viewFour: getCommonContainer({
      estateOfficerCourt: getLabelWithValue(
        estateOfficerCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].estateOfficerCourt`
        }
      ),
      commissionersCourt: getLabelWithValue(
        commissionersCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].commissionersCourt`
        }
      ),
      chiefAdministratorsCourt: getLabelWithValue(
        chiefAdministratorsCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].chiefAdministartorsCourt`
        }
      ),
      advisorToAdminCourt: getLabelWithValue(
        advisorToAdminCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].advisorToAdminCourt`
        }
      ),
      honbleDistrictCourt: getLabelWithValue(
        honbleDistrictCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].honorableDistrictCourt`
        }
      ),
      honbleHighCourt: getLabelWithValue(
        honbleHighCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].honorableHighCourt`
        }
      ),
      honbleSupremeCourt: getLabelWithValue(
        honbleSupremeCourtLabel, {
          jsonPath: `Properties[0].propertyDetails.courtCases[${owner}].honorableSupremeCourt`
        }
      )
    })
  })
}

export const getReviewPremiumAmount = (isEditable = true) => {
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
            labelName: "Premium Amount Details",
            labelKey: "ES_PREMIUM_AMOUNT_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 5, "allotment")
      }
    },
    viewPremiumAmount: getCommonContainer({
      premiumAmount: getLabelWithValue(
        {
          labelName: "Premium Amount",
          labelKey: "ES_PREMIUM_AMOUNT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.totalAmount`
        }
      )
    }),
    viewInstallments: getCommonContainer({})
  })
}

export const getReviewGroundRent = (isEditable = true) => {
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
            labelName: "Ground Rent Details",
            labelKey: "ES_GROUND_RENT_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 5, "allotment")
      }
    },
    viewGroundRent: getCommonContainer({
      groundRentGenerationType: getLabelWithValue(
        {
          labelName: "Ground Rent Generation Type",
          labelKey: "ES_GROUND_RENT_GENERATION_TYPE_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentGenerationType`
        }
      ),
      billingStartDate: getLabelWithValue(
        {
          labelName: "Billing Start Date",
          labelKey: "ES_BILLING_START_DATE_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentBillStartDate`,
          callBack: convertEpochToDate
        }
      ),
      dateToGenerateDemandRent: getLabelWithValue(
        {
          labelName: "Date to Generate the Demand/Rent",
          labelKey: "ES_DATE_TO_GENERATE_DEMAND_RENT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentGenerateDemand`,
          callBack: convertEpochToDate
        }
      )
    }),
    viewRents: getCommonContainer({})
  })
}

export const getReviewAdvanceRent = (isEditable = true) => {
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
            labelName: "Advance Rent Details",
            labelKey: "ES_ADVANCE_RENT_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 5, "allotment")
      }
    },
    viewAdvanceRent: getCommonContainer({
      advanceRent: getLabelWithValue(
        {
          labelName: "Advance Rent",
          labelKey: "ES_ADVANCED_RENT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentAdvanceRent`
        }
      ),
      dateOfPaymentOfAdvanceRent: getLabelWithValue(
        {
          labelName: "Date of Payment of Advance Rent",
          labelKey: "ES_DATE_OF_PAYMENT_OF_ADVANCE_RENT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentAdvanceRentDate`,
          callBack: convertEpochToDate
        }
      )
    })
  })
}

export const getReviewLicenseFee = (isEditable = true) => {
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
            labelName: "License Fee Details",
            labelKey: "ES_LICENSE_FEE_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 5, "allotment")
      }
    },
    viewLicenseFee: getCommonContainer({
      demandDenerationType: getLabelWithValue(
        {
          labelName: "License Fee Generation Type",
          labelKey: "ES_LICENSE_FEE_GENERATION_TYPE_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentGenerationType`
        }
      ),
      dateToGenerateDemand: getLabelWithValue(
        {
          labelName: "Date to Generate the Demand/License Fee",
          labelKey: "ES_DATE_TO_GENERATE_DEMAND_LICENSE_FEE_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentGenerateDemand`,
          callBack: convertEpochToDate
        }
      ),
      billingStartDate: getLabelWithValue(
        {
          labelName: "Billing Start Date",
          labelKey: "ES_BILLING_START_DATE_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.groundRentBillStartDate`,
          callBack: convertEpochToDate
        }
      )
    }),
    viewLicenses: getCommonContainer({})
  })
}

export const getReviewSecurity = (isEditable = true) => {
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
            labelName: "Security Details",
            labelKey: "ES_SECURITY_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 5, "allotment")
      }
    },
    viewSecurity: getCommonContainer({
      securityFeeAmount: getLabelWithValue(
        {
          labelName: "Security Fee Amount",
          labelKey: "ES_SECURITY_FEE_AMOUNT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.securityAmount`
        }
      ),
      securityFeeDateOfPayment: getLabelWithValue(
        {
          labelName: "Date of Payment",
          labelKey: "ES_DATE_OF_PAYMENT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.paymentConfig.dueDateOfPayment`,
          callBack: convertEpochToDate
        }
      )
    })
  })
}

export const getReviewAuction = (isEditable = true, screenName) => {
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
        editSection: masterEntryEditSection(isEditable, 1, screenName)
      }
    },
    viewAuctionDetails: getCommonContainer({
      auctionId: getLabelWithValue(
        {
          labelName: "Auction Id",
          labelKey: "ES_AUCTION_ID_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.bidders[0].auctionId`
        }
      ),
      schemeName: getLabelWithValue(
        {
          labelName: "Scheme Name",
          labelKey: "ES_SCHEME_NAME_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.schemeName`
        }
      ),
      dateOfAuction: getLabelWithValue(
        {
          labelName: "Date Of Auction",
          labelKey: "ES_DATE_OF_AUCTION_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.dateOfAuction`,
          callBack: convertEpochToDate
        }
      ),
      modeOfAuction: getLabelWithValue(
        {
          labelName: "Mode Of Auction",
          labelKey: "ES_MODE_OF_AUCTION_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.modeOfAuction`
        }
      ),
      emdAmount: getLabelWithValue(
        {
          labelName: "EMD Amount",
          labelKey: "ES_EMD_AMOUNT_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.emdAmount`,
        }
      ),
      emdAmountDate: getLabelWithValue(
        {
          labelName: "EMD Date",
          labelKey: "ES_EMD_DATE_LABEL"
        }, 
        {
          jsonPath: `Properties[0].propertyDetails.emdDate`,
          callBack: convertEpochToDate
        }
      )
    })
  })
}

export const getReviewAllotmentMultipleSectionDetails = (state, dispatch, screenName, screenpath, type, count) => {
  var detailsObj = {};
  
  switch(type) {
    case "premiumAmount": 
      for (var i=0; i<count; i++) {
        detailsObj[`installment_${i}`] = getLabelWithValue(
          {
            labelName: "Installment",
            labelKey: "ES_INSTALLMENT_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems[${i}].premiumAmount`
          }
        );
      
        detailsObj[`dueDateForInstallment_${i}`] = getLabelWithValue(
          {
            labelName: "Due Date for Installment",
            labelKey: "ES_DUE_DATE_INSTALLMENT_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems[${i}].premiumAmountDate`,
            callBack: convertEpochToDate
          }
        )
      }
      break;
    case "groundRent":
      for (var i=0; i<count; i++) {
        detailsObj[`rentAmount_${i}`] = getLabelWithValue(
          {
            labelName: "Rent Amount",
            labelKey: "ES_RENT_AMOUNT_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${i}].groundRentAmount`
          }
        );
      
        detailsObj[`startYear_${i}`] = getLabelWithValue(
          {
            labelName: "Start Year",
            labelKey: "ES_START_YEAR_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${i}].groundRentStartMonth`
          }
        )

        detailsObj[`endYear_${i}`] = getLabelWithValue(
          {
            labelName: "End Year",
            labelKey: "ES_END_YEAR_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${i}].groundRentEndMonth`
          }
        )
      }
      break;

    case "licenseFee":
      for (var i=0; i<count; i++) {
        detailsObj[`licenseFee_${i}`] = getLabelWithValue(
          {
            labelName: "License Fee",
            labelKey: "ES_LICENSE_FEE_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${i}].groundRentAmount`
          }
        );
      
        detailsObj[`startYear_${i}`] = getLabelWithValue(
          {
            labelName: "Start Year",
            labelKey: "ES_START_YEAR_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${i}].groundRentStartMonth`
          }
        )

        detailsObj[`endYear_${i}`] = getLabelWithValue(
          {
            labelName: "End Year",
            labelKey: "ES_END_YEAR_LABEL"
          }, 
          {
            jsonPath: `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${i}].groundRentEndMonth`
          }
        )
      }
      break;
  }
  dispatch(
    handleField(
      screenName,
      screenpath,
      "children",
      detailsObj
    )
  )
}

export const getReviewCompanyDetails = (isEditable = true, screenkey = "apply") => {
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
            labelName: "Company Details",
            labelKey: "ES_COMPANY_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 2, screenkey)
      }
    },
    viewFour: getCommonContainer({
      companyName: getLabelWithValue(
        {
          labelName: "Company Name",
          labelKey: "ES_COMPANY_NAME_LABEL"
        }, 
        {
          jsonPath: "Properties[0].propertyDetails.companyName",
        }
      ),
      companyRegistrationNumber: getLabelWithValue(
        {
          labelName: "Company Registration Number",
          labelKey: "ES_COMPANY_REG_NO_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.companyRegistrationNumber"
        }
      ),
      companyRegistrationDate: getLabelWithValue(
        {
          labelName: "Registration Date",
          labelKey: "ES_REGISTRATION_DATE_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.companyRegistrationDate",
          callBack: convertEpochToDate
        }
      ),
      companyAddress: getLabelWithValue(
        {
          labelName: "Company Address",
          labelKey: "ES_COMPANY_ADDRESS_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.companyAddress"
        }
      )
    })
  })
}

export const getReviewFirmDetails = (isEditable = true, screenkey = "apply") => {
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
            labelName: "Firm Details",
            labelKey: "ES_FIRM_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 2, screenkey)
      }
    },
    viewFour: getCommonContainer({
      firmName: getLabelWithValue(
        {
          labelName: "Firm Name",
          labelKey: "ES_FIRM_NAME_LABEL"
        }, 
        {
          jsonPath: "Properties[0].propertyDetails.companyName",
        }
      ),
      firmRegistrationNumber: getLabelWithValue(
        {
          labelName: "Firm Registration Number",
          labelKey: "ES_FIRM_REG_NO_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.companyRegistrationNumber"
        }
      ),
      firmRegistrationDate: getLabelWithValue(
        {
          labelName: "Registration Date",
          labelKey: "ES_REGISTRATION_DATE_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.companyRegistrationDate",
          callBack: convertEpochToDate
        }
      ),
      firmAddress: getLabelWithValue(
        {
          labelName: "Firm Address",
          labelKey: "ES_FIRM_ADDRESS_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.companyAddress"
        }
      )
    })
  })
}

export const getReviewProprietorshipDetails = (isEditable = true, screenkey = "apply") => {
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
            labelName: "Proprietorship Details",
            labelKey: "ES_PROPRIETORSHIP_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable, 2, screenkey)
      }
    },
    viewFour: getCommonContainer({
      proprietorName: getLabelWithValue(
        {
          labelName: "Name",
          labelKey: "ES_NAME_LABEL"
        }, 
        {
          jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.ownerName",
        }
      ),
      gaurdianName: getLabelWithValue(
        {
          labelName: "Father/Husband Name",
          labelKey: "ES_FATHER_HUSBAND_NAME_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.guardianName"
        }
      ),
      address: getLabelWithValue(
        {
          labelName: "Address",
          labelKey: "ES_ADDRESS_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.address"
        }
      ),
      mobileNumber: getLabelWithValue(
        {
          labelName: "Mobile Number",
          labelKey: "ESTATE_MOBILE_NUMBER_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.mobileNumber"
        }
      ),
      cpNumber: getLabelWithValue(
        {
          labelName: "CP Number",
          labelKey: "ES_CP_NUMBER_LABEL"
        },
        {
          jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.cpNumber"
        }
      )
    })
  })
}
