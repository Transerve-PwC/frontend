import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { ShgMemberReviewDetails } from "./viewSHGMemberResource/shg-member-review"
  import { poViewFooter } from "./viewSHGMemberResource/footer";
  import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  const applicationNumber = getQueryArg(window.location.href, "applicationId");
  const status = getQueryArg(window.location.href, "status");

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
      labelName: `SHG Member`,
      labelKey: "NULM_SHG_MEMBER_HEADER"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });
  
  const tradeView = ShgMemberReviewDetails(false);
  
  const getMdmsData = async (action, state, dispatch, tenantId) => {
    const tenant = tenantId || getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "egov-hrms",
            masterDetails: [
              {
                name: "DeactivationReason",
                filter: "[?(@.active == true)]"
              }
            ]
          }
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

   const fileStoreIds = response.ResponseBody[0].documentAttachemnt;


   const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));

   if(fileUrlPayload){
   let  documentsUploadRedux ={}
  const documentsPreview = [  {    title: "smidDocument",
                                    linkText: "VIEW", 
                                    link :  (fileUrlPayload &&
                                                    fileUrlPayload[fileStoreIds] &&
                                                    getFileUrl(fileUrlPayload[fileStoreIds])) ||
                                                    "",
                                     name:   (fileUrlPayload &&
                                                      fileUrlPayload[fileStoreIds] &&
                                                      decodeURIComponent(
                                                        getFileUrl(fileUrlPayload[fileStoreIds])
                                                          .split("?")[0]
                                                          .split("/")
                                                          .pop().slice(13)
                                                      )) ||
                                                    `Document - ${index + 1}` 
                                        }
                                      ];
                                        //for populating in update mode
                                        documentsUploadRedux[0] = {                          
                                          "documents":[
                                          {
                                          "fileName":  (fileUrlPayload &&
                                            fileUrlPayload[fileStoreIds] &&
                                            decodeURIComponent(
                                              getFileUrl(fileUrlPayload[fileStoreIds])
                                                .split("?")[0]
                                                .split("/")
                                                .pop().slice(13)
                                            )) ||
                                          `Document - 1`,
                                          "fileStoreId": fileStoreIds,
                                          "fileUrl": fileUrlPayload[fileStoreIds]
                                         }
                                        ]
                                       }
                                  
          documentsPreview && dispatch(prepareFinalObject("documentsPreview", documentsPreview));
         documentsPreview &&  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
         }
                       
   
  }

  const getSMIDDetails = async(state, dispatch) =>{
    
    const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
    const applicationNumber = getQueryArg(window.location.href, "applicationId");
    let NulmShgMemberRequest = {};
    NulmShgMemberRequest.tenantId = tenantId;
    NulmShgMemberRequest.applicationId= applicationNumber;
   // NulmShgMemberRequest.applicationUuid= applicationNumber;
    
    const requestBody = {NulmShgMemberRequest}
    let response = await getSearchResults([],requestBody, dispatch,"shgMember");
  
    if(response){ 
      getFileUrlDetails(state,dispatch,tenantId,response);
      dispatch(prepareFinalObject("NulmShgMemberRequest", response.ResponseBody[0]));
      if( response.ResponseBody[0]){

        const NulmShgMemberRequest = { ...response.ResponseBody[0]};
        const radioButtonValue = ["isUrbanPoor","isPwd","isMinority","isInsurance","isStreetVendor","isHomeless"];
      
        radioButtonValue.forEach(value => {
          if(NulmShgMemberRequest[value] && NulmShgMemberRequest[value]=== true ){
            dispatch(prepareFinalObject(`NulmShgMemberRequest[${value}]`, "Yes" ));
          }else{
            dispatch(prepareFinalObject(`NulmShgMemberRequest[${value}]`, "No" ));
          }
        })
        if(NulmShgMemberRequest.dob !== null)
        dispatch(prepareFinalObject(`NulmShgMemberRequest.dob`, NulmShgMemberRequest.dob.split(" ")[0] ));
      }
    }
  }
  const roleBasedValidationForFooter = () => {
    const status = getQueryArg(window.location.href, "status");
    if(process.env.REACT_APP_NAME === "Employee"){
        return {};
    }
    else{
          return status==="Deleted" ? {} : poViewFooter() 
    }
   
  }
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-shg-member",
    beforeInitScreen: (action, state, dispatch) => {
      getSMIDDetails(state, dispatch);
      const applicationNumber = getQueryArg(window.location.href, "applicationId");
      const status = getQueryArg(window.location.href, "status");
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
          tradeView,
          footer:  roleBasedValidationForFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  