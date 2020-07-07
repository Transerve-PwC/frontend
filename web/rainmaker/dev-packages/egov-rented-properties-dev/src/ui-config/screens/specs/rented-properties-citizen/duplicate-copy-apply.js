import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";

import {stepper, formwizardDuplicateCopyFirstStep, formwizardDuplicateCopySecondStep } from '../rented-properties/applyResource/applyConfig';
import {footer} from './footer-duplicate-copy';


const header = getCommonHeader({
    labelName: "Apply Duplicate Copy Of Allotment",
    labelKey: "RP_COMMON_DUPLICATE_COPY_APPLY"
});

const applyLicense = {
    uiFramework: "material-ui",
    name: "duplicate-copy-apply",
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
                        header: {
                            gridDefination: {
                              xs: 12,
                              sm: 10
                            },
                            ...header
                          }
                    }
                },
                stepper,
                formwizardFirstStep: formwizardDuplicateCopyFirstStep,
                formwizardSecondStep: formwizardDuplicateCopySecondStep,
                footer
            }
        }
    }
}

export default applyLicense;