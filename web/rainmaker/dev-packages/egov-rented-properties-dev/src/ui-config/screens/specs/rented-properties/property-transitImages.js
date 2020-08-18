import {
      getCommonHeader,
      getCommonContainer,
      getCommonCard,
      getLabel,
      convertEpochToDate
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {onTabChange, headerrow, tabs} from './search-preview'
  import { getSearchResults } from "../../../../ui-utils/commons";
import {
  getQueryArg,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";

  let transitNumber = getQueryArg(window.location.href, "transitNumber");

  export const fetchImage = async (imgId) => {
    const res = await getFileUrlFromAPI(imgId.fileStoreId)           
      return res.fileStoreIds[0].url;
  }
 
  export const getImages = (imageObs) => {
    imageObs = imageObs.filter(img => !!img.applicationDocuments)
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
        const {notices = []} = properties[0]
        let data = properties[0].propertyImages;
        data = data.filter(function(image) {
        if(image.applicationDocuments != null){
          return image;
        }
      }).map(item => {
        const transitNotices = notices.filter(notice => notice.propertyImageId === item.id).map(notice => notice.memoNumber)
          return {...item, notices: transitNotices.join(",")}
      })
        let images = await getImages(data);
        images = images.map(item => {
          let { applicationDocuments, urls } = item;
          applicationDocuments = applicationDocuments.map((image, index) => ({ ...image, url: urls[index], name: urls[index].split("?")[0].split("/").pop().slice(13) }));
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
                  btnhide: true,
                  businessService:"RP",
                  className: "review-documents",
                  contents: [
                    {
                      label: "RP_NOTICE_ID",
                      jsonPath: "notices",
                      url:`/rented-properties/notices?tenantId=${getTenantId()}` 
                    },
                    {
                      label: "RP_CREATED_DATE",
                      jsonPath: "auditDetails.createdTime",
                      callback: convertEpochToDate
                    },
                    {
                      label: "RP_COMMENTS_LABEL",
                      jsonPath: "description"
                    },
                    {
                      label: "RP_CAPTUREDBY_LABEL",
                      jsonPath: "capturedBy"
                    },
                  ]
                }
              },
          }
        }
      }
    };
  
    export default propertyTransitImages;