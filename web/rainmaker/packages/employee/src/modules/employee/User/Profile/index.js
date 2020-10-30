import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { fileUpload, removeFile } from "egov-ui-kit/redux/form/actions";
import { UploadDrawer } from "modules/common";
import ProfileForm from "./components/ProfileForm";
import { Screen } from "modules/common";
import img from "egov-ui-kit/assets/images/download.png";
import { isImage } from "egov-ui-kit/utils/commons";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import "./index.css";

const formKey = "profileEmployee";
const ProfileFormHOC = formHoc({ formKey })(ProfileForm);

class Profile extends Component {
  state = {
    openUploadSlide: false,
  };

  setProfilePic = (file = null, imageUri = "") => {
    const { fileUpload } = this.props;
    this.removeProfilePic('UPLOAD');
    fileUpload("profileEmployee", "photo", { module: "rainmaker-pgr", file, imageUri }, true);
  };

  removeProfilePic = (type) => {
    const { removeFile } = this.props;
    const { toggleSnackbarAndSetText } = this.props;
    removeFile("profileEmployee", "photo", 0);
    if(type === "REMOVE")
    {
      toggleSnackbarAndSetText(true, { labelName: "File remove success", labelKey: "CORE_COMMON_IMAGE_FILE_REMOVE_SUCCESS" }, "success");
    }
  };

  onClickAddPic = (isOpen) => {
    this.setState({
      openUploadSlide: isOpen,
    });
  };

  render() {
    const { profilePic, loading } = this.props;
    const { openUploadSlide } = this.state;
    const { setProfilePic, onClickAddPic, removeProfilePic } = this;

    return (
      <Screen loading={loading} className="employee-profile-screen">
        <div className="profile-container">
          <ProfileFormHOC onClickAddPic={onClickAddPic} img={img} profilePic={profilePic} />
        </div>
        {openUploadSlide && (
          <UploadDrawer removeFile={() =>removeProfilePic('REMOVE')} setProfilePic={setProfilePic} onClickAddPic={onClickAddPic} openUploadSlide={openUploadSlide} />
        )}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const form = state.form[formKey] || {};
  const images = (form && form.files && form.files["photo"]) || [];
  const loading =
    images.reduce((loading, file) => {
      return loading || file.loading;
    }, false) || false;

  return {
    loading,
    profilePic: (images.length && images[0].imageUri) || img,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fileUpload: (formKey, fieldKey, module, fileObject) => dispatch(fileUpload(formKey, fieldKey, module, fileObject)),
    removeFile: (formKey, fieldKey, index) => dispatch(removeFile(formKey, fieldKey, index)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
