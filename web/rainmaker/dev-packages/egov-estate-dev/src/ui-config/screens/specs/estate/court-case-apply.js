import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getCommonCard,
    getCommonTitle,
    getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    httpRequest
  } from "../../../../ui-utils/api";
import { getSearchResults } from "../../../../ui-utils/commons";
import {
    toggleSnackbar
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import get from "lodash/get";
import {
    getQueryArg,
  } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {_getPattern
} from "../utils";

const header = getCommonHeader({
    labelName: "Create Court Case",
    labelKey: "ES_CREATE_COURT_CASE_APPLY"
  });
  export const getCommonApplyFooter = children => {
    return {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "apply-wizard-footer"
      },
      children
    };
  };
  
export const courtCaseHeader = getCommonTitle(
{
    labelName: "Court Case Details",
    labelKey: "ES_COURT_CASE_DETAILS_HEADER"
},
{
    style: {
            marginBottom: 18,
            marginTop: 18
    }
}
)



const advisorToAdminCourtField = {
    ...advisorToAdminCourtConfig,
    label: {
        labelName: "Advisor to Admin Court",
        labelKey: "ES_ADVISOR_TO_ADMIN_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Advisor to Admin Court",
        labelKey: "ES_ADVISOR_TO_ADMIN_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
      jsonPath: "tempCourtCase[0].advisorToAdminCourt"
  }

  export const advisorToAdminCourtConfig = {
    label: {
        labelName: "Advisor to Admin Court",
        labelKey: "ADVISOR_TO_ADMIN_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Advisor to Admin Court",
        labelKey: "ADVISOR_TO_ADMIN_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 5,
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,

}
const chiefAdministartorsCourtField = {
    ...chiefAdministartorsCourtFieldConfig,
    label: {
        labelName: "Chief Administrators Court",
        labelKey: "ES_CHIEF_ADMINISTRATORS_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Chief Administrators Court",
        labelKey: "ES_CHIEF_ADMINISTRATORS_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    jsonPath: "tempCourtCase[0].chiefAdministartorsCourt"
  }
  export const chiefAdministartorsCourtFieldConfig = {
    label: {
        labelName: "Chief Administartors Court",
        labelKey: "CHIEF_ADMINISTARTORS_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Chief Administartors Court",
        labelKey: "CHIEF_ADMINISTARTORS_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,
}

// commisioner

const commissionersCourtField = {
    ...commissionersCourtFieldConfig,
    label: {
        labelName: "Commissioners Court",
        labelKey: "ES_COMMISSIONERS_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Commissioners Court",
        labelKey: "ES_COMMISSIONERS_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    jsonPath: "tempCourtCase[0].commissionersCourt"
  }
  export const commissionersCourtFieldConfig = {
    label: {
        labelName: "Commissioners Court Court",
        labelKey: "COMMISSIONERS_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Commissioners Court Court",
        labelKey: "COMMISSIONERS_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,
}


// estate officer
const estateOfficerCourtField = {
    ...estateOfficerCourtFieldConfig,
    label: {
        labelName: "Estate Officer Court",
        labelKey: "ES_ESTATE_OFFICER_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Estate Officer Court",
        labelKey: "ES_ESTATE_OFFICER_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    jsonPath: "tempCourtCase[0].estateOfficerCourt"
  }
  export const estateOfficerCourtFieldConfig = {
    label: {
        labelName: "Estate Officer Court",
        labelKey: "ESTATE_OFFICER_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Estate Officer Court",
        labelKey: "ESTATE_OFFICER_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,
}

// honr district

const honorableDistrictCourtField = {
    ...honorableDistrictCourtFieldConfig,
    label: {
        labelName: "Hon'ble District Court",
        labelKey: "ES_HONBLE_DISTRICT_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Hon'ble District Court",
        labelKey: "ES_HONBLE_DISTRICT_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    jsonPath: "tempCourtCase[0].honorableDistrictCourt"
  }
  export const honorableDistrictCourtFieldConfig = {
    label: {
        labelName: "Hon'ble District Court",
        labelKey: "DISTRICT_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Hon'ble District Court",
        labelKey: "DISTRICT_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,
}

// honr high
const honorableHighCourtField = {
    ...honorableHighCourtFieldConfig,
    label: {
        labelName: "Hon'ble High Court",
        labelKey: "ES_HONBLE_HIGH_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Hon'ble High Court",
        labelKey: "ES_HONBLE_HIGH_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    jsonPath: "tempCourtCase[0].honorableHighCourt"
  }
  export const honorableHighCourtFieldConfig = {
    label: {
        labelName: "Hon'ble High Court",
        labelKey: "HIGH_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Hon'ble High Court",
        labelKey: "HIGH_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,
}

// honr supreme

const honorableSupremeCourtField = {
    ...honorableSupremeCourtFieldConfig,
    label: {
        labelName: "Hon'ble Supreme Court",
        labelKey: "ES_HONBLE_SUPREME_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Hon'ble Supreme Court",
        labelKey: "ES_HONBLE_SUPREME_COURT_PLACEHOLDER"
    },
    props: {
        // disabled: true
      },
      errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    jsonPath: "tempCourtCase[0].honorableSupremeCourt"
  }
  export const honorableSupremeCourtFieldConfig = {
    label: {
        labelName: "Hon'ble Supreme Court",
        labelKey: "SUPREME_COURT_LABEL"
    },
    placeholder: {
        labelName: "Enter Hon'ble Supreme Court",
        labelKey: "SUPREME_COURT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
      pattern: _getPattern("courtCase"),
    required: false,
}

export const courtCaseDetails = getCommonCard({
    header: courtCaseHeader,
        detailsContainer: getCommonContainer({
            advisorToAdminCourt: getTextField(advisorToAdminCourtField),
            chiefAdministartorsCourt: getTextField(chiefAdministartorsCourtField),
            commissionersCourt: getTextField(commissionersCourtField),
            estateOfficerCourt: getTextField(estateOfficerCourtField),
            honorableDistrictCourt: getTextField(honorableDistrictCourtField),
            honorableHighCourt: getTextField(honorableHighCourtField),
            honorableSupremeCourt: getTextField(honorableSupremeCourtField),
        })
})

export const courtCaseForm = {
uiFramework: "custom-atoms",
componentPath: "Form",
props: {
    id: "apply_form3"
},
children: {
    courtCaseDetails
},
}
export const courtCasefooterButton = {
    componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "45px",
            borderRadius: "inherit"
          }
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: "submit",
            labelKey: "ES_COURT_CASE_BUTTON_SUBMIT"
          }),
         
        },
        
  }
  export const moveToSuccess = (data, dispatch, type, screenKey) => {
    const id = get(data, "id");
    const tenantId = get(data, "tenantId");
    const fileNumber = get(data, "fileNumber");
    const applicationNumber = get(data, "applicationNumber")
    const purpose = screenKey;
    const status = "success";
    let path = "";
    switch(type) {
      case ES_CREATE_COURT_CASE : 
        path = `/estate/acknowledgement?purpose=${purpose}&status=${status}&fileNumber=${fileNumber}&tenantId=${tenantId}&type=${type}`;
        break;
    //   default : {
    //     const {branchType, moduleType, applicationType} = data;
    //     type = `${branchType}_${moduleType}_${applicationType}`;
    //     path = `/estate/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
    //   }
    }
    dispatch(
      setRoute(path)
    );
  };

  export const applyCourtCaseDetails = async (state, dispatch) => {
    
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
    let queryObjectInitial = [
        { key: "fileNumber", value: fileNumber }
      ];

    try{

    let payload = await getSearchResults(queryObjectInitial);
    let tempCourtCaseArr = get(state.screenConfiguration.preparedFinalObject,"tempCourtCase[0]");
    payload.Properties[0].propertyDetails.courtCases.push(tempCourtCaseArr);
    let courtcasesArrLen =  payload.Properties[0].propertyDetails.courtCases.length
    
    let queryObject = JSON.parse(
        JSON.stringify(
          get(state.screenConfiguration.preparedFinalObject, "Properties", [])
        )
      );
      
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const id = get(payload, "id");
    let response;
    // [0].propertyDetails.courtCases[0].advisorToAdminCourt
    set(payload, `Properties[0].propertyDetails.courtCases[${courtcasesArrLen-1}].tenantId`, tenantId);
    set(payload, "Properties[0].propertyDetails.addCourtCases","ADD_COURT_CASES");
    // set(queryObject[0], `propertyDetails.courtCases[${index}].advisorToAdminCourt`,queryObject[0].propertyDetails.courtCases[0].advisorToAdminCourt)
    // set(queryObject[0], `propertyDetails.courtCases[${index}].chiefAdministartorsCourt`,queryObject[0].propertyDetails.courtCases[0].chiefAdministartorsCourt)
    // set(queryObject[0], `propertyDetails.courtCases[${index}].commissionersCourt`,queryObject[0].propertyDetails.courtCases[0].commissionersCourt)
    // set(queryObject[0], `propertyDetails.courtCases[${index}].estateOfficerCourt`,queryObject[0].propertyDetails.courtCases[0].estateOfficerCourt);
    // set(queryObject[0], `propertyDetails.courtCases[${index}].honorableDistrictCourt`,queryObject[0].propertyDetails.courtCases[0].honorableDistrictCourt);
    // set(queryObject[0], `propertyDetails.courtCases[${index}].honorableHighCourt`,queryObject[0].propertyDetails.courtCases[0].honorableHighCourt);
    // set(queryObject[0], `propertyDetails.courtCases[${index}].honorableSupremeCourt`,queryObject[0].propertyDetails.courtCases[0].honorableSupremeCourt);
    
    if(!id){
        set(payload, "Properties[0].action", "");
        response = await httpRequest(
            "post",
            "/est-services/property-master/_update",
            "",
            [], {
              Properties: payload.Properties
            }
          );
    }
   
   return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, {
      labelName: error.message
    }, "error"));
    console.log(error);
    return false;
  }


}

  const  callBackForNextcourtCase = async(state, dispatch) => {
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
      let isFormValid = true;
    const courtCases = get(
        state.screenConfiguration.preparedFinalObject,
        "Properties[0].propertyDetails.courtCases"
      )
      if(get(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].advisorToAdminCourt').length > 250 ||
      get(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].chiefAdministartorsCourt').length > 250 ||
      get(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].commissionersCourt').length > 250 ||
      get(state,'screenConfiguration.preparedFinalObject.Properties[0].propertyDetails.courtCases[0].estateOfficerCourt').length > 250 ||
      get(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].honorableDistrictCourt').length > 250 ||
      get(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].honorableHighCourt').length > 250 ||
      get(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].honorableSupremeCourt').length > 250){
        isFormValid = false;
      }
  
      if (isFormValid) {
        const res = await applyCourtCaseDetails(state, dispatch);
        if (!res) {
          return
        }
      } else {
        isFormValid = false;
      }
    
      if (isFormValid) {
        // const courtCaseData = get(
        //   state.screenConfiguration.preparedFinalObject,
        //   "Properties[0]"
        // );
        
        // moveToSuccess(courtCaseData, dispatch, ES_CREATE_COURT_CASE);
        let successMessage = {
                    labelName:
                        "Court Case submitted successfully!",
                    labelKey: "ES_COURT_CASE_SUBMITTED_SUCCESS"
                };
                
                dispatch(toggleSnackbar(true, successMessage, "success"))
        dispatch(setRoute(`/estate/court-case?fileNumber=${fileNumber}&tenantId=${getTenantId()}`))
        
        
        // setTimeout(dispatch(toggleSnackbar(false, successMessage, "success")), 1500);
          
    }
    else if(!isFormValid){
      let errorMessage = {
        labelName:
            "Shouldn't exceed 250 characters",
        labelKey: "ERR_COURT_DETAILS_250_CHARACTERS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"))
    }
    
    }

export const courtCasefooter = getCommonApplyFooter({
    
    submitButton: {
      ...courtCasefooterButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNextcourtCase
      },
    }
  });

const beforeInitFn = async(action, state, dispatch) => {
    set(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].advisorToAdminCourt',"")
    set(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].chiefAdministartorsCourt',"")
    set(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].commissionersCourt',"")
    set(state,'screenConfiguration.preparedFinalObject.Properties[0].propertyDetails.courtCases[0].estateOfficerCourt',"")
    set(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].honorableDistrictCourt',"")
    set(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].honorableHighCourt',"")
    set(state,'screenConfiguration.preparedFinalObject.tempCourtCase[0].honorableSupremeCourt',"")
}

const applyCourtCase = {
    uiFramework: "material-ui",
    name: "court-case-apply",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch);
        //     getData(action, state, dispatch);
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
                formwizardFirstStep: courtCaseForm,
                footer: courtCasefooter
            }
        }
    }
}

export default applyCourtCase