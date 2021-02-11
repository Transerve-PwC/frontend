import React from "react";
import RoadcutRates from "./RoadcutRates.xlsx";
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

function SampleDownloadRoadCut(props) {
	return <div style={styles}><a href={RoadcutRates} download='RoadcutRates.xlsx'style={{textDecoration: "underline", fontWeight: "100"}}>Roadcut Rate Document</a></div>;
}

export default SampleDownloadRoadCut;
