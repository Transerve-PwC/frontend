import {
    getCommonHeader,
    getCommonContainer,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { ScrapReviewDetails } from "./viewScrapMaterialResource/scrap-review";
  import { poViewFooter } from "./viewScrapMaterialResource/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View Scrap Material`,
      labelKey: "STORE_SCRAP_VIEW"
    })
  });
  const creatDisposalHandle = async (state, dispatch) => {
    let scrapNumber = getQueryArg(window.location.href, "scrapNumber");
    dispatch(setRoute(`/egov-store-asset/create-dispose-scrap-material?scrapNumber=${scrapNumber}`));
  };
  const tradeView = ScrapReviewDetails(false);
  
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

  const fetchEmployeeDetails = async(response,dispatch) => {
    
    const queryParams = [{ key: "ids", value: response.scraps[0].auditDetails.createdBy },{ key: "tenantId", value:  getTenantId() }];
    try { 
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "_search",
        queryParams
      );
      if(payload){
        dispatch(prepareFinalObject("scraps[0].createdBy",payload.Employees[0].user.name));  
      }

    } catch (e) {
      console.log(e);
    }
  }
  
const fetchMaterialData = (response,dispatch) => {
  let materialNames =[];
  if(response){
   
    response.scraps[0].scrapDetails.forEach((scrapDetail,index) => {
      let storeCode = response.scraps[0].store.code;
      let materialObj  = scrapDetail.material;
      let receiptIdForScrap = scrapDetail.issueDetail.materialIssuedFromReceipts[0].materialReceiptId;
      const scrapUom = scrapDetail.issueDetail.uom;
      const scrapissueDetail = scrapDetail.issueDetail.id;
      const lotNumber =  scrapDetail.issueDetail.materialIssuedFromReceipts && scrapDetail.issueDetail.materialIssuedFromReceipts[0].materialReceiptDetail.receiptDetailsAddnInfo[0].lotNo;
        
        const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "issueingStore", value: storeCode},{ key: "material", value: materialObj.code}];
        getSearchResults(queryObject, dispatch,"materialBalanceAndName")
        .then( response =>{
          if(response){    
               response.MaterialBalanceRate.forEach(element => {      
                 if(element.receiptId === receiptIdForScrap){           
                    dispatch(prepareFinalObject(`scraps[0].scrapDetails[${index}].balanceQuantity`, element.balance)); 
                    dispatch(prepareFinalObject(`scraps[0].scrapDetails[${index}].unitRate`, element.unitRate)); 
            
                    let balanceValue = element.unitRate * element.balance;
                    if(balanceValue) {
                     dispatch(prepareFinalObject(`scraps[0].scrapDetails[${index}].balanceValue`, balanceValue)); 
                    }                         
                 }
                                                          
            });
                     
         }           
        }); 
        
        let obj = {
          ...materialObj,
          receiptIdForScrap,
          scrapUom,
          scrapissueDetail,
          lotNumber
        }
        materialNames.push(obj);
  });

  materialNames &&  dispatch(prepareFinalObject("materialNames", materialNames));



  }
}
 



  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-scrap-material",
    beforeInitScreen: (action, state, dispatch) => {
      let scrapNumber = getQueryArg(window.location.href, "scrapNumber");
      let tenantId = getQueryArg(window.location.href, "tenantId");
      const queryObject = [{ key: "tenantId", value: tenantId},{ key: "scrapNumber", value: scrapNumber}];
      getSearchResults(queryObject, dispatch,"scrap")
      .then(response =>{
        if(response){
          dispatch(prepareFinalObject("scraps", [...response.scraps]));  
          dispatch(prepareFinalObject("scraps[0].scrapDate", new Date(response.scraps[0].scrapDate).toISOString().substr(0,10) ));    
          fetchEmployeeDetails(response,dispatch);
          fetchMaterialData(response,dispatch);
        }
      })


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
                  sm: 6,
                },
                ...header
              },
              newPOButton: {
                componentPath: "Button",         
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right",
                },   
                visible: true,// enableButton,
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    color: "white",
                    borderRadius: "2px",
                    width: "250px",
                    height: "48px",
                  },
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Add Disposal",
                    labelKey: "STORE_ADD_NEW_DISPOSAL_BUTTON",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: creatDisposalHandle,
                },
              },
            }
          },
          tradeView,
          footer: poViewFooter()
        }
      },
    }
  };
  
  export default screenConfig;
  