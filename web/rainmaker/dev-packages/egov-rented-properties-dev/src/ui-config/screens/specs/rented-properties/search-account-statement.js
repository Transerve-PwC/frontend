import {
    getCommonHeader,
    getBreak,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { accountStatementFilterForm } from "./searchResource/rentedPropertyApplication";
import { accountStatementResults } from "./searchResource/searchResults";
import {downloadAccountStatementPdf,downloadAccountStatementXLS} from "./searchResource/functions"
import {getColonyTypes} from "../rented-properties/apply"
  const header = getCommonHeader({
    labelName: "Account Statement Generation",
    labelKey: "RP_COMMON_ACCOUNT_STATEMENT_GENERATION_APPLICATION"
  });
  const beforeInitFn =async(action, state, dispatch)=>{
    getColonyTypes(action, state, dispatch);
  }
  const accountStatementSearchResult = {
    uiFramework: "material-ui",
    name: "search-account-statement",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch);
      dispatch(prepareFinalObject("searchScreen", {}))
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
              }
            }
          },
          accountStatementFilterForm,
          breakAfterSearch: getBreak(),
          accountStatementResults,
          downloadButton:{
            uiFramework: "custom-atoms",
            componentPath: "Container",
            props: {
              style: { justifyContent: "center", marginTop: 10 }
            },
            visible:false,
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
                    labelKey: "RP_COMMON_DOWNLOAD_PDF"
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
                    labelKey: "RP_COMMON_DOWNLOAD_XLS"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: downloadAccountStatementXLS
                }
              }
            }
          }
        },
      }
    }
  };
  
  export default accountStatementSearchResult;
  