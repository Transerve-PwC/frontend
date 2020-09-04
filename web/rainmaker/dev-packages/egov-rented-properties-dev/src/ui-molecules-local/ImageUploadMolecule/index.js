import React, { Component } from "react";
import ImageUpload from "../ImageUpload";
import { rest } from "lodash";


class ImageUploadMolecule extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { formKey, ...rest } = this.props;
    return (
        <div>
        <ImageUpload module="egov-rented-properties" formKey={formKey} {...rest} fieldKey="media" />
      </div>
        );
  }
}
export default ImageUploadMolecule;