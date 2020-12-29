import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getLabelWithValue,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
//import { DOEApplyApplication} from "./applydoeResources/DOEApplyApplication";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchPensioner,getPMSPattern } from "../../../../ui-utils/commons";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  InventoryData
  } from "../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../ui-utils";
  import { getSearchResults } from "../../../../ui-utils/commons"; 
  const resetFields = (state, dispatch) => {
    const textFields = ["storeName","materialName",];
    for (let i = 0; i < textFields.length; i++) {
      if (
        `state.screenConfiguration.screenConfig.InvenrtyRegister.components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}.props.value`
      ) {
        dispatch(
          handleField(
            "InvenrtyRegister",
            `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}`,
            "props.value",
            ""
          )
        );
      }
    }
    dispatch(prepareFinalObject("searchScreen", {}));
  }; 
const ActionSubmit = async (state, dispatch) => {
  let queryObject = [
  {
    key: "tenantId",
    value: getTenantId()
  }
 
];
let searchScreenObject = get(
  state.screenConfiguration.preparedFinalObject,
  "searchScreen",
  {}
);
if( Object.keys(searchScreenObject).length == 0 )
{
  const textFields = ["storeName","materialName",];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.InvenrtyRegister.components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "OpenningBalence",
          `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Please fill at least one field to start search",
        labelKey: "ERR_FILL_ALL_FIELDS"
      },
      "warning"
    )
  );
}
else
{

for (var key in searchScreenObject) {  
  
  queryObject.push({ key: key, value: (searchScreenObject[key]) });
}

queryObject.push({
  key: "isprint",
  value: false
});

try {
  let payload =[];

 let Responce = await httpRequest(
    "post",
    "/store-asset-services/receiptnotes/_inventoryreport",
    "_inventoryreport",    
    queryObject
  );

payload = InventoryData()
dispatch(prepareFinalObject("InventoryData", payload));
if(get(Responce,"printData",[]))
dispatch(prepareFinalObject("InventoryAPIData", get(Responce,"printData",[])));
else
{
 let  InventoryAPIData =[] 
 dispatch(prepareFinalObject("InventoryAPIData",InventoryAPIData));
}
  console.log(payload)


  


return payload

} catch (e) {
  console.log(e);
}
}


}

export const getData = async (action, state, dispatch) => {
 
  await getMdmsData(state, dispatch);
  
   //fetching store name
   const queryObject = [{ key: "tenantId", value: getTenantId()  }];
   getSearchResults(queryObject, dispatch,"storeMaster")
   .then(response =>{
     if(response){
       const storeNames = response.stores.map(item => {
         let code = item.code;
         let name = item.name;
         let department = item.department.name;
         let divisionName = item.divisionName;
         return{code,name,department,divisionName}
       } )
       dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
     }
   });
};
const getMdmsData = async (state, dispatch) => {
  const tenantId =  getstoreTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material", },
           
          ],
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
    dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "MdmsRes"))
    );

    return true;
  } catch (e) {
    console.log(e);
  }
};

const header = getCommonHeader({
  labelName: "Inventory Register",
  labelKey: "STORE_INVENTORY_REGISTER"
});
const RegisterReviewResult = {
  uiFramework: "material-ui",
  name: "InvenrtyRegister",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();   
    dispatch(prepareFinalObject("searchScreen",{}));
    let  InventoryAPIData =[] 
    dispatch(prepareFinalObject("InventoryAPIData",InventoryAPIData));
    getData(action, state, dispatch).then(responseAction => {
    
    }); 
       //get Eployee details data       
// prepareEditFlow(state, dispatch,  tenantId).then(res=>
//   {
//   }
// );
    
        return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "review"
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
 
    SearchCard: getCommonCard({

      appPRSearchContainer: getCommonContainer({
        storeName: {
          ...getSelectField({
            label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
            placeholder: {
              labelName: "Select Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
            },
            required: true,
            jsonPath: "searchScreen.storecode",
            sourceJsonPath: "searchMaster.storeNames",
            errorMessage: "STORE_VALIDATION_STORE_NAME_SELECT",
            props: {
              disabled : false,
              className: "hr-generic-selectfield",
              optionValue: "code",
              optionLabel: "name"
            }
          }),

        },
        materialName: getSelectField({
          label: { labelName: "Material  Name", labelKey: "STORE_MATERIAL_NAME" },
          placeholder: {
            labelName: "Select Materila  Name",
            labelKey: "STORE_MATERIAL_NAME_SELECT",
          },
          required: true,
          jsonPath: "searchScreen.material",
          errorMessage: "STORE_VALIDATION_MATERIAL_NAME_SELECT",
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          sourceJsonPath: "searchScreenMdmsData.store-asset.Material",
          props: {
            optionValue: "code",
            optionLabel: "name",
          },
         
        }),
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "STORE_COMMON_RESET_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "STORE_COMMON_SEARCH_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: ActionSubmit,
        },
      },
    }),
  }),

    }),
 
  breakAfterSearch: getBreak(),
        PensionReviewBottom: {
          uiFramework: "custom-containers-local",        
          componentPath: "InventoryContainer",
          moduleName: "egov-store-asset",
            props: {
              dataPath: "InventoryData",
              moduleName: "STORE_ASSET",
              pageName:"INVENTRY"
            }
        },

     
       
      }
    },
    
  }
};

export default RegisterReviewResult;
