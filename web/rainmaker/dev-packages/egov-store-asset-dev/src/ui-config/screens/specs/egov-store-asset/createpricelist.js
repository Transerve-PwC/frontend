import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./createpricelistResource/footer";
  import { getstoreTenantId ,getsuppliersSearchResults} from "../../../../ui-utils/storecommonsapi";
  import { getSearchResults} from "../../../../ui-utils/commons";
  import { SupplierDetails } from "./createpricelistResource/Supplier-Details"; 
  import { MaterialPriceDetails } from "./createpricelistResource/Material-price-map"; 
  import { documentDetails } from "./createpricelistResource/documentDetails";
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import {
    prepareDocumentsUploadData,
    
  } from "../../../../ui-utils/storecommonsapi";
  export const stepsData = [
    { labelName: "Supplier Details", labelKey: "STORE_PRICE_SUPPLIER_DETAILS" },
    { labelName: "Price List for Material Name Details",  labelKey: "STORE_PRICE_PRICE_LIST_FOR_MATERIAL_NAME_DETAILS" },
    //{ labelName: "Documents", labelKey: "STORE_PRICE_LIST_DOCUMENTS" },
   
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Create Material Master`,
      labelKey: "STORE_COMMON_CREATE_PRICE_LIST_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
        SupplierDetails
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      documentDetails,
        MaterialPriceDetails
    },
    visible: false
  };

  // export const formwizardThirdStep = {
  //   uiFramework: "custom-atoms",
  //   componentPath: "Form",
  //   props: {
  //     id: "apply_form3"
  //   },
  //   children: {
  //     documentDetails
  //   },
  //   visible: false
  // };

 
  
  const getMdmsData = async (state, dispatch, tenantId) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material" },
              { name: "RateType", },
              { name: "MaterialType"},
            ],
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "UOM",
                filter: "[?(@.active == true)]"
              },
              
            ]
          },
          {
            moduleName: "ACCESSCONTROL-ROLES",
            masterDetails: [
              {
                name: "roles",
                filter: "$.[?(@.code!='CITIZEN')]"
              }
            ]
          },
         
         
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
      // document type 
      //set url in case of edit

      let fileUrl =
      get(state, "screenConfiguration.preparedFinalObject.documentsPreview[0].link",'') 

      const step = getQueryArg(window.location.href, "step");
      const id = getQueryArg(window.location.href, "id");
      if(!step && !id){
        fileUrl = '';
        dispatch(
          prepareFinalObject("documentsUploadRedux[0].documents", null)
          );
      }
     let  DocumentType_PriceList= [
        {
            code: "STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION",
            isMandatory: true, 
            required:true,
            documentType:"STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION"  , 
            url: fileUrl,       
            active: true
        },]
        dispatch(
          prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes"))
        );
      dispatch(
        prepareFinalObject("DocumentType_PriceList", DocumentType_PriceList)
      );
      prepareDocumentsUploadData(state, dispatch, 'pricelist');
      setRolesList(state, dispatch);
      setHierarchyList(state, dispatch);
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  const getstoreData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getSearchResults(queryObject, dispatch,"supplier");
      dispatch(prepareFinalObject("supplier", response));
    } catch (e) {
      console.log(e);
    }
  };
  const getYearsList = (startYear, state, dispatch) => {
    var currentYear = new Date().getFullYear(),
      years = [];
    startYear = startYear || 1980;
  
    while (startYear <= currentYear) {
      years.push({ value: (startYear++).toString() });
    }
  
    dispatch(prepareFinalObject("yearsList", years));
  };
  
  const setRolesList = (state, dispatch) => {
    let rolesList = get(
      state.screenConfiguration.preparedFinalObject,
      `createScreenMdmsData.ACCESSCONTROL-ROLES.roles`,
      []
    );
    let furnishedRolesList = rolesList.filter(item => {
      return item.code;
    });
    dispatch(
      prepareFinalObject(
        "createScreenMdmsData.furnishedRolesList",
        furnishedRolesList
      )
    );
  };
  
  const setHierarchyList = (state, dispatch) => {
    let tenantBoundary = get(
      state.screenConfiguration.preparedFinalObject,
      `createScreenMdmsData.egov-location.TenantBoundary`,
      []
    );
    let hierarchyList = map(tenantBoundary, "hierarchyType", []);
    dispatch(
      prepareFinalObject("createScreenMdmsData.hierarchyList", hierarchyList)
    );
  };
  
  const freezeEmployedStatus = (state, dispatch) => {
    let employeeStatus = get(
      state.screenConfiguration.preparedFinalObject,
      "Employee[0].employeeStatus"
    );
    if (!employeeStatus) {
      dispatch(prepareFinalObject("Employee[0].employeeStatus", "EMPLOYED"));
    }
  };
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `createpricelist`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
     
      const tenantId = getstoreTenantId();
      const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
      const storedata = getstoreData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
      const id = getQueryArg(window.location.href, "id");
      if(!step && !id){
        dispatch(prepareFinalObject("priceLists[0]",null));
        dispatch(prepareFinalObject("priceLists[0].active",true));

      }
      //let employeeCode = getQueryArg(window.location.href, "employeeCode");
     // employeeCode && getEmployeeData(state, dispatch, employeeCode, tenantId);
      // getYearsList(1950, state, dispatch);
      // freezeEmployedStatus(state, dispatch);
      // if (mdmsDataStatus) {
      //   setHierarchyList(state, dispatch);
      // }
      //   dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
      //   dispatch(prepareFinalObject("LicensesTemp", []));
      //   // getData(action, state, dispatch);
      //   getData(action, state, dispatch).then(responseAction => {
      //     const queryObj = [{ key: "tenantId", value: tenantId }];
      //     getBoundaryData(action, state, dispatch, queryObj);
      //     let props = get(
      //       action.screenConfig,
      //       "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
      //       {}
      //     );
      //     props.value = tenantId;
      //     props.disabled = true;
      //     set(
      //       action.screenConfig,
      //       "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
      //       props
      //     );
      //     dispatch(
      //       prepareFinalObject(
      //         "Licenses[0].tradeLicenseDetail.address.city",
      //         tenantId
      //       )
      //     );
      //     //hardcoding license type to permanent
      //     set(
      //       action.screenConfig,
      //       "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicenseType.props.value",
      //       "PERMANENT"
      //     );
      //   });
  
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
         // formwizardThirdStep,
         
         
          footer
        }
      }
      // breakUpDialog: {
      //   uiFramework: "custom-containers-local",
      //   componentPath: "ViewBreakupContainer",
      //   props: {
      //     open: false,
      //     maxWidth: "md",
      //     screenKey: "apply"
      //   }
      // }
    }
  };
  
  export default screenConfig;
  



