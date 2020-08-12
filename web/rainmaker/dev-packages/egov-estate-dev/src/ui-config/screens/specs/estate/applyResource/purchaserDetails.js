import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";

export const purchaserHeader = getCommonTitle({
  labelName: "Purchaser Details",
  labelKey: "EST_PURCHASER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const newOwnerNameField = {
  label: {
    labelName: "New Owner Name",
    labelKey: "EST_NEW_OWNER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter New Owner Name",
    labelKey: "EST_NEW_OWNER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].newOwnerName"
}

const newOwnerFatherHusbandNameField = {
  label: {
    labelName: "New Owner Father/Husband Name",
    labelKey: "EST_NEW_OWNER_FATHER_HUSBAND_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter New Owner Father/Husband Name",
    labelKey: "EST_NEW_OWNER_FATHER_HUSBAND_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].newOwnerFatherName"
}

const newOwnerAddressField = {
  label: {
    labelName: "New Owner Address",
    labelKey: "EST_NEW_OWNER_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter New Owner Address",
    labelKey: "EST_NEW_OWNER_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  props: {
    multiline: true,
    rows: 2
  },
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].newOwnerAddress"
}

const newOwnerMobileNumberField = {
  label: {
    labelName: "New Owner Mobile No.",
    labelKey: "TL_NEW_OWNER_MOBILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter New Owner Mobile No.",
    labelKey: "TL_NEW_OWNER_MOBILE_NUMBER_PLACEHOLDER"
  },
  pattern: getPattern("MobileNo"),
  // props: {
  //   value: userInfo.userName,
  //   disabled: true
  // },
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].newOwnerMobileNumber",
}

const sellerNameField = {
  label: {
    labelName: "Seller Name",
    labelKey: "EST_SELLER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Seller Name",
    labelKey: "EST_SELLER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].sellerName"
}

const sellerFatherHusbandNameField = {
  label: {
    labelName: "Seller Father/Husband Name",
    labelKey: "EST_SELLER_FATHER_HUSBAND_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Seller Father/Husband Name",
    labelKey: "EST_SELLER_FATHER_HUSBAND_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].sellerFatherName"
}

const shareField = {
  label: {
    labelName: "% Share",
    labelKey: "EST_PERCENT_SHARE_LABEL"
  },
  placeholder: {
    labelName: "Enter % Share",
    labelKey: "EST_PERCENT_SHARE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 5,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].percentageOfShare"
}

const modeOfTransferField = {
  label: {
    labelName: "Mode of Transfer",
    labelKey: "EST_MODE_OF_TRANSFER_LABEL"
  },
  placeholder: {
    labelName: "Select Mode Of Transfer",
    labelKey: "EST_MODE_OF_TRANSFER_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].modeOfTransfer",
  sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.modeOfTransfer",
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

const registrationNumberField = {
  label: {
    labelName: "Registration Number of the Property in Sub-Registrar Office",
    labelKey: "EST_REGISTRATION_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Registration Number of the Property in Sub-Registrar Office",
    labelKey: "EST_REGISTRATION_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].registrationNumber"
}

const dateOfRegistrationField = {
  label: {
    labelName: "Date of Registration",
    labelKey: "EST_DATE_OF_REGISTRATION_LABEL"
  },
  placeholder: {
    labelName: "Enter Date of Registration",
    labelKey: "EST_DATE_OF_REGISTRATION_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.purchaseDetails[0].dateOfRegistration",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const commonPurchaserInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Purchaser",
      labelKey: "EST_COMMON_PURCHASER_INFORMATION"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    purchaserCard: getCommonContainer({
      newOwnerName: getTextField(newOwnerNameField),
      newOwnerFatherHusbandName: getTextField(newOwnerFatherHusbandNameField),
      newOwnerAddress: getTextField(newOwnerAddressField),
      newOwnerMobileNumber: getTextField(newOwnerMobileNumberField),
      sellerName: getTextField(sellerNameField),
      sellerFatherHusbandName: getTextField(sellerFatherHusbandNameField),
      share: getTextField(shareField),
      modeOfTransfer: getSelectField(modeOfTransferField),
      registrationNumber: getTextField(registrationNumberField),
      dateOfRegistration: getDateField(dateOfRegistrationField)
    })
  });
};

export const purchaserDetails = getCommonCard({
  header: purchaserHeader,
  detailsContainer: getCommonContainer({
    multipleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleApplicantInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonPurchaserInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Purchaser",
              labelKey: "EST_COMMON_ADD_PURCHASER_LABEL"
            },
            headerName: "Purchaser ",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.label",
            sourceJsonPath: "Properties[0].purchaseDetails",
            prefixSourceJsonPath: "children.cardContent.children.purchaserCard.children"
          },
          type: "array"
        }
      }
    }
  })
})