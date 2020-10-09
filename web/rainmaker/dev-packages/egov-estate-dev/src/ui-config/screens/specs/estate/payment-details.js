import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './search-preview'



let fileNumber = getQueryArg(window.location.href, "fileNumber");

// const paymentReviewDetails = getReviewPayment(false)

// export const PaymentDetails = getCommonCard({
//   paymentReviewDetails
// });

const paymentContainer = {
  uiFramework: "custom-atoms",
componentPath: "Container",
props: {
  id: "docs"
},
children: {
}
}

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));

    let containers={}
    properties[0].propertyDetails.owners.forEach((element,parentIndex) => { 
      if(element.ownerDetails.paymentDetails){
         let subContainer ={}
         element.ownerDetails.paymentDetails.forEach((element,index) => { 
            let paymentListContainer = getReviewPayment(false,parentIndex,index)
            subContainer[index] = getCommonCard({
              paymentListContainer
              }); 
           })
           containers[parentIndex] = getCommonCard(subContainer); 
      }
    });
    dispatch(
      handleField(
      "payment-details",
      "components.div.children.paymentContainer",
      "children",
      containers
      )
    );
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
    await searchResults(action, state, dispatch, fileNumber)
  }
}


const EstatePaymentDetails = {
  uiFramework: "material-ui",
  name: "payment-details",
  beforeInitScreen: (action, state, dispatch) => {
    fileNumber = getQueryArg(window.location.href, "filenumber");
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
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 6,
              onTabChange
            },
            type: "array",
          },
          paymentContainer
      }
    }
  }
};

export default EstatePaymentDetails;