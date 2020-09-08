import React from "react";
import { getCurrentAssignee, getServiceRequestStatus } from "egov-ui-kit/utils/localStorageUtils";

const stylesHidden = {
  backgroundColor: "rgb(254, 122, 81)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px",
  display: "none"
};

const styles = {
  backgroundColor: "rgb(254, 122, 81)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px",
 
};
// const { number } = props;/ssss
function CurrentAssignee(props) {
  if(getServiceRequestStatus() == "COMPLETED" || getServiceRequestStatus() == "REJECTED" )
  {return <div style={stylesHidden}>Assigned To : N/A</div>;}
  else{
    return <div style={styles}>Assigned To : {getCurrentAssignee()}</div>;
  }
}

export default CurrentAssignee;
