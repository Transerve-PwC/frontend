import React from "react";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import get from "lodash/get";
import { getLocaleLabels} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import {  setModule ,getLocale ,getUserInfo} from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
const styles = {
  color: "rgba(0, 0, 0, 0.87)",
  marginLeft: "3%",
  marginTop: "6%",
  lineHeight: "35px",
  fontSize: "16px"
};

const clickHereStyles = {
  cursor: "pointer",
  textDecoration: "none",
  color: "#FE7A51"
}
class  AddLinkForProperty extends React.Component {
  citizenTenantId = () => {
    const userInfo = JSON.parse(getUserInfo());
    return userInfo.permanentCity || userInfo.tenantId;
  }
handleClick = (url) => {
  const {onsetRoute} = this.props;
  setModule("rainmaker-pt,rainmaker-ws");
  
  const tenantId = process.env.REACT_APP_NAME === "Citizen" ? this.citizenTenantId(): getTenantId();
  this.props.fetchLocalizationLabel(getLocale(), tenantId, tenantId);
  url = `/pt-common-screens/propertySearch?redirectUrl=${url}`;
    onsetRoute(url);
}
render() {
  const { url,localizationLabels } = this.props; 
  let translatedLabel = getLocaleLabels(
    "WS_APPLY_CLICK_HERE",
    "WS_APPLY_CLICK_HERE",
    localizationLabels
  );
  return (   
    <div style={styles}>
       <Button  style={clickHereStyles}  onClick = {()=> this.handleClick(url)} visible={false}>{translatedLabel}</Button>   
       </div>
  );

}
}
const mapStateToProps = (state, ownprops) => {
  const { app } = state;
  const { localizationLabels } = app;
  return { localizationLabels };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onsetRoute: (url) => {
      dispatch(setRoute(url));
    },
    fetchLocalizationLabel: (locale, moduleName, tenantId)=> dispatch(fetchLocalizationLabel(locale, moduleName, tenantId))
  };
};
export default  connect(mapStateToProps, mapDispatchToProps)(AddLinkForProperty) ;
//export default AddLinkForProperty;