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
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    convertEpochToDate,
    getTodaysDateInYMD
  } from "../../utils";
  import get from "lodash/get";
  import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
  
  export const ownerHeader = getCommonTitle({
    labelName: "Owner Details",
    labelKey: "ES_OWNER_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const serialNumberField = {
    label: {
      labelName: "Sr No",
      labelKey: "ES_SERIAL_NUMBER_LABEL"
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
      labelKey: "ES_OWNER_NAME_LABEL",
  }
  
  const fatherHusbandNameField = {
      labelName: "Father/Husband Name",
      labelKey: "ES_FATHER_HUSBAND_NAME_LABEL"
  }
  
  const getRelationshipLabel = {
    labelName: "Relationship",
    labelKey: "ES_RELATIONSHIP_LABEL"
  };

  const dobLabel = {
    labelName: "Date of Birth",
    labelKey: "ES_DOB_LABEL"
  };
  
  const addressField = {
   
      labelName: "Address",
      labelKey: "ES_ADDRESS_LABEL",
  }
  
  const mobileNumberField = {
    
      labelName: "Mobile No.",
      labelKey: "ESTATE_MOBILE_NUMBER_LABEL",
  }
  
  const shareField = {
   
      labelName: "Share",
      labelKey: "ES_SHARE_LABEL",
  }
  
  const cpNumberField = {
      labelName: "CP No.",
      labelKey: "ES_CP_NUMBER_LABEL",
  }
  
  const possessionDateField = {
   
      labelName: "Possession Date",
      labelKey: "ES_POSSESSION_DATE_LABEL"
  }
  
  const dateOfAllotmentField = {
   
      labelName: "Date of Allotment",
      labelKey: "ES_DATE_OF_ALLOTMENT_LABEL",
  }
  
  const allotmentNumberField = {
      labelName: "Allotment Number",
      labelKey: "ES_ALLOTMENT_NUMBER_LABEL",
  }

  const modeOfTransferField = {
      labelName: "Mode Of Transfer",
      labelKey: "ES_MODE_OF_TRANSFER_LABEL",
  }

  const applicationNumberField = {
      labelName: "Application Number",
      labelKey: "ES_APPLICATION_NUMBER_LABEL",
  }

  const companyNameField = {
    labelName: "Company Name",
    labelKey: "ES_COMPANY_NAME_LABEL"
  }
  
  const companyRegNoField = {
    labelName: "Company Registration Number",
    labelKey: "ES_COMPANY_REG_NO_LABEL"
  }

  const companyRegDateField = {
    labelName: "Registration Date",
    labelKey: "ES_REGISTRATION_DATE_LABEL"
  }

  const companyAddressField = {
    labelName: "Company Address",
    labelKey: "ES_COMPANY_ADDRESS_LABEL"
  }

  const firmNameField = {
    labelName: "Firm Name",
    labelKey: "ES_FIRM_NAME_LABEL"
  }

  const isFirmRegistered = {
    labelName: "Is Firm Registered",
    labelKey: "ES_IS_FIRM_REGISTERED_LABEL"
  }

  const firmRegNoField = {
    labelName: "Firm Registration Number",
    labelKey: "ES_FIRM_REG_NO_LABEL"
  }

  const firmRegDateField = {
    labelName: "Registration Date",
    labelKey: "ES_REGISTRATION_DATE_LABEL"
  }

  const firmAddressField = {
    labelName: "Firm Address",
    labelKey: "ES_FIRM_ADDRESS_LABEL"
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

const editOwnerDetailsByDso = (isEditableByDso, index) => ({
  ...editSection,
  visible: isEditableByDso,
  onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        let owners = get(
          state.screenConfiguration.preparedFinalObject,
          `Properties[0].propertyDetails.owners`,
          []
        )
        dispatch(
          prepareFinalObject("ownersTemp", JSON.parse(JSON.stringify(owners)))
        )
        dispatch(
          handleField(
            "owner-details",
            `components.adhocDialog`,
            `props.open`,
            true
          )
        );
        dispatch(
          handleField(
            "owner-details",
            `components.adhocDialog.children.details.children.address`,
            `jsonPath`,
            `Properties[0].propertyDetails.owners[${index}].ownerDetails.address`
          )
        )
        dispatch(
          handleField(
            "owner-details",
            `components.adhocDialog.children.details.children.address`,
            `props.value`,
            owners[index].ownerDetails.address
          )
        )
        dispatch(
          handleField(
            "owner-details",
            `components.adhocDialog.children.details.children.mobileNumber`,
            `jsonPath`,
            `Properties[0].propertyDetails.owners[${index}].ownerDetails.mobileNumber`
          )
        )
        dispatch(
          handleField(
            "owner-details",
            `components.adhocDialog.children.details.children.mobileNumber`,
            `props.value`,
            owners[index].ownerDetails.mobileNumber
          )
        )
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

   export const getOwnerDetails = (isEditable = true, index=0, isEditableByDso = false) => {
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
              labelKey: "ES_OWNER_INFO_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0),
          editOwnerDetailsByDso: editOwnerDetailsByDso(isEditableByDso, index)
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
        dob:getLabelWithValue(
            dobLabel, {
              jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.dob`,
              callBack: convertEpochToDate
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
              labelKey: "ES_ALLOTMENT_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
        possessionDate: getLabelWithValue(
            possessionDateField, {
            jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.possesionDate`,
            callBack: convertEpochToDate
            }
        ),
        dateOfAllotment:getLabelWithValue(
            dateOfAllotmentField, {
            jsonPath: `Properties[0].propertyDetails.owners[${index}].ownerDetails.dateOfAllotment`,
            callBack: convertEpochToDate
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

  export const getModeOfTransferDetailsForApprovedProperty = (branchType) => {
    let modeOfTransferObj = {
      uiFramework: "custom-containers-local",
      moduleName: "egov-estate",
      componentPath: "MultipleDocumentsContainer",
      props: {
        sourceJsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.modeOfTransferArr`,
        btnhide: false,
        businessService:"EST",
        className: "review-documents",
        contents: [
          {
            label: "ES_APPLICATION_NUMBER",
            jsonPath: "applicationNumber",
            url: `/estate/preview?tenantId=${getTenantId()}&branchType=${branchType}`
          },
          {
            label: "ES_MODE_OF_TRANSFER",
            jsonPath: "applicationType"
          },
          {
            label: "ES_APPROVAL_DATE",
            jsonPath: ""
          }
        ]
      }
    }
    return modeOfTransferObj;
  }

  export const getCompanyDetails = (isEditable = true) => {
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
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewCompanyDetails: getCommonContainer({
        companyName: getLabelWithValue(
            companyNameField, {
            jsonPath: `Properties[0].propertyDetails.companyName`,
            }
        ),
        companyRegNo: getLabelWithValue(
            companyRegNoField, {
            jsonPath: `Properties[0].propertyDetails.companyRegistrationNumber`,
            }
        ),
        companyRegDate: getLabelWithValue(
            companyRegDateField, {
            jsonPath: `Properties[0].propertyDetails.companyRegistrationDate`,
            callBack: convertEpochToDate
            }
        ),
        companyAddress: getLabelWithValue(
          companyAddressField, {
          jsonPath: `Properties[0].propertyDetails.companyAddress`,
          }
        )
      })
    })
  }

  export const getFirmDetails = (isEditable = true) => {
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
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFirmDetails: getCommonContainer({
        firmName: getLabelWithValue(
            firmNameField, {
            jsonPath: `Properties[0].propertyDetails.companyName`,
            }
        ),
        // isFirmRegistered: getLabelWithValue(
        //     isFirmRegistered, {
        //     jsonPath: `Properties[0].propertyDetails.isFirmRegistered`,
        //     }
        // ),
        firmRegNo: getLabelWithValue(
            firmRegNoField, {
            jsonPath: `Properties[0].propertyDetails.companyRegistrationNumber`,
            }
        ),
        firmRegDate: getLabelWithValue(
            firmRegDateField, {
            jsonPath: `Properties[0].propertyDetails.companyRegistrationDate`,
            callBack: convertEpochToDate
            }
        ),
        firmAddress: getLabelWithValue(
          firmAddressField, {
          jsonPath: `Properties[0].propertyDetails.companyAddress`,
          }
        )
      })
    })
  }
