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
  toggleSnackbar
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
          display: true,
          viewColumns: true
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
    let reqBody = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties"
    )

    const response = await httpRequest(
      "post",
      "/est-services/property-master/_update",
      "",
      [], 
      {
        Properties: reqBody
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
    }
  } catch(err) {
    dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  }
}

const refund = {
  uiFramework: "material-ui",
  name: "refund",
  beforeInitScreen: (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "filenumber");
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