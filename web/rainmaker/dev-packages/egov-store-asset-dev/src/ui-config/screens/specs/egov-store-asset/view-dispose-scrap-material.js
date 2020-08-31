import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { DisposalScrapReviewDetails } from "./viewDisposalScrapMaterialResource/disposalScrap-review";
  import { poViewFooter } from "./viewDisposalScrapMaterialResource/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import store from "ui-redux/store";
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View Dispoal of Scrap Material`,
      labelKey: "STORE_DISPOSAL_SCRAP_VIEW"
    })
  });
  let scrapNumber = "";
  const tradeView = DisposalScrapReviewDetails(false);
  
  const getMdmsData = async (action, state, dispatch, tenantId) => {
    const tenant = tenantId || getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "egov-hrms",
            masterDetails: [
              {
                name: "DeactivationReason",
                filter: "[?(@.active == true)]"
              }
            ]
          }
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };

  const fetchEmployeeDetails = async(response,dispatch,state) => {
    
    const queryParams = [{ key: "ids", value: response.disposals[0].auditDetails.createdBy },{ key: "tenantId", value:  getTenantId() }];
    try { 
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "_search",
        queryParams
      );
      if(payload){
        dispatch(prepareFinalObject("disposals[0].createdBy",payload.Employees[0].user.name));  
        console.log("designation emp",state.common.designationsById)
      }

    } catch (e) {
      console.log(e);
    }
  }
  const fetchMaterialData = (response,dispatch,disposalResponse) => {
    let materialNames =[];
    let materialRecptBinding =[];
    if(response){
        //Binding material and receipt number    
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

            disposalResponse.disposals[0].disposalDetails.forEach( (dispDetail,index) => {
                if(dispDetail.material.code === scrapdetail.material.code){
                  const storeCode =  disposalResponse.disposals[0].store.code;
                 const receiptIdForScrap = scrapdetail.issueDetail.materialIssuedFromReceipts[0].materialReceiptId;
                  const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "issueingStore", value: storeCode},{ key: "material", value: dispDetail.material.code}];
                  getSearchResults(queryObject, dispatch,"materialBalanceAndName")
                  .then( response =>{
                    if(response){    
                         response.MaterialBalanceRate.forEach(element => {      
                           if(element.receiptId === receiptIdForScrap){           
                              dispatch(prepareFinalObject(`disposals[0].disposalDetails[${index}].balanceQuantity`, element.balance)); 
                              dispatch(prepareFinalObject(`disposals[0].disposalDetails[${index}].unitRate`, element.unitRate)); 
                              dispatch(prepareFinalObject(`disposals[0].disposalDetails[${index}].lotNumber`, lotNumber)); 
                              let balanceValue = element.unitRate * element.balance;
                              if(balanceValue) {
                               dispatch(prepareFinalObject(`disposals[0].disposalDetails[${index}].balanceValue`, balanceValue)); 
                              }                         
                           }                                                                  
                      });                              
                   }           
                  }); 
                }
            })
            materialNames.push(obj);
          });
          materialNames &&  dispatch(prepareFinalObject("materialNames", materialNames));

          materialNames &&  store.dispatch(toggleSpinner());
  
    }
  }
  const fetchScrapData = async(disposalResponse,dispatch,scrapNumber) => {
    let tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [{ key: "tenantId", value: tenantId},{ key: "scrapNumber", value: scrapNumber}];
    getSearchResults(queryObject, dispatch,"scrap")
    .then(response =>{
      if(response){
        dispatch(prepareFinalObject("scraps", [...response.scraps])); 
        fetchMaterialData(response,dispatch,disposalResponse);
      }
    })
  }

  const fetchDisposalData = async (state, dispatch) => {
    let disposalNumber = getQueryArg(window.location.href, "disposalNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");

    const queryObject = [{ key: "tenantId", value: tenantId},{ key: "disposalNumber", value: disposalNumber}];
    getSearchResults(queryObject, dispatch,"disposals")
    .then(response =>{
      if(response){
        store.dispatch(toggleSpinner());
        dispatch(prepareFinalObject("disposals", [...response.disposals]));  
        dispatch(prepareFinalObject("disposals[0].disposalDate", new Date(response.disposals[0].disposalDate).toISOString().substr(0,10) ));    
        fetchEmployeeDetails(response,dispatch,state);
        let scrapNumber = response.disposals[0].disposalDetails[0].scrapDetails.scrapNumber;
        fetchScrapData(response,dispatch,scrapNumber);
      }
    })
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-dispose-scrap-material",
    beforeInitScreen: (action, state, dispatch) => {
    fetchDisposalData(state, dispatch);
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
          tradeView,
          footer: poViewFooter()
        }
      },
    }
  };
  
  export default screenConfig;
  