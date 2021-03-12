import React, { Component } from "react";
import { connect } from "react-redux";
import { ExpansionPanelMolecule } from "../../ui-molecules-local";
import { get } from "lodash";

class ExpansionPanelContainer extends Component {
    render() {
        const {data,properties, ...rest} = this.props
        return (
            <ExpansionPanelMolecule data={data} properties ={properties}  {...rest}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    const properties = get(screenConfiguration.preparedFinalObject, "Properties");
    const data = get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath);
    return {data,properties}
}

export default connect(mapStateToProps, null)(ExpansionPanelContainer)