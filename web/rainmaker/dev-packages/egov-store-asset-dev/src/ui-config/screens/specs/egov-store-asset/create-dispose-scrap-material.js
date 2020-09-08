import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { footer } from "./createDisposalScrapMaterialResource/footer";
  import {DisposalScrapHeader  } from "./createDisposalScrapMaterialResource/DisposalScrapHeader";
  import { DisposalScrapMaterialDetails } from "./createDisposalScrapMaterialResource/DisposalScrapMaterialDetails";
  import { poApprovalInfo } from "./createDisposalScrapMaterialResource/poApprovalInfo";
  import {totalDisposalValue} from './createDisposalScrapMaterialResource/totalDisposalValue';
  import commonConfig from '../../../../config/common';

  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  export const stepsData = [
    { labelName: "Disposal", labelKey: "STORE_DISPOSAL_SCRAP_HEADER" },
    { labelName: "Disposal Material Details", labelKey: "STORE_DISPOSAL_SCRAP_DETAILS_HEADER" },
    { labelName: "Approval Information", labelKey: "STORE_PO_APPROVAL_INFO_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Disposal of Scrap Material`,
      labelKey: "STORE_DISPOSAL_SCRAP_CREATE_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
        DisposalScrapHeader
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
        DisposalScrapMaterialDetails,
        totalDisposalValue
    },
    visible: false
  };
  
  export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form3"
    },
    children: {
        poApprovalInfo
    },
    visible: false
  };
  
  

  
  const getMdmsData = async (action, state, dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [ 
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "RateType", filter: "[?(@.active == true)]" },
            ]
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              { name: "UOM", filter: "[?(@.active == true)]" },
            ]
          }
        ]
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch( prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes")) );
    } catch (e) {
      console.log(e);
    }
  };
  
  const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);

    const queryObject = [{ key: "tenantId", value: getTenantId()  }];
    //fetching store name
    getSearchResults(queryObject, dispatch, "storeMaster")
      .then(response => {
        if (response) {
          const storeNames = response.stores.map(item => {
            let code = item.code;
            let name = item.name;
            let department = item.department.name;
            let divisionName = item.divisionName;
            return { code, name, department, divisionName }
          })
          dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
        }
      });
  
         // fetching employee designation
      const userInfo = JSON.parse(getUserInfo());
      if(userInfo){
        dispatch(prepareFinalObject("disposals[0].createdBy", userInfo.name));
        const queryParams = [{ key: "codes", value: userInfo.userName },{ key: "tenantId", value:  getTenantId() }];
        try { 
          const payload = await httpRequest(
            "post",
            "/egov-hrms/employees/_search",
            "_search",
            queryParams
          );
          if(payload){
            const {designationsById} = state.common;
            const empdesignation = payload.Employees[0].assignments[0].designation;
            if(designationsById){
            const desgnName = Object.values(designationsById).filter(item =>  item.code === empdesignation )
            dispatch(prepareFinalObject("disposals[0].designation", desgnName[0].name));
            }
          }
          
        } catch (e) {
          console.log(e);
        }
      }
      // fetching Scrap 
      let scrapNumber = getQueryArg(window.location.href, "scrapNumber");
       let materialNames =[];
if(scrapNumber){
      const queryObject1 = [{ key: "tenantId", value:  getTenantId()},{ key: "scrapNumber", value: scrapNumber}];
      getSearchResults(queryObject1, dispatch,"scrap")
      .then(response =>{
        if(response){
          dispatch(prepareFinalObject("disposals[0].store.code", get(response, "scraps[0].store.code")));
          dispatch(prepareFinalObject("disposals[0].store.name", get(response, "scraps[0].store.name")));
          response.scraps[0].scrapDetails.forEach(scrapdetail => {
            const disposalUom = scrapdetail.uom;
            const scrapDetails = scrapdetail;
            const receiptIdForScrap = scrapdetail.issueDetail.materialIssuedFromReceipts[0].materialReceiptId;
            const lotNumber =  scrapdetail.issueDetail.materialIssuedFromReceipts && scrapdetail.issueDetail.materialIssuedFromReceipts[0].materialReceiptDetail.receiptDetailsAddnInfo[0].lotNo;
            let obj = {
              ...scrapdetail.material,
              scrapDetails,
              receiptIdForScrap,
              disposalUom,
              lotNumber
            }
            materialNames.push(obj);
          })
        }
  });
  materialNames &&  dispatch(prepareFinalObject("materialNames", materialNames));
}
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "create-dispose-scrap-material",
    beforeInitScreen: (action, state, dispatch) => {
      const step = getQueryArg(window.location.href, "step");
      if(!step){
        dispatch(prepareFinalObject("disposals[0]",null));
      }
      getData(action, state, dispatch);
      
      return action;
    },
  
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...header
              }
            }
          },
          stepper,
          formwizardFirstStep,
          formwizardSecondStep,
          formwizardThirdStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  