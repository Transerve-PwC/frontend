import {
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