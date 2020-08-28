import React from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {onTabChange, headerrow, tabs} from './search-preview'
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults, setXLSTableData } from "../../../../ui-utils/commons";
import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";


const beforeInitFn = async (action, state, dispatch, transitNumber) => {
    dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    if(transitNumber){
        let queryObject = [
            { key: "transitNumber", value: transitNumber },
            {key: "relations", value: "finance"}
          ];
      const response = await getSearchResults(queryObject);
      if(!!response) {
        let {demands, payments} = response.Properties[0];
        demands = demands || []
        payments = payments || []
        setXLSTableData({demands, payments, screenKey: "rent-history", componentJsonPath: "components.div.children.paymentDetailsTable"})
      }
    }
}

const rentHistory = {
    uiFramework: "material-ui",
    name: "rent-history",
    beforeInitScreen: (action, state, dispatch) => {
      const transitNumber = getQueryArg(window.location.href, "transitNumber");
      beforeInitFn(action, state, dispatch, transitNumber);
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
                 ...headerrow
                },
                helpSection: {
                  uiFramework: "custom-atoms",
                  componentPath: "Container",
                  props: {
                    color: "primary",
                    style: { justifyContent: "flex-end" }
                  },
                  gridDefination: {
                    xs: 12,
                    sm: 4,
                    align: "right"
                  }
                }
                }
              },
              tabSection: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-rented-properties",
                componentPath: "CustomTabContainer",
                props: {
                  tabs,
                  onTabChange,
                  activeIndex: 3
                },
                type: "array",
              },
              breakAfterSearch: getBreak(),
              paymentDetailsTable
          }
        }
      }
}

export default rentHistory