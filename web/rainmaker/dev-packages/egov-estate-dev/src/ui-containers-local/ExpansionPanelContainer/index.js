import React, { Component } from "react";
import { connect } from "react-redux";
import { ExpansionPanelMolecule } from "../../ui-molecules-local";
import { get } from "lodash";

class ExpansionPanelContainer extends Component {
    render() {
        const {data,value, ...rest} = this.props
        return(
            <ExpansionPanelMolecule data={data} value={value} {...rest}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    const data = get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath);
    const value = get(screenConfiguration.preparedFinalObject, ownProps.jsonPath)
    return {data, value}
}

export default connect(mapStateToProps, null)(ExpansionPanelContainer)