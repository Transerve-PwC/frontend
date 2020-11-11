import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { SUSVReviewDetails } from "./viewSUSVResource/susv-review";
  import { poViewFooter } from "./viewSUSVResource/footer";
  import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let status = getQueryArg(window.location.href, "status");

  const applicationNumberContainer = () => {

    if (applicationNumber)
      return {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-nulm",
        componentPath: "ApplicationNoContainer",
        props: {
          number: `${applicationNumber}`,
          visibility: "hidden"
        },
        visible: true
      };
    else return {};
  };
  const statusContainer = () => {
 
  if(status)
      return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-nulm",
      componentPath: "ApplicationStatusContainer",
      props: {
       status: `${status}`,
        visibility: "hidden"
      },
      visible: true
    };
   else return {};
 };
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View SUSV`,
      labelKey: "NULM_SUSV_VIEW"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });
  
  const tradeView = SUSVReviewDetails(false);
  
  const getMdmsData = async (dispatch, tenantId) => {
    const tenant = "ch"
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "NULM",
            masterDetails: [
              {
                name: "SusvDocuments",
              }
            ]
          },
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const getFileUrlDetails = async (state,dispatch,tenantId,response)=>{
    //mdms call
    getMdmsData(dispatch, tenantId);

   const fileStoreIds = response.ResponseBody[0].applicationDocument.map(docInfo => docInfo.filestoreId).join();


   const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
   let  documentsUploadRedux ={}
  const documentsPreview = response.ResponseBody[0].applicationDocument 
                          && response.ResponseBody[0].applicationDocument.map((docInfo,index) => {
                            let docObj =  {
                                          title: docInfo.documentType,
                                          linkText: "VIEW", 
                                          link :  (fileUrlPayload &&
                                                    fileUrlPayload[docInfo.filestoreId] &&
                                                    getFileUrl(fileUrlPayload[docInfo.filestoreId])) ||
                                                    "",
                                           name:   (fileUrlPayload &&
                                                      fileUrlPayload[docInfo.filestoreId] &&
                                                      decodeURIComponent(
                                                        getFileUrl(fileUrlPayload[docInfo.filestoreId])
                                                          .split("?")[0]
                                                          .split("/")
                                                          .pop().slice(13)
                                                      )) ||
                                                    `Document - ${index + 1}` 
                                        }

                                        //for populating in update mode
                                   //     const {viewScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
                                    //    if(viewScreenMdmsData && viewScreenMdmsData.NULM && viewScreenMdmsData.NULM.SusvDocuments){

                                 //         const {SusvDocuments} = viewScreenMdmsData.NULM;
                                          const documentsDes = ["Identity Proof","Address Proof","Disability Proof"];
                                       //  const documentsDes = ["NULM_IDENTITY_PROOF","NULM_ADDRESS_PRROF","NULM_DISABILITY_PROOF"];
                                         
                                          const indexOfDoc = documentsDes.findIndex(doc =>  doc === docInfo.documentType )

                                            documentsUploadRedux[indexOfDoc] = {                          
                                            "documents":[
                                            {
                                            "fileName":  (fileUrlPayload &&
                                              fileUrlPayload[docInfo.filestoreId] &&
                                              decodeURIComponent(
                                                getFileUrl(fileUrlPayload[docInfo.filestoreId])
                                                  .split("?")[0]
                                                  .split("/")
                                                  .pop().slice(13)
                                              )) ||
                                            `Document - ${index + 1}`,
                                            "fileStoreId": docInfo.filestoreId,
                                            "fileUrl": fileUrlPayload[docInfo.filestoreId]
                                           }
                                          ]
                                         }
                                     //   }

                              return docObj;
                          })
    
          documentsPreview && dispatch(prepareFinalObject("documentsPreview", documentsPreview));
                          
                            
          documentsPreview &&  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));

                       
   
  }

  const getSUSVDetails = async(state, dispatch) =>{
    
    const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  
    let NulmSusvRequest = {};
    NulmSusvRequest.tenantId = tenantId;
    NulmSusvRequest.applicationId= applicationNumber;
    const requestBody = {NulmSusvRequest}
    let response = await getSearchResults([],requestBody, dispatch,"susv");
  
    if(response){ 
      getFileUrlDetails(state,dispatch,tenantId,response);
      
      if( response.ResponseBody[0]){

        const NulmSusvRequest = { ...response.ResponseBody[0]};
        const radioButtonValue = ["isDisability"];
      
        radioButtonValue.forEach(value => {
          if(NulmSusvRequest[value] && NulmSusvRequest[value]=== true ){
            dispatch(prepareFinalObject(`NulmSusvRequest[${value}]`, "Yes" ));
          }else{
            dispatch(prepareFinalObject(`NulmSusvRequest[${value}]`, "No" ));
          }
        });

        NulmSusvRequest.date = NulmSusvRequest.date.split(" ")[0];
  
        dispatch(prepareFinalObject("NulmSusvRequest", NulmSusvRequest));
      }
    }
  }
  const roleBasedValidationForFooter = () => {
    if(process.env.REACT_APP_NAME === "Employee"){
      return {};//poViewFooter();
    }
    else{
      if(status==="Drafted" || status==="Reassign To Citizen")
          return poViewFooter() 
      else
        return{};
    }
   
  }
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-susv",
    beforeInitScreen: (action, state, dispatch) => {
      getSUSVDetails(state, dispatch);
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
        applicationNumber
      );
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.status.props.status",
        status
      );
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
          taskStatus: {
            uiFramework: "custom-containers-local",
            componentPath: "WorkFlowContainer",
            moduleName: "egov-nulm",
            visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
            props: {
              dataPath: "NulmSusvRequest",
              moduleName: "NULM",
              updateUrl: "/nulm-services/v1/susv/_updateAppStatus"
            }
          },
          tradeView,
          footer: roleBasedValidationForFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  