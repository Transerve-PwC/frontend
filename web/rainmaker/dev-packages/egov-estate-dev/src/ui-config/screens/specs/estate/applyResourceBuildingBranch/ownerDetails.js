import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getCommonGrayCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";
import {
  _getPattern,
  displayCustomErr,
  displayDefaultErr
} from "../../utils"

let screenName = "apply-building-branch";

const ownerNameField = {
  label: {
    labelName: "Owner Name",
    labelKey: "ES_OWNER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Owner Name",
    labelKey: "ES_OWNER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.ownerName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
    }
    else {
        displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const fatherHusbandNameField = {
  label: {
    labelName: "Father/Husband Name",
    labelKey: "ES_FATHER_HUSBAND_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Father/Husband Name",
    labelKey: "ES_FATHER_HUSBAND_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.guardianName",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
    }
    else {
        displayDefaultErr(action.componentJsonpath, dispatch, screenName);
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
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.guardianRelation",
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
    jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.guardianRelation",
    required: true,
  },
  required: true,
  type: "array",
};

export const addressField = {
  label: {
    labelName: "Address",
    labelKey: "ES_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter Address",
    labelKey: "ES_ADDRESS_PLACEHOLDER"
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
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.address",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
    }
    else {
        displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

export const mobileNumberField = {
  label: {
    labelName: "Mobile No.",
    labelKey: "ESTATE_MOBILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Mobile No.",
    labelKey: "ES_MOBILE_NUMBER_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("MobileNo"),
  // props: {
  //   value: userInfo.userName,
  //   disabled: true
  // },
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.mobileNumber"
}

const shareField = {
  label: {
    labelName: "Share",
    labelKey: "ES_SHARE_LABEL"
  },
  placeholder: {
    labelName: "Enter Share",
    labelKey: "ES_SHARE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("share"),
  jsonPath: "Properties[0].propertyDetails.owners[0].share"
}

const getIsCurrentOwnerRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.isCurrentOwner",
  props: {
    label: {
      name: "Is Current Owner",
      key: "ES_IS_CURRENT_OWNER_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true"
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.isCurrentOwner",
    required: true,
  },
  required: true,
  type: "array",
};

const possessionDateField = {
  label: {
    labelName: "Possession Date",
    labelKey: "ES_POSSESSION_DATE_LABEL"
  },
  placeholder: {
    labelName: "Enter Possession Date",
    labelKey: "ES_POSSESSION_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.possesionDate",
  // props: {
  //   inputProps: {
  //     max: getTodaysDateInYMD()
  //   }
  // }
}

const ownerHeader = getCommonTitle({
  labelName: "Owner Details",
  labelKey: "ES_OWNER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const commonOwnerInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Owner Information",
      labelKey: "ES_COMMON_OWNER_INFORMATION"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    ownerCard: getCommonContainer({
      ownerName: getTextField(ownerNameField),
      fatherHusbandName: getTextField(fatherHusbandNameField),
      relationship: getRelationshipRadioButton,
      address: getTextField(addressField),
      mobileNumber: getTextField(mobileNumberField),
      share: getTextField(shareField),
      isCurrentOwner: getIsCurrentOwnerRadioButton,
      possessionDate: getDateField(possessionDateField)
    })
  });
};

export const ownerDetails = getCommonCard({
  header: ownerHeader,
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
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonOwnerInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Owner",
              labelKey: "ES_COMMON_ADD_OWNER_LABEL"
            },
            headerName: "Owner Information",
            headerJsonPath: "children.cardContent.children.header.children.Owner Information.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.owners",
            prefixSourceJsonPath: "children.cardContent.children.ownerCard.children"
          },
          type: "array"
        }
      }
    }
  })
})
