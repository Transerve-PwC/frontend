import React from "react";

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
      labelName: "Status",
      labelKey: `STORE_MATERIAL_INDENT_NOTE_STATUS`,
    }
    break;  
    
    default :  labelValue = {
      labelName: "Application No.",
      labelKey: "STORE_APPLICATION_NUMBER_DEFAULT",
    }

  }
 return labelValue.labelName;
}
function ApplicationStatusContainer(props) {
  const { status } = props;
 
  return <div style={styles}>Status : {status}</div>;
}

export default ApplicationStatusContainer;
