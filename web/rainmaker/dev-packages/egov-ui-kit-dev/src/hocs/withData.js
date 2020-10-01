import React from "react";
import { connect } from "react-redux";
import { searchUser } from "egov-ui-kit/redux/auth/actions";
import { fetchComplaintCategories ,fetchComplaintDepartment , fetchComplaintSector } from "egov-ui-kit/redux/complaints/actions";
import { fetchpgrConstants } from "egov-ui-kit/redux/common/actions";
import { fetchUiCommonConfig, fetchUiCommonConstants } from "egov-ui-kit/redux/app/actions";
import { getAccessToken, getModule } from "egov-ui-kit/utils/localStorageUtils";

const withData = (Component) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      const { searchUser, fetchComplaintCategories ,fetchComplaintDepartment , fetchComplaintSector , authenticated, fetchpgrConstants, fetchUiCommonConfig, fetchUiCommonConstants } = this.props;
      if (getAccessToken()) {
 
        if(getModule() ==="rainmaker-pgr"|| window.location.pathname.includes("/all-complaints") ){
          fetchComplaintCategories();
          fetchComplaintDepartment();
          fetchComplaintSector();
          fetchpgrConstants();
          fetchUiCommonConfig();
        }
        
        searchUser();
        fetchUiCommonConstants();
      }
    }

    render() {
      const { searchUser, fetchCurrentLocation, fetchComplaintCategories ,fetchComplaintDepartment , fetchComplaintSector ,...rest } = this.props;
      return <Component {...rest} />;
    }
  }

  const mapStateToProps = ({ auth }) => {
    const { authenticated } = auth;
    return { authenticated };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
      fetchComplaintDepartment:() => dispatch(fetchComplaintDepartment()),
      fetchComplaintSector  : () =>  dispatch(fetchComplaintSector()),
      searchUser: () => dispatch(searchUser()),
      fetchpgrConstants: () => dispatch(fetchpgrConstants()),
      fetchUiCommonConfig: () => dispatch(fetchUiCommonConfig()),
      fetchUiCommonConstants: () => dispatch(fetchUiCommonConstants()),
    };
  };

  return connect(
    null,
    mapDispatchToProps
  )(Wrapper);
};

export default withData;
