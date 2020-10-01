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
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";

const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "DocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "ES_BUTTON_UPLOAD_FILE"
    },
    inputProps: [],
    documentTypePrefix: "ES_",
    documentsJsonPath: "temp[0].documents",
    uploadedDocumentsJsonPath: "temp[0].uploadedDocsInRedux",
    tenantIdJsonPath: "Properties[0].tenantId",
    removedJsonPath: "temp[0].removedDocs",
    excelUrl: "/est-services/auctions/_create?"
  }
};

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Upload Bidders List",
      labelKey: "ES_UPLOAD_BIDDERS_LIST_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  // paragraph: getCommonParagraph({
  //   labelName:
  //     "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
  //   labelKey: "ES_NEW-UPLOAD-DOCS_SUBHEADER"
  // }),
  documentList
})

export const auctionDetailsHeader = getCommonTitle({
  labelName: "Auction Details",
  labelKey: "ES_AUCTION_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

// export const biddersListHeader = getCommonTitle({
//   labelName: "Bidders List Upload",
//   labelKey: "ES_BIDDERS_LIST_HEADER"
// }, {
//   style: {
//     marginBottom: 18,
//     marginTop: 18
//   }
// })

const auctionIdField = {
  label: {
    labelName: "Auction Id",
    labelKey: "ES_AUCTION_ID_LABEL"
  },
  placeholder: {
    labelName: "Enter Auction Id",
    labelKey: "ES_AUCTION_ID_PLACEHOLDER"
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
    labelKey: "ES_SCHEME_NAME_LABEL"
  },
  placeholder: {
    labelName: "Enter Scheme Name",
    labelKey: "ES_SCHEME_NAME_PLACEHOLDER"
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
    labelName: "Date Of Auction",
    labelKey: "ES_DATE_OF_AUCTION_LABEL"
  },
  placeholder: {
    labelName: "Enter Date Of Aunction",
    labelKey: "ES_DATE_OF_AUCTION_PLACEHOLDER"
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
    labelKey: "ES_MODE_OF_AUCTION_LABEL"
  },
  placeholder: {
    labelName: "Enter Mode Of Auction",
    labelKey: "ES_MODE_OF_AUCTION_PLACEHOLDER"
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
    labelKey: "ES_EMD_AMOUNT_LABEL"
  },
  placeholder: {
    labelName: "Enter EMD Amount",
    labelKey: "ES_EMD_AMOUNT_PLACEHOLDER"
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
    labelName: "EMD Date",
    labelKey: "ES_EMD_DATE_LABEL"
  },
  placeholder: {
    labelName: "Enter EMD Date",
    labelKey: "ES_EMD_DATE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.emdDate"
}

const buttonItem = {
  firstCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  },
  searchButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 4
    },
    props: {
      variant: "contained",
      style: {
        color: "white",

        backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
        borderRadius: "2px",
        width: "80%",
        height: "48px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "Upload",
        labelKey: "ES_UPLOAD_BUTTON"
      })
    }
  }
}

const commonAuctionInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Auction Details",
      labelKey: "ES_AUCTION_DETAILS_HEADER"
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

// const UploadButtonContainer = getCommonGrayCard({
//   header: biddersListHeader,
//   buttonContainer: getCommonContainer(
//     {...buttonItem, searchButton: {...buttonItem.searchButton, 
//       onClickDefination: {
//         action: "condition",
//         // callBack: searchApiCall
//       }
//     }, lastCont: {
//       uiFramework: "custom-atoms",
//       componentPath: "Div",
//       gridDefination: {
//         xs: 12,
//         sm: 4
//       }
//     }
//   })
// });



export const AllotmentAuctionDetails = getCommonCard({
  header: auctionDetailsHeader,
  biddersListContainer: documentDetails,
  detailsContainer: commonAuctionInformation()
})