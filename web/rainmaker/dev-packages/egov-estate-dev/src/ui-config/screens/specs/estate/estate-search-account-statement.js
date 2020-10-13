import {
    getCommonHeader,
    getLabel,
    getBreak,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { estateApplicationAccountStatementGen } from './searchResource/estateApplicationAccountStatementGen';
  import { searchResultsAccountStatement } from './searchResource/searchResultsAccountStatement';
  import commonConfig from "config/common.js";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { httpRequest } from "../../../../ui-utils";
  import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
  
  const header = getCommonHeader({
    labelName: "Account Statement Generation",
    labelKey: "ES_ACCOUNT_STATEMENT_GENERATION_HEADER"
  });
  
  const getMdmsData = async (dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [{
          moduleName: ESTATE_SERVICES_MDMS_MODULE,
          masterDetails: [{
           name: "categories"
          }]
        }]
      }
    };
    try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  }
  
  const estateAccountStatementGenerationSearch = {
    uiFramework: "material-ui",
    name: "estate-search-account-statement",
    beforeInitScreen: (action, state, dispatch) => {
    //   state.screenConfiguration.preparedFinalObject.citizenSearchScreen = {}
      getMdmsData(dispatch);
      return action
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 8
                },
                ...header
              },
            }
          },
          estateApplicationAccountStatementGen,
          breakAfterSearch: getBreak(),
          searchResultsAccountStatement,
          searchButton: {
            componentPath: "Button",
             visible: false,
            gridDefination: {
               xs: 12,
               sm: 12,
              align: "right",
            },
            props: {
              variant: "contained",
              style: {
                color: "white",
                backgroundColor: "#fe7a51",
                borderColor:"#fe7a51",
                borderRadius: "2px",
                width: "25%",
                height: "48px",
                margin:"10px"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Download",
                labelKey: "RP_COMMON_DOWNLOAD_PDF"
              })
            },
            onClickDefination: {
              action: "condition",
            //   callBack: downloadAccountStatementPdf
            },
          }
        }
      }
    }
  };
  
  export default estateAccountStatementGenerationSearch;