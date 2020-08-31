import React from "react";
import { getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";

const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};

const getApplicationDisplayCode =(screenName) => {
  let labelValue = "";
  switch(screenName){
    case "Indent": labelValue = {
      labelName: "Indent No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "Indent Note": labelValue = {
      labelName: "Issue No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    //Non Indent
    case "Non Indent": labelValue = {
      labelName: "Non Indent Issue No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "PO": labelValue = {
      labelName: "PO No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "Material Recept": labelValue = {
      labelName: "MRN No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "Material Recept MISC": labelValue = {
      labelName: "Misc. MRN No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "Indent Transfer": labelValue = {
      labelName: "MRIN Transfer No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "Indent Transfer Outword": labelValue = {
      labelName: "MRIN Outword No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break; 
    case "Indent Transfer Inword": labelValue = {
      labelName: "MRIN Inword No.",
      labelKey: `STORE_APPLICATION_NUMBER_INDENT`,
    }
    break;  
    
    default :  labelValue = {
      labelName: "Application No.",
      labelKey: "STORE_APPLICATION_NUMBER_DEFAULT",
    }

  }
 return labelValue.labelName;
}
function ApplicationNoContainer(props) {
  const { number } = props;//number
  const { pagename } = props;//number
	return <div style={styles}>{getApplicationDisplayCode(pagename)} : {number}</div>;
}

export default ApplicationNoContainer;
