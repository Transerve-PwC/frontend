import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { Container, Item } from "egov-ui-framework/ui-atoms";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import {getNextFinancialYearForRenewal,getSearchResults} from "../../ui-utils/commons"
import { getDownloadItems } from "./downloadItems";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { WF_PROPERTY_MASTER } from "../../ui-constants";

class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: [],
    //responseLength: 0
  };

  getDownloadData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, fileNumber } = (data && data[0]) || "";
    return {
      label: "Download",
      leftIcon: "cloud_download",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      menu: getDownloadItems(status, fileNumber, state).downloadMenu
      // menu: ["One ", "Two", "Three"]
    };
  };

  getPrintData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, fileNumber } = (data && data[0]) || "";
    return {
      label: "Print",
      leftIcon: "print",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      // menu: ["One ", "Two", "Three"]
      menu: getDownloadItems(status, fileNumber, state).printMenu
    };
  };

  findAssigner = (item, processInstances) => {
    const findIndex = processInstances.map(processInstance => processInstance.action === item).lastIndexOf(true)
    return processInstances[findIndex]
  }

  openActionDialog = async item => {
    const { handleFieldChange, setRoute, dataPath, moduleName } = this.props;
    const {preparedFinalObject} = this.props.state.screenConfiguration;
    const {workflow: {ProcessInstances = []}} = preparedFinalObject || {}
    let employeeList = [];
    let action = ""
    switch(item.buttonLabel) {
      case "SENDBACK": {
        action = "FORWARD"
        break
      }
      default : action = ""
    }
    let assignee = [];
    switch(moduleName) {
      case WF_PROPERTY_MASTER: {
        if(!!action && dataPath[0].masterDataState !== "PM_PENDING_DA_VERIFICATION") {
          const {assigner = {}} = this.findAssigner(action, ProcessInstances) || {}
          assignee = !!assigner.uuid ? [assigner.uuid] : []
        }
        break
      }
    }

    handleFieldChange(`${dataPath}[0].comment`, "");
    handleFieldChange(`${dataPath}[0].assignee`, assignee);

    if (item.isLast) {
      const url =
        process.env.NODE_ENV === "development"
          ? item.buttonUrl
          : item.buttonUrl;
      setRoute(url);
      return;
    }
    if (item.showEmployeeList) {

     // commented to test the application status change flow as below API is failing.
      const tenantId = getTenantId();
      const queryObj = [
        {
          key: "roles",
          value: item.roles
        },
        {
          key: "tenantId",
          value: tenantId
        }
      ];
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "",
        queryObj
      );
      employeeList =
        payload &&
        payload.Employees.map((item, index) => {
          const name = get(item, "user.name");
          return {
            value: item.uuid,
            label: name
          };
        });
    }

    this.setState({ open: true, data: item, employeeList });
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  renewTradelicence = async (financialYear, tenantId) => {
    const {setRoute , state} = this.props;
    const licences = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses`
    );

    const nextFinancialYear = await getNextFinancialYearForRenewal(financialYear);

    const wfCode = "DIRECTRENEWAL";
    set(licences[0], "action", "INITIATE");
    set(licences[0], "workflowCode", wfCode);
    set(licences[0], "applicationType", "RENEWAL");
    set(licences[0],"financialYear" ,nextFinancialYear);

  const response=  await httpRequest("post", "/tl-services/v1/_update", "", [], {
      Licenses: licences
    })
     const renewedapplicationNo = get(
      response,
      `Licenses[0].applicationNumber`
    );
    const licenseNumber = get(
      response,
      `Licenses[0].licenseNumber`
    );
    setRoute(
      `/tradelicence/acknowledgement?purpose=DIRECTRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&FY=${nextFinancialYear}&tenantId=${tenantId}&action=${wfCode}`
    );
  };
  render() {
    const {
      contractData,
      handleFieldChange,
      onDialogButtonClick,
      dataPath,
      moduleName,
      state,
      dispatch
    } = this.props;
    const { open, data, employeeList } = this.state;
    const status = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].status`
    );
    const applicationType = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].applicationType`
    );
    const applicationNumber = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].applicationNumber`
    );
    const tenantId = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].tenantId`
    );
    const financialYear = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].financialYear`
    );
    const licenseNumber = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].licenseNumber`
    );

    const downloadMenu =
      contractData &&
      contractData.map(item => {
        const { buttonLabel, moduleName } = item;
        return {
          labelName: { buttonLabel },
          labelKey: `WF_${moduleName.toUpperCase()}_${buttonLabel}`,
          link: () => {
            this.openActionDialog(item);
          }
        };
      });
    
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 15,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px"
        }
      },
      menu: downloadMenu
    };
    return (
      <div className="apply-wizard-footer" id="custom-atoms-footer">
        {!isEmpty(downloadMenu) && (
          <Container>
            <Item xs={12} sm={12} className="wf-footer-container">
              <MenuButton data={buttonItems} />
            </Item>
          </Container>
        )}
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
          dataPath={dataPath}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
