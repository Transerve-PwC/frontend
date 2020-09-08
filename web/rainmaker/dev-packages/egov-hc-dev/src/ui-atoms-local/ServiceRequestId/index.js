import React from "react";
import { getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";

const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "5px",
  paddingRight: "5px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px"
};


function ServiceRequestIdContainer(props) {
	return <div style={styles}>Service Request Id. : {getapplicationNumber()}</div>;
}

export default ServiceRequestIdContainer;
