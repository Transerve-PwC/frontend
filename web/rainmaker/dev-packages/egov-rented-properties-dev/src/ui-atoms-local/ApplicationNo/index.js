import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getQueryArg} from "egov-ui-framework/ui-utils/commons";
import "./index.css";

function ApplicationNoContainer(props) {
  const { number } = props;
  if(props.notice==="Notice"){
  return <div className="application-no-container"><LabelContainer labelName="Notice Id." labelKey ={"RP_NOTICE_ID"}/>
  {number}
  </div>;
} else if(props.type === "RP_MASTER") {
  return <div className="application-no-container"><LabelContainer labelName="Transit Site No." labelKey ={"RP_COMMON_TABLE_COL_TRANSIT_NO"}/>
  {" "}{number}
  </div>
} else {
  return <div className="application-no-container"><LabelContainer labelName="Application No." labelKey ={"TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"}/>
  {number}
  </div>;
}
}

export default ApplicationNoContainer;
