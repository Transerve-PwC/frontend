import React from "react";
import { connect } from "react-redux";
import { ActionDialog, HCActionDialog,StoreAssetActionDialog } from "../";
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
    const { status, applicationNumber } = (data && data[0]) || "";
    return {
      label: "Download",
      leftIcon: "cloud_download",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      menu: getDownloadItems(status, applicationNumber, state).downloadMenu
      // menu: ["One ", "Two", "Three"]
    };
  };

  getPrintData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
    return {
      label: "Print",
      leftIcon: "print",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      // menu: ["One ", "Two", "Three"]
      menu: getDownloadItems(status, applicationNumber, state).printMenu
    };
  };

  openActionDialog = async item => {
    const { handleFieldChange, setRoute, dataPath } = this.props;
    let employeeList = [];

    if (dataPath === "BPA") {
      handleFieldChange(`${dataPath}.comment`, "");
      handleFieldChange(`${dataPath}.assignees`, "");
    }
    if(dataPath==="services"){
      var { state  } = this.props;
      
      const applicationNumberHC = get(
        state.screenConfiguration.preparedFinalObject.workflow,
        `ProcessInstances[0].businessId`);
      let tenantId = getTenantId().split(".")[0];
      handleFieldChange(`${dataPath}[0].comment`, "");
      handleFieldChange(`${dataPath}[0].assignee`, []);
      handleFieldChange(`${dataPath}[0].roleList`, []); // this line I chnages from array to "" just remember so evr time got it?
      handleFieldChange(`${dataPath}[0].isRoleSpecific`, true);
      handleFieldChange(`${dataPath}[0].serviceType`, item.moduleName);
      handleFieldChange(`${dataPath}[0].service_request_id`, applicationNumberHC);
      handleFieldChange(`${dataPath}[0].wfDocuments`, []);
	  handleFieldChange(`${dataPath}[0].locality`, tenantId);
      if (item.showEmployeeList) {
      
      let mdmsBody = {
        MdmsCriteria: {
          tenantId: tenantId,
          moduleDetails: [
            
            {
              moduleName: "eg-horticulture",
              masterDetails: [
                {
                  name: "roles"
                }
              ]
            },
          ]
        }
      };
      try {
        let payload = null;
        payload = await httpRequest(
          "post",
          "/egov-mdms-service/v1/_search",
          "_search",
          [],
          mdmsBody
        );
        // debugger
        // dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
        employeeList =
          payload &&
          payload.MdmsRes["eg-horticulture"].roles.map((item, index) => {
            const name = get(item, "name");
            console.log(item);
            return {
              value: item.code,
              label: name
            };
          });
      } catch (e) {
        console.log(e);
      }
        
      }
     
    }
    if (dataPath === "indents" || dataPath === "materialIssues" || dataPath === "purchaseOrders" || dataPath === "materialReceipt" || dataPath === "transferInwards") {
      var { state } = this.props;
      const applicationNumberStoreAsset = get(
        state.screenConfiguration.preparedFinalObject.workflow,
        `ProcessInstances[0].businessId`);

      // indents[0].workflowDetails.assigneewfupdate
      if (item.buttonLabel === "SENDTOCREATOR") {
        let jeuuid = get(
          state.screenConfiguration.preparedFinalObject.workflow,
          `ProcessInstances[0].assigner.uuid`);

        handleFieldChange(`${dataPath}[0].workFlowDetails.assignee[0]`, jeuuid);
      }
      handleFieldChange(`${dataPath}[0].workFlowDetails.action`, item.buttonLabel);
      handleFieldChange(`${dataPath}[0].workFlowDetails.businessService`, item.moduleName);
      handleFieldChange(`${dataPath}[0].workFlowDetails.comments`, "");
      handleFieldChange(`${dataPath}[0].workFlowDetails.businessId`, applicationNumberStoreAsset);
      handleFieldChange(`${dataPath}[0].workFlowDetails.wfDocuments`, []);


    }
	
    else {
      handleFieldChange(`${dataPath}[0].comment`, "");
      handleFieldChange(`${dataPath}[0].assignee`, []);
    }

    if (item.isLast) {
      const url =
        process.env.NODE_ENV === "development"
          ? item.buttonUrl
          : item.buttonUrl;
      setRoute(url);
      return;
    }
    if(dataPath!="services")
    {if (item.showEmployeeList) {
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
    }}

    this.setState({ open: true, data: item, employeeList });
  };

  onClose = () => {
    var {state} = this.props;
    this.setState({
      open: false
    });
    set(state, "form.workflow.files.wfDocuments", "")
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
      if(moduleName === "NewTL"){
        const responseLength = get(
          state.screenConfiguration.preparedFinalObject,
          `licenseCount`,
          1
        );
      const rolearray=  getUserInfo() && JSON.parse(getUserInfo()).roles.filter((item)=>{
          if(item.code=="TL_CEMP"&&item.tenantId===tenantId)
          return true;
        })
       const rolecheck= rolearray.length>0? true: false;
    if ((status === "APPROVED"||status === "EXPIRED") && applicationType !=="RENEWAL"&& responseLength===1 && rolecheck===true) {
      const editButton = {
        label: "Edit",
        labelKey: "WF_TL_RENEWAL_EDIT_BUTTON",
        link: () => {
          this.props.setRoute(
            `/tradelicence/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
          );
        }
      };
      downloadMenu && downloadMenu.push(editButton);
      const submitButton = {
        label: "Submit",
        labelKey: "WF_TL_RENEWAL_SUBMIT_BUTTON",
        link: () => {
          this.renewTradelicence(financialYear, tenantId);
        }
      };
      downloadMenu && downloadMenu.push(submitButton);
    }
  }

    
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
    if (dataPath ==="services" && data.length != 0){
      return (
        <div className="apply-wizard-footer" id="custom-atoms-footer">
          {!isEmpty(downloadMenu) && (
            <Container>
              <Item xs={12} sm={12} className="wf-footer-container">
                <MenuButton data={buttonItems} />
              </Item>
            </Container>
          )} 
                 
          <HCActionDialog
            open={open}
            onClose={this.onClose}
            dialogData={data}
            dropDownData={employeeList}
            handleFieldChange={handleFieldChange}
            onButtonClick={onDialogButtonClick}
            dataPath={dataPath}
            state = {state}
          />
  
  
          
        </div>
      );}
      else if ((dataPath === "indents" || dataPath === "materialIssues" || dataPath === "purchaseOrders" || dataPath === "materialReceipt" || dataPath === "transferInwards") && data.length != 0) {
      return (
        <div className="apply-wizard-footer" id="custom-atoms-footer">
          {!isEmpty(downloadMenu) && (
            <Container>
              <Item xs={12} sm={12} className="wf-footer-container">
                <MenuButton data={buttonItems} />
              </Item>
            </Container>
          )}

          <StoreAssetActionDialog
            open={open}
            onClose={this.onClose}
            dialogData={data}
            dropDownData={employeeList}
            handleFieldChange={handleFieldChange}
            onButtonClick={onDialogButtonClick}
            dataPath={dataPath}
            state={state}
          />



        </div>
      );
    }
    else {return (
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
    );}
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
