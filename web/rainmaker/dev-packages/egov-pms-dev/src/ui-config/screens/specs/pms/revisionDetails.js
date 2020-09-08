import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getLabel,
  getCommonTitle,
  getDateField,  
  getPattern,
  getSelectField,
  getTextField,
  getBreak,
  getCommonApplyFooter
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSearchPensionerForPensionRevision ,getPMSPattern} from "../../../../ui-utils/commons";
import { getSearchPensioner } from "../../../../ui-utils/commons";
import {empDetails} from "./revisionResource/employeeDetails"
import {pensionerBasicDetails} from "./revisionResource/pensionerBasicData"
import {pensionerverifiedData} from "./revisionResource/pensionerVerifiedData"
import { revisionDetails} from "./revisionResource/RevisionApplication"
import { footer} from "./revisionResource/footer"
import { GetMonthlydata } from "./revisionResource/function";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import { reverse, max,slice} from "lodash"
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
let IsAdd = false
let IsEdit = false
let IsRevisionEdit = true
let Year = getQueryArg(window.location.href, "Year")
let Month = getQueryArg(window.location.href, "Month")
if(Year>0 || Month>0)
{
  IsEdit= true
  IsAdd= false
}
else{
  IsEdit= false
  IsAdd= true
  

}
if (Year === 0 || Month === 0)
{
  IsEdit= false
  IsAdd= true
  IsRevisionEdit = false
}
else if(Year < Number(new Date().getFullYear()) && Year >0)
{
  IsRevisionEdit = false
  IsEdit= false
  IsAdd = false
}

export const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { 
          moduleName: "pension", 
          masterDetails: 
          [{ name: "PensionRevisionYear" 
          },
          {
            name:"PensionRevisionMonth"
          },
          {
            name:"PensionRevisionMonth"
          },
          {
            name:"PensionConfig"
          },
          
          
        ] }
      ]
    }
  };
  try {
     let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
   
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
   
  } catch (e) {
    console.log(e);
  }
};
export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
}
export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
 
  
  if (applicationNumber) {

    let queryObject = [
      {
        key: "pensionerNumber",
      value: applicationNumber
       
      }];
    queryObject.push({
      key: "tenantId",
      value: tenantId
    });
    const response = await getSearchPensionerForPensionRevision(queryObject);
     //response = sampleSingleSearch(); 
     let Year = Number( getQueryArg(window.location.href, "Year"))
     let Month = Number(getQueryArg(window.location.href, "Month"))
     let pensionrevesion;
     if(Year>0 && Month>0)
     {
      pensionrevesion = response.ProcessInstances[0].pensionRevision.filter((item) => item.effectiveStartYear === Year && item.effectiveStartMonth === Month)
     }
     else{
const index = response.ProcessInstances[0].pensionRevision.length;

       let pensionrevesionTemp =[{
        effectiveStartYear:Number(new Date().getFullYear()),
        effectiveStartMonth:Number(new Date().getMonth()+1),

        basicPension:response.ProcessInstances[0].pensionRevision[index-1].basicPension,
        totalPension:response.ProcessInstances[0].pensionRevision[index-1].totalPension,

        da:response.ProcessInstances[0].pensionRevision[index-1].da,
        overPayment:response.ProcessInstances[0].pensionRevision[index-1].overPayment,

        commutedPension:response.ProcessInstances[0].pensionRevision[index-1].commutedPension,
        incomeTax:response.ProcessInstances[0].pensionRevision[index-1].incomeTax,

        additionalPension:response.ProcessInstances[0].pensionRevision[index-1].additionalPension,
        cess:response.ProcessInstances[0].pensionRevision[index-1].cess,

        fma:response.ProcessInstances[0].pensionRevision[index-1].fma,
        netDeductions:response.ProcessInstances[0].pensionRevision[index-1].netDeductions,

        miscellaneous:response.ProcessInstances[0].pensionRevision[index-1].miscellaneous,
        finalCalculatedPension:response.ProcessInstances[0].pensionRevision[index-1].finalCalculatedPension,

        woundExtraordinaryPension:response.ProcessInstances[0].pensionRevision[index-1].woundExtraordinaryPension,
        attendantAllowance:response.ProcessInstances[0].pensionRevision[index-1].attendantAllowance,        

        pensionDeductions:response.ProcessInstances[0].pensionRevision[index-1].pensionDeductions,
        interimRelief:response.ProcessInstances[0].pensionRevision[index-1].interimRelief,

        remarks:"",


      }
    ]
      pensionrevesion =pensionrevesionTemp
     }
     queryObject = [
      {
        key: "pensionerNumber",
      value: applicationNumber
       
      }];
    queryObject.push({
      key: "tenantId",
      value: tenantId
    });
     
    const response_ = await getSearchPensioner(queryObject);
    dispatch(prepareFinalObject("ProcessInstancesTemp", get(response_, "Pensioners", [])));
    let  data =[
            {
              pensionRevision:pensionrevesion,
              pensioner :response.ProcessInstances[0].pensioner,
              pensionerFinalCalculatedBenefitDetails:response.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
              PensionersBasicData : get(response_, "Pensioners", [])
            } ];
            // IsRevisionEdit = pensionrevesion.isEditEnabled;
     dispatch(prepareFinalObject("ProcessInstances", data, []));
     dispatch(prepareFinalObject("pensionRevisionTemp", response.ProcessInstances[0].pensionRevision, []));

     //set in case of add revesion default value of last records
   

  }
};
function getMax(arr, prop) {
  var max;
  for (var i=0 ; i<arr.length ; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
          max = arr[i];
  }
  return max;
}
const header = getCommonHeader({
  labelName: "PENSION_PENSIONER_REVESION",
  labelKey: "PENSION_PENSIONER_REVESION"
});
const DOEapplyResult = {
  uiFramework: "material-ui",
  name: "revisionDetails",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    const pensionerNumber = getQueryArg(
      window.location.href,
      "pensionerNumber"
    );
    getData(action, state, dispatch).then(responseAction => {
    
    });
   //get Eployee details data
prepareEditFlow(state, dispatch, pensionerNumber, tenantId).then(res=>
  {

  }
);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "revisionDetails"
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
     
    // PensionBasicDetails: {
    //   uiFramework: "custom-containers-local",
    //   componentPath: "PensionBasicContainer",
    //   moduleName: "egov-pms",
    //     props: {
    //       dataPath: "ProcessInstances",
    //       moduleName: "DOE_SERVICE",
    //       pageName:"REVISION"
    //     }
    // },
    // break: getBreak(),
       
        PensionReview: {
          uiFramework: "custom-containers-local",        
          componentPath: "PensionReviewContainer",
          moduleName: "egov-pms",
            props: {
              dataPath: "ProcessInstances",
              moduleName: "DOE_SERVICE",
              pageName:"REVISION"
            }
        },
        break: getBreak(),
        revisionDetails:revisionDetails(IsRevisionEdit),
        footer:footer(IsAdd,IsEdit, IsRevisionEdit)
        
      
      }
    },
   
  }
};

export default DOEapplyResult;
