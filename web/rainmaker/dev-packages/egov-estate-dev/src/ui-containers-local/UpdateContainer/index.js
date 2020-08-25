import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

class UpdateContainer extends Component{

    componentDidUpdate(prevProps){
        const {preparedFinalObject} = prevProps;
        const {payload = {}} = preparedFinalObject;
        const {preparedFinalObject: currentFinalObject, handleField, screenConfig} = this.props
        const {payload : currentPayload = {} } = currentFinalObject;
        if(JSON.stringify(payload) !== JSON.stringify(currentPayload)) {
           handleField("apply", "", "", screenConfig.apply);
        }
    }

    render() {
        return(
            <div/>
        )
    }
}

const mapStateToProps = (state) => {
    const {screenConfiguration} = state
    return {...screenConfiguration}
}

const mapDispatchToProps = dispatch => {
    return {
      handleField: (screenKey, jsonPath, fieldKey, value) =>
        dispatch(handleField(screenKey, jsonPath, fieldKey, value))
    };
  };

export default connect(mapStateToProps,
    mapDispatchToProps)(UpdateContainer)