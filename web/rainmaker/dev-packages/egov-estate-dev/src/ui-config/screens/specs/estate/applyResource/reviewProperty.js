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

const allocationTypeLabel = {
  labelName: "Type of Allocation",
  labelKey: "EST_ALLOCATION_TYPE_LABEL"
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
    style: {
      marginBottom: "10px"
    }
  }
}

export const getReviewProperty = (isEditable = true) => {
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
            labelKey: "EST_PROPERTY_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable)
      }
    },
    viewFour: getCommonContainer({
      allocationType: getLabelWithValue(
        allocationTypeLabel, {
          jsonPath: "Properties[0].propertyDetails.allocationType"
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
          jsonPath: "Properties[0].propertyDetails.dateOfAuction"
        }
      ),
      dateOfAllotment: getLabelWithValue(
        dateOfAllotmentLabel, {
          jsonPath: "Properties[0].propertyDetails.dateOfAllotment"
        }
      ),
      allotmentNumber: getLabelWithValue(
        allotmentNumberLabel, {
          jsonPath: "Properties[0].propertyDetails.allotmentNumber"
        }
      ),
      areaOfProperty: getLabelWithValue(
        areaOfPropertyLabel, {
          jsonPath: "Properties[0].propertyDetails.areaOfProperty"
        }
      ),
      rate: getLabelWithValue(
        rateLabel, {
          jsonPath: "Properties[0].propertyDetails.rate"
        }
      ),
      possessionDate: getLabelWithValue(
        possessionDateLabel, {
          jsonPath: "Properties[0].propertyDetails.possessionDate"
        }
      ),
      category: getLabelWithValue(
        categoryLabel, {
          jsonPath: "Properties[0].propertyDetails.category"
        }
      ),
      subCategory: getLabelWithValue(
        subCategoryLabel, {
          jsonPath: "Properties[0].propertyDetails.subCategory"
        }
      ),
      siteNumber: getLabelWithValue(
        siteNumberLabel, {
          jsonPath: "Properties[0].propertyDetails.siteNumber"
        }
      ),
      sectorNumber: getLabelWithValue(
        sectorNumberLabel, {
          jsonPath: "Properties[0].propertyDetails.sectorNumber"
        }
      ),
      fileNumber: getLabelWithValue(
        fileNumberLabel, {
          jsonPath: "Properties[0].propertyDetails.fileNumber"
        }
      ),
      lastNocDate: getLabelWithValue(
        lastNocDateLabel, {
          jsonPath: "Properties[0].propertyDetails.lastNocDate"
        }
      ),
      propertyType: getLabelWithValue(
        propertyTypeLabel, {
          jsonPath: "Properties[0].propertyDetails.propertyType"
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
  labelName: "Owner Name",
  labelKey: "EST_MODE_OF_AUCTION_LABEL"
}
const fatherHusbandNameLabel = {
  labelName: "Father/Husband Name",
  labelKey: "EST_FATHER_HUSBAND_NAME_LABEL"
}
const relationshipLabel = {
  labelName: "Relationship",
  labelKey: "EST_RELATIONSHIP_LABEL"
}
const addressLabel = {
  labelName: "Address",
  labelKey: "EST_ADDRESS_LABEL"
}
const mobileNumberLabel = {
  labelName: "Mobile No.",
  labelKey: "TL_MOBILE_NUMBER_LABEL"
}
const shareLabel = {
  labelName: "Share",
  labelKey: "EST_SHARE_LABEL"
}
const cpNumberLabel = {
  labelName: "CP No.",
  labelKey: "EST_CP_NUMBER_LABEL"
}

export const getReviewOwner = (isEditable = true, owner) => {
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
            labelKey: "EST_OWNER_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable)
      }
    },
    viewFour: getCommonContainer({
      ownerName: getLabelWithValue(
        ownerNameLabel, {
          jsonPath: `Properties[0].ownerDetails[${owner}].ownerName`
        }
      ),
      fatherHusbandName: getLabelWithValue(
        fatherHusbandNameLabel, {
          jsonPath: `Properties[0].ownerDetails[${owner}].fatherHusbandName`
        }
      ),
      relationship: getLabelWithValue(
        relationshipLabel, {
          jsonPath: "Properties[0].ownerDetails.relationship"
        }
      ),
      address: getLabelWithValue(
        addressLabel, {
          jsonPath: "Properties[0].ownerDetails.address"
        }
      ),
      mobileNumber: getLabelWithValue(
        mobileNumberLabel, {
          jsonPath: "Properties[0].ownerDetails.mobileNumber"
        }
      ),
      share: getLabelWithValue(
        shareLabel, {
          jsonPath: "Properties[0].ownerDetails.share"
        }
      ),
      cpNumber: getLabelWithValue(
        cpNumberLabel, {
          jsonPath: "Properties[0].ownerDetails.cpNumber"
        }
      )
    })
  })
}

/* purchaser review */
const newOwnerNameLabel = {
  labelName: "New Owner Name",
  labelKey: "EST_NEW_OWNER_NAME_LABEL"
}
const newOwnerFatherHusbandNameLabel = {
  labelName: "New Father/Husband Name",
  labelKey: "EST_NEW_OWNER_FATHER_HUSBAND_NAME_LABEL"
}
const newOwnerAddressLabel = {
  labelName: "New Owner Address",
  labelKey: "EST_NEW_OWNER_ADDRESS_LABEL"
}
const newOwnerMobileNumberLabel = {
  labelName: "New Owner Mobile No.",
  labelKey: "TL_NEW_OWNER_MOBILE_NUMBER_LABEL"
}
const sellerNameLabel = {
  labelName: "Seller Name",
  labelKey: "EST_SELLER_NAME_LABEL"
}
const sellerFatherHusbandNameLabel = {
  labelName: "Seller Father/Husband Name",
  labelKey: "EST_SELLER_FATHER_HUSBAND_NAME_LABEL"
}
const percentShareLabel = {
  labelName: "% Share",
  labelKey: "EST_PERCENT_SHARE_LABEL"
}
const modeOfTransferLabel = {
  labelName: "Mode of Transfer",
  labelKey: "EST_MODE_OF_TRANSFER_LABEL"
}
const registrationNumberLabel = {
  labelName: "Registration Number of the Property in Sub-Registrar Office",
  labelKey: "EST_REGISTRATION_NUMBER_LABEL"
}
const dateOfRegistrationLabel = {
  labelName: "Date of Registration",
  labelKey: "EST_DATE_OF_REGISTRATION_LABEL"
}

export const getReviewPurchaser = (isEditable = true) => {
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
            labelName: "Purchaser Details",
            labelKey: "EST_PURCHASER_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable)
      }
    },
    viewFour: getCommonContainer({
      newOwnerName: getLabelWithValue(
        newOwnerNameLabel, {
          jsonPath: "Properties[0].purchaserDetails.newOwnerName"
        }
      ),
      newOwnerFatherHusbandName: getLabelWithValue(
        newOwnerFatherHusbandNameLabel, {
          jsonPath: "Properties[0].purchaserDetails.newOwnerFatherHusbandName"
        }
      ),
      relationship: getLabelWithValue(
        relationshipLabel, {
          jsonPath: "Properties[0].purchaserDetails.relationship"
        }
      ),
      newOwnerAddress: getLabelWithValue(
        newOwnerAddressLabel, {
          jsonPath: "Properties[0].purchaserDetails.newOwnerAddress"
        }
      ),
      newOwnerMobileNumber: getLabelWithValue(
        newOwnerMobileNumberLabel, {
          jsonPath: "Properties[0].purchaserDetails.newOwnerMobileNumber"
        }
      ),
      sellerName: getLabelWithValue(
        sellerNameLabel, {
          jsonPath: "Properties[0].purchaserDetails.sellerName"
        }
      ),
      sellerFatherHusbandName: getLabelWithValue(
        sellerFatherHusbandNameLabel, {
          jsonPath: "Properties[0].purchaserDetails.sellerFatherHusbandName"
        }
      ),
      percentShare: getLabelWithValue(
        percentShareLabel, {
          jsonPath: "Properties[0].purchaserDetails.share"
        }
      ),
      modeOfTransfer: getLabelWithValue(
        modeOfTransferLabel, {
          jsonPath: "Properties[0].purchaserDetails.modeOfTransfer"
        }
      ),
      registrationNumber: getLabelWithValue(
        registrationNumberLabel, {
          jsonPath: "Properties[0].purchaserDetails.registrationNumberField"
        }
      ),
      dateOfRegistration: getLabelWithValue(
        dateOfRegistrationLabel, {
          jsonPath: "Properties[0].purchaserDetails.dateOfRegistration"
        }
      )
    })
  })
}

/* Ground rent review */
const dueDateOfPaymentLabel = {
  labelName: "Due Date of payment",
  labelKey: "EST_DUE_DATE_OF_PAYMENT_LABEL"
}
const payableLabel = {
  labelName: "Payable",
  labelKey: "EST_PAYABLE_LABEL"
}
const amountOfGRLabel = {
  labelName: "Amount of GR",
  labelKey: "EST_AMOUNT_OF_GR_LABEL"
}
const totalGRLabel = {
  labelName: "Total GR",
  labelKey: "EST_TOTAL_GR_LABEL"
}
const dateOfDepositLabel = {
  labelName: "Date of Deposit",
  labelKey: "EST_DATE_OF_DEPOSIT_LABEL"
}
const delayInPaymentLabel = {
  labelName: "Delay in Payment",
  labelKey: "EST_DELAY_IN_PAYMENT_LABEL"
}
const interestForDelayLabel = {
  labelName: "Interest for Delay",
  labelKey: "EST_INTEREST_FOR_DELAY_LABEL"
}
const totalAmountDueWithInterestLabel = {
  labelName: "Total Amount Due with Interest",
  labelKey: "EST_TOTAL_AMOUNT_DUE_WITH_INTEREST_LABEL"
}
const amountDepositedGRLabel = {
  labelName: "Amount Deposited GR",
  labelKey: "EST_AMOUNT_DEPOSITED_GR_LABEL"
}
const amountDepositedInttLabel = {
  labelName: "Amount Deposited Intt",
  labelKey: "EST_AMOUNT_DEPOSITED_INTT_LABEL"
}
const balanceGRLabel = {
  labelName: "Balance(+due, -excess) GR",
  labelKey: "EST_BALANCE_GR_LABEL"
}
const balanceInttLabel = {
  labelName: "Balance(+due, -excess) Intt",
  labelKey: "EST_BALANCE_INTT_LABEL"
}
const totalDueLabel = {
  labelName: "Total Due",
  labelKey: "EST_TOTAL_DUE_LABEL"
}
const receiptNumberAndDateLabel = {
  labelName: "Receipt No. & Date",
  labelKey: "EST_RECEIPT_NUMBER_AND_DATE_LABEL"
}

export const groundRentHeader = getCommonTitle({
  labelName: "Ground Rent Details",
  labelKey: "EST_GROUND_RENT_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18,
    width: "100%"
  }
})

export const serviceTaxHeader = getCommonTitle({
  labelName: "Service Tax/GST Details",
  labelKey: "EST_SERVICE_TAX_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18,
    width: "100%"
  }
})

/* Service tax review */
const rateOfStOrGstLabel = {
  labelName: "Rate of ST/GST",
  labelKey: "EST_RATE_ST_GST_LABEL"
}
const amountOfGstLabel = {
  labelName: "Amount of GST",
  labelKey: "EST_AMOUNT_OF_GST_LABEL"
}
const amountDueLabel = {
  labelName: "Amount Due",
  labelKey: "EST_AMOUNT_DUE_LABEL"
}
const amountDepositedSTLabel = {
  labelName: "Amount Deposited ST/GST",
  labelKey: "EST_AMOUNT_DEPOSITED_ST_LABEL"
}
const balanceStLabel = {
  labelName: "Balance ST/GST",
  labelKey: "EST_BALANCE_ST_LABEL"
}
const balanceInttLabelST = {
  labelName: "Balance Intt",
  labelKey: "EST_BALANCE_INTT_LABEL"
}

export const getReviewServiceTax = (isEditable = true) => {
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
            labelName: "Service Tax Details",
            labelKey: "EST_SERVICE_TAX_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable)
      }
    },
    viewFour: getCommonContainer({
      rateOfStOrGst: getLabelWithValue(
        rateOfStOrGstLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.rateOfStOrGst"
        }
      ),
      amountOfGst: getLabelWithValue(
        amountOfGstLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountOfGst"
        }
      ),
      amountDue: getLabelWithValue(
        amountDueLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountDue"
        }
      ),
      dateOfDeposit: getLabelWithValue(
        dateOfDepositLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.dateOfDeposit"
        }
      ),
      delayInPayment: getLabelWithValue(
        delayInPaymentLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.delayInPayment"
        }
      ),
      interestForDelay: getLabelWithValue(
        interestForDelayLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.interestForDelay"
        }
      ),
      totalAmountDueWithInterest: getLabelWithValue(
        totalAmountDueWithInterestLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.totalAmountDueWithInterest"
        }
      ),
      amountDepositedSt: getLabelWithValue(
        amountDepositedSTLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountDepositedSt"
        }
      ),
      amountDepositedIntt: getLabelWithValue(
        amountDepositedInttLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountDepositedIntt"
        }
      ),
      balanceSt: getLabelWithValue(
        balanceStLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.balanceSt"
        }
      ),
      balanceIntt: getLabelWithValue(
        balanceInttLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.balanceIntt"
        }
      ),
      totalDue: getLabelWithValue(
        totalDueLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.totalDue"
        }
      ),
      receiptNumberAndDate: getLabelWithValue(
        receiptNumberAndDateLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.receiptNumberAndDate"
        }
      )
    })
  })
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
            labelKey: "EST_PAYMENT_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable)
      }
    },
    viewGroundRent: getCommonContainer({
      header: groundRentHeader,
      dueDateOfPayment: getLabelWithValue(
        dueDateOfPaymentLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.dueDateOfPayment"
        }
      ),
      payable: getLabelWithValue(
        payableLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.payable"
        }
      ),
      amountOfGR: getLabelWithValue(
        amountOfGRLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.amountOfGR"
        }
      ),
      totalGR: getLabelWithValue(
        totalGRLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.totalGR"
        }
      ),
      dateOfDeposit: getLabelWithValue(
        dateOfDepositLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.dateOfDeposit"
        }
      ),
      delayInPayment: getLabelWithValue(
        delayInPaymentLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.delayInPayment"
        }
      ),
      interestForDelay: getLabelWithValue(
        interestForDelayLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.interestForDelay"
        }
      ),
      totalAmountDueWithInterest: getLabelWithValue(
        totalAmountDueWithInterestLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.totalAmountDueWithInterest"
        }
      ),
      amountDepositedGR: getLabelWithValue(
        amountDepositedGRLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.amountDepositedGR"
        }
      ),
      amountDepositedIntt: getLabelWithValue(
        amountDepositedInttLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.amountDepositedIntt"
        }
      ),
      balanceGR: getLabelWithValue(
        balanceGRLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.balanceGR"
        }
      ),
      balanceIntt: getLabelWithValue(
        balanceInttLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.balanceIntt"
        }
      ),
      totalDue: getLabelWithValue(
        totalDueLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.totalDue"
        }
      ),
      receiptNumberAndDate: getLabelWithValue(
        receiptNumberAndDateLabel, {
          jsonPath: "Properties[0].paymentDetails.groundRent.receiptNumberAndDate"
        }
      )
    }),
    viewServiceTax: getCommonContainer({
      header: serviceTaxHeader,
      rateOfStOrGst: getLabelWithValue(
        rateOfStOrGstLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.rateOfStOrGst"
        }
      ),
      amountOfGst: getLabelWithValue(
        amountOfGstLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountOfGst"
        }
      ),
      amountDue: getLabelWithValue(
        amountDueLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountDue"
        }
      ),
      dateOfDeposit: getLabelWithValue(
        dateOfDepositLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.dateOfDeposit"
        }
      ),
      delayInPayment: getLabelWithValue(
        delayInPaymentLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.delayInPayment"
        }
      ),
      interestForDelay: getLabelWithValue(
        interestForDelayLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.interestForDelay"
        }
      ),
      totalAmountDueWithInterest: getLabelWithValue(
        totalAmountDueWithInterestLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.totalAmountDueWithInterest"
        }
      ),
      amountDepositedSt: getLabelWithValue(
        amountDepositedSTLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountDepositedSt"
        }
      ),
      amountDepositedIntt: getLabelWithValue(
        amountDepositedInttLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.amountDepositedIntt"
        }
      ),
      balanceSt: getLabelWithValue(
        balanceStLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.balanceSt"
        }
      ),
      balanceIntt: getLabelWithValue(
        balanceInttLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.balanceIntt"
        }
      ),
      totalDue: getLabelWithValue(
        totalDueLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.totalDue"
        }
      ),
      receiptNumberAndDate: getLabelWithValue(
        receiptNumberAndDateLabel, {
          jsonPath: "Properties[0].paymentDetails.serviceTax.receiptNumberAndDate"
        }
      )
    })
  })
}


/* Court case review */
const estateOfficerCourtLabel = {
  labelName: "Estate Officer Court",
  labelKey: "EST_ESTATE_OFFICER_COURT_LABEL"
}
const commissionersCourtLabel = {
  labelName: "Commissioners Court",
  labelKey: "EST_COMMISSIONERS_COURT_LABEL"
}
const chiefAdministratorsCourtLabel = {
  labelName: "Chief Administrators Court",
  labelKey: "EST_CHIEF_ADMINISTRATORS_COURT_LABEL"
}
const advisorToAdminCourtLabel = {
  labelName: "Advisor to Admin Court",
  labelKey: "EST_ADVISOR_TO_ADMIN_COURT_LABEL"
}
const honbleDistrictCourtLabel = {
  labelName: "Hon'ble District Court",
  labelKey: "EST_HONBLE_DISTRICT_COURT_LABEL"
}
const honbleHighCourtLabel = {
  labelName: "Hon'ble High Court",
  labelKey: "EST_HONBLE_HIGH_COURT_LABEL"
}
const honbleSupremeCourtLabel = {
  labelName: "Hon'ble Supreme Court",
  labelKey: "EST_HONBLE_SUPREME_COURT_LABEL"
}

export const getReviewCourtCase = (isEditable = true) => {
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
            labelKey: "EST_COURT_CASE_DETAILS_HEADER"
          })
        },
        editSection: masterEntryEditSection(isEditable)
      }
    },
    viewFour: getCommonContainer({
      estateOfficerCourt: getLabelWithValue(
        estateOfficerCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.estateOfficerCourt"
        }
      ),
      commissionersCourt: getLabelWithValue(
        commissionersCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.commissionersCourt"
        }
      ),
      chiefAdministratorsCourt: getLabelWithValue(
        chiefAdministratorsCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.chiefAdministratorsCourt"
        }
      ),
      advisorToAdminCourt: getLabelWithValue(
        advisorToAdminCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.advisorToAdminCourt"
        }
      ),
      honbleDistrictCourt: getLabelWithValue(
        honbleDistrictCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.honbleDistrictCourt"
        }
      ),
      honbleHighCourt: getLabelWithValue(
        honbleHighCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.honbleHighCourt"
        }
      ),
      honbleSupremeCourt: getLabelWithValue(
        honbleSupremeCourtLabel, {
          jsonPath: "Properties[0].courtCaseDetails.honbleSupremeCourt"
        }
      )
    })
  })
}