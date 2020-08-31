import { getCommonCard, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, setapplicationNumber, setapplicationType, setServiceRequestStatus, setSLADays, setCurrentAssignee, setHCRoles } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import "../../../../customstyle.css";
import { getSearchResultsView, getCurrentAssigneeUserNameAndRole } from "../../../../ui-utils/commons";
import { downloadPrintContainerScreenDownload, downloadPrintContainer } from "./applyResourceSearchPreview/footer";
import { documentsSummary } from "./myRequestSearchPreview/documentsSummary";
import { ownerDetails } from "./myRequestSearchPreview/ownerDetails";
import { requestDetails } from "./myRequestSearchPreview/requestDetails";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "../../../../ui-utils";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

let role_name = JSON.parse(getUserInfo()).roles[0].code

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Service Request Details",
    labelKey: "HC_SERVICE_REQUEST_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "ServiceRequestId",
  },
  SLA: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "SLADays",
  },
  Status: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "Status",
  },
  CurrentAssignee: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "CurrentAssignee",
  },

 
});



const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];
  
  let document_list = []
  
  let hcUploadedDocs = get(
  state,
  "screenConfiguration.preparedFinalObject.myRequestDetails.service_request_document",
  {}
  );

      var myObj = JSON.parse(hcUploadedDocs);

      hcUploadedDocs = myObj['document'];

      
  if (hcUploadedDocs.length > 0) {
    let cnt = 1;
    hcUploadedDocs.forEach(element => {
        documentsPreview.push({
          title: "Uploaded Image "+cnt,
          fileStoreId: element.media,
          linkText: "View"
        
      })
      cnt = cnt +1;
    }
       )}


       let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      documentsPreview = documentsPreview.map(function (doc, index) {
  
        doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
        
        doc["name"] =
          (fileUrls[doc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[doc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
          document_list.push(doc["name"]);
          
        return doc;
      });
      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
      dispatch(prepareFinalObject("documents_list", document_list));

};

const setSearchResponse = async (state, dispatch, action, serviceRequestId) => {
  //debugger
  let tenantIdForBoth = JSON.parse(getUserInfo()).permanentCity;
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantIdForBoth },
    { key: "service_request_id", value: serviceRequestId }
  ]);

  if(!response.ResponseInfo['ver'] === false)
  {
    // dispatch(setRoute(`/egov-hc/acknowledgementInvalidServiceRequest?serviceRequestId=${serviceRequestId}`));
    dispatch(setRoute(`/egov-hc/acknowledgementInvalidServiceRequest`));
  }
  else{
  
  dispatch(prepareFinalObject("myRequestDetails", response.ResponseBody[0], {}));

  prepareDocumentsView(state, dispatch);
  set(state, "screenConfiguration.moduleName", "HC");

  var servicetype = response.ResponseBody[0].service_type

   const queryObject = [
      { key: "tenantId", value: tenantIdForBoth },
      { key: "businessServices", value: servicetype.toUpperCase().trim()}
    ];
     setBusinessServiceDataToLocalStorage(queryObject, dispatch);

  try{
  var service_request_status = response.ResponseBody[0].service_request_status
  
  setServiceRequestStatus(service_request_status)
  
  }
  catch(e){
    console.log("Error in setting ServiceRequestStatus ")
  }
  try{  
    var businessServiceSla = response.ResponseInfo.resMsgId
    setSLADays(businessServiceSla)
  }
  catch(e){
    console.log("Error in setting businessServiceSla ")
  }
  var CurrentAssignee = response.ResponseBody[0].current_assignee
     var userData = parseInt(CurrentAssignee);
     if(isNaN(userData))
     {
      setCurrentAssignee(CurrentAssignee)
     }
     else{
      const response = await getCurrentAssigneeUserNameAndRole(dispatch, userData);
      var current_Assignee = response.Employees[0].user.userName
      setCurrentAssignee(current_Assignee)
      
     }


    const printCont = downloadPrintContainer(
      state,
    );
    process.env.REACT_APP_NAME === "Citizen"
      ? set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        )
      : set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        );
    
        //keep this code commented till client's confirmation 
        // const printCont = downloadPrintContainerScreenDownload(
        //   serviceRequestId,
        // );
        // const CitizenprintCont=downloadPrintContainerScreenDownload(
        //   serviceRequestId, 
        // );
        
        
        // process.env.REACT_APP_NAME === "Citizen"
        //   ? set(
        //       action,
        //       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        //       CitizenprintCont
        //     )
        //   : set(
        //       action,
        //       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        //       printCont
        //     );
  }
};
const getMdmsData = async (dispatch) => {
  
  let tenantId = getTenantId().split(".")[0];
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "eg-horticulture",
          masterDetails: [
           
            {
              name: "roles"
            }
          ]
        },
        
        
      ]
    }
  };
  try{
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",  
      [],
      mdmsBody
    );
    debugger
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

    //setting horticulture roles into mdms
    var roleList = []
    roleList = payload &&
    payload.MdmsRes["eg-horticulture"].roles
    setHCRoles(JSON.stringify(roleList))}
    catch(e){
      console.log(e);
    }
  };


const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    debugger
    getMdmsData(dispatch).then(response => {  
    }) 
    const serviceRequestId = getQueryArg(window.location.href, "applicationNumber");
    
    setapplicationNumber(serviceRequestId);
     setapplicationType("HORTICULTUREWF");

    const tenantId = getTenantId();

    setSearchResponse(state, dispatch, action, serviceRequestId);

   
     
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
                sm: 12
              },
              ...titlebar
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
                sm: 12,
                align: "right"
              }
            }
          }
          
        },
        
        taskStatus: {
          uiFramework: "custom-containers-local",
          
          componentPath: "WorkFlowContainer",
          // moduleName: process.env.REACT_APP_NAME === "Employee" ? "egov-workflow" : "egov-hc",
          moduleName: "egov-hc",
          props: {
            dataPath: "services",
            moduleName: "HORTICULTURE",
            updateUrl: "/hc-services/serviceRequest/_update"
          }
        },
        body: role_name !== 'CITIZEN' ? getCommonCard({

          requestDetails: requestDetails,
          ownerDetails: ownerDetails,
          documentsSummary: documentsSummary

        })
          : getCommonCard({
            requestDetails: requestDetails,
            ownerDetails: ownerDetails,
            documentsSummary: documentsSummary
          }),
      }
    }
  }
};

export default screenConfig;
