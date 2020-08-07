import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardFirstStep, formwizardSecondStep, formwizardThirdStep,recoveryNoticeFirstStep} from './applyResource/applyConfig'
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {footer,recoveryNoticefooter} from './applyResource/footer';
import { searchResults } from "./search-preview";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareDocumentTypeObj } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";




const header = getCommonHeader({
    labelName: "Add Rented Properties",
    labelKey: "RP_COMMON_RENTED_PROPERTIES_ADD"
  });



const recoveryNotice = {
    uiFramework: "material-ui",
    name: "notice-recovry",
 
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                              xs: 12,
                              sm: 10
                            },
                            ...header
                          }
                    }
                },
                // stepper,
                formwizardFirstStep: recoveryNoticeFirstStep,
                footer: recoveryNoticefooter
                
            }
        }
    }
}

export default recoveryNotice