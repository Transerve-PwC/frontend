import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { formwizardTransitSiteImagesFirstStep } from '../rented-properties/applyResource/applyConfig';
  import { transitsiteimagefooter } from '../rented-properties-citizen/footer';


const header = getCommonHeader({
    labelName: "Upload Transit Site Images",
    labelKey: "RP_TRANSIT_SITE_IMAGES"
});



const uploadTransitImages = {
    uiFramework: "material-ui",
    name: "transit-site-images",
    beforeInitScreen: (action, state, dispatch) => {
        
        // return action;
        return action
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
                            ...header,
                             
                          }
                    }
                },
                // stepper,
                formwizardFirstStep: formwizardTransitSiteImagesFirstStep,
                // formwizardSecondStep: formwizardOwnershipSecondStep,
                // formwizardThirdStep: formwizardOwnershipThirdStep,
                footer: transitsiteimagefooter
               
            }
        }
    }
}

export default uploadTransitImages;