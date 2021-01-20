import React, { Component } from "react";
import ImageUpload from "egov-ui-kit/common/common/ImageUpload";

class ImageUploadMolecule extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { formKey } = this.props;
    return (
        <div>
        <ImageUpload module="egov-hc" formKey={formKey} fieldKey="media" />
      </div>
        );
  }
}
export default ImageUploadMolecule;
