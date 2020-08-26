import React from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {onTabChange, headerrow, tabs} from './search-preview'
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {paymentDetailsTable} from './applyResource/applyConfig'
import { RP_MONTH, RP_ASSESSMENT_AMOUNT, RP_REALIZATION_AMOUNT, RP_RECEIPT_NO } from "../../../../ui-constants";
import moment from "moment";

const beforeInitFn = async (action, state, dispatch, transitNumber) => {
    dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    if(transitNumber){
        let queryObject = [
            { key: "transitNumber", value: transitNumber },
            {key: "relations", value: "finance"}
          ];
      const response = await getSearchResults(queryObject);
      if(!!response) {
        const {demand, payment} = response.Properties[0];
        let data = demand.map(item => {
          const findItem = payment.find(payData => moment(new Date(payData.dateOfPayment)).format("MMM YYYY") === moment(new Date(item.generationDate)).format("MMM YYYY"));
          return !!findItem ? {...item, ...findItem} : {...item}
        })
        data = data.map(item => ({
          [RP_MONTH]: moment(new Date(item.generationDate)).format("MMM YYYY"),
          [RP_ASSESSMENT_AMOUNT]: item.collectionPrincipal.toFixed(2),
          [RP_REALIZATION_AMOUNT]: item.amountPaid.toFixed(2),
          [RP_RECEIPT_NO]: item.receiptNo
        }))
  
        const {totalAssessment, totalRealization} = data.reduce((prev, curr) => {
          prev = {
            totalAssessment: prev.totalAssessment + Number(curr[RP_ASSESSMENT_AMOUNT]),
            totalRealization: prev.totalRealization + Number(curr[RP_REALIZATION_AMOUNT])
          } 
          return prev
        }, {totalAssessment: 0, totalRealization: 0})
  
        data = [...data, {
          [RP_MONTH]: "Total",
          [RP_ASSESSMENT_AMOUNT]: totalAssessment.toFixed(2),
          [RP_REALIZATION_AMOUNT]: totalRealization.toFixed(2),
          [RP_RECEIPT_NO]: ""
        }]
  
        dispatch(
          handleField(
              "rent-history",
              "components.div.children.paymentDetailsTable",
              "props.data",
              data
          )
        );
        dispatch(
          handleField(
              "rent-history",
              "components.div.children.paymentDetailsTable",
              "visible",
              true
          )
        );
      }
    }
}

export const rentHistory = {
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
                  activeIndex: 2
                },
                type: "array",
              },
              paymentDetailsTable
          }
        }
      }
}