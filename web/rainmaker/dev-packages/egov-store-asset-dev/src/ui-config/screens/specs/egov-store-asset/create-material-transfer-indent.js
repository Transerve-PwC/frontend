import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { footer } from "./createMaterialTransferIndentResource/footer";
  import {MTIHeader  } from "./createMaterialTransferIndentResource/MTIHeader";
  import { MTIDetails } from "./createMaterialTransferIndentResource/MTIDetails";
  import { poApprovalInfo } from "./createMaterialTransferIndentResource/poApprovalInfo";
  import {totalIndentValue} from "./createMaterialTransferIndentResource/totalIndentValue";
  import commonConfig from '../../../../config/common';

  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  export const stepsData = [
    { labelName: "Material Transfer Indent", labelKey: "STORE_MTI_HEADER" },
    { labelName: "Material Transfer Indent Details", labelKey: "STORE_MTI_DETAILS_HEADER" },
    { labelName: "Approval Information", labelKey: "STORE_PO_APPROVAL_INFO_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Material Transfer Indent`,
      labelKey: "STORE_MTI_CREATE_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
     MTIHeader
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      MTIDetails,
      //totalIndentValue
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
              { name: "Material" }, //filter: "[?(@.active == true)]" },
              { name: "InventoryType", filter: "[?(@.active == true)]" },
              { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
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
  const getstoreData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getSearchResults(queryObject, dispatch,"storeMaster");
      dispatch(prepareFinalObject("store", response));       
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);
    await getstoreData(action, state, dispatch);
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "create-material-transfer-indent",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
           // SEt Default data Start
     dispatch(prepareFinalObject("indents[0].indentType", "Transfer Indent"));
     dispatch(prepareFinalObject("indents[0].designation", "MD",));
     dispatch(prepareFinalObject("indents[0].materialHandOverTo", "",));
     dispatch(prepareFinalObject("indents[0].inventoryType", "",));
     dispatch(prepareFinalObject("indents[0].expectedDeliveryDate", 1609353000000,));//31 DEC 2020
      
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
  