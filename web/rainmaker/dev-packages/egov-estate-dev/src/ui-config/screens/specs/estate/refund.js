import {
  getCommonCard,
  getBreak,
  getCommonContainer,
  getCommonHeader,
  getLabel,
  getCommonTitle,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getSearchResults,
  populateBiddersTable
} from "../../../../ui-utils/commons";
import {
  getReviewAuction
} from "./preview-resource/preview-properties";
import {
  auctionTable
} from './applyResource/auction-details';
import {
  getTextToLocalMapping
} from '../utils'
import {
  httpRequest
} from '../../../../ui-utils/api';
import get from "lodash/get";
import { WF_EB_REFUND_OF_EMD } from "../../../../ui-constants";
import {
  getUserInfo
  } from "egov-ui-kit/utils/localStorageUtils";
import store from "redux/store";

const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_SECTION_OFFICER");

const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "bidder"}
  ];
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));
    if (properties[0].propertyDetails.bidders) {
      let { bidders } = properties[0].propertyDetails;
      populateBiddersTable(bidders, "refund", "components.div.children.auctionTableContainer")
    }
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber) {
    await searchResults(action, state, dispatch, fileNumber);

    let bidders = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.bidders",
      []
    )

    if (!!bidders[0].state) {
      dispatch(
        handleField(
          action.screenKey,
          `components.div.children.taskStatus`,
          `visible`,
          `true`
        )
      )
    }
    let refundInitiated = bidders.filter(item => !!item.refundStatus && item.refundStatus != "-");

    let refundInitiatedColDisplay = !!findItem && (bidders.length != refundInitiated.length) ? true : false;

    dispatch(
      handleField(
        `refund`,
        `components.div.children.headerDiv.children.header1.children.fileNumber`,
        `props.number`,
        fileNumber
      )
    )

    dispatch(
      handleField(
        `refund`,
        `components.div.children.auctionTableContainer`,
        `visible`,
        true
      )
    )

    const auctionTableColumns = [
      getTextToLocalMapping("Auction Id"),
      getTextToLocalMapping("Bidder Name"),
      getTextToLocalMapping("Deposited EMD Amount"),
      getTextToLocalMapping("Deposit Date"),
      getTextToLocalMapping("EMD Validity Date"),
      {
        name: getTextToLocalMapping("Initiate Refund"),
        options: { 
          display: refundInitiatedColDisplay,
          viewColumns: refundInitiatedColDisplay
        }
      },
      {
        name: getTextToLocalMapping("Refund Status"),
        options: { 
          display: true,
          viewColumns: true
        }
      }
    ]

    dispatch(
      handleField(
        "refund",
        "components.div.children.auctionTableContainer",
        "props.columns",
        auctionTableColumns
      )
    )

  }
}

let auctionDetailsCont = getReviewAuction(false);
const auctionDetailsContainer = getCommonCard({
  auctionDetailsCont
})

const auctionTableContainer = auctionTable;

const headerRow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Refund",
    labelKey: "ES_COMMON_REFUND"
  }),
  fileNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-estate",
    componentPath: "FileNumberContainer",
    props: {
      number: ""
    },
  }
});

const submitButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 15px 0px 0px",
      borderRadius: "inherit",
      right: 0,
      position: "absolute"
    }
  },
  children: {
    submitButtonLabel: getLabel({
      labelName: "Submit",
      labelKey: "ES_COMMON_BUTTON_SUBMIT"
    }),
    submitButtonIcon: {
      uiFramework: "custom-atoms",
      componentPath: "Icon",
      props: {
        iconName: "keyboard_arrow_right"
      }
    }
  },
  visible: false
}

const saveButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 15px 0px 0px",
      borderRadius: "inherit",
      right: 0,
      position: "absolute"
    }
  },
  children: {
    saveButtonLabel: getLabel({
      labelName: "Save",
      labelKey: "ES_COMMON_BUTTON_SAVE"
    }),
    saveButtonIcon: {
      uiFramework: "custom-atoms",
      componentPath: "Icon",
      props: {
        iconName: "keyboard_arrow_right"
      }
    }
  },
  visible: false
}

const callBackForSaveOrSubmit = async (state, dispatch) => {
  try {
    let properties = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties"
    )

    const response = await httpRequest(
      "post",
      "/est-services/property-master/_update",
      "",
      [], 
      {
        Properties: properties

      }
    );
    if (!!response) {
      let message = {
        labelName: "Success",
        labelKey: "ES_SUCCESS"
      };
      dispatch(toggleSnackbar(true, message, "success"));
      dispatch(
        handleField(
          "refund",
          "components.div.children.saveButton",
          "visible",
          false
        )
      )
      dispatch(
        handleField(
          "refund",
          "components.div.children.submitButton",
          "visible",
          false
        )
      )

      let bidders = properties[0].propertyDetails.bidders;
      let refundInitiated = bidders.filter(item => !!item.refundStatus);
  
      let refundInitiatedColDisplay = !!findItem && (bidders.length != refundInitiated.length) ? true : false;

      const auctionTableColumns = [
        getTextToLocalMapping("Auction Id"),
        getTextToLocalMapping("Bidder Name"),
        getTextToLocalMapping("Deposited EMD Amount"),
        getTextToLocalMapping("Deposit Date"),
        getTextToLocalMapping("EMD Validity Date"),
        {
          name: getTextToLocalMapping("Initiate Refund"),
          options: { 
            display: refundInitiatedColDisplay,
            viewColumns: refundInitiatedColDisplay
          }
        },
        {
          name: getTextToLocalMapping("Refund Status"),
          options: { 
            display: true,
            viewColumns: true
          }
        }
      ]
  
      dispatch(
        handleField(
          "refund",
          "components.div.children.auctionTableContainer",
          "props.columns",
          auctionTableColumns
        )
      )
  
    }
  } catch(err) {
    dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  }
}

const adhocDialogHeader = getCommonTitle({
  labelName: "Are you sure you want to initiate refund?",
  labelKey: "Are you sure you want to initiate refund?"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

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
  // pattern: _getPattern("address"),
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.address",
  // afterFieldChange: (action, state, dispatch) => {
  //   if (action.value.length > 150) {
  //       displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", screenName);
  //   }
  //   else {
  //       displayDefaultErr(action.componentJsonpath, dispatch, screenName);
  //   }
  // }
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
  // pattern: getPattern("MobileNo"),
  // props: {
  //   value: userInfo.userName,
  //   disabled: true
  // },
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.mobileNumber"
}

// const editOwnerDetails = getCommonContainer({
//   address: getTextField(addressField),
//   mobileNumber: getTextField(mobileNumberField)
// })

const cancelButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 0px 0px 0px",
      borderRadius: "inherit"
    }
  },
  children: {
    cancelButtonLabel: getLabel({
      labelName: "Cancel",
      labelKey: "ES_COMMON_BUTTON_CANCEL"
    }),
    // cancelButtonIcon: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Icon",
    //   props: {
    //     iconName: "keyboard_arrow_right"
    //   }
    // }
  },
  visible: true
}
const okButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 0px 0px 15px",
      borderRadius: "inherit",
    }
  },
  children: {
    saveButtonLabel: getLabel({
      labelName: "Save",
      labelKey: "ES_COMMON_BUTTON_SAVE"
    }),
    // saveButtonIcon: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Icon",
    //   props: {
    //     iconName: "keyboard_arrow_right"
    //   }
    // }
  },
  visible: true
}

export const callBackForCancel = async (state,dispatch) => {

  store.dispatch(
    handleField(
      "refund",
      `components.adhocDialog`,
      "props.open",
      false
    )
  )
}

const callBackForSave = async(state,dispatch,e) => {
  setTimeout((e) => {
    // store.dispatch(toggleSpinner());
    let { isMarked } = store.getState().screenConfiguration.preparedFinalObject;
    let { Properties } = store.getState().screenConfiguration.preparedFinalObject;
    let bidderData = store.getState().screenConfiguration.preparedFinalObject.BidderData;
    let { biddersList } = store.getState().screenConfiguration.preparedFinalObject;

    biddersList = biddersList.map((item, index) => {
      if (bidderData[1] == item.bidderName) {
        item.refundStatus = isMarked ? "Initiated" : "-";
      }
      return item;
    });
    populateBiddersTable(biddersList, "refund", "components.div.children.auctionTableContainer")

    // populateBiddersTable(biddersList, screenKey, componentJsonPath)

    let refundedBidders = biddersList.filter(item => item.refundStatus == "Initiated");
    store.dispatch(
      handleField(
        "refund", 
        "components.div.children.submitButton",
        "visible",
        (biddersList.length === refundedBidders.length)
      )
    )
    store.dispatch(
      handleField(
        "refund", 
        "components.div.children.saveButton",
        "visible",
        (biddersList.length !== refundedBidders.length)
      )
    )

    if (biddersList.length == refundedBidders.length) {
      biddersList = biddersList.map(item => ({...item, action: "SUBMIT"}));
    }
    else {
      biddersList = biddersList.map(item => ({...item, action: "", state: ""}));
    }

    let properties = [{...Properties[0], propertyDetails: {...Properties[0].propertyDetails, bidders: biddersList}}]
    store.dispatch(
      prepareFinalObject(
        "Properties",
        properties
      )
    )
    store.dispatch(
      handleField(
        "refund",
        `components.adhocDialog`,
        "props.open",
        false
      )
     )
  }, 1000)
}

const refund = {
  uiFramework: "material-ui",
  name: "refund",
  beforeInitScreen: (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerRow
            },
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "WorkFlowContainer",
          props: {
            dataPath: "Properties",
            moduleName: WF_EB_REFUND_OF_EMD,
            updateUrl: "/est-services/property-master/_update",
            style: {
              wordBreak: "break-word"
            }
          },
          visible:false
        },
        auctionDetailsContainer,
        breakAfterSearch: getBreak(),
        auctionTableContainer,
        submitButton: {
          ...submitButton,
          onClickDefination: {
            action: "condition",
            callBack: callBackForSaveOrSubmit
          }
        },
        saveButton: {
          ...saveButton,
          onClickDefination: {
            action: "condition",
            callBack: callBackForSaveOrSubmit
          }
        }
      }
     
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-estate",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "refund",
      },
      children: {
        header: adhocDialogHeader,
        // details: editOwnerDetails,
        cancelButton: {
          ...cancelButton,
          onClickDefination: {
            // action: "condition",
            // callBack: callBackForCancel
          }
        },
        saveButton: {
          ...okButton,
          onClickDefination: {
            // action: "condition",
            // callBack: callBackForSave
          }
        }
      }
    }
  }
};

export default refund;