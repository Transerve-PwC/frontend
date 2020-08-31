import React from "react";
import { getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import sampledata from "./sampledata.xlsx";
import { Button } from "@material-ui/core";
import "./index.css";
const styles = {
 // backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginTop: "8px",
  //paddingLeft: "19px",
  paddingRight: "19px",
 // textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};

function SampleDownload(props) {
   return <div className="col-md-12 col-sm-12 col-xs-12 sampleData">
      <a href={sampledata} download='sampledata.xlsx'
       style={{color: "#3366BB", fontSize: "16px", paddingRight: "10px", marginBottom: "10px", textDecoration: "underline"}}
       data-toggle="tooltip" data-placement="bottom" title="Please upload the data in desired format as per Sample File!"
       >Sample Download</a></div>; 
//<div className="col-md-3 col-sm-3">
//   <Button

//     className="MuiButtonBase-root-47 MuiButton-root-21 MuiButton-contained-32 MuiButton-containedPrimary-33 MuiButton-raised-35 MuiButton-raisedPrimary-36"
//     style={{
//       color: "white",
//       margin: "8px",
//       backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
//       borderRadius: "2px",
//       minWidth: "250px",
//       height: "48px",
//       float: "left"
//     }}
//     href={sampledata} download='sampledata.xlsx'
//   >
// SAMPLE DOWNLOAD
//   </Button>
// </div>
 
}

export default SampleDownload;