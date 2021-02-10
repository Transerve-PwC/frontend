import {
    getCommonHeader,
    getLabel,
    getBreak,
    getCommonApplyFooter
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { conectionDetails} from "./linkConnectionResources/conectionDetails"  
  import {  getSearchResults,getSearchResultsForSewerage } from "../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import {
    getTenantId
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    toggleSnackbar,
  toggleSpinner,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { footer } from "./linkConnectionResources/footer";
  
  export const prepareData = async (
    state,
    dispatch,
    connectionNumber,
    id,
    tenantId
  ) => {
   
    
    if (connectionNumber && id) {
  
      let queryObject = [
        {
          key: "connectionNumber",
        value: connectionNumber         
        }];       
      try {
        //let queryObject = [];
        //queryObject.push({ key: "connectionNumber", value: connectionNumber });
        let getSearchResult = getSearchResults(queryObject)
        let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
        let finalArray = [];
        let searchWaterConnectionResults, searcSewerageConnectionResults;
    
     try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
     try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
     const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
     const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
     
     let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
     combinedSearchResults = combinedSearchResults.filter(x=>x.id === id)
     dispatch(prepareFinalObject("combinedSearchResults", combinedSearchResults));

     if(combinedSearchResults && combinedSearchResults[0].connectionHolders && combinedSearchResults[0].connectionHolders !=="NA" )
     {
      dispatch(
        handleField(
          "link-connection-details",
          "components.div.children.footer.children.SubmitButton",
          "visible",
          false
        )
      );
      dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_LINK_CONNECTION_VALLIDATION",
          labelName: "This connection is already assign to other user"
        },
          "warning"
        )
      )
     }
     else
     {
      dispatch(
        handleField(
          "link-connection-details",
          "components.div.children.footer.children.SubmitButton",
          "visible",
          true
        )
      );

     }
    } catch (err) { console.log(err) }
  
     
    }
  };
  
  const header = getCommonHeader({
    labelName: "Link Water Connection",
    labelKey: "WS_LINK_WATER_COMNNECTION"
  });
  const LinkConnectionResult = {
    uiFramework: "material-ui",
    name: "applydop",
    beforeInitScreen: (action, state, dispatch) => {
    //  resetFields(state, dispatch);
      const tenantId = getTenantId();
      const id = getQueryArg(
        window.location.href,
        "id"
      );
      const connectionNumber = getQueryArg(
        window.location.href,
        "connectionNumber"
      );
     
     //get Eployee details data
  prepareData(state, dispatch, connectionNumber,id, tenantId).then(res=>
    {
  
    }
  );



      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "applydop"
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
          conectionDetails:conectionDetails(),
          break:getBreak(),         
          footer:footer()
  
         
        }
      },
     
    }
  };
  
  export default LinkConnectionResult;
  