import React, { Component } from "react";
import { connect } from "react-redux";
import { ExpansionPanelMolecule } from "../../ui-molecules-local";
import { get } from "lodash";

class ExpansionPanelContainer extends Component {
    render() {
        const {data, ...rest} = this.props
        return (
            <ExpansionPanelMolecule data={data} {...rest}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    const data = get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath);
    return {data}
}

export default connect(mapStateToProps, null)(ExpansionPanelContainer)