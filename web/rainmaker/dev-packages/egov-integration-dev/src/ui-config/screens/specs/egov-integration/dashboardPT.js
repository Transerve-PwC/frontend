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
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
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

    const redirecthouse = async (state, dispatch) => {
      dispatch(setRoute(`/egov-integration/search-house`));
    };
    const resetFields = (state, dispatch) => {
      const textFields = ["propertyTaxId","code","mobileNo","otp" ];
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
      dispatch(
        handleField(
          `dashboardPT`,
          "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.validateOTPButton",
          "props.style",
          { display: "none" }
        )
      );
      dispatch(
        handleField(
          `dashboardPT`,
          "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.searchButton",
          "props.style",
          { display: "inline-block",marginTop:"8px" }
        )
      );
      dispatch(
        handleField(
        "dashboardPT",
        `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.otp`,
        "props.style",
        { display: "none" }
        )
        );
        dispatch(
          handleField(
          "dashboardPT",
          `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code`,
          "props.style",
          { display: "none" }
          )
          );
      dispatch(prepareFinalObject("searchScreen", {}));
     
      dispatch(prepareFinalObject("APIData", []));
      // dispatch(
      //   handleField(
      //     `dashboardPT`,
      //     "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
      //     "label",
      //     { labelName: "property Tax Id", labelKey: "PT_CODE"  }
      //   )
      // );
      // dispatch(
      //   handleField(
      //     `dashboardPT`,
      //     "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer",
      //     "props",
      //     { disabled : false, }
      //   )
      // );
      // set(
      //   action.screenConfig,
      //   "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.props",
      //   { disabled : false, }
      // );
      dispatch(
        handleField(
          `dashboardPT`,
          "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
          "props.disabled",
            false
        )
      );
      dispatch(
        handleField(
          `dashboardPT`,
          "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.propertyTaxId",
          "props.disabled",
            false
        )
      );
      dispatch(
        handleField(
          `dashboardPT`,
          "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.mobileNo",
          "props.disabled",
            false
        )
      );
      
    }; 
    const ValidateOTP = async (state, dispatch) => {
     
      let ValidateOTPobj = get(
        state.screenConfiguration.preparedFinalObject,
        "getOTP.ResponseBody[0]",
        {}
      );
      let searchScreenObject = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreen",
        {}
      );
      let OtpValid = false
      const fields = get(
        state.screenConfiguration.screenConfig[`dashboardPT`],
        "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
        {}
      );
      if(fields.otp!==undefined )
    {
      if(fields.otp.isFieldValid ===false)
      {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Enter valid OTP",
              labelKey: "INTIGRATION_OTP_INPUT_VALIDATION"
            },
            "warning"
          )
        );

      }
      else{
        if(ValidateOTPobj.OTP === searchScreenObject.otp)
        OtpValid = true
        else{
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Incorrect OTP",
                labelKey: "INTIGRATION_OTP_INPUT_COMPARE_VALIDATION"
              },
              "warning"
            )
          );

        }

      }
    } 
    let uid ='';
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
    
    if(fields.code.props.style.display ==="none")
    {
      uid = propertyTaxId
    }
    else{
      uid = code
    }
      if(OtpValid)
      {
      const requestBody = {
        uid:uid,
        otp:searchScreenObject.otp,
        mobileNo:searchScreenObject.mobileNo,
        TokenId:ValidateOTPobj.TokenId,
      }
      dispatch(toggleSpinner())
      let response = await getSearchResults([],requestBody, dispatch, "verifyOTP");
      if(response)
      {
        dispatch(
          handleField(
            `dashboardPT`,
            "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.validateOTPButton",
            "props.style",
            { display: "none" }
          )
        );
        dispatch(
          handleField(
          "dashboardPT",
          `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.otp`,
          "props.style",
          { display: "none" }
          )
          );

            if(get(response,"ResponseBody",[]))
            {
            dispatch(prepareFinalObject("APIData", get(response,"ResponseBody",[])));
            }
            dispatch(toggleSpinner())
        //GetData(state, dispatch)
         // call save api
        let {result} = state.screenConfiguration.preparedFinalObject.searchScreenMdmsData;
        let uidExist = false;
        // check id in list
        if(result)
        {
          result = result.filter(x=>x.propertyTaxId == uid)
          if(result.length >0)
          uidExist = true;
        }
       
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
      }
    }
    }
    const GetOTP = async (state, dispatch) => {
      let searchScreenObject = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreen",
        {}
      );
      if(searchScreenObject.mobileNo !== undefined && searchScreenObject.code !== undefined )
      {
     
let validmobileNo = false;
let validcode = false;
      const fields = get(
        state.screenConfiguration.screenConfig[`dashboardPT`],
        "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
        {}
      );
      if(fields.code!==undefined )
      {
        if(fields.code.isFieldValid ===false)
        { 
          if(fields.code.props.style.display !=="none")
          {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please enter valid property Id",
                labelKey: "INTIGRATION_ERR_FILL_VALID_FIELDS_PT_CODE"
              },
              "warning"
            )
          );
          validcode = false;
          return;
            }
            else{
              validcode = true;
            }
          
        }
        if(fields.code.isFieldValid ===true)
        {
          validcode = true
        }
        else{
          if(fields.code.props.style.display ==="none")
          {
            validcode = true
          }
          else{
            validcode = false
          }
          

        }
      }
       if(fields.mobileNo!==undefined )
      {
        if(fields.mobileNo.isFieldValid ===false)
        { 
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please enter mobile Number",
                labelKey: "INTIGRATION_ERR_FILL_VALID_FIELDS_PT_MOBIL_NUMBER"
              },
              "warning"
            )
          );
          validmobileNo = false;
          return;
        }
        else{
          validmobileNo = true;
        }
      }
      if(validmobileNo && validcode)
      {
        let uid ='';
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
        
        if(fields.code.props.style.display ==="none")
        {
          uid = propertyTaxId
        }
        else{
          uid = code
        }
        const requestBody = {
          uid:uid,
          mobileNo:searchScreenObject.mobileNo,
        }
        dispatch(toggleSpinner())
        let response = await getSearchResults([],requestBody, dispatch, "getOTP");
        if(response)
        {
          if(response.ResponseBody[0].Status ==='F')
          {
            const errorMessage = {
              labelName: "Please select the Minority",
              labelKey: response.ResponseBody[0].Msg
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.validateOTPButton",
                "props.style",
                { display: "none" }
              )
            );
            dispatch(
              handleField(
              "dashboardPT",
              `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.otp`,
              "props.style",
              { display: "none" }
              )
              );

          }
          else  if(response.ResponseBody[0].Status ==='S')
          {
            const errorMessage = {
              labelName: "Please select the Minority",
              labelKey: response.ResponseBody[0].Msg
            };
            dispatch(toggleSnackbar(true, errorMessage, "success"));

            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.validateOTPButton",
                "props.style",
                { display: "inline-block",marginTop:"8px" }
              )
            );
            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.searchButton",
                "props.style",
                { display: "none" }
              )
            );
            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.otp",
                "props.style",
                { display: "inline-block" }
              )
            );
            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
               "props.disabled",
                true
              )
            );
            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.propertyTaxId",
                "props.disabled",
                true
              )
            );
            dispatch(
              handleField(
                `dashboardPT`,
                "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.mobileNo",
                "props.disabled",
                true
              )
            );


          }
          
          dispatch(prepareFinalObject("getOTP",response));
          dispatch(toggleSpinner())
        }
      }
      else{
        if(!validmobileNo)
        {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please enter mobile Number",
                labelKey: "INTIGRATION_ERR_FILL_VALID_FIELDS_PT_MOBIL_NUMBER"
              },
              "warning"
            )
          );

        }
        else if(!validcode)
        {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please enter valid property Id",
                labelKey: "INTIGRATION_ERR_FILL_VALID_FIELDS_PT_CODE"
              },
              "warning"
            )
          );

        }

      }
        }
        else{
          if(searchScreenObject.code === undefined)
          {
            dispatch(
              toggleSnackbar(
                true,
                {
                  labelName: "Please enter valid property Id",
                  labelKey: "INTIGRATION_ERR_FILL_VALID_FIELDS_PT_CODE"
                },
                "warning"
              )
            );
          }
          else if (searchScreenObject.mobileNo === undefined)

          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please enter mobile Number",
                labelKey: "INTIGRATION_ERR_FILL_FIELDS_PT_MOBIL_NUMBER"
              },
              "warning"
            )
          );


        }
     
    }
  const GetData = async (state, dispatch) => {
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
      const propertyTaxId = getQueryArg(
        window.location.href,
        "propertyId"
      );
      getData(action, state, dispatch).then(responseAction => {

        dispatch(prepareFinalObject("searchScreen.code",propertyTaxId));
        dispatch(prepareFinalObject("searchScreen.propertyTaxId","others"));
      
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
    if(propertyTaxId)
    {
    set(
      action.screenConfig,
      "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code.props.style",
      { display: "inline-block" }
    );
    dispatch(
          handleField(
            `dashboardPT`,
            "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
            "props.value",
            propertyTaxId
          )
        );
        dispatch(
          handleField(
            `dashboardPT`,
            "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
            "isFieldValid",
            true  
          )        
        );
        set(
          action.screenConfig,
          "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.validateOTPButton.props.style",
          { display: "none" }
        );
        set(
          action.screenConfig,
          "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.otp.props.style",
          { display: "none" }
        );
    }
    else{
     
      set(
        action.screenConfig,
        "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code.props.style",
        { display: "inline-block" }
      );
      set(
        action.screenConfig,
        "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.mobileNo.props.style",
        { display: "inline-block" }
      );
      set(
        action.screenConfig,
        "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.otp.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.SearchCard.children.cardContent.children.button.children.buttonContainer.children.validateOTPButton.props.style",
        { display: "none" }
      );
      // set(
      //   action.screenConfig,
      //   "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
      //   "isFieldValid",
      //   false
      // );
      // dispatch(
      //   handleField(
      //     `dashboardPT`,
      //     "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.code",
      //     "isFieldValid",
      //     false
      //   )
      // );


    }
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
              newApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right",
                },
                visible: process.env.REACT_APP_NAME === "Employee"? false : true,
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
                     // iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Search By HouseNo",
                    labelKey: "INTIGRATION_SEARCH_BY_HOUSE",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: redirecthouse,
                },
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
                sm: 6,
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
                    dispatch(
                      handleField(
                      "dashboardPT",
                      `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.mobileNo`,
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
                      `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.mobileNo`,
                      "props.style",
                      { display: "inline-block" }
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
              isFieldValid:true,
             pattern: getPTPattern("PropertycodePT"),
              gridDefination: {
                xs: 12,
                sm: 6,
              },
               
            })
          },
          mobileNo: {
            ...getTextField({
              label: { labelName: "mobileNo", labelKey: "INTIGRATION_MOBILE_NUMBER" },
              placeholder: {
                labelName: "Enter mobileNo",
                labelKey: "INTIGRATION_MOBILE_NUMBER_PLACEHOLDER"
              },
              required: true,
              jsonPath: "searchScreen.mobileNo",
              pattern: getPattern("MobileNo") || null,
              gridDefination: {
                xs: 12,
                sm: 6,
              },
               
            })
          },
          otp: {
            ...getTextField({
              label: { labelName: "otp", labelKey: "INTIGRATION_OTP" },
              placeholder: {
                labelName: "Enter OTP",
                labelKey: "INTIGRATION_OTP"
              },
              required: true,
              jsonPath: "searchScreen.otp",
              pattern: getPattern("UOMValue") || null,
              errorMessage: "INTIGRATION_OTP_INPUT_VALIDATION",
              gridDefination: {
                xs: 12,
                sm: 6,
              },
               
            })
          },
     
    }),
    button: getCommonContainer({
      buttonContainer: getCommonContainer({

        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 2,
            // align: "center"
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              // width: "220px",
              // height: "48px",
            },
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Send OTP",
              labelKey: "INTIGRATION_GET_OTP_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: GetOTP,
          },
        },
        validateOTPButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 2,
            // align: "center"
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              // width: "220px",
              // height: "48px",
            },
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Search",
              labelKey: "INTIGRATION_VALID_OTP_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: ValidateOTP,
          },
        },
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 2,
            //align: "left"
          },
          props: {
            variant: "outlined",
            style: {
              color: "#FE7A51",
              borderColor: "#FE7A51",
              //   borderRadius: "2px",
              // width: "220px",
              // height: "48px",
              margin: "8px",
              float: "left",
            },
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Cancel",
              labelKey: "INTIGRATION_CANCEL_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: resetFields,
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
  