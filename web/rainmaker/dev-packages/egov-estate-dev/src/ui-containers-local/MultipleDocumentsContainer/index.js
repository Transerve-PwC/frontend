import React, { Component } from "react";
import MultipleDocuments from "../../ui-molecules-local/MultipleDocuments";
import { connect } from "react-redux";
import get from "lodash/get";
  
class MultipleDocumentsContainer extends Component {
    render() {
        const {data,...rest} = this.props
        return(
            <MultipleDocuments data={data} {...rest}/>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { screenConfiguration } = state;
    let data = get(
        screenConfiguration.preparedFinalObject,
        props.sourceJsonPath,
        []
    ); 
  return {data }
}




export default connect(mapStateToProps, null)(MultipleDocumentsContainer)