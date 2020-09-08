import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { AuctionGridHistoryDetails } from "../auctionHistory/serachResultGrid"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

export const adhocPopup = getCommonContainer({

  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Auction History Details",
              labelKey: "EC_AUCTION_HISTORY_DETAILS"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
    }
  },

  GridDetails: getCommonContainer(
    {
      AuctionGridHistoryDetails
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
});
