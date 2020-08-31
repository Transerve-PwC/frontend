import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getLabelWithValue,
    getBreak,
    getLabel,
    getCommonParagraph
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale
  } from "egov-ui-framework/ui-utils/commons";
  import jp from "jsonpath";
  import get from "lodash/get";
  import set from "lodash/set";

  import { presssummaryfooter } from './applyResource/presssummaryfooter'
 
  import { getTenantId } from "../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
  import {getPressMasterSearchResultsView} from "../egov-pr/searchResource/citizenSearchFunctions"
  import {localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
  import {
    pressdetailsSummary  
  } from "./summaryResourcePressdetails/pressdetailsSummary";

  import { deletePressmaster } from "../../../../ui-utils/commons";

  const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Manage Press",
      labelKey: "PR_MANAGE_PRESS_HEADER"
    }),
  
  });
  export const DeletePresmaterData = (state, dispatch) => {
   
      let payload={
        "RequestBody":{ 
          "tenantId":getTenantId(),
          "pressMasterUuid":getQueryArg(window.location.href, "presstId"),
          "moduleCode":localStorageGet("modulecode")
         
        }}
        
          deletePressmaster(dispatch,payload);
      
    };
  export const ConfirmMsg = 
  getCommonContainer({
   
    msgContainer: getCommonContainer({
      subText: getCommonParagraph({
        labelName: "Are you sure you want to delete this press?",
        
        labelKey: "PR_PRESS_CONFIRM_MSG"
      },
      
      {
        style: {
          wordBreak:"break-all"
        }
      }
      ),
      
    }),
      break: getBreak(),
      btnContainer: getCommonContainer({

      cancel: {
        componentPath: "Button",
        props: {
          variant: "outlined",
        //  color: "primary",
          style: {
            color: "rgb(254, 122, 81)",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            height: "38px",
            marginRight: "16px",
            marginTop: "40px",
            minWidth:"80px",
            // backgroundColor: "transparent",
            // color: "rgb(254, 122, 81)",
          //  border: "none",
          //  height: "48px",
          //  marginRight: "16px",
          //  marginTop: "20px",
          //  minWidth:"80px",
          //  boxShadow: "none",

  
          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "Cancel",
            labelKey: "PR_BUTTON_CANCEL"
          }),
          // nextButtonIcon: {
          //   uiFramework: "custom-atoms",
          //   componentPath: "Icon",
          //   props: {
          //     iconName: "keyboard_arrow_right"
          //   }
          // }
        },
        onClickDefination: {
  
  
          action: "condition",
          callBack: (action, state, dispatch) => { window.location.reload(); }
        }
      },
      submit: {
        componentPath: "Button",
        props: {
          variant: "contained",
         color: "primary",
          style: {
            borderRadius: "2px",
            height: "38px",
            marginRight: "16px",
            marginTop: "40px",
            minWidth:"80px",

            //  backgroundColor: "transparent",
            //  color: "rgb(254, 122, 81)",
            // border: "none",
            // borderRadius: "2px",
            // height: "48px",
            // marginRight: "16px",
            // marginTop: "20px",
            // minWidth:"auto",
            // boxShadow: "none",

  
          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "Ok",
            labelKey: "PR_OK_BUTTON"
          }),
          // nextButtonIcon: {
          //   uiFramework: "custom-atoms",
          //   componentPath: "Icon",
          //   props: {
          //     iconName: "keyboard_arrow_right"
          //   }
          // }
        },
        onClickDefination: {
  
  
          action: "condition",
          callBack:  DeletePresmaterData 
        }
      }
  
    })
  });
  
  const prepareDocumentsView = async (state, dispatch) => {
    let documentsPreview = [];
    let reduxDocuments = get(
      state,
      "screenConfiguration.preparedFinalObject.documentsUploadRedux",
      {}
    );
    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        documentsPreview.push({
          title: getTransformedLocale(doc.documentCode),
          name: doc.documents[0].fileName,
          fileStoreId: doc.documents[0].fileStoreId,
          linkText: "View"
        });
      }
    });
    let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : [];
    documentsPreview = documentsPreview.map(doc => {
      doc["link"] = fileUrls[doc.fileStoreId];
      return doc;
    });
  
  
    dispatch(prepareFinalObject("documentsPreview", documentsPreview));
      
  }
  
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "PressMasterSummary",
    beforeInitScreen: (action, state, dispatch) => {
   
      let payload={
        "RequestBody":{ 
            "tenantId":getTenantId(),
            "pressMasterUuid":getQueryArg(window.location.href, "presstId"),
            "moduleCode":localStorageGet("modulecode")
           }
        
              }
      getPressMasterSearchResultsView(state, dispatch,payload)
      let uomsObject = get(
        state.screenConfiguration.preparedFinalObject,
        "PublicRelations[0].PublicRelationDetails.buildings[0].uomsMap"
      );
      if (uomsObject) {
        for (const [key, value] of Object.entries(uomsObject)) {
          let labelElement = getLabelWithValue(
            {
              labelName: key,
              labelKey: `NOC_PROPERTY_DETAILS_${key}_LABEL`
            },
            {
              jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[0].uomsMap.${key}`
            }
          );
          set(
            action,
            `screenConfig.components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.propertyContainer.children.${key}`,
            labelElement
          );
        }
      }
  
     
      if (
        get(
          state.screenConfiguration.preparedFinalObject,
          "PublicRelations[0].PublicRelationDetails.applicantDetails.ownerShipType",
          ""
        ).startsWith("INSTITUTION")
      ) {
        set(
          action,
          "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.visible",
          false
        );
      } else {
        set(
          action,
          "screenConfig.components.div.children.body.children.cardContent.children.institutionSummary.visible",
          false
        );
      }
  
    //  generateBill(dispatch, applicationNumber, tenantId);
      prepareDocumentsView(state, dispatch);
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
          body: getCommonCard({
           
            pressdetailsSummary: pressdetailsSummary,
            
          }),
          presssummaryfooter: presssummaryfooter
        }
      },
    	adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: "xs",
          screenKey: "PressMasterSummary"
        },
        children: {
          popup: ConfirmMsg
        }
      },
    },
    
   
 
  };
  
  export default screenConfig;
  