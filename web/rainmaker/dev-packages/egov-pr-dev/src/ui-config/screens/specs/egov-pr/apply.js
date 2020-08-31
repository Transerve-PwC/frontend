import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { EventFooter } from "./applyResource/footer";
import { eventDetails } from "./applyResource/eventDetails";
import { eventDescription } from "./applyResource/eventDescription";
import jp from "jsonpath";

import { EventFirstStepperTimeDetail } from "./applyResource/EventFirstStepperTimeDetail";
import { EventFirstStepperDetail,EventFirstStepperDetailSCP} from "./applyResource/EventFirstStepperDetail";

import { documentDetails, MultipleDocumentDetails } from "./applyResource/documentDetails";
import { getQueryArg ,getFileUrlFromAPI} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";

import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
  
  furnishResponse,
  setApplicationNumberBox,
  getSearchResultsViewEvent
} from "../../../../ui-utils/commons";
import {setCommittiee} from "../egov-pr/searchResource/citizenSearchFunctions"
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from '../../../../config/common';
export const stepsData = [
  { labelName: "Event Details", labelKey: "PR_EVENT_DETAILS_HEADER" },
  { labelName: "Documents", labelKey: "PR_COMMON_DOCUMENTS" },
  { labelName: "Summary", labelKey: "PR_EVENT_APPLICANT_SUMMARY_STEP" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);
const toTitleCase=(str)=> {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
} 
const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-pr",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Create Event`, 
    labelKey: "PR_COMMON_CREATE_EVENT"
  }),
 
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  
  children: {
    EventFirstStepperDetail,
    EventFirstStepperTimeDetail,
    eventDetails,
    eventDescription
    }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
   MultipleDocumentDetails
  },
  visible: false
};


const getMdmsData = async (action, state, dispatch) => {

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" },  { name: "eventSector" },{ name: "localityAreaName" }

        
          
        ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },


        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "Department"
            }
          ]
        },
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
  
      
    for(let i=0;i<payload.MdmsRes["common-masters"].Department.length;i++)
    {
      

      payload.MdmsRes["common-masters"].Department[i].name= toTitleCase(payload.MdmsRes["common-masters"].Department[i].name)

      
      

    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};


export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  
  let id=getQueryArg(window.location.href, "eventuuId") 
  if(id)
  {
   let payload={
    "requestBody":{
            "tenantId":getTenantId(),
            "eventDetailUuid":getQueryArg(window.location.href, "eventuuId")            ,
            "scheduledStatus":"",
            "eventStatus":"PUBLISHED",
            "moduleCode": localStorageGet("modulecode"),
            
    }
    
          }
   let response = await getSearchResultsViewEvent(payload)
 
 if(response.ResponseBody.length>0)
 {
  
	
   try {
     let payload1 = null;
     let user=[]
    const queryStr = [
         { key: "departments", value: response.ResponseBody[0].organizerDepartmentName },
       ]
     payload1 = await httpRequest(
       "post",
       "/egov-hrms/employees/_search",
       "_search",
       queryStr,
       {}
     );
     for(let i=0;i<payload1.Employees.length;i++)
     {
       if(payload1.Employees[i].user!==null)
       {
         user.push(payload1.Employees[i].user) 
         
       }
     }
     dispatch(prepareFinalObject("applyScreenMdmsData.employees", user));
    
   } catch (e) {
     console.log(e);
   }

   
	 let documentsPreview = [];
  
      let PublicRelation = response.ResponseBody[0]
    
      let doc=JSON.parse(PublicRelation.eventString)
    
     let doctitle = [];
      if(doc.length>0)
      {
 
  
  if(doc.length>0)
  {

    for(let i=0; i<doc.length; i++) {
      let eventDoc = doc[i]['fileStoreId']
          doctitle.push(doc[i]['fileName:']);
     
      if (eventDoc !== '' || eventDoc!==undefined) {
        documentsPreview.push({
          title: doc[i]['fileName:'],
          fileStoreId: eventDoc,
          linkText: "View",
          fileName:doc[i]['fileName:']
        })
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};

        documentsPreview = documentsPreview.map(function (doc, index) {
  
             
      doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
      
          return doc;
        });
      }
      }

    }
  }
        dispatch(prepareFinalObject("EventDocuments", documentsPreview));

        let mdmsBody = {
          MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
      
              {
                moduleName: "common-masters",
                masterDetails: [
                  {
                    name: "Department"
                  }
                ]
              },
            ]
          }
        };
          let payload = null;
          payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
          );
          
      
      
          for(let i=0;i<payload.MdmsRes["common-masters"].Department.length;i++)
          {
            for(let j=0;j<response.ResponseBody.length;j++)
            {
      if(response.ResponseBody[j].organizerDepartmentName===payload.MdmsRes["common-masters"].Department[i].code)
      {
        response.ResponseBody[j]['EmpName']=payload.MdmsRes["common-masters"].Department[i].name
      }
            }
      
          }

  let Refurbishresponse = furnishResponse(response);
  let startdate= response.ResponseBody[0].startDate
  startdate=startdate.split(" ")[0]
 
  dispatch(prepareFinalObject("PublicRelation[0].CreateEventDetails", Refurbishresponse));
  dispatch(prepareFinalObject("PublicRelation[0].SummaryEventDetails", Refurbishresponse));

  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.EventFirstStepperTimeDetail.children.cardContent.children.propertyDetailsConatiner.children.EndDate",
      "props.inputProps.min",
      startdate
    )
  );
 
}
}
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {

 
    
  
    dispatch(prepareFinalObject("PublicRelation[0].CreateEventDetails", {}));
    dispatch(prepareFinalObject("EventDocuments",[]));

    localStorageSet("shoWHideCancel","apply")
    const eventuuId = getQueryArg(
      window.location.href,
      "eventuuId"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "public-relations");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
         if(localStorageGet("modulecode")==="SCP")
    {
     
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.EventFirstStepperDetail.children.cardContent.children.propertyDetailsConatiner.children.committiee",
        "visible",
        false
      )
    );
  }
  else{
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.EventFirstStepperDetail.children.cardContent.children.propertyDetailsConatiner.children.committiee",
        "visible",
        true
      )
    );
  }

		if(eventuuId)
		{
			prepareEditFlow(state, dispatch, eventuuId, tenantId);
		}	
      prepareDocumentsUploadData(state, dispatch, 'create_event');
      
    });

    let payload_committie={
      "tenantId": getTenantId(),
      "RequestBody":{
      
      "committeeUuid": "",
      "committeeName": "",
      "committeeDescription": "",
      "isActive": true,
      "tenantId": getTenantId(),
      "moduleCode":localStorageGet("modulecode"),
      "committeeMember": [ ]
      }
      }
      setCommittiee(action, state, dispatch,payload_committie);
    

    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep",
       ];
      for (let i = 0; i <= 1; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.EventFooter.children.previousButton.visible`,
          step != 0
        );
      }
    }


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
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        EventFooter
      }
    }
  }
};

export default screenConfig;
