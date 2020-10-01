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
  getTodaysDateInYMD
} from "../../utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

/*********************** Company Details **********************/
const companyNameField = {
  label: {
    labelName: "Company Name",
    labelKey: "ES_COMPANY_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Name",
    labelKey: "ES_COMPANY_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.companyName"
}

const companyRegNoField = {
  label: {
    labelName: "Company Registration Number",
    labelKey: "ES_COMPANY_REG_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Registration Number",
    labelKey: "ES_COMPANY_REG_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.companyRegistrationNumber"
}

const companyRegDateField = {
  label: {
    labelName: "Registration Date",
    labelKey: "ES_REGISTRATION_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.companyRegistrationDate",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const companyAddressField = {
  label: {
    labelName: "Company Address",
    labelKey: "ES_COMPANY_ADDRESS_LABEL"
},
  placeholder: {
    labelName: "Enter Company Address",
    labelKey: "ES_COMPANY_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyAddress",
  props:{
    multiline: true,
    rows: "2"
  }
}

export const companyDetailsHeader = getCommonTitle({
  labelName: "Company Details",
  labelKey: "ES_COMPANY_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

export const companyDetails = getCommonCard({
  header: companyDetailsHeader,
  detailsContainer: getCommonContainer({
    companyName: getTextField(companyNameField),
    companyRegNo: getTextField(companyRegNoField),
    companyRegDate: getDateField(companyRegDateField),
    companyAddress: getTextField(companyAddressField)
  })
})

/********************** Partnership firm ************************/ 
const firmNameField = {
  label: {
    labelName: "Firm Name",
    labelKey: "ES_FIRM_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Firm Name",
    labelKey: "ES_FIRM_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.companyName"
}

const getIsFirmRegisteredRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.isFirmRegistered",
  props: {
    label: {
      name: "Is Firm Registered",
      key: "ES_IS_FIRM_REGISTERED_LABEL"
    },
    buttons: [{
        labelName: "YES",
        labelKey: "ES_COMMON_YES",
        value: "true"
      },
      {
        label: "NO",
        labelKey: "ES_COMMON_NO",
        value: "false"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.isFirmRegistered",
    required: true,
  },
  required: true,
  type: "array",
  beforeFieldChange: (action, state, dispatch) => {
    let screenName = "apply";
    let stepName = "formwizardThirdStep";

    if ((window.location.href.includes("allotment"))) {
        screenName = "allotment";
        stepName = "formwizardThirdStepAllotment";
    }

    dispatch(
      handleField(
        screenName,
        `components.div.children.${stepName}.children.firmDetails.children.cardContent.children.detailsContainer.children.firmRegNo`,
        "props.required",
        !!(action.value == "true")
      )
    )
    dispatch(
      handleField(
        screenName,
        `components.div.children.${stepName}.children.firmDetails.children.cardContent.children.detailsContainer.children.firmRegDate`,
        "props.required",
        !!(action.value == "true")
      )
    )
  }
}

const firmRegNoField = {
  label: {
    labelName: "Firm Registration Number",
    labelKey: "ES_FIRM_REG_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Firm Registration Number",
    labelKey: "ES_FIRM_REG_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.companyRegistrationNumber"
}

const firmRegDateField = {
  label: {
    labelName: "Registration Date",
    labelKey: "ES_REGISTRATION_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.companyRegistrationDate",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const firmAddressField = {
  label: {
    labelName: "Firm Address",
    labelKey: "ES_FIRM_ADDRESS_LABEL"
},
  placeholder: {
    labelName: "Enter Firm Address",
    labelKey: "ES_FIRM_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyAddress",
  props:{
    multiline: true,
    rows: "2"
  }
}

export const firmDetailsHeader = getCommonTitle({
  labelName: "Firm Details",
  labelKey: "ES_FIRM_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

export const firmDetails = getCommonCard({
  header: firmDetailsHeader,
  detailsContainer: getCommonContainer({
    firmName: getTextField(firmNameField),
    isFirmRegistered: getIsFirmRegisteredRadioButton,
    firmRegNo: getTextField(firmRegNoField),
    firmRegDate: getDateField(firmRegDateField),
    firmAddress: getTextField(firmAddressField)
  })
})

const nameField = {
  label: {
    labelName: "Name",
    labelKey: "ES_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Name",
    labelKey: "ES_NAME_PLACEHOLDER"
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

const husbandFatherNameField = {
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

const addressField = {
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
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.address"
}

const mobileNumberField = {
  label: {
    labelName: "Mobile Number",
    labelKey: "ESTATE_MOBILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Mobile Number",
    labelKey: "ES_MOBILE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: getPattern("MobileNo"),
  maxLength: 10,
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
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.share"
}

const cpNumberField = {
  label: {
    labelName: "CP Number",
    labelKey: "ES_CP_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter CP Number",
    labelKey: "ES_CP_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 1,
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.cpNumber"
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
        value: "FATHER"
      },
      {
        label: "Husband",
        labelKey: "ES_COMMON_RELATION_HUSBAND",
        value: "HUSBAND"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.guardianRelation",
    required: true,
  },
  required: true,
  type: "array",
};

export const partnerHeader = getCommonTitle({
  labelName: "Partner Details",
  labelKey: "ES_PARTNER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const commonPartnerInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Partner Information",
      labelKey: "ES_PARTNER_INFORMATION"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    partnerCard: getCommonContainer({
      name: getTextField(nameField),
      husbandFatherName: getTextField(husbandFatherNameField),
      relationship: getRelationshipRadioButton,
      address: getTextField(addressField),
      mobileNumber: getTextField(mobileNumberField),
      share: getTextField(shareField),
      cpNumber: getTextField(cpNumberField)
    })
  });
};

 export const partnerDetails = getCommonCard({
  header: partnerHeader,
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
            scheama: commonPartnerInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Partner",
              labelKey: "ES_COMMON_ADD_PARTNER_LABEL"
            },
            headerName: "Partner Information",
            headerJsonPath: "children.cardContent.children.header.children.Partner Information.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.owners",
            prefixSourceJsonPath: "children.cardContent.children.partnerCard.children"
          },
          type: "array"
        }
      }
    }
  })
})

/***************** Proprietorship ********************/
const proprietorshipDetailsHeader = getCommonTitle({
  labelName: "Proprietorship Details",
  labelKey: "ES_PROPRIETORSHIP_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

export const proprietorshipDetails = getCommonCard({
  header: proprietorshipDetailsHeader,
  detailsContainer: getCommonContainer({
    name: getTextField(nameField),
    husbandFatherName: getTextField(husbandFatherNameField),
    relationship: getRelationshipRadioButton,
    address: getTextField(addressField),
    mobileNumber: getTextField(mobileNumberField),
    share: getTextField(shareField),
    cpNumber: getTextField(cpNumberField)
  })
});
