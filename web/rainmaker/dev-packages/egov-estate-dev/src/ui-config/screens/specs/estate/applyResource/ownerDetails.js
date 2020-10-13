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

export const ownerHeader = getCommonTitle({
  labelName: "Owner Details",
  labelKey: "ES_OWNER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

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
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.ownerName"
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
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.guardianName"
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
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.address"
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
  minLength: 1,
  maxLength: 5,
  jsonPath: "Properties[0].propertyDetails.owners[0].share"
}

const cpNumberField = {
  label: {
    labelName: "CP No.",
    labelKey: "ES_CP_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter CP No.",
    labelKey: "ES_CP_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.owners[0].cpNumber",
}

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
  required: true,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.possesionDate",
  // props: {
  //   inputProps: {
  //     max: getTodaysDateInYMD()
  //   }
  // }
}

const dateOfAllotmentField = {
  label: {
    labelName: "Date of Allotment",
    labelKey: "ES_DATE_OF_ALLOTMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Date of Allotment",
    labelKey: "ES_DATE_OF_ALLOTMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.dateOfAllotment",
  // props: {
  //   inputProps: {
  //     max: getTodaysDateInYMD()
  //   }
  // }
}

const allotmentNumberField = {
  label: {
    labelName: "Allotment Number",
    labelKey: "ES_ALLOTMENT_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Allotment Number",
    labelKey: "ES_ALLOTMENT_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 50,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.allotmentNumber"
}

const getIsDirectorRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.isDirector",
  props: {
    label: {
      name: "Is Director",
      key: "ES_IS_DIRECTOR_LABEL"
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
    jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.isDirector",
    required: true,
  },
  required: true,
  type: "array",
};

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
      cpNumber: getTextField(cpNumberField),
      dateOfAllotment: getDateField(dateOfAllotmentField),
      allotmentNumber: getTextField(allotmentNumberField),
      possessionDate: getDateField(possessionDateField),
      isDirector: getIsDirectorRadioButton
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
          uiFramework: "custom-containers",
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

/* export const getActionDefinationForOwnerDetailsFields = (disabled = true, noOfItems, stepName) => {
  const actionDefination = [{
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.address`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.address`,
    property: "props.required",
    value: !disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.allotmentNumber`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.cpNumber`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.dateOfAllotment`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.fatherHusbandName`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.fatherHusbandName`,
    property: "props.required",
    value: !disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.mobileNumber`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.ownerName`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.ownerName`,
    property: "props.required",
    value: !disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.possessionDate`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.possessionDate`,
    property: "props.required",
    value: !disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.relationship.props.buttons[0]`,
    property: "disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.relationship.props.buttons[1]`,
    property: "disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.relationship`,
    property: "props.required",
    value: !disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.share`,
    property: "props.disabled",
    value: disabled
  },
  {
    path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.share`,
    property: "props.required",
    value: !disabled
  }
];

  for (var i=0; i<noOfItems; i++) {
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.address`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.address`,
      property: "props.required",
      value: !disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.allotmentNumber`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.cpNumber`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.dateOfAllotment`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.fatherHusbandName`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.fatherHusbandName`,
      property: "props.required",
      value: !disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.mobileNumber`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.ownerName`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.ownerName`,
      property: "props.required",
      value: !disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.possessionDate`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.possessionDate`,
      property: "props.required",
      value: !disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.relationship.props.buttons[0]`,
      property: "disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.relationship.props.buttons[1]`,
      property: "disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.relationship`,
      property: "props.required",
      value: !disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.share`,
      property: "props.disabled",
      value: disabled
    })
    actionDefination.push({
      path: `components.div.children.${stepName}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children.share`,
      property: "props.required",
      value: !disabled
    })
  }
  
  return actionDefination;
} */