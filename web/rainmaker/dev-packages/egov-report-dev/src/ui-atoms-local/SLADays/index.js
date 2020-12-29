import React from "react";
import { getSLADays,getServiceRequestStatus } from "egov-ui-kit/utils/localStorageUtils";

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
  marginTop: "5px"
};
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
// const { number } = props;/ssss
function SLADays(props) {
  if(getServiceRequestStatus() == "COMPLETED" || getServiceRequestStatus() == "REJECTED" )
  {
    return <div style={stylesHidden}>Resolution Time(Days) : {getSLADays()}</div>;}
  else{
    return <div style={styles}>Resolution Time(Days) : {getSLADays()}</div>;
  }
}
// function SLADays(props) {
 
//     return <div style={stylesHidden}>Resolution Time(Days) : {getSLADays()}</div>;
  
// }

export default SLADays;
