
import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import {
 
  getQueryArg,

} from "egov-ui-framework/ui-utils/commons";
import { localStorageSet,getUserInfo} from "egov-ui-kit/utils/localStorageUtils";
import "../../../../customstyle.scss";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from '../../../../config/common';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
        
const header = getCommonHeader(
  {
    labelName: "Other Services",
    labelKey: "PR_OTHER_SERVICES",
    
  },
  {
  style: {
    padding: "20px",
  }
},
  {
    classes: {
      root: "common-header-cont"
    }
  }
); 
  
  


const GENERATEPRESSNOTE=    
{
  label: {
    labelName: "Generate Press Note",
    labelKey: "PR_GENERATE_PRESS_NOTE"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 menu_book
</i>,
  route: "pressnotesHome"
}
const CREATE_TENDER= {
  label: {
    labelName: "Create Tender Notice",
    labelKey: "PR_CREATE_TENDER_NOTICE"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 menu_book
</i>,
  route: "tenderMaster"
}
const TENDER_LIST=  {
  label: {
    labelName: "Tender Notice Lisr",
    labelKey: "PR_TENDER_NOTICE_LIST"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 description
</i>,
  route: "TenderSearch"
}
const PUBLISHED_TENDER=    {
  label: {
    labelName: "Publish Tender Notice",
    labelKey: "PR_PUBLISH_TENDER_NOTICE"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 description
</i>,
  route: "TenderSearch"
}

let allCardList = [{ "code": "GENERATEPRESSNOTE", "value": GENERATEPRESSNOTE },
 
{ "code": "TENDER_LIST", "value": TENDER_LIST },
{ "code": "CREATE_TENDER", "value": CREATE_TENDER },
{ "code": "PUBLISHED_TENDER", "value": PUBLISHED_TENDER }]

const getMdmsData = async (action, state, dispatch) => {

 
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [ { name: "cardList" }
          
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


    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const setcardList = (state, dispatch) => {
  let mdmsCardList = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['RAINMAKER-PR'].cardList",
    []
  );
  let employeeCardList = []
  let roles = JSON.parse(getUserInfo()).roles
  mdmsCardList.map((item, index) => {
    roles.some(r => {
      let temp1=allCardList.find((x) => x.code == item.code)
      if (item.roles.includes(r.code)) {
        if (employeeCardList.length > 0) {
          if(!employeeCardList.find((x) => x.code == item.code))
          {
           let temp=allCardList.find((x) => x.code == item.code)
          if (temp) {
            employeeCardList.push(temp)
            
          }
        } 
      }else {
          if(temp1!==undefined)
           {
           
            // if (temp) {
            employeeCardList.push(temp1)
            //}
           }
        }
      }
    
      
    })
  });

  const cards = employeeCardList.map((item, index) => {
    return item.value
  });

  dispatch(
    handleField(
      "dashboardHome",
      "components.div.children.applyCard",
      "props.items",
      cards
    )
  );
}
const PRSCPSearchAndResult = {
  uiFramework: "material-ui",
  name: "dashboardHome",
  beforeInitScreen: (action, state, dispatch) => {
  
   
    getMdmsData(action, state, dispatch).then(response => {
      setcardList(state, dispatch)
    });
	
	
	const modulecode = getQueryArg(
      window.location.href,
      "modulecode"
    );
  
    
	localStorageSet("modulecode",modulecode);
  

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header:header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: [],
            history: {},
            module:"PR"
          }
        },
        
    }
	},
    
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default PRSCPSearchAndResult;
