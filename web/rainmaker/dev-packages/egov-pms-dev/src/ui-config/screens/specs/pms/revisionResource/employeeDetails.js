import {
    getBreak,
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getLabel,
    getDateField,
    getSelectField,
    getCommonContainer,
    getLabelWithValue,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { GetMonthlydata } from "./function";
  import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getPMSPattern } from "../../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import get from "lodash/get";
  import { httpRequest } from "egov-ui-framework/ui-utils/api";
  const ActionAdd = async (state, dispatch) => {  
   
    const pensionerNumber = getQueryArg(
      window.location.href,
      "pensionerNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    
    window.location.href = `revisionDetails?pensionerNumber=${pensionerNumber}&tenantId=${tenantId}&Year=${0}&Month=${0}`;//&pensionerNumber=${rowData[6]}`;
   
  }
  export const pensionerPensionDiscontinuation = async (state, dispatch) => {
    try {  
      const tenantId = getQueryArg(window.location.href, "tenantId");
      let queryObject = [
      {
      key: "tenantId",
      value: tenantId
      }];  
      let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])   
      let response = await httpRequest(
      "post",
      "/pension-services/v1/_pensionerPensionDiscontinuation",
      "",
      [],
      { 
        ProcessInstances: [
                            {
                            tenantId:tenantId,
                            pensioner:{
                            pensionerNumber:ProcessInstances[0].pensioner.pensionerNumber,
                            }
                            
                            }
                          ] 
      }
      );
      console.log(response);
      dispatch(
      toggleSnackbar(
        true,
        {
        labelName: "Pension is discontineou of this pensioner from next month!",
        labelKey: "PENSION_REVIEW_PENSIONER_DISCONTINUATION_SUCCESS_MESSAGE"
        },
        "success"
        ));
    
    }
    catch (e) {
    console.log(e)
    dispatch(
    toggleSnackbar(
    true,
    {
    labelName: "Workflow returned empty object !",
    labelKey: "PENSION_API_EXCEPTION_ERROR"
    },
    "error"
    ));
    }
    }
export const empDetails = () => {
   
  
    return getCommonCard({
      
      ViewButton: {
        componentPath: "Button",       
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_VIEW"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: GetMonthlydata
        },
        visible: true
      },
      AddButton: {
        componentPath: "Button",
        
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_ADD"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: ActionAdd
        },
        visible: true
      },
      DiscontinuationButton: {
        componentPath: "Button",
        
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_DISCONTINUATION"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: pensionerPensionDiscontinuation
        },
        visible: true
      },
      
    });
    }