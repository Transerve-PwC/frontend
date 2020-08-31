import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getLabel 
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { documentsSummary,documentsEventSummary } from "./summaryResource/documentsSummary";
//import { footer } from "./summaryResource/footer";
import { propertySummary } from "./summaryResource/propertySummary";
import { getCommonApplyFooter, validateFields, getTextToLocalMapping } from "../utils";
import { getTenantId ,geteventuuid} from "../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import {getSearchResultsView, resendinvitation,resendinvitationevent} from "../egov-pr/searchResource/citizenSearchFunctions"
import { localStorageGet,localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { ResendInvitedEmployeesResults } from "./inviteResources/searchResults";
import "./publishtender.css";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
const toggleactionmenu = (state, dispatch) => {
	
  var x = document.getElementById("custom-atoms-footer");
 	 // if (x.style.display === "none") {
   if(window.getComputedStyle(x).display === "none") {   
    x.style.display = "block";
    x.classList.add("addpadding");
	  } else {
    x.style.display = "none";
    x.classList.remove("addpadding");
	  }
}




const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Invite Guests",
    labelKey: "PR_INVITE_GUESTS_HEADER"
  }),
  eventId: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pr",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "eventId")
    }

  },
  status: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pr",
    componentPath: "StatusContainer",
    props: {
      number: getQueryArg(window.location.href, "status")
    }

  }
});


const setcreateinviteroute = (state, dispatch,payload) => {
		const reviewUrl = `createInvite?id=`+getQueryArg(window.location.href, "eventuuId");
  //	window.location.href =reviewUrl;
  dispatch(setRoute(reviewUrl));
  
 }
 
 const setcancelinviteroute = (state, dispatch,payload) => {
		const reviewUrl = `eventList`
  //	window.location.href =reviewUrl;
  dispatch(setRoute(reviewUrl));
  
 }
 
 export const footer =  getCommonApplyFooter({
		
  
  ResendButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        }
      },
      gridDefination:{
        xs: 12,
        sm: 12,
        md: 12
      },
      children: {
        submitButtonLabel: getLabel({
        labelName: "Invite",
        labelKey: "PR_RESEND_BUTTON"
        }),
       
      },
      onClickDefination: {
        action: "condition",
        callBack: resendinvitationevent
      },
      
  },
  inviteButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        }
      },
      gridDefination:{
        xs: 12,
        sm: 12,
        md: 12
      },
      children: {
        submitButtonLabel: getLabel({
        labelName: "Invite",
        labelKey: "PR_INVITE_BUTTON"
        }),
       
      },
      onClickDefination: {
        action: "condition",
        callBack: setcreateinviteroute
      }
  },
  cancelButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
      minWidth: "200px",
      height: "48px",
      marginRight: "16px",
      background:"#fff",
      border: "1px solid #ddd" ,
      color: "#000"
      }
    },
    gridDefination:{
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      submitButtonLabel: getLabel({
      labelName: "Cancel",
      labelKey: "PR_CANCEL_BUTTON"
      }),
     
    },
    onClickDefination: {
      action: "condition",
      callBack: setcancelinviteroute
    }
},
})
export const takeactionfooter = getCommonApplyFooter({
  actionbutton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px" 
      }
    },
    children: {
       
      pressguestbuttonLabel: getLabel({
        labelName: "Take Action",
        labelKey: "PR_TAKE_ACTION"
      }),
	  nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_up"
        }
      },
    },
    onClickDefination: {
      action: "condition",
       callBack: (state, dispatch) =>{
           toggleactionmenu(state, dispatch)
    }
    },
    visible: true
  }
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
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "event_summary",
  beforeInitScreen: (action, state, dispatch) => {
   
   localStorageSet("ResendInvitelist","");
   localStorageSet("ResendInvitelistAll","");
   


   localStorageSet("resendmodule","EVENT");
   
    let payload={
      "requestBody":{
              "tenantId":getTenantId(),
              "eventDetailUuid":getQueryArg(window.location.href, "eventuuId")            ,
              "scheduledStatus":"",
              "eventStatus":"PUBLISHED",
              "moduleCode": localStorageGet("modulecode"),
              
      }
      
            }
	getSearchResultsView(state, dispatch,payload).then( response => {
	
		let invitedguests = response.ResponseBody[0].inviteGuest;
		
    const guestarray = invitedguests.filter((el) => {
			return (el.sentFlag !== false);
  });	
  


  let selectedrows = []
  let allrows = guestarray;
 
  if(allrows!==null)
  {
  localStorageSet("gridobjlength", allrows.length)
  allrows.map(item => {
      selectedrows.push(JSON.stringify(item))
  })
  localStorageSet("gridobj",selectedrows);
}
		if (guestarray.length >  0) {
			let data = guestarray.map(item => ({
     
      
		  [getTextToLocalMapping("Guest Type")]:
			 item.eventGuestType || "-",
		   [getTextToLocalMapping("Guest Name")]: (item.guestName !== null ? item.guestName : "-") || "-",
		   [getTextToLocalMapping("Guest Mobile Number")]: (item.guestMobile !== null ? item.guestMobile : "-") || "-",
		   [getTextToLocalMapping("Email ID")]: (item.guestEmail !== null ? item.guestEmail : "-") || "-",
		   [getTextToLocalMapping("Guest UUID")]: (item.eventGuestUuid !== null ? item.eventGuestUuid : "-") || "-"
		   
		  
		 }));
    	  
    	  
	  dispatch(
       handleField(
         "event_summary",	
		 "components.div.children.resendbody.children.cardContent.children.guestlist",
		 "props.data",
         data
       )
     );
	
  }
  else
  {
	dispatch(
              toggleSnackbar(
                true,
                { labelName: "Invitations Not Send to This Event", labelKey: "PR_NO_INVITEES_EVENT" },
                "warning"
              )
            );
	
	
	 dispatch(
       handleField(
         "event_summary",
         "components.div.children.resendbody",
         "visible",
         false
       )
     );
	
	 dispatch(
       handleField(
         "event_summary",
         "components.div.children.footer.children.ResendButton",
         "visible",
         false
       )
     );
    
	  
  }
	});;
	
	
    
    prepareDocumentsView(state, dispatch);
	
	set(
        action,        "screenConfig.components.div.children.body.children.cardContent.children.eventSummary.children.cardContent.children.header.children.editSection.visible",
        false
      );
	
	set(
        action,        "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
        false
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
        body: getCommonCard({
         
        eventSummary: propertySummary,
        
           documentsSummary: documentsEventSummary,
		   
        }),
		
		 resendbody: getCommonCard({
		 resendheader: getCommonHeader({
				labelName: "Invited Guest List",
				labelKey: "PR_INVITED_GUEST_LIST"
			}),
			guestlist : ResendInvitedEmployeesResults
    }),	
    footer,
    
  takeactionfooter
      }
    }
  }
};

export default screenConfig;
