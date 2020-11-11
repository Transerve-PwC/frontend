import {
    getCommonHeader,
    getLabel,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { SMIDOrgReviewDetails } from "./viewSMIDOrgResource/smid-org-review";
  import { poViewFooter } from "./viewSMIDOrgResource/footer";
  import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import {
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let status = getQueryArg(window.location.href, "status");
  let id = getQueryArg(window.location.href, "id");
   const applicationNumberContainer = () => {

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
   
 };
 const statusContainer = () => {

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
 
};



  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View SMID for Organization`,
      labelKey: "NULM_SHG_VIEW"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });

  const createShgMemberHandle = (state, dispatch) => {
    const createUrl = `/egov-nulm/create-shg-member`;
    dispatch(prepareFinalObject("NulmShgMemberRequest",{}))
    dispatch(setRoute(createUrl));
  };

  export const addSHGMember =  {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3,
        align: "right",
      },
      visible: process.env.REACT_APP_NAME === "Employee"? false : true,
      props: {
        variant: "contained",
        color: "primary",
        style: {
          color: "white",
          borderRadius: "2px",
          width: "250px",
          height: "48px",
        },
      },

      children: {
        plusIconInsideButton: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "add",
            style: {
              fontSize: "24px",
            },
          },
        },

        buttonLabel: getLabel({
          labelName: "Add SHG Member",
          labelKey: "NULM_SHG_MEMBER_ADD_BUTTON",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: createShgMemberHandle,
      },
    };
  
  const tradeView = SMIDOrgReviewDetails(false);
  
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
                name: "SEPDocuments",
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
 
  

const roleBasedValidationForFooter = () => {
  if(process.env.REACT_APP_NAME === "Employee" && status === "Created"){
      return poViewFooter();
  }
  else{ 
        return poViewFooter() ;
  }
}
const getSMIDOrgDetails = async(action,state, dispatch) =>{
    
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let NulmShgRequest = {};
  NulmShgRequest.tenantId = tenantId;
  NulmShgRequest.shgId= applicationNumber;
 // NulmShgRequest.shgUuid=id;
  const requestBody = {NulmShgRequest}
  let response = await getSearchResults([],requestBody, dispatch,"smid-org");

  if(response){ 
   
    dispatch(prepareFinalObject("NulmShgRequest", response.ResponseBody[0]));
    if( response.ResponseBody[0]){

      const NulmShgRequest = { ...response.ResponseBody[0]};
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
        NulmShgRequest.shgId
      );
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.status.props.status",
        NulmShgRequest.status
      );
      dispatch(prepareFinalObject(`NulmShgRequest.dateOfFormation`, NulmShgRequest.dateOfFormation.split(" ")[0] ));
      dispatch(prepareFinalObject(`NulmShgRequest.dateOfOpeningAccount`, NulmShgRequest.dateOfOpeningAccount.split(" ")[0] ));
    }
  }
}
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-smid-org",
    beforeInitScreen: (action, state, dispatch) => {
      getSMIDOrgDetails(action,state,dispatch);
      localStorage.setItem("shgUuid", id);
      localStorage.setItem("shgApplicationNumber", applicationNumber);
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
                ...header,
              },
              addSHGMember
            }
          },
          tradeView,
          footer: roleBasedValidationForFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  