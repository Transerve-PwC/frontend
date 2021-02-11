import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    getApplicationStatusList,
    getApplicationTypes,
    getSearchApplicationsResults
  } from "../../../../ui-utils/commons";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    getCommonCard,
    getCommonTitle,
    getCommonParagraph,
    getCommonContainer,
    getTextField,
    getSelectField,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    getStatusList
  } from "../estate/searchResource/functions";
  import {
    localStorageGet,
    getTenantId
  } from "egov-ui-kit/utils/localStorageUtils";
  import get from "lodash/get";
  import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { applicationTypeField } from "../estate/searchResource/estateApplication";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getSearchResults} from "../../../../ui-utils/commons";
  import{ _getPattern,displayCustomErr} from "../utils";
  const header = getCommonHeader({
    labelName: "Refund",
    labelKey: "ES_REFUND_HEADER"
  }, {
    classes: {
      root: "common-header-cont"
    }
  });
    
  const searchApplications = (state, dispatch) => {
    const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
    const {
      actualResults,
      searchScreen = {}
    } = preparedFinalObject
    let searchResults = actualResults
    if (!!searchScreen.fileNumber) {
      searchResults = searchResults.filter(item => item.fileNumber == (searchScreen.fileNumber).trim())
    }
    if (!!searchScreen.status) {
      searchResults = searchResults.filter(item => item.state === (searchScreen.status).trim())
    }
    dispatch(prepareFinalObject("searchResults", searchResults))
  }
  
  const clearSearch = (state, dispatch) => {
    const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
    const {
      actualResults,
      searchScreen = {}
    } = preparedFinalObject
    if (!!searchScreen.fileNumber || !!searchScreen.status) {
      dispatch(
        handleField(
          "refund-search-applications",
          "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.fileNumber",
          "props.value",
          ""
        )
      )
      dispatch(
        handleField(
          "refund-search-applications",
          "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.status",
          "props.value",
          ""
        )
      )
    
      dispatch(prepareFinalObject("searchScreen", {}))
      dispatch(prepareFinalObject("searchResults", actualResults))
    }
  }
  
  const searchCard = getCommonCard({
    subHeader: getCommonTitle({
      labelName: "Search Property",
      labelKey: "ES_SEARCH_PROPERTY"
    }),
    subParagraph: getCommonParagraph({
      labelName: "Provide at least one parameter to search for the Property",
      labelKey: "ES_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_PROPERTY"
    }),
    statusApplicationNumberContainer: getCommonContainer({
      fileNumber: getTextField({
        label: {
          labelName: "File Number.",
          labelKey: "ES_FILE_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter File No.",
          labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        required: false,
        jsonPath: "searchScreen.fileNumber",
        pattern: _getPattern("fileNumber"),
        afterFieldChange: (action, state, dispatch) => {
            if (action.value.length > 50) {
                displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
            }
            else {
              displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_FILE_NUMBER", action.screenKey);
            }
        }
      }),
      status: getSelectField({
        label: {
          labelName: "Application status",
          labelKey: "ES_APPLICATION_STATUS_LABEL"
        },
        placeholder: {
          labelName: "Select Application Status",
          labelKey: "ES_APPLICATION_STATUS_PLACEHOLDER"
        },
        required: false,
        jsonPath: "searchScreen.status",
        data: [],
        gridDefination: {
          xs: 12,
          sm: 4
        }
      })
    }),
  
    button: getCommonContainer({
      buttonContainer: getCommonContainer(
        {
          firstCont: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 2
            }
          }, 
          searchButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 3
            },
            props: {
              variant: "contained",
              style: {
                color: "white",
                marginBottom: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                borderRadius: "2px",
                width: "80%",
                height: "48px"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Search",
                labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                searchApplications(state, dispatch)
              }
            }
          },
          clearButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 3
            },
            props: {
              variant: "outlined",
              style: {
                color: "#fe7a51",
                borderColor: "#fe7a51",
                backgroundColor: "white",
                borderRadius: "2px",
                width: "80%",
                height: "48px"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Clear",
                labelKey: "ES_SEARCH_CLEAR"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                clearSearch(state, dispatch)
              }
            }
          }, 
          lastCont: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 2
            }
          }
      })
    })
        
  }, {
    style: {
      marginLeft: 8,
      marginRight: 8
    }
  })
  
  const getData = async (action, state, dispatch) => {
    const branchType = getQueryArg(window.location.href, "branchType");
    const queryObject = [
      {key: "branchType", value: branchType,
       key :"relations", value: "bidder"}
    ]
    const response = await getSearchResults(queryObject);

    if (!!response && !!response.Properties && !!response.Properties.length) {
      let initiatedRefund = []
      response.Properties = response.Properties.filter(item => {
          if(item.propertyDetails.bidders && item.propertyDetails.bidders.length > 0 ){
            initiatedRefund = item.propertyDetails.bidders.filter(bidder => {
              if(bidder.refundStatus == "Initiated"){
                return bidder
              }
            })
            if(initiatedRefund.length == item.propertyDetails.bidders.length ){
              return item
            }
          }
      })
      dispatch(prepareFinalObject("actualResults", response.Properties));
      dispatch(prepareFinalObject("searchResults", response.Properties));
    }
  }
  
  const refundSearchApplications = {
    uiFramework: "material-ui",
    name: "refund-search-applications",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("actualResults", []));
      dispatch(prepareFinalObject("searchResults", []));
      const queryObject = [{
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "businessServices",
        value: "ES-EB-IS-RefundOfEmd"
      }
    ]
      clearSearch(state, dispatch);
      getData(action, state, dispatch)
      getStatusList(state, dispatch, queryObject, "refund-search-applications", "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.status", "ES-EB-AllotmentOfSite")
      return action
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          header: header,
          searchCard,
          applicationsCard: {
            uiFramework: "custom-molecules",
            componentPath: "SingleApplication",
            visible: true,
            props: {
              contents: [
                {
                  label: "ES_FILE_NUMBER_LABEL",
                  jsonPath: "fileNumber"
                },
                {
                  label: "ES_AUCTION_ID",
                  jsonPath: "propertyDetails.bidders[0].auctionId",
                  callBack: (value) => {
                    return Math.floor(value)
                  }
                },
                {
                  label: "ES_PROPERTY_STATUS",
                  jsonPath: "state"
                }
              ],
              moduleName: "REFUNDOFEMD"
            
            }
          }
        }
      }
    }
  };
  
  export default refundSearchApplications;