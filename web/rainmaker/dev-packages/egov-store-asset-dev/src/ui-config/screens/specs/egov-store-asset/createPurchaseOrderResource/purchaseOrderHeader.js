import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults ,getSTOREPattern} from "../../../../../ui-utils/commons";
import { getMaterialIndentSearchResults } from "../../../../../ui-utils/storecommonsapi";
import { prepareFinalObject, handleScreenConfigurationFieldChange as  handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";

let indentNumber="";
indentNumber = getQueryArg(window.location.href, "indentNumber");
export const purchaseOrderHeader = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Purchase Order",
      labelKey: "STORE_PO_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  purchaseOrderHeaderContainer: getCommonContainer({
    purchaseType: {
      ...getSelectField({
        label: { labelName: "Purchase Type", labelKey: "STORE_PURCHASE_ORDER_TYPE" },
        placeholder: {
          labelName: "Select Purchase Type",
          labelKey: "STORE_PURCHASE_ORDER_TYPE"
        },
       
        required: true,
            errorMessage:"STORE_VALIDATION_PURCHASE_TYPE_SELECT",
        jsonPath: "purchaseOrders[0].purchaseType",
       // sourceJsonPath: "searchMaster.storeNames",
        props: {
          disabled : indentNumber ? true : true,
          className: "hr-generic-selectfield",
          optionValue: "value",
          optionLabel: "label",
          data: [
            {
              value: "Indent",
              label: "Indent"
            },
            {
              value: "Non Indent",
              label: "Non Indent"
            }
          ],
        }
      }),
    },
    storeName: {
      ...getSelectField({
        label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
        placeholder: {
          labelName: "Select Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
        required: true,
            errorMessage:"STORE_VALIDATION_STORE_NAME_SELECT",
        jsonPath: "purchaseOrders[0].store.code",
        sourceJsonPath: "searchMaster.storeNames",
        props: {
          disabled : indentNumber ? true : false,
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name"
        }
      }),
      beforeFieldChange: async (action, state, dispatch) => {
        if(action.value){
        const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "store", value: action.value}];
        getSearchResults(queryObject, dispatch,"materials")
        .then(async response =>{
          if(response){
            let indentingMaterial =[];
            let  materialNames = response.materials.map(material => {
                const name = material.name;
                const code = material.code;
                const description = material.description;
                const uom = material.baseUom;
                const indentQuantity = 0;
                const indentIssuedQuantity = 0;
                const poOrderedQuantity = 0;
                return{ name, code,description,uom ,indentQuantity,indentIssuedQuantity,poOrderedQuantity}
            })
              if(indentNumber){
                const queryObj = [{ key: "tenantId", value: getTenantId()},{ key: "indentNumber", value: indentNumber}];               
                let res = await getMaterialIndentSearchResults(queryObj, dispatch);
                if(res && res.indents &&  res.indents.length > 0){
                    res.indents.forEach(item => {
                      if(item.indentDetails.length > 0){
                        item.indentDetails.forEach(ele =>{
                          const name = ele.material.name;
                          const code = ele.material.code;
                          const description = ele.material.description;
                          const uom = ele.material.baseUom;
                          const indentQuantity = ele.indentQuantity;
                          const indentIssuedQuantity = ele.indentIssuedQuantity;
                          const poOrderedQuantity = ele.poOrderedQuantity;
                          if(!indentingMaterial.find(mat => mat.code === code))
                               indentingMaterial.push({name,code,description,uom,indentQuantity,indentIssuedQuantity,poOrderedQuantity})
                        })
                      }
                    })
                }

                // finding common material
                   materialNames = indentingMaterial.filter(function(ele) {
                        return materialNames.findIndex(mat => mat.code === ele.code) !== -1;
                    })
              }
            dispatch(prepareFinalObject("searchMaster.materialNames", materialNames));          
         }
          
        });   
        if(state.screenConfiguration.preparedFinalObject.searchMaster && state.screenConfiguration.preparedFinalObject.searchMaster.storeNames){
            const {storeNames} = state.screenConfiguration.preparedFinalObject.searchMaster;
            const storebj =  storeNames.filter(ele => ele.code === action.value);
            if(storebj){
              dispatch(prepareFinalObject("purchaseOrders[0].store.name", storebj[0].name)); 
              dispatch(prepareFinalObject("purchaseOrders[0].store.department.name", storebj[0].department));      
              dispatch(prepareFinalObject("purchaseOrders[0].store.divisionName", storebj[0].divisionName));              
            }
          }
          //
          const step = getQueryArg(window.location.href, "step");
          const poNumber = getQueryArg(window.location.href, "poNumber");
          if(!step && !poNumber){
              // dispatch(
              //   handleField(
              //     `create-purchase-order`,
              //     "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier",
              //     "props.style",
              //    { display: "none" }
              //     // { display: "inline-block" }
                  
              //   )
              // );
              // dispatch(
              //   handleField(
              //     `create-purchase-order`,
              //     "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier",
              //     "props",
              //     // { display: "none" }
              //     { disabled: true }
                  
              //   )
              // );
              
                }
        }
      }
    },
    divisionName: getTextField({
      label: {
        labelName: "Division Name",
        labelKey: "STORE_DETAILS_DIVISION_NAME",
      },
      props: {
        className: "applicant-details-error",
        disabled: true
      },
      placeholder: {
        labelName: "Enter Division Name",
        labelKey: "STORE_DETAILS_DIVISION_NAME_PLACEHOLDER",
      },
      pattern: getPattern("non-empty-alpha-numeric"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "purchaseOrders[0].store.divisionName",
    }),
    departmentName: getTextField({
      label: {
        labelName: "Department Name",
        labelKey: "STORE_DETAILS_DEPARTMENT_NAME",
      },
      props: {
        className: "applicant-details-error",
        disabled: true
      },
      //pattern: getPattern("non-empty-alpha-numeric"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "purchaseOrders[0].store.department.name",
    }),
    indentDate: {
      ...getDateField({
        label: {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
        },
        placeholder: {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
        },
        pattern: getPattern("Date"),
        jsonPath: "indents[0].indentDate",
        props: {
          disabled:true,
          inputProps: {
            max: new Date().toISOString().slice(0, 10),
          }
        }
      }),
    }, 
    purchaseOrderDate: {
      ...getDateField({
        label: {
          labelName: "PO Date",
          labelKey: "STORE_PURCHASE_ORDER_DATE",
        },
        placeholder: {
          labelName: "PO Date",
          labelKey: "STORE_PURCHASE_ORDER_DATE",
        },
        required: true,
            errorMessage:"STORE_VALIDATION_PURCHASE_OREDER_DATE_SELECT",
        pattern: getPattern("Date"),
        jsonPath: "purchaseOrders[0].purchaseOrderDate",
        props: {
          inputProps: {
           max: new Date().toISOString().slice(0, 10),
          }
        }
      }),
    },
    rateType: {
      ...getSelectField({
        label: { labelName: "PO Rate Type", labelKey: "STORE_PURCHASE_ORDER_RATETYPE" },
        placeholder: {
          labelName: "Select PO Rate Type",
          labelKey: "STORE_PURCHASE_ORDER_RATETYPE_SELECT"
        },
        required: true,
            errorMessage:"STORE_VALIDATION_RATE_TYPE_SELECT",
        jsonPath: "purchaseOrders[0].rateType",
        sourceJsonPath: "createScreenMdmsData.store-asset.PORateType",
        props: {
          className: "hr-generic-selectfield",
          //  data: [
          // {
          //   code: "Gem",
          //   name: "GEM"
          // },         
          //],
          optionValue: "code",
          optionLabel: "name"
        }
      }),
      beforeFieldChange: async (action, state, dispatch) => {
        // when Type is GEM then Unit rate input by user
        if(action.value.toLocaleUpperCase() ==="GEM")
        {
         
          dispatch(prepareFinalObject("purchaseOrders[0].rateType", "Gem")); 
         //dispatch(prepareFinalObject("purchaseOrders[0].supplier.code", null));
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier",
              "props.style",
              { display: "none"  }
            )
          );
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
              "props.style",
              { display: "inline-block" }
            )
          ); 
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
              "props.style",
              { display: "inline-block" }
            )
          ); 
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
              "required",
              true
            )
          );
            dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
              "required",
              true
            )
          );
          const step = getQueryArg(window.location.href, "step"); 
          const poNumber = getQueryArg(window.location.href, "poNumber");        
          if(!step &&!poNumber)
          {
          // dispatch(
          //   handleField(
          //     `create-purchase-order`,
          //     "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
          //     "props.value",
          //     ''
          //   )
          // );
          // dispatch(
          //   handleField(
          //     `create-purchase-order`,
          //     "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
          //     "props.value",
          //     ''
          //   )
          // );
            }
        }
        else{
          let purchaseOrders = get(
            state.screenConfiguration.preparedFinalObject,
            "purchaseOrders",
            []
          );
         
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier",
              "props.style",
              { display: "inline-block",width:"40%" }
            )
          );
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
              "props.style",
              { display: "none"  }
            )
          );
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
              "props.style",
              { display: "none"  }
            )
          );
          dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
              "required",
              false
            )
          );
            dispatch(
            handleField(
              "create-purchase-order",
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
              "required",
              false
            )
          ); 
          dispatch(
            handleField(
              `create-purchase-order`,
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
              "props.value",
              ''
            )
          );
          dispatch(
            handleField(
              `create-purchase-order`,
              "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
              "props.value",
              ''
            )
          );
          if(state.screenConfiguration.preparedFinalObject.searchMaster && state.screenConfiguration.preparedFinalObject.searchMaster.supplierName)
          {
            const {supplierName} = state.screenConfiguration.preparedFinalObject.searchMaster;
            if(purchaseOrders && purchaseOrders[0])
            {
              const {supplier} = purchaseOrders[0];
              if(supplier)
              {
                const supplierObj =  supplierName.filter(ele => ele.code === supplier.code);
                if (supplierObj && supplierObj[0]){
                  dispatch(prepareFinalObject("purchaseOrders[0].supplier.name", supplierObj[0].name));         
                }
              }
            }
            
           }
        }
        
      }
    },
    deliveryTerms: getTextField({
      label: {
        labelName: "Delivery Terms",
        labelKey: "STORE_PURCHASE_ORDER_DLVRY_TERM",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter Delivery Terms",
        labelKey: "STORE_PURCHASE_ORDER_DLVRY_TERM_PLCEHLDER",
      },
      required: true,
            errorMessage:"STORE_VALIDATION_DELIVERY_TERMS",
      pattern: getSTOREPattern("Comment"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "purchaseOrders[0].deliveryTerms",
    }),
    supplier: {
      ...getSelectField({
        label: { labelName: "Supplier", labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
        placeholder: {
          labelName: "Select supplier",
          labelKey: "STORE_SUPPLIER_MASTER_NAME_SELECT"
        },
        required: true,
            errorMessage:"STORE_VALIDATION_SUPPLIER_NAME_SELECT",
            gridDefination: {
              xs: 12
            },
        jsonPath: "purchaseOrders[0].supplier.code",
        sourceJsonPath: "searchMaster.supplierName",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name"
        }
      }),
      beforeFieldChange: async (action, state, dispatch) => {
        if(action.value){
        const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "suppliers", value: action.value}];
       
        getSearchResults(queryObject, dispatch,"priceList")
        .then(response =>{
          if(response){
            const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
            const {rateType} = purchaseOrders[0];
            let priceList = [{rateContractNumber:"",rateContractDate:"",agreementNumber:"",agreementDate:"",agreementStartDate:"",agreementEndDate:""}];
           if(rateType)
           {
            if(rateType.toLocaleUpperCase() === 'GEM')
            {
              
              // priceList[0].rateContractNumber  =  "";
              // priceList[0].rateContractDate   = new Date().toISOString().slice(0, 10);
              // priceList[0].agreementNumber   =   "";
              // priceList[0].agreementDate   =   new Date().toISOString().slice(0, 10);
              // priceList[0].agreementStartDate   = new Date().toISOString().slice(0, 10);
              // priceList[0].agreementEndDate   =  new Date().toISOString().slice(0, 10);
              priceList = null

            }
            else{

              if(response.priceLists[0])
                {
                    priceList[0].rateContractNumber  =  response.priceLists[0].rateContractNumber;
                    priceList[0].rateContractDate   = new Date(response.priceLists[0].rateContractDate).toISOString().substr(0,10);
                    priceList[0].agreementNumber   =   response.priceLists[0].agreementNumber;
                    priceList[0].agreementDate   =   new Date(response.priceLists[0].agreementDate).toISOString().substr(0,10);
                    priceList[0].agreementStartDate   = new Date(response.priceLists[0].agreementStartDate).toISOString().substr(0,10);
                    priceList[0].agreementEndDate   =  new Date(response.priceLists[0].agreementEndDate).toISOString().substr(0,10);

                }
            }
          }
           
            dispatch(prepareFinalObject("searchMaster.priceList", response.priceLists));  
            dispatch(prepareFinalObject("purchaseOrders[0].priceList", priceList));    
               
           }  
           if(state.screenConfiguration.preparedFinalObject.searchMaster && state.screenConfiguration.preparedFinalObject.searchMaster.supplierName){
           const {supplierName} = state.screenConfiguration.preparedFinalObject.searchMaster;
           const supplierObj =  supplierName.filter(ele => ele.code === action.value);
           if (supplierObj && supplierObj[0]){
             dispatch(prepareFinalObject("purchaseOrders[0].supplier.name", supplierObj[0].name));         
           }
           
          }
        });     
       }
     }
    },
    supplierGem: {
      ...getTextField({
        label: { labelName: "Supplier", labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
        placeholder: {
          labelName: "Select supplier",
          labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME"
        },
        required: true,
        errorMessage:"STORE_VALIDATION_SUPPLIER_NAME",
        gridDefination: {
          xs: 6
        },
        isFieldValid:true,
        pattern: getPattern("non-empty-alpha-numeric"),
        jsonPath: "purchaseOrders[0].supplier.name",
       // sourceJsonPath: "searchMaster.supplierName",
        // props: {
        //   className: "hr-generic-selectfield",
        //   optionValue: "code",
        //   optionLabel: "name"
        // }
      }),
      beforeFieldChange: async (action, state, dispatch) => {
        if(action.value){
         // dispatch(prepareFinalObject("purchaseOrders[0].supplier.code", action.value));  
       
      }
     }
    },
    externalPoNumber: {
      ...getTextField({
        label: { labelName: "External PO Number", labelKey: "STORE_EXTERNAL_PO_NUMBER" },
        placeholder: {
          labelName: "Enter external PO number",
          labelKey: "STORE_EXTERNAL_PO_NUMBER_PLACEHOLDER"
        },
        required: true,
        errorMessage:"STORE_VALIDATION_EXTERNAL_PO_NUMBER",
        gridDefination: {
          xs: 6
        },
        pattern: getPattern("non-empty-alpha-numeric"),
       
        jsonPath: "purchaseOrders[0].externalPoNumber",
       // sourceJsonPath: "searchMaster.supplierName",
        // props: {
        //   className: "hr-generic-selectfield",
        //   optionValue: "code",
        //   optionLabel: "name"
        // }
      }),
      beforeFieldChange: async (action, state, dispatch) => {
        if(action.value){
       
      }
     }
    },
    // advancePercentage: {
    //   ...getTextField({
    //     label: {
    //       labelName: "Advance Percentage",
    //       labelKey: "STORE_PURCHASE_ORDER_ADVNC_PRCNT"
    //     },
    //     placeholder: {
    //       labelName: "Enter Advance Percentage",
    //       labelKey: "STORE_PURCHASE_ORDER_ADVNC_PRCNT_PLACEHOLDER"
    //     },
    //     pattern: getPattern("Amount"),
    //     jsonPath: "purchaseOrders[0].advancePercentage"
    //   })
    // },
    // advanceAmount: {
    //   ...getTextField({
    //     label: {
    //       labelName: "Advance Amount",
    //       labelKey: "STORE_PURCHASE_ORDER_ADVNC_AMT"
    //     },
    //     placeholder: {
    //       labelName: "Enter Advance Amount",
    //       labelKey: "STORE_PURCHASE_ORDER_ADVNC_AMTT_PLACEHOLDER"
    //     },
    //     pattern: getPattern("Amount"),
    //     jsonPath: "purchaseOrders[0].advanceAmount"
    //   })
    // },
    expectedDeliveryDate: {
      ...getDateField({
        label: {
          labelName: "Expected Delivery Date",
          labelKey: "STORE_PURCHASE_ORDER_EXPCT_DLVRY_DT"
        },
        placeholder: {
          labelName: "Enter Expected Delivery Date",
          labelKey: "STORE_PURCHASE_ORDER_EXPCT_DLVRY_DT"
        },
        required: true,
            errorMessage:"STORE_VALIDATION_EXPECTED_DELIVERY_DATE",
        pattern: getPattern("Date"),
        jsonPath: "purchaseOrders[0].expectedDeliveryDate",
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          }
        }
      })
    },

    paymentTerms: getTextField({
      label: {
        labelName: "Payment Terms",
        labelKey: "STORE_PURCHASE_ORDER_PYMNT_TERM",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter Payment Terms",
        labelKey: "STORE_PURCHASE_ORDER_PYMNT_TERM_PLCEHLDER",
      },
      pattern: getSTOREPattern("Comment"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "purchaseOrders[0].paymentTerms",
    }),

    // status: {
    //   ...getTextField({
    //     label: {
    //       labelName: "PO Status",
    //       labelKey: "STORE_PURCHASE_ORDER_STATUS"
    //     },
    //     placeholder: {
    //       labelName: "Enter PO Status",
    //       labelKey: "STORE_PURCHASE_ORDER_STATUS_PLCEHLDER"
    //     },
    //     props: {
    //       disabled: true
    //     },
    //    // pattern: getPattern("Email"),
    //     jsonPath: "purchaseOrders[0].status"
    //   })
    // },
    createdBy: {
      ...getTextField({
        label: {
          labelName: "Created by",
          labelKey: "STORE_PURCHASE_ORDER_CREATEBY"
        },
        placeholder: {
          labelName: "Enter Created By",
          labelKey: "STORE_PURCHASE_ORDER_CREATEBY_PLCEHLDER"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "purchaseOrders[0].poCreatedBy"
      })
    },
    designation: {
      ...getTextField({
        label: {
          labelName: "Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "purchaseOrders[0].designation"
      })
    },
    remarks: getTextField({
      label: {
        labelName: "Remarks",
        labelKey: "STORE_PURCHASE_ORDER_REMARK",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter Remarks",
        labelKey: "STORE_PURCHASE_ORDER_REMARK_PLCEHLDER",
      },
      pattern: getSTOREPattern("Comment"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "purchaseOrders[0].remarks",
    }),
  })
});

