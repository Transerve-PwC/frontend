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
    labelName: "",
    labelKey:"PR_SPORTS_AND_CULTURE",
  
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
)

const LIBRARY= {
  label: {
    labelKey: "Library",
    labelName: "LIBRARY"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 local_library
</i>, 
  route: "library-search"
}
const CREATE_EVENT={
  label: {
    labelName: "Create Event",
    labelKey: "PR_CREATE EVENT"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 event
</i>,
  route: "apply"
}
const MANAGE_EVENT={
  label: {
    labelName: "Manage Events",
    labelKey: "PR_MANAGE_EVENT"
  },
  icon: <i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 library_books
</i>,


  route: "search"
}
const INVITEGUEST= {
  label: {
    labelName: "Invite Guest",
    labelKey: "PR_INVITE_GUEST"
  },
  icon:<i
  viewBox="0 -8 35 42"
  color="primary"
  font-size="40px"
  class="material-icons module-page-icon" style={{fontSize:"50px", height: "unset", width: "unset"}}>
 contact_mail
</i>,
  route: "eventList"
}

let allCardList = [{ "code": "CREATE_EVENT", "value": CREATE_EVENT },
 { "code": "MANAGE_EVENT", "value": MANAGE_EVENT },
{ "code": "INVITEGUEST", "value": INVITEGUEST },
{ "code": "LIBRARY", "value": LIBRARY }]

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
      if (item.roles.includes(r.code)) {
        if (employeeCardList.length > 0) {
          if (!employeeCardList.find((x) => x.code == item.code)) {
           if(allCardList[index]!==undefined)
           {
            employeeCardList.push(allCardList[index])
           }
              
            
          }
        } else {
          if(allCardList[index]!==undefined)
           {
            employeeCardList.push(allCardList[index])
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
      "home-scp",
      "components.div.children.applyCard",
      "props.items",
      cards
    )
  );
}
const PRSCPSearchAndResult = {
  uiFramework: "material-ui",
  name: "home-scp",
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
            module:"PRSCP"
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
