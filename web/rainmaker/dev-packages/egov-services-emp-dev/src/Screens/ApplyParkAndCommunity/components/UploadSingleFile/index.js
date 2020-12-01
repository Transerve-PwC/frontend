
import React, { Component } from 'react'
import { UploadFile, UploadedDocument } from "egov-ui-framework/ui-atoms";

export default class UploadSingleFile extends Component {
     
 render() {
  let {uploaded,classes,handleFileUpload,removeDocument,documents,onButtonClick,inputProps,buttonLabel} = this.props
  return (
    <div>
    {!uploaded && (
      <UploadFile
        buttonProps={{
          variant: "outlined",
          color: "primary",
          onClick: onButtonClick
        }}
        handleFileUpload={handleFileUpload}
        inputProps={{ multiple: false, ...inputProps }}
        classes={classes}
        buttonLabel={buttonLabel}
      />
    )}
    {uploaded && (
      <div>
        {documents &&
          documents.map((document, documentIndex) => {
            return (
              <div key={documentIndex}>
                <UploadedDocument
                  document={document}
                  removeDocument={removeDocument}
                />
              </div>
            );
          })}
      </div>
    )}
  </div>
  )
}
}