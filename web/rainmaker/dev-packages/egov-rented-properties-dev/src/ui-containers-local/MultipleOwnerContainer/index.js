import React, { Component } from "react";
import MultipleOwners from "../../ui-molecules-local/MultipleOwners";
import { connect } from "react-redux";
import get from "lodash/get";

class MultipleOwnerContainer extends Component {
    render() {
        const {data, ...rest} = this.props
        return(
            <MultipleOwners data={data} {...rest}/>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { screenConfiguration } = state;
    const data = get(
        screenConfiguration.preparedFinalObject,
        props.jsonPath,
        []
      ); 
    return {data}
}


export default connect(mapStateToProps, null)(MultipleOwnerContainer)