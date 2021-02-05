import {
  getCommonCard,
  getBreak,
  getCommonContainer,
  getCommonHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner
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

const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_SECTION_OFFICER");
import store from "../../../../ui-redux/store";

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

const searchResults = async (action, state, dispatch, fileNumber, auctionId) => {
  let queryObject = []
  if(auctionId){
    queryObject = [
      { key: "auctionId", value: auctionId },
      {key: "relations", value: "bidder"}
    ];
  }
  else if(fileNumber){
    queryObject = [
      { key: "fileNumber", value: fileNumber },
      {key: "relations", value: "bidder"}
    ];
  }
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    let filenumber = payload.Properties[0].fileNumber;
    dispatch(prepareFinalObject("Properties", properties));
    dispatch(
      handleField(
        `refund`,
        `components.div.children.headerDiv.children.header1.children.fileNumber`,
        `props.number`,
        filenumber
      )
    )
    if (properties[0].propertyDetails.bidders) {
      let { bidders } = properties[0].propertyDetails;
      populateBiddersTable(bidders, "refund", "components.div.children.auctionTableContainer")
    }
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber, auctionId) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber || auctionId) {
    await searchResults(action, state, dispatch, fileNumber, auctionId);

    let bidders = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.bidders",
      []
    )

    if(bidders.length > 0){
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
    }  
    let refundInitiated = bidders.filter(item => !!item.refundStatus && item.refundStatus != "-");

    let refundInitiatedColDisplay = !!findItem && (bidders.length != refundInitiated.length) ? true : false;

    if(!!fileNumber){
      dispatch(
        handleField(
          `refund`,
          `components.div.children.headerDiv.children.header1.children.fileNumber`,
          `props.number`,
          fileNumber
        )
      )
    }
    

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

  dispatch(toggleSpinner());
}

let auctionDetailsCont = getReviewAuction(false);
const auctionDetailsContainer = getCommonCard({
  auctionDetailsCont
})

const auctionTableContainer = auctionTable;

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

const refund = {
  uiFramework: "material-ui",
  name: "refund",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(toggleSpinner());
    let fileNumber = getQueryArg(window.location.href, "fileNumber");
    let auctionId = getQueryArg(window.location.href, "auctionId");
    dispatch(
      handleField(
        `refund`,
        `components.div.children.headerDiv.children.header1.children.fileNumber`,
        `props.number`,
        fileNumber
      )
    )
    beforeInitFn(action, state, dispatch, fileNumber, auctionId);
    
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
        confirmDialog: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "ConfirmDialog",
          props: {
            screenKey: "refund",
            open: false,
            title: "Confirm",
            content: "Are you sure you want to initiate refund ?",
            populateBiddersTable: populateBiddersTable
          }
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
    }
  }
};

export default refund;