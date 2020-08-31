import {
  dispatchMultipleFieldChangeAction,
  getLabel,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { 
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, convertDateTimeToEpoch } from "../../utils";
import "./index.css";
import {
  createUpdateNocApplication,
  auctionCreateMasterChallanData
} from "../../../../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";

const setReviewPageRoute = (state, dispatch) => {

  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-echallan-auction/home`;
  dispatch(setRoute(reviewUrl));
};


const updateAuctioDetails = async (state, dispatch) => {

  let challanObj = [];
  let auctionedGrid = [];
  let isSubmitted = get(state.screenConfiguration.preparedFinalObject, "auctionDetails.isSubmitted", false);
  challanObj = get(state.screenConfiguration.preparedFinalObject, "eChallanDetail[0]", []);
  auctionedGrid = get(state.screenConfiguration.preparedFinalObject, "auctionGridDetails", []);
  let aulist = [];
  dispatch(toggleSpinner());
  if (auctionedGrid.length > 0 && !isSubmitted) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.footer.children.submitButton",
        "props.disabled", true
      ));

    set(state, 'screenConfiguration.preparedFinalObject.auctionDetails.isSubmitted', true);
    auctionedGrid.forEach(element => {
      let temp = {
        purchaserName: element[4],
        purchaserContactNo: element[3],
        auctionDate: convertEpochToDate(convertDateTimeToEpoch(element[2])),
        auctionAmount: element[6],
        auctionQuantity: element[5],
        violationItemUuid: challanObj.violationItem[0].violationItemUuid,
        storeItemUuid: element[7]
      }
      aulist.push(temp);

    });

    try {
      let data = {
        tenantId: getTenantId(),
        challanUuid: challanObj.challanUuid,
        violationUuid: challanObj.violationItem[0].violationUuid,
        auctionList: aulist
      }

      let response = await auctionCreateMasterChallanData(state, dispatch, data);
      dispatch(toggleSpinner());
      let responseStatus = get(response, "status", "");
      if (responseStatus == 'SUCCESS' || responseStatus == 'success') {
        dispatch(toggleSnackbar(true, {
          labelName: "Auction Details has been initated and send to Approval!",
          labelKey: "EC_AUCTION_APPROVE_SUCCESS_TOASTER"
        }, "success"));
        setReviewPageRoute(state, dispatch);
      } else {
        dispatch(toggleSnackbar(true, {
          labelName: "Submission Falied, Try Again later!",
          labelKey: "EC_AUCTION_APPROVE_FAIL_TOASTER",
        }, "warning"));
      }
    } catch (error) {
      console.log(error);
    }
  }
  else {
    dispatch(toggleSpinner());
    dispatch(toggleSnackbar(true, {
      labelName: "Atleast one Auction Detail has to be there for processing Auction!",
      labelKey: "EC_AUCTION_NO_RECORD_TOASTER"
    }, "warning"));
  }
};

export const footer = getCommonApplyFooter({
  cancelButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      cancelButtonLabel: getLabel({
        labelName: "CANCEL",
        labelKey: "EC_AUCTION_COMMON_BUTTON_CANCEL"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      },

      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: setReviewPageRoute
    }
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      auctionButtonLabel: getLabel({
        labelName: "submit",
        labelKey: "EC_AUCTION_SUBMIT_BUTTON_LABEL"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: updateAuctioDetails
    }
  },
});
