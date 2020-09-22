import React, { Component } from "react";
import MultipleCards from "../../ui-molecules-local/MultipleCards";
import { connect } from "react-redux";
import get from "lodash/get";

class MultipleCardContainer extends Component {
    render() {
        const {data, ...rest} = this.props
        return(
            <MultipleCards data={data} {...rest}/>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { screenConfiguration } = state;
    const data = get(
        screenConfiguration.preparedFinalObject,
        props.sourceJsonPath,
        []
      ); 
    return {data}
}


export default connect(mapStateToProps, null)(MultipleCardContainer)