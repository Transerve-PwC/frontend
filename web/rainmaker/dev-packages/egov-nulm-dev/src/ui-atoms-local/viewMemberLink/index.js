import React from "react";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import get from "lodash/get";
import { getLocaleLabels} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
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

class  ViewMemberLinkContainer extends React.Component {
 
  handleClick = (url) => {
    const {onsetRoute} = this.props;
      onsetRoute(url);
  }

  render() {
    const {url,localizationLabels,labelText,isDisabled} =  this.props
    let translatedLabel = getLocaleLabels(
      labelText,
      labelText,
      localizationLabels
    );
    return <Button disabled={isDisabled} onClick = {()=> this.handleClick(url)}>{translatedLabel}</Button>;
  }
 
}
const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration,app } = state;
  const { jsonPath,urlLink } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  const applicationId = get(preparedFinalObject,jsonPath, "");
  const jsonPathStatus = jsonPath.replace("applicationId","applicationStatus")
  const status = get(preparedFinalObject,jsonPathStatus, "");
  const isDisabled = status ==="DELETED"?true : false;
  const url = `${urlLink}?applicationId=${applicationId}&status=${status}`;
  const { localizationLabels } = app;
  return { preparedFinalObject, jsonPath, url,localizationLabels,isDisabled };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onsetRoute: (url) => {
      dispatch(setRoute(url));
    },
  };
};

export default  connect(mapStateToProps, mapDispatchToProps)(ViewMemberLinkContainer) ;
