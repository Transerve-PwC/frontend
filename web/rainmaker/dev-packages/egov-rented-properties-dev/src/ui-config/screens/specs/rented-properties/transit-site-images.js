import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { formwizardTransitSiteImagesFirstStep } from '../rented-properties/applyResource/applyConfig';
  import { transitsiteimagefooter } from '../rented-properties-citizen/footer';
  import set from "lodash/set";

const header = getCommonHeader({
    labelName: "Upload Transit Site Images",
    labelKey: "RP_TRANSIT_SITE_IMAGES"
});
const beforeInitFn =async(action, state, dispatch)=>{
    set(state, 'form.newapplication.files.media', []);
    console.log(state)
}

const uploadTransitImages = {
    uiFramework: "material-ui",
    name: "transit-site-images",
    beforeInitScreen: (action, state, dispatch) => {
        beforeInitFn(action, state, dispatch);
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
    
                formwizardFirstStep: formwizardTransitSiteImagesFirstStep,
                footer: transitsiteimagefooter
               
            }
        }
    }
}

export default uploadTransitImages;