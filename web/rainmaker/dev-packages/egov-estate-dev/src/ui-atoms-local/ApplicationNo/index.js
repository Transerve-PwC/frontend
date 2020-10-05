import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getQueryArg} from "egov-ui-framework/ui-utils/commons";
import "./index.css";

function ApplicationNoContainer(props) {
  const { number } = props;
  return <div className="application-no-container"><LabelContainer labelName="Application No." labelKey ={"ES_APPLICATION_NUMBER_LABEL"}/>
  {" "}{number}
  </div>;
}
export default ApplicationNoContainer;
