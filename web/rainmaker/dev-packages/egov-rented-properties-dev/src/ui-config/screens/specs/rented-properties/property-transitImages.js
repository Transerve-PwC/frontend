import {
      getCommonHeader,
      getCommonContainer,
      getCommonCard,
      getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {onTabChange, headerrow, tabs} from './search-preview'
  import { getSearchResults } from "../../../../ui-utils/commons";
import {
  getQueryArg,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
  let transitNumber = getQueryArg(window.location.href, "transitNumber");

  const fetchImage = async (imgId) => {
    const res = await getFileUrlFromAPI(imgId.fileStoreId)           
      return res.fileStoreIds[0].url;
  }
 
  const getImages = (imageObs) => {
    return Promise.all(
      imageObs.map(imageOb =>
        Promise.all(imageOb.applicationDocuments.map(id => fetchImage(id))).then(urls => ({
          ...imageOb,
          urls
        }))
      )
    );
  }
  
  export const searchResults = async (action, state, dispatch, transitNumber) => {
    let queryObject = [
      { key: "transitNumber", value: transitNumber }
    ];
    let payload = await getSearchResults(queryObject);
    if(payload) {
      let properties = payload.Properties;
      if(properties[0].propertyImages){
        let data = properties[0].propertyImages;
        data = data.filter(function(image) {
        if(image.applicationDocuments != null){
          return image;
        }
      })
        let images = await getImages(data);
        images = images.map(item => {
          let { applicationDocuments, urls } = item;
          applicationDocuments = applicationDocuments.map((image, index) => ({ ...image, url: urls[index] }));
          return { ...item, applicationDocuments };
        });
        dispatch(prepareFinalObject("Images", images));
        dispatch(prepareFinalObject("Properties[0]", properties[0]));     
      }
    }
    
   }
  
  const beforeInitFn = async (action, state, dispatch, transitNumber) => {
    dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    if(transitNumber){
      await searchResults(action, state, dispatch, transitNumber)
    }
  }
  
  const propertyTransitImages = {
      uiFramework: "material-ui",
      name: "property-transitImages",
      beforeInitScreen: (action, state, dispatch) => {
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
                  activeIndex: 1
                },
                type: "array",
              },
              viewFour: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-rented-properties",
                componentPath: "MultipleDocumentsContainer",
                props: {
                  sourceJsonPath:"Images",
                  businessService:"RP",
                  className: "review-documents"
                }
              },
          }
        }
      }
    };
  
    export default propertyTransitImages;