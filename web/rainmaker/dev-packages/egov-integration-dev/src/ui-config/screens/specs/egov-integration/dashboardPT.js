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
  import { validateFields, getTextToLocalMapping } from "../utils";
  import { getSearchPensioner,getPTPattern } from "../../../../ui-utils/commons";
  import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import store from "../../../../ui-redux/store";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  import {
    getTenantId,getUserInfo
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
      const textFields = ["propertyTaxId","code",];
      for (let i = 0; i < textFields.length; i++) {
        if (
          `state.screenConfiguration.screenConfig.dashboardPT.components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}.props.value`
        ) {
          dispatch(
            handleField(
              "dashboardPT",
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
  let isSearchBoxFirstRowValid = validateFields(
    "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
    state,
    dispatch,
    "dashboardPT"
  );
  
  //isSearchBoxFirstRowValid = true;
  if( Object.keys(searchScreenObject).length == 2 )
  {
    const fields = get(
      state.screenConfiguration.screenConfig[`dashboardPT`],
      "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
      {}
    );
    if(fields.code!==undefined )
    {
      if(fields.code.isFieldValid ===false)
      {
        if(fields.code.props.style.display ==="none")
        {
          isSearchBoxFirstRowValid = true;
        }
        else
        {
          isSearchBoxFirstRowValid = false;
        }

      }
     
      else
      isSearchBoxFirstRowValid = true;

    }
    
  }
  else if( Object.keys(searchScreenObject).length == 1 )
  {
    const fields = get(
      state.screenConfiguration.screenConfig[`dashboardPT`],
      "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
      {}
    );
    if(fields.propertyTaxId!==undefined )
    {
      if(fields.propertyTaxId.isFieldValid ===false)
      {      
      isSearchBoxFirstRowValid = false;
      }
      else
      {
        if(fields.propertyTaxId.isFieldValid ===false)
        {
        isSearchBoxFirstRowValid = false;
        }
        else
       {
        isSearchBoxFirstRowValid = true;
       }
      }
    

    }
    
  }

  if( Object.keys(searchScreenObject).length == 0 )
  {
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
  else  if (!(isSearchBoxFirstRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please enter valid property Id",
          labelKey: "INTIGRATION_ERR_FILL_VALID_FIELDS_PT_CODE"
        },
        "error"
      )
    );
  }
  else
  {
    let uid ='';
    if( Object.keys(searchScreenObject).length == 1 )
  {
    let propertyTaxId = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreen.propertyTaxId",
      null
    );
    uid = propertyTaxId
  }
  else if( Object.keys(searchScreenObject).length == 2 )
  {
    let code = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreen.code",
      null
    );
    let propertyTaxId = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreen.propertyTaxId",
      null
    );
    const fields = get(
      state.screenConfiguration.screenConfig[`dashboardPT`],
      "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
      {}
    );
    if(fields.code.props.style.display ==="none")
    {
      uid = propertyTaxId
    }
    else{
      uid = code
    }
    
  }
  // for (var key in searchScreenObject) {  
    
  //   queryObject.push({ key: key, value: (searchScreenObject[key]) });
  //   if(key ==="code")
  //   {
  //     uid=searchScreenObject[key].trim();
  //   }
  //   else{
  //     uid=searchScreenObject[key].trim();
  //   }
    
  // }
  

  
  dispatch(toggleSpinner())
  try {
    let payload =[];
  
   let Responce = await httpRequest(
      "post",
      "integration-services/pt/v1/_get",
      "_get",    
      [],
        {
          tenantId: "ch",
          uid: `${uid}`
        }
    );
  
  // payload = InventoryData()
  // dispatch(prepareFinalObject("InventoryData", payload));
  if(Responce)
  {
    if(get(Responce,"ResponseBody",[]))
    {
    dispatch(prepareFinalObject("APIData", get(Responce,"ResponseBody",[])));
    // call save api /integration-services/pt-mapping/v1/_save if input id not exist in List
    // get integration-services/pt-mapping/v1/_get
    let {result} = state.screenConfiguration.preparedFinalObject.searchScreenMdmsData;
    let uidExist = false;
    // check id in list
    if(result)
    {
      result = result.filter(x=>x.propertyTaxId == uid)
      if(result.length >0)
      uidExist = true;
    }
    // call save api
    if(!uidExist)
    {
      try
      {
        const userInfo = JSON.parse(getUserInfo());
      let  payload = await httpRequest(
          "post",
          "/integration-services/pt-mapping/v1/_save",
          "_save",    
          [],
            {
              
              PtMappingRequest:{
                userId:userInfo.id,
                propertyTaxId:`${uid}`,
                tenantId: "ch",
              }
            }
        );
        if(payload)
        {
          await getMdmsData(state, dispatch);
        }

      }
      catch(error)
      {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: error.message, labelKey: error.message },
            "error"
          )
        );

      }
  }

    dispatch(toggleSpinner())
    }
    else
    {
     let  APIData =[] 
     dispatch(prepareFinalObject("APIData",APIData));
     dispatch(toggleSpinner())
    }
  }
  else{
    let  APIData =[] 
     dispatch(prepareFinalObject("APIData",APIData));
     dispatch(toggleSpinner())

  }
 
    console.log(payload)
  
  return payload
  
  } catch (error) {
    console.log(error);
    let  APIData =[] 
    if(error.message ==="An unhandled exception occurred on the server")
    {
      
            const errorMessage = {
              labelName: "Enter Valid property tax id",
              labelKey:   `INTIGRATION_ERR_FILL_VALID_FIELDS_PT_CODE`
              
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    else{
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
    }
 
     dispatch(prepareFinalObject("APIData",APIData));
     dispatch(toggleSpinner())
  }
  }
  
  
  }
  const addPropertyIdHandle = async (state, dispatch) => {
    console.log('call api to add property id seasrch');
  };
  export const getData = async (action, state, dispatch) => {
   
    await getMdmsData(state, dispatch);
    
     //fetching store name
    //  const queryObject = [{ key: "tenantId", value: getTenantId()  }];
    //  getSearchResults(queryObject, dispatch,"storeMaster")
    //  .then(response =>{
    //    if(response){
    //      const storeNames = response.stores.map(item => {
    //        let code = item.code;
    //        let name = item.name;
    //        let department = item.department.name;
    //        let divisionName = item.divisionName;
    //        return{code,name,department,divisionName}
    //      } )
    //      dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
    //    }
    //  });
  };
  const getMdmsData = async (state, dispatch) => {
    const tenantId =  getstoreTenantId();
    let mdmsBody = {
      userInfo: {
        id: 323,
       
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/integration-services/pt-mapping/v1/_get",
        "_get",
        [],
        mdmsBody
      );
      if(response)
      {
        dispatch(prepareFinalObject("searchScreenMdmsData",response.ResponseBody))
      }
     //dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "ResponseBody.result")));
      const {result} = state.screenConfiguration.preparedFinalObject.searchScreenMdmsData;
      result.push(
        {
          propertyTaxId:"others",
          isActive:true,
          userId:0
        }
      )
      dispatch(prepareFinalObject("searchScreenMdmsData.result",result))
      // if(result)
      // {
      //   result.push(
      //     {
      //       propertyTaxId:"others",
      //       isActive:true,
      //       userId:0
      //     }
      //   )
      //   dispatch(prepareFinalObject("searchScreenMdmsData.result",result))
      // }
      // else{
      //   result.push(
      //     {
      //       propertyTaxId:"others",
      //       isActive:true,
      //       userId:0
      //     }
      //   )
      //   dispatch(prepareFinalObject("searchScreenMdmsData.result",result))

      // }
  
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  
  const header = getCommonHeader({
    labelName: "RTI Data",
    labelKey: "PT_DATA_HEADER"
  });
  const RegisterReviewResult = {
    uiFramework: "material-ui",
    name: "dashboardPT",
    beforeInitScreen: (action, state, dispatch) => {
    //  resetFields(state, dispatch);
      const tenantId = getTenantId();   
      dispatch(prepareFinalObject("searchScreen",{}));
      getData(action, state, dispatch).then(responseAction => {
      
      }); 
         
  let  APIData =[] 
  dispatch(prepareFinalObject("APIData",APIData)); 
  dispatch(
    handleField(
    "dashboardPT",
    `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code`,
    "props.style",
    { display: "none" }
    )
    );
    set(
      action.screenConfig,
      "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code.props.style",
      { display: "none" }
    );
    set(
      action.screenConfig,
      "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.newPropertycodePTButton.props.style",
      { display: "none" }
    );
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
          propertyTaxId: {
            ...getSelectField({
              label: { labelName: "property Tax Id", labelKey: "PT_CODE" },
              placeholder: {
                labelName: "Select property Tax Id",
                labelKey: "PT_CODE"
              },
              gridDefination: {
                xs: 12,
                sm: 4,
              },
              required: true,
              jsonPath: "searchScreen.propertyTaxId",
              sourceJsonPath: "searchScreenMdmsData.result",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "propertyTaxId",
                optionLabel: "propertyTaxId"
              }
            }),
            beforeFieldChange: (action, state, dispatch) => {
              if(action.value)
              {
                if(action.value.toUpperCase() === "OTHERS")
                {
                  dispatch(
                  handleField(
                  "dashboardPT",
                  `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code`,
                  "props.style",
                  { display: "inline-block" }
                  )
                  );
                  dispatch(
                    handleField(
                    "dashboardPT",
                    `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.newPropertycodePTButton`,
                    "props.style",
                    { display: "inline-block" }
                    )
                    );
                }
                else{
                  dispatch(
                    handleField(
                    "dashboardPT",
                    `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code`,
                    "props.style",
                    { display: "none" }
                    )
                    );
                    dispatch(
                      handleField(
                      "dashboardPT",
                      `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.newPropertycodePTButton`,
                      "props.style",
                      { display: "none" }
                      )
                      );

                      dispatch(
                        handleField(
                          "dashboardPT",
                          `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code`,
                          "props.value",
                          ""
                        )
                      );
                }

              }
            }
          },
          code: {
            ...getTextField({
              label: { labelName: "Code", labelKey: "PT_CODE" },
              placeholder: {
                labelName: "Enter Code",
                labelKey: "PT_CODE"
              },
              required: true,
              jsonPath: "searchScreen.code",
             pattern: getPTPattern("PropertycodePT"),
              gridDefination: {
                xs: 12,
                sm: 4,
              },
               
            })
          },
          // newPropertycodePTButton: {
          //   componentPath: "Button",
          //   gridDefination: {
          //     xs: 12,
          //     sm: 4,
          //     align: "left",
          //     style: {
          //       paddingTop:"16px"
                
          //     },
          //   },
          //   visible: false,
          //   props: {
          //     variant: "contained",
          //     color: "primary",
          //     style: {
          //       color: "white",
          //       borderRadius: "2px",
          //       // width: "250px",
          //       // height: "48px",
          //     },
          //   },

          //   children: {
          //     plusIconInsideButton: {
          //       uiFramework: "custom-atoms",
          //       componentPath: "Icon",
          //       props: {
          //         iconName: "add",
          //         style: {
          //           fontSize: "24px",
          //         },
          //       },
          //     },

          //     // buttonLabel: getLabel({
          //     //   labelName: "Add Purchase Order",
          //     //   labelKey: "STORE_ADD_NEW_PURCHASE_ORDR_BUTTON",
          //     // }),
          //   },
          //   onClickDefination: {
          //     action: "condition",
          //     callBack: addPropertyIdHandle,
          //   },
          //   // roleDefination: {
          //   //   rolePath: "user-info.roles",
          //   //   roles: roles
          //   // }
          // }, 
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
              labelKey: "COMMON_RESET_BUTTON",
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
              labelKey: "COMMON_SEARCH_BUTTON",
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
            moduleName: "egov-integration",
              props: {
                dataPath: "records",
                moduleName: "RTI",
                pageName:"INTIGRATION_PT",
  
              }
          },
  
       
         
        }
      },
      
    }
  };
  
  export default RegisterReviewResult;
  