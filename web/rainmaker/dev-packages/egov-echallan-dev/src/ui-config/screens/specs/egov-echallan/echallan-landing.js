import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { serachResultGrid } from "./searchResource/serachResultGrid";
import { searchResultApiResponse } from './searchResource/searchResultApiResponse'
import { footer } from "./challanManage/footer/manageChallanFooter"
import { getTenantId, getUserInfo, localStorageGet, setapplicationType } from "egov-ui-kit/utils/localStorageUtils/";
import { clearlocalstorageAppDetails, checkForRole, getMdmsEncroachmentSectorData, getSiNameDetails } from "../utils";
import { searchCriteria } from "./searchCriteria";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
let roles = JSON.parse(getUserInfo()).roles;

const header = getCommonHeader({
  labelName: "Manage Challan",
  labelKey: 'EC_MANAGE_CHALLAN'
});

const setData = async (state, dispatch,dataarray,searchCrieteria) => { 
      // if (dataarray != null) {
      //   dispatch(prepareFinalObject('eChallanMasterGrid', dataarray));

      //   dispatch(
      //     handleField(
      //       "echallan-landing",
      //       "components.div.children.serachResultGrid",
      //       "props.data",
      //       dataarray
      //     )
      //   );
      // }
  if (searchCrieteria != null) { 
    await searchResultApiResponse(state, dispatch);
  }
}

const MANAGECHALLANSearchAndResult = {
  uiFramework: "material-ui",
  name: "echallan-landing",
  beforeInitScreen: (action, state, dispatch) => {
    
    let searchCrieteria = JSON.parse(localStorageGet("echallanSearchCrieteria"));
    let dataarray=JSON.parse(localStorage.getItem("eChallanMasterGrid"));

    clearlocalstorageAppDetails(state);
    setapplicationType('egov-echallan');
    getMdmsEncroachmentSectorData(action, state, dispatch).then(response => {
      getSiNameDetails(action, state, dispatch);
      setData(state,dispatch,dataarray,searchCrieteria);
    });

    
    if (searchCrieteria != null) { 
      dispatch(prepareFinalObject("searchCriteriaManageChallan[0].ToDate",searchCrieteria.toDate));
      dispatch(prepareFinalObject("searchCriteriaManageChallan[0].FromDate",searchCrieteria.fromDate));
      dispatch(prepareFinalObject("searchCriteriaManageChallan[0].EncroachmentType",searchCrieteria.encroachmentType));
      dispatch(prepareFinalObject("searchCriteriaManageChallan[0].sector",searchCrieteria.sector));
      dispatch(prepareFinalObject("searchCriteriaManageChallan[0].SIName",searchCrieteria.siName));
      dispatch(prepareFinalObject("searchCriteriaManageChallan[0].Status", searchCrieteria.status));
      // await searchResultApiResponse(state, dispatch);
      
    }
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "serachResultGrid"
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

            footer: checkForRole(roles, 'challanSI') ? footer : {}
          }
        },
        searchCriteria,
        breakAfterSearch: getBreak(),
        serachResultGrid
      }
    },
  }
};

export default MANAGECHALLANSearchAndResult;
