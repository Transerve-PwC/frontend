import React, { Component } from "react";
import { MultiDownloadCard } from "../../ui-molecules-local/";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.css";

class DownloadFileContainer extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    return (
      <MultiDownloadCard data={data} documentData={documentData} {...rest} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = get(
    screenConfiguration.preparedFinalObject,
    ownProps.sourceJsonPath,
    []
  );
  return { data };
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainer);
