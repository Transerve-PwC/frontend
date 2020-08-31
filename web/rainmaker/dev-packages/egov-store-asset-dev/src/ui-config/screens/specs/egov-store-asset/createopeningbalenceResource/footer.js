import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonApplyFooter,
} from "../../utils";
import { handleCreateUpdateOpeningBalence } from "./function";

const getCommonCreateFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};
export const footer = () => {
  return getCommonApplyFooter({
    
       searchButton: {
         componentPath: "Button",
         
         props: {
           variant: "contained",
           color: "primary",
           style: {
             //minWidth: "200px",
             height: "48px",
             marginRight: "45px"
           }
         },
         children: {
           buttonLabel: getLabel({
             labelName: "searchppr",
             labelKey: "STORE_SUBMIT_LABEL"
           })
         },
         onClickDefination: {
           action: "condition",
           callBack: handleCreateUpdateOpeningBalence
         }
       }
    
    
   });
}
