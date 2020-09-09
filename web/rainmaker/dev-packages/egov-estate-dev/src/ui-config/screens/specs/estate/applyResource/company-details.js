import {
<<<<<<< HEAD
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getCommonGrayCard,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";


export const auctionDetailsHeader = getCommonTitle({
  labelName: "Company Details",
  labelKey: "EST_COMPANY_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})


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
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyName"
}

const companyAddressField = {
  label: {
    labelName: "Company Address",
    labelKey: "EST_ESTATE_COMPANY_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Address",
    labelKey: "EST_ESTATE_COMPANY_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyAddress"
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
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyRegNoField"
}

const companyTypeField = {
  label: {
    labelName: "Company Type",
    labelKey: "EST_COMPANY_TYPE_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Type",
    labelKey: "EST_COMPANY_TYPE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyTypeField"
}

const CompanyShareholderNameField = {
  label: {
    labelName: "Company Shareholder Name",
    labelKey: "EST_COMPANY_SHAREHOLDER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Shareholder Name",
    labelKey: "EST_COMPANY_SHAREHOLDER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyShareHolderName"
}

const companyShare = {
  label: {
    labelName: "Company Share %",
    labelKey: "EST_COMPANY_SHARE_LABEL"
  },
  placeholder: {
    labelName: "Enter Company Share %",
    labelKey: "EST_COMPANY_SHARE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.companyShare"
}

const PartnerName = {
  label: {
    labelName: "Partner Name",
    labelKey: "EST_PARTNER_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Partner Name",
    labelKey: "EST_PARTNER_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.partners[0].partnerName"
}

const PartnerHusbandFatherName = {
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
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.partners[0].partnerFatherHusbandName"
}

const partnerAddress = {
  label: {
    labelName: "Partner Address",
    labelKey: "EST_PARTNER_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter Partner Address",
    labelKey: "EST_PARTNER_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.partners[0].partnerAddress"
}

const partnerMobileNumber = {
  label: {
    labelName: "Partner Mobile Number",
    labelKey: "EST_PARTNER_MOBILE_LABEL"
  },
  placeholder: {
    labelName: "Enter Partner Mobile Number",
    labelKey: "EST_PARTNER_MOBILE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.partners[0].partnerMobileNumber"
}

const partnerShare = {
  label: {
    labelName: "Partner Share",
    labelKey: "EST_PARTNER_SHARE_LABEL"
  },
  placeholder: {
    labelName: "Enter Partner Share",
    labelKey: "EST_PARTNER_SHARE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.partners[0].partnerShare"
}

const partnerCPNumber = {
  label: {
    labelName: "Partner CP Number",
    labelKey: "EST_PARTNER_CP_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Partner CP Number",
    labelKey: "EST_PARTNER_CP_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.partners[0].partnerCpNumber"
}

const commonCompanyDetails = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Company Details",
      labelKey: "EST_COMPANY_DETAILS"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    auctionCard: getCommonContainer({
      auctionId: getTextField(companyNameField),
      companyAddressField: getTextField(companyAddressField),
      companyRegNoField: getTextField(companyRegNoField),
      companyTypeField: getTextField(companyTypeField),
      CompanyShareholderNameField: getTextField(CompanyShareholderNameField),
      companyShare: getTextField(companyShare)
    })
  });
};

const CompanyPartnerDetails = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "partner Details",
      labelKey: "EST_PARTNER_DETAILS"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    auctionCard: getCommonContainer({
      PartnerName: getTextField(PartnerName),
      PartnerHusbandFatherName: getTextField(PartnerHusbandFatherName),
      partnerAddress: getTextField(partnerAddress),
      partnerMobileNumber: getTextField(partnerMobileNumber),
      partnerShare: getTextField(partnerShare),
      partnerCPNumber: getTextField(partnerCPNumber)
    })
  });
};

const partnersCotainer = getCommonContainer({
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
          scheama: CompanyPartnerDetails(),
          items: [],
          addItemLabel: {
            labelName: "Add Partner",
            labelKey: "EST_COMMON_ADD_PARTNER_LABEL"
          },
          headerName: "Partner Information",
          headerJsonPath: "children.cardContent.children.header.children.Partner Information.props.label",
          sourceJsonPath: "Properties[0].propertyDetails.partners",
          prefixSourceJsonPath: "children.cardContent.children.auctionCard.children"
        },
        type: "array"
      }
    }
  }
})


export const CompanyDetails = getCommonCard({
  header: auctionDetailsHeader,
  companyDetails: commonCompanyDetails(),
  partnerDetails: partnersCotainer
})
=======
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer,
    getCommonGrayCard,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";

  
  export const auctionDetailsHeader = getCommonTitle({
    labelName: "Company Details",
    labelKey: "EST_COMPANY_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  
  const auctionIdField = {
    label: {
      labelName: "Auction Id",
      labelKey: "EST_AUCTION_ID_LABEL"
    },
    placeholder: {
      labelName: "Enter Auction Id",
      labelKey: "EST_AUCTION_ID_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.auctionId"
  }
  
  const schemeName = {
    label: {
      labelName: "Scheme Name",
      labelKey: "EST_ESTATE_SCHEME_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Scheme Name",
      labelKey: "EST_ESTATE_SCHEME_NAME_LACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.schemeName"
  }
  
  const dateOfAuction = {
    label: {
      labelName: "Date Of Aunction",
      labelKey: "EST_DATE_OF_AUCTION_LABEL"
    },
    placeholder: {
      labelName: "Enter Date Of Aunction",
      labelKey: "EST_DATE_OF_AUCTION_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.dateOfAuction"
  }
  
  const modeOfAuction = {
    label: {
      labelName: "Mode Of Auction",
      labelKey: "EST_MODE_OF_AUCTION_LABEL"
    },
    placeholder: {
      labelName: "Enter Mode Of Auction",
      labelKey: "EST_MODE_OF_AUCTION_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.modeOfAuction"
  }
  
  const emdAmount = {
    label: {
      labelName: "EMD Amount",
      labelKey: "EST_EMD_AMOUNT_LABEL"
    },
    placeholder: {
      labelName: "Enter EMD Amount",
      labelKey: "EST_EMD_AMOUNT_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.emdAmount"
  }
  
  const emdAmountDate = {
    label: {
      labelName: "EMD Amount Date",
      labelKey: "EST_EMD_AMOUNT_DATE_LABEL"
    },
    placeholder: {
      labelName: "Enter EMD Amount Date",
      labelKey: "EST_EMD_AMOUNT_DATE_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.emdAmountDate"
  }
  
  
  const commonCompanyDetails = () => {
    return getCommonGrayCard({
      header: getCommonTitle({
        labelName: "Company Details",
        labelKey: "EST_COMPANY_DETAILS"
      }, {
        style: {
          marginBottom: 18
        }
      }),
      auctionCard: getCommonContainer({
        auctionId: getTextField(auctionIdField),
        schemeName: getTextField(schemeName),
        dateOfAuction: getDateField(dateOfAuction),
        modeOfAuction: getTextField(modeOfAuction),
        emdAmount: getTextField(emdAmount),
        emdAmountDate: getDateField(emdAmountDate)
      })
    });
  };

  const partnersCotainer = getCommonContainer({
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
            scheama: commonCompanyDetails(),
            items: [],
            addItemLabel: {
              labelName: "Add Partner",
              labelKey: "EST_COMMON_ADD_PARTNER_LABEL"
            },
            headerName: "Partner Information",
            headerJsonPath: "children.cardContent.children.header.children.Owner Information.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.partners",
            prefixSourceJsonPath: "children.cardContent.children.ownerCard.children"
          },
          type: "array"
        }
      }
    }
  })

  
  export const CompanyDetails = getCommonCard({
    header: auctionDetailsHeader,
    companyDetails: commonCompanyDetails(),
    partnerDetails: partnersCotainer
  })
>>>>>>> b721a860... company details init
