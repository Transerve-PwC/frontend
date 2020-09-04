import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { formwizardTransitSiteImagesFirstStep } from '../rented-properties/applyResource/applyConfig';
import { transitsiteimagefooter } from '../rented-properties-citizen/footer';
import set from "lodash/set";
import get from "lodash/get";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";

const getMdmsData = async (dispatch, body) => {
  let mdmsBody = {
        MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: body
      }
  };
  try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return payload;
  } catch (e) {
      console.log(e);
  }
};

const header = getCommonHeader({
    labelName: "Upload Transit Site Images",
    labelKey: "RP_TRANSIT_SITE_IMAGES"
});
const beforeInitFn =async(action, state, dispatch)=>{
    set(state, 'form.newapplication.files.media', []);
    set(state,'screenConfiguration.preparedFinalObject.PropertyImagesApplications',[]);
    

    console.log(state)
    const transitImagesPayload = [{
      moduleName: "RentedProperties",
      masterDetails: [{name: "applications"}]
    }]
    let documentsRes = await getMdmsData(dispatch, transitImagesPayload);

    if (documentsRes) {
      documentsRes = documentsRes.MdmsRes.RentedProperties.applications[0].documentList;

      documentsRes = documentsRes.filter(item => item.code == "TRANSIT_SITE_IMAGES");
      const imageLength = documentsRes[0].maxCount;
      dispatch(
        handleField(
          "transit-site-images",
          "components.div.children.formwizardFirstStep.children.imageUploadDetailsProperties.children.cardContent.children.uploadimage.children.cardContent.children.imageUpload",
          "props.imageLength",
          imageLength
        )
      )
    }
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