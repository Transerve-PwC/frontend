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
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";

export const purchaserHeader = getCommonTitle({
  labelName: "Previous Owner Details",
  labelKey: "ES_PREVIOUS_OWNER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const newOwnerNameField = {
  label: {
    labelName: "Previous Owner Name",
    labelKey: "ES_PREVIOUS_OWNER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Previous Owner Name",
    labelKey: "ES_PREVIOUS_OWNER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.ownerName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const newOwnerFatherHusbandNameField = {
  label: {
    labelName: "Previous Owner Father/Husband Name",
    labelKey: "ES_PREVIOUS_OWNER_FATHER_HUSBAND_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Previous Owner Father/Husband Name",
    labelKey: "ES_PREVIOUS_OWNER_FATHER_HUSBAND_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.guardianName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const getRelationshipRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.guardianRelation",
  props: {
    label: {
      name: "Relationship",
      key: "ES_RELATIONSHIP_LABEL"
    },
    buttons: [{
        labelName: "Father",
        labelKey: "ES_COMMON_RELATION_FATHER",
        value: "FATHER",
      },
      {
        label: "Husband",
        labelKey: "ES_COMMON_RELATION_HUSBAND",
        value: "HUSBAND",
      }
    ],
    jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.guardianRelation",
    // required: true,
  },
  // required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
};

const newOwnerAddressField = {
  label: {
    labelName: "Previous Owner Address",
    labelKey: "ES_PREVIOUS_OWNER_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter Previous Owner Address",
    labelKey: "ES_PREVIOUS_OWNER_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  props: {
    multiline: true,
    rows: 2
  },
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.address",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const newOwnerMobileNumberField = {
  label: {
    labelName: "Previous Owner Mobile No.",
    labelKey: "ES_PREVIOUS_OWNER_MOBILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Previous Owner Mobile No.",
    labelKey: "ES_PREVIOUS_OWNER_MOBILE_NUMBER_PLACEHOLDER"
  },
  pattern: getPattern("MobileNo"),
  // props: {
  //   value: userInfo.userName,
  //   disabled: true
  // },
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.mobileNumber",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const sellerNameField = {
  label: {
    labelName: "Seller Name",
    labelKey: "ES_SELLER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Seller Name",
    labelKey: "ES_SELLER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.sellerName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const sellerFatherHusbandNameField = {
  label: {
    labelName: "Seller Father/Husband Name",
    labelKey: "ES_SELLER_FATHER_HUSBAND_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Seller Father/Husband Name",
    labelKey: "ES_SELLER_FATHER_HUSBAND_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.sellerFatherName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const getSellerRelationshipRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.sellerGuardianRelation",
  props: {
    label: {
      name: "Relationship",
      key: "ES_RELATIONSHIP_LABEL"
    },
    buttons: [{
        labelName: "Father",
        labelKey: "ES_COMMON_RELATION_FATHER",
        value: "FATHER",
      },
      {
        label: "Husband",
        labelKey: "ES_COMMON_RELATION_HUSBAND",
        value: "HUSBAND",
      }
    ],
    jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.sellerGuardianRelation",
    // required: true,
  },
  // required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
};

const shareField = {
  label: {
    labelName: "% Share",
    labelKey: "ES_PERCENT_SHARE_LABEL"
  },
  placeholder: {
    labelName: "Enter % Share",
    labelKey: "ES_PERCENT_SHARE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 5,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.percentageOfShare",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const modeOfTransferField = {
  label: {
    labelName: "Mode of Transfer",
    labelKey: "ES_MODE_OF_TRANSFER_LABEL"
  },
  placeholder: {
    labelName: "Select Mode Of Transfer",
    labelKey: "ES_MODE_OF_TRANSFER_PLACEHOLDER"
  },
  // required: true,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.modeOfTransfer",
  sourceJsonPath: "applyScreenMdmsData.EstateServices.modeOfTransfer",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const registrationNumberField = {
  label: {
    labelName: "Registration Number of the Property in Sub-Registrar Office",
    labelKey: "ES_REGISTRATION_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Registration Number of the Property in Sub-Registrar Office",
    labelKey: "ES_REGISTRATION_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.registrationNumber",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const dateOfRegistrationField = {
  label: {
    labelName: "Date of Registration",
    labelKey: "ES_DATE_OF_REGISTRATION_LABEL"
  },
  placeholder: {
    labelName: "Enter Date of Registration",
    labelKey: "ES_DATE_OF_REGISTRATION_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.dateOfRegistration",
  // props: {
  //   inputProps: {
  //     max: getTodaysDateInYMD()
  //   }
  // },
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      markFieldsMandatory(action, dispatch);
    }
  }
}

const commonPurchaserInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Previous Owner Information",
      labelKey: "ES_COMMON_PREVIOUS_OWNER_INFORMATION"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    purchaserCard: getCommonContainer({
      newOwnerName: getTextField(newOwnerNameField),
      newOwnerFatherHusbandName: getTextField(newOwnerFatherHusbandNameField),
      guardianRelation: getRelationshipRadioButton,
      newOwnerAddress: getTextField(newOwnerAddressField),
      newOwnerMobileNumber: getTextField(newOwnerMobileNumberField),
      sellerName: getTextField(sellerNameField),
      sellerFatherHusbandName: getTextField(sellerFatherHusbandNameField),
      sellerGuardianRelation: getSellerRelationshipRadioButton,
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
              labelName: "Add Previous Owner",
              labelKey: "ES_COMMON_ADD_PREVIOUS_OWNER_LABEL"
            },
            headerName: "Purchaser Information",
            headerJsonPath:
              "children.cardContent.children.header.children.Purchaser Information.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.purchaser",
            prefixSourceJsonPath: "children.cardContent.children.purchaserCard.children"
          },
          type: "array"
        }
      }
    }
  })
})

export const markFieldsMandatory = (param, dispatch) => {
  debugger
  let commonPathArr = (param.componentJsonpath).split(".");
  commonPathArr.pop();
  let commonpath = commonPathArr.join(".");
  let fieldsArr = ["newOwnerName", "newOwnerFatherHusbandName", "guardianRelation", "newOwnerAddress", "newOwnerMobileNumber", "sellerName", "sellerFatherHusbandName", "sellerGuardianRelation", "share", "modeOfTransfer"]

  fieldsArr.map(item => {
    dispatch(
      handleField(
        param.screenKey,
        `${commonpath}.${item}`,
        `props.required`,
        !!param.value
      )
    )
  })
}
