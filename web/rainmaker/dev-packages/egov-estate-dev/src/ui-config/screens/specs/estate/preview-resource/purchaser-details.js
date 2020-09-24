import {
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer,
    getCommonGrayCard,
    getLabel,
    getCommonSubHeader,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    convertEpochToDate,
    getTodaysDateInYMD
  } from "../../utils";
  import get from "lodash/get";
  
 
export const purchaserHeader = getCommonTitle({
    labelName: "Purchaser Details",
    labelKey: "ES_PURCHASER_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const newOwnerNameField = {
      labelName: "New Owner Name",
      labelKey: "ES_NEW_OWNER_NAME_LABEL",
  }
  
  const newOwnerFatherHusbandNameField = {
      labelName: "New Owner Father/Husband Name",
      labelKey: "ES_NEW_OWNER_FATHER_HUSBAND_NAME_LABEL",
  }
  
  const newOwnerAddressField = {
    
      labelName: "New Owner Address",
      labelKey: "ES_NEW_OWNER_ADDRESS_LABEL",
  }
  
  const newOwnerMobileNumberField = {
      labelName: "New Owner Mobile No.",
      labelKey: "ESTATE_NEW_OWNER_MOBILE_NUMBER_LABEL",
  }
  
  const sellerNameField = {
    
      labelName: "Seller Name",
      labelKey: "ES_SELLER_NAME_LABEL",
  }
  
  const sellerFatherHusbandNameField = {
      labelName: "Seller Father/Husband Name",
      labelKey: "ES_SELLER_FATHER_HUSBAND_NAME_LABEL",
  }
  
  const shareField = {
    
      labelName: "% Share",
      labelKey: "ES_PERCENT_SHARE_LABEL",
  }
  
  const modeOfTransferField = {
      labelName: "Mode of Transfer",
      labelKey: "ES_MODE_OF_TRANSFER_LABEL",
  }
  
  const registrationNumberField = {
      labelName: "Registration Number of the Property in Sub-Registrar Office",
      labelKey: "ES_REGISTRATION_NUMBER_LABEL",
  }
  
  const dateOfRegistrationField = {
      labelName: "Date of Registration",
      labelKey: "ES_DATE_OF_REGISTRATION_LABEL",
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

   export const getPurchaserDetails = (isEditable = true,index) => {
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
              labelKey: "ES_PURCHASER_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        newOwnerName: getLabelWithValue(
            newOwnerNameField, {
              jsonPath: `Properties[0].propertyDetails.purchaseDetails[${index}].newOwnerName`
            }
          ),
          newOwnerFatherHusbandName: getLabelWithValue(
            newOwnerFatherHusbandNameField, {
              jsonPath: `Properties[0].propertyDetails.purchaseDetails[${index}].newOwnerFatherName`
            }
          ),
          newOwnerAddress:getLabelWithValue(
            newOwnerAddressField, {
              jsonPath: `Properties[0].propertyDetails.purchaseDetails[${index}].newOwnerAddress`
            }
          ),
          newOwnerMobileNumber: getLabelWithValue(
            newOwnerMobileNumberField, {
              jsonPath:  `Properties[0].propertyDetails.purchaseDetails[${index}].newOwnerMobileNumber`
            }
          ),
          sellerName: getLabelWithValue(
            sellerNameField, {
              jsonPath: `Properties[0].propertyDetails.purchaseDetails[${index}].sellerName`
            }
          ),
        sellerFatherHusbandName: getLabelWithValue(
            sellerFatherHusbandNameField, {
              jsonPath: `Properties[0].propertyDetails.purchaseDetails[${index}].sellerFatherName`
            }
          ),
          share: getLabelWithValue(
            shareField, {
              jsonPath:`Properties[0].propertyDetails.purchaseDetails[${index}].percentageOfShare`
            }
          ),
          modeOfTransfer: getLabelWithValue(
            modeOfTransferField, {
              jsonPath:`Properties[0].propertyDetails.purchaseDetails[${index}].modeOfTransfer`
            }
          ),
          registrationNumber: getLabelWithValue(
            registrationNumberField, {
              jsonPath:`Properties[0].propertyDetails.purchaseDetails[${index}].registrationNumber`
            }
          ),
          dateOfRegistration: getLabelWithValue(
            dateOfRegistrationField, {
              jsonPath:`Properties[0].propertyDetails.purchaseDetails[${index}].dateOfRegistration`,
              callback: convertEpochToDate
            }
          )
      })
    })
  }


