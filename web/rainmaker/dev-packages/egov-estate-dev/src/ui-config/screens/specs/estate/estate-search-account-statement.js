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
  import {downloadAccountStatementPdf} from '../estate/searchResource/searchAccountStatementFunction'
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
                  sm: 6
                },
                ...header
              },
            }
          },
          estateApplicationAccountStatementGen,
          breakAfterSearch: getBreak(),
          searchResultsAccountStatement,
          downloadButton:{
            uiFramework: "custom-atoms",
            componentPath: "Container",
            props: {
              style: { justifyContent: "center", marginTop: 10 }
            },
            visible: false,
            children:{
              searchButton: {
                componentPath: "Button",
                 visible: true,
                gridDefination: {
                   xs: 4,
                   sm: 6,
                  align: "left",
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
                    labelKey: "EST_COMMON_DOWNLOAD_PDF"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: downloadAccountStatementPdf
                },
              },
              downloadXLSButton: {
                componentPath: "Button",
                 visible: true,
                gridDefination: {
                  xs: 4,
                  sm: 6,
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
                    labelKey: "EST_COMMON_DOWNLOAD_XLS"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  // callBack: downloadAccountStatementXLS
                }
              }
            }
          }
        }
      }
    }
  };
  
  export default estateAccountStatementGenerationSearch;