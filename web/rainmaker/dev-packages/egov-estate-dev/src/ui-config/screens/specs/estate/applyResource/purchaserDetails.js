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
  getTodaysDateInYMD, 
  _getPattern,
  displayCustomErr,
  displayDefaultErr
} from "../../utils";
import get from "lodash/get";

let screenName = "apply";
if ((window.location.href).includes("allotment")) {
    screenName = "allotment";
}

export const purchaserHeader = getCommonTitle({
  labelName: "Previous Owner Details",
  labelKey: "ES_PREVIOUS_OWNER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const getPreviousOwnerRequiredRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
  },
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.previousOwnerRequired",
  props: {
    label: {
      name: "Previous Owner Required ?",
      key: "ES_PREVIOUS_OWNER_REQUIRED_LABEL"
    },
    buttons: [{
        labelName: "Father",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "Husband",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.previousOwnerRequired",
    required: true,
  },
  required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    markUnmarkFieldsMandatory(action, dispatch);
  }
};


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
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.ownerName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
      }
      else {
          displayDefaultErr(action.componentJsonpath, dispatch, screenName);
      }
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
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.guardianName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
      }
      else {
          displayDefaultErr(action.componentJsonpath, dispatch, screenName);
      }
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
  },
  type: "array"
};

const dateOfBirthField = {
  label: {
      labelName: "Date of Birth",
      labelKey: "ES_DOB_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Birth",
      labelKey: "ES_DOB_PLACEHOLDER"
  },
  // required: true,
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.dob",
  props: {
    inputProps: {
        max: getTodaysDateInYMD(),
        style: {
            lineHeight: "initial"
        }
    }
  }
}

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
  pattern: _getPattern("address"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.address",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
      }
      else {
        displayDefaultErr(action.componentJsonpath, dispatch, screenName);
      }
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
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.mobileNumber"
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
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.sellerName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
    }
    else {
        displayDefaultErr(action.componentJsonpath, dispatch, screenName);
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
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.sellerGuardianName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value) {
      if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
      }
      else {
          displayDefaultErr(action.componentJsonpath, dispatch, screenName);
      }
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
  jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.sellerRelation",
  props: {
    label: {
      name: "Relationship",
      key: "ES_RELATIONSHIP_LABEL"
    },
    buttons: [{
        labelName: "Father",
        labelKey: "ES_COMMON_RELATION_FATHER",
        value: "FATHER"
      },
      {
        label: "Husband",
        labelKey: "ES_COMMON_RELATION_HUSBAND",
        value: "HUSBAND"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.purchaser[0].ownerDetails.sellerRelation",
  },
  type: "array"
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
  pattern: _getPattern("share"),
  jsonPath: "Properties[0].propertyDetails.purchaser[0].share"
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
      previousOwnerRequired: getPreviousOwnerRequiredRadioButton,
      newOwnerName: getTextField(newOwnerNameField),
      newOwnerFatherHusbandName: getTextField(newOwnerFatherHusbandNameField),
      guardianRelation: getRelationshipRadioButton,
      dob: getDateField(dateOfBirthField),
      newOwnerAddress: getTextField(newOwnerAddressField),
      newOwnerMobileNumber: getTextField(newOwnerMobileNumberField),
      sellerName: getTextField(sellerNameField),
      sellerFatherHusbandName: getTextField(sellerFatherHusbandNameField),
      sellerGuardianRelation: getSellerRelationshipRadioButton,
      share: getTextField(shareField),
      modeOfTransfer: getSelectField(modeOfTransferField)
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

export const markUnmarkFieldsMandatory = (param, dispatch) => {
  let commonPathArr = (param.componentJsonpath).split(".");
  commonPathArr.pop();
  let commonpath = commonPathArr.join(".");
  let fieldsArr = ["newOwnerName", "newOwnerFatherHusbandName", "guardianRelation", "newOwnerAddress", "newOwnerMobileNumber", "sellerName", "sellerFatherHusbandName", "sellerGuardianRelation", "share", "modeOfTransfer", "dob"]

  fieldsArr.map(item => {
    dispatch(
      handleField(
        param.screenKey,
        `${commonpath}.${item}`,
        `props.required`,
        !!(param.value == "true")
      )
    )
    dispatch(
      handleField(
        param.screenKey,
        `${commonpath}.${item}`,
        `required`,
        !!(param.value == "true")
      )
    )
  })
}
