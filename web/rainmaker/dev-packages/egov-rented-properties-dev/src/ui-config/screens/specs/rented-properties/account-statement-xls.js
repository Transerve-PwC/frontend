import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {uploadXLS } from './applyResource/applyConfig';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {accountGenerationFooter} from '../rented-properties-citizen/footer';
import {onTabChange, headerrow, tabs} from './search-preview'
const header = getCommonHeader({
    labelName: "Apply for Account Statement Generation",
    labelKey: "RP_COMMON_ACCOUNT_STATEMENT_GENERATION_APPLY"
});

const accountStatementXLS = {
    uiFramework: "material-ui",
    name: "account-statement-xls",
    beforeInitScreen: (action, state, dispatch) => {
        return action;
      },
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
                        // header: {
                        //     gridDefination: {
                        //       xs: 12,
                        //       sm: 10
                        //     },
                        //     ...header
                        //   }
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
                // formwizardFirstStep: uploadXLS,
                footer:accountGenerationFooter
            }
        }
    }
}

export default accountStatementXLS;