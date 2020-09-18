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
    getTodaysDateInYMD
  } from "../../utils";
  import get from "lodash/get";
  import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
  
  export const ownerHeader = getCommonTitle({
    labelName: "Owner Details",
    labelKey: "EST_OWNER_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const serialNumberField = {
    label: {
      labelName: "Sr No",
      labelKey: "EST_SERIAL_NUMBER_LABEL"
    },
    required: true,
    jsonPath: "Properties[0].ownerDetails[0].serialNumber",
    props: {
      value: 1,
      disabled: true
    },
    gridDefination: {
      xs: 12,
      sm: 6
    }
  }
  
  const ownerNameField = {
      labelName: "Owner Name",
      labelKey: "EST_OWNER_NAME_LABEL",
  }
  
  const fatherHusbandNameField = {
      labelName: "Father/Husband Name",
      labelKey: "EST_FATHER_HUSBAND_NAME_LABEL"
  }
  
  const getRelationshipLabel = {
    labelName: "Relationship",
    labelKey: "EST_RELATIONSHIP_LABEL"
  };
  
  const addressField = {
   
      labelName: "Address",
      labelKey: "EST_ADDRESS_LABEL",
  }
  
  const mobileNumberField = {
    
      labelName: "Mobile No.",
      labelKey: "ESTATE_MOBILE_NUMBER_LABEL",
  }
  
  const shareField = {
   
      labelName: "Share",
      labelKey: "EST_SHARE_LABEL",
  }
  
  const cpNumberField = {
      labelName: "CP No.",
      labelKey: "EST_CP_NUMBER_LABEL",
  }
  
  const possessionDateField = {
   
      labelName: "Possession Date",
      labelKey: "EST_POSSESSION_DATE_LABEL"
  }
  
  const dateOfAllotmentField = {
   
      labelName: "Date of Allotment",
      labelKey: "EST_DATE_OF_ALLOTMENT_LABEL",
  }
  
  const allotmentNumberField = {
      labelName: "Allotment Number",
      labelKey: "EST_ALLOTMENT_NUMBER_LABEL",
  }

  const modeOfTransferField = {
      labelName: "Mode Of Transfer",
      labelKey: "EST_MODE_OF_TRANSFER_LABEL",
  }

  const applicationNumberField = {
      labelName: "Application Number",
      labelKey: "EST_APPLICATION_NUMBER_LABEL",
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

   export const getOwnerDetails = (isEditable = true,index=0) => {
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
              labelName: "Owner Information",
              labelKey: "EST_OWNER_INFO_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        ownerName: getLabelWithValue(
            ownerNameField, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.ownerName`
            }
          ),
        fatherHusbandName: getLabelWithValue(
            fatherHusbandNameField, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.guardianName`
            }
          ),
        relationship:getLabelWithValue(
            getRelationshipLabel, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.guardianRelation`
            }
          ),
        address: getLabelWithValue(
            addressField, {
              jsonPath:  `Properties[0].propertyDetails.owners[${index}].ownerDetails.address`
            }
          ),
        mobileNumber: getLabelWithValue(
            mobileNumberField, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.mobileNumber`
            }
          ),
        share: getLabelWithValue(
            shareField, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].share`
            }
          ),
        cpNumber: getLabelWithValue(
            cpNumberField, {
              jsonPath:`Properties[0].propertyDetails.owners[${index}].cpNumber`
            }
          ),
          share: getLabelWithValue(
            shareField, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].share`
            }
          ),
      })
    })
  }

  export const getAllotmentDetails = (isEditable = true,index = 0) => {
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
              labelName: "Allotment Details",
              labelKey: "EST_ALLOTMENT_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        possessionDate: getLabelWithValue(
            possessionDateField, {
            jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.possesionDate`
            }
        ),
        dateOfAllotment:getLabelWithValue(
            dateOfAllotmentField, {
            jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.dateOfAllotment`
            }
        ),
        allotmentNumber: getLabelWithValue(
            allotmentNumberField, {
            jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.allotmentNumber`
            }
        )        
      })
    })
  }

  export const getModeOfTransferDetailsForApprovedProperty = () => {
    let modeOfTransferObj = {
      uiFramework: "custom-containers-local",
      moduleName: "egov-estate",
      componentPath: "MultipleDocumentsContainer",
      props: {
        sourceJsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.modeOfTransfer`,
        btnhide: false,
        businessService:"EST",
        className: "review-documents",
        contents: [
          {
            label: "EST_APPLICATION_NUMBER",
            jsonPath: "applicationNumber",
            url: `/estate/preview?tenantId=${getTenantId()}`
          },
          {
            label: "EST_MODE_OF_TRANSFER",
            jsonPath: "applicationType"
          },
          {
            label: "EST_APPROVAL_DATE",
            jsonPath: ""
          }
        ]
      }
    }
    return modeOfTransferObj;
  }
