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
    labelKey: "EST_COMPANY_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Name",
    labelKey: "EST_COMPANY_NAME_PLACEHOLDER"
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
    labelKey: "EST_COMPANY_REG_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Registration Number",
    labelKey: "EST_COMPANY_REG_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.companyRegNo"
}

const companyRegDateField = {
  label: {
    labelName: "Registration Date",
    labelKey: "EST_REGISTRATION_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.companyRegDate",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const companyAddressField = {
  label: {
    labelName: "Company Address",
    labelKey: "EST_COMPANY_ADDRESS_LABEL"
},
  placeholder: {
    labelName: "Enter Company Address",
    labelKey: "EST_COMPANY_ADDRESS_PLACEHOLDER"
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
  labelKey: "EST_COMPANY_DETAILS_HEADER"
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
    labelKey: "EST_FIRM_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Firm Name",
    labelKey: "EST_FIRM_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.firmName"
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
      key: "EST_IS_FIRM_REGISTERED_LABEL"
    },
    buttons: [{
        labelName: "YES",
        labelKey: "EST_COMMON_YES",
        value: "YES"
      },
      {
        label: "NO",
        labelKey: "EST_COMMON_NO",
        value: "NO"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.isFirmRegistered",
    required: true,
    value: "YES"
  },
  required: true,
  type: "array",
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value == "YES") {
      
    }
  }
}

const firmRegNoField = {
  label: {
    labelName: "Firm Registration Number",
    labelKey: "EST_FIRM_REG_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Firm Registration Number",
    labelKey: "EST_FIRM_REG_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.firmRegNo"
}

const firmRegDateField = {
  label: {
    labelName: "Registration Date",
    labelKey: "EST_REGISTRATION_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.firmRegDate",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const firmAddressField = {
  label: {
    labelName: "Firm Address",
    labelKey: "EST_FIRM_ADDRESS_LABEL"
},
  placeholder: {
    labelName: "Enter Firm Address",
    labelKey: "EST_FIRM_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  minLength: 2,
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.firmAddress",
  props:{
    multiline: true,
    rows: "2"
  }
}

export const firmDetailsHeader = getCommonTitle({
  labelName: "Firm Details",
  labelKey: "EST_FIRM_DETAILS_HEADER"
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
    labelKey: "EST_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Name",
    labelKey: "EST_NAME_PLACEHOLDER"
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
    labelKey: "EST_FATHER_HUSBAND_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Father/Husband Name",
    labelKey: "EST_FATHER_HUSBAND_NAME_PLACEHOLDER"
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
    labelKey: "EST_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter Address",
    labelKey: "EST_ADDRESS_PLACEHOLDER"
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
    labelKey: "EST_MOBILE_NUMBER_PLACEHOLDER"
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
    labelKey: "EST_SHARE_LABEL"
  },
  placeholder: {
    labelName: "Enter Share",
    labelKey: "EST_SHARE_PLACEHOLDER"
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
    labelKey: "EST_CP_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter CP Number",
    labelKey: "EST_CP_NUMBER_PLACEHOLDER"
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
      key: "EST_RELATIONSHIP_LABEL"
    },
    buttons: [{
        labelName: "Father",
        labelKey: "EST_COMMON_RELATION_FATHER",
        value: "FATHER"
      },
      {
        label: "Husband",
        labelKey: "EST_COMMON_RELATION_HUSBAND",
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
  labelKey: "EST_PARTNER_DETAILS_HEADER"
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
      labelKey: "EST_PARTNER_INFORMATION"
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
    multiplePartnerContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multiplePartnerInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonPartnerInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Partner",
              labelKey: "EST_COMMON_ADD_PARTNER_LABEL"
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
  labelKey: "EST_PROPRIETORSHIP_DETAILS_HEADER"
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
