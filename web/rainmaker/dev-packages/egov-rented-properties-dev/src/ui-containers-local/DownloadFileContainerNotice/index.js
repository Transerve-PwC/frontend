import React, { Component } from "react";
import MultiDownloadCardNoticePreview  from "../../ui-molecules-local/MultiDownloadCardNoticePreview"
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.css";

class DownloadFileContainerNotice extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    console.log(this.props)
    return (
      <MultiDownloadCardNoticePreview data={data} documentData={documentData} {...rest} />
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
)(DownloadFileContainerNotice);