import React from "react";

const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "10px",
  paddingRight: "10px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px"
};

const styles1 = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "10px",
  paddingRight: "10px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px",
  display:"none"
};

function WithdrawRequestContainer(props) {
  return <div style={props.isVisible?styles:styles1}>Withdraw Request</div>;
}

export default WithdrawRequestContainer;
