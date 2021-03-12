import {
    getCommonHeader,
    getCommonCard,
    getCommonContainer, 
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
    sampleeofficestat
    } from "../../../../ui-utils/sampleResponses";
    import { httpRequest } from "../../../../ui-utils";
    import { getSearchResults } from "../../../../ui-utils/commons"; 
import { stringify } from "jsonpath";


  export const getData = async (action, state, dispatch) => {
   
    await getMdmsData(state, dispatch);
    
    
  };
  export const geteOfficedata =async(state, dispatch)=>{
    let totalVIPReceiptsPending =0;
    let VIPReceiptsPendingDepartmentName='';
    let VIPReceiptsPendingOrgName='';
    let VIPReceiptsPendingEmployeeName=''
    let totalFilesPendingCnt =0;
    let FilesPendingDepartmentName=''
    let FilesPendingOrgName=''
    let FilesPendingEmployeeName=''
    let totalFilesClosed =0;
    let FilesClosedDepartmentName=''
    let FilesClosedOrgName=''
    let FilesClosedEmployeeName=''
    let totalReceiptsPending =0;
    let ReceiptsPendingDepartmentName=''
    let ReceiptsPendingOrgName=''
    let ReceiptsPendingEmployeeName=''
    let totalReceiptsClosed =0;
    let ReceiptsClosedDepartmentName=''
    let ReceiptsClosedOrgName=''
    let ReceiptsClosedEmployeeName=''
    let postdetailid_ =''
    let NumberOfElectronicVipreceipt=''
    let NumberOfPhysicalVipreceipt=''
    let ElectronicReceipt=''
    let PhysicalReceipt=''
    let ElectronicFile=''
    let PhysicalFile=''
    let ElectronicFileFileClosed=''
    let PhysicalFileFileClosed=''
    let ElectronicFileReceiptClosed=''
    let PhysicalFileReceiptClosed=''
    let orgid =''
    let APIData_ =[]
    let postdetailid=[]
     postdetailid_ = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreen.postdetailid",
      ''
    );
    if(postdetailid_)
    {
      postdetailid.push(postdetailid_)
      let postDetails = get(
        state.screenConfiguration.preparedFinalObject,
        "postDetails",
        []
      );
      postDetails = postDetails.filter(x=>x.code ===postdetailid_)
      if(postDetails && postDetails[0])
      {
        orgid = postDetails[0].orgid;
      }


    }
    else
    {
      const errorMessage = {
        labelName: "Please select post detail",
        labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_SELECTION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

      return false;
    }
    let mdmsBody_ = {
      eOfficeRequest: {
       // orgid: 37, // set from  integration-services/eoffice/v1/_getPostDetailsId responce
        orgid: orgid,
        postdetailid:postdetailid,
       
      }
    };
    //postdetailid_ =postdetailid;
    let curindex = 0;// index;
    dispatch(toggleSpinner());
    try {
      let response = await httpRequest(
        "post",
        "/integration-services/eoffice/v1/_get",
        "_get",
        [],
        mdmsBody_
      );
      let  APIData = response;
        //let  APIData = sampleeofficestat()

      // if(APIData.ResponseBody && APIData.ResponseBody[curindex].length>0)
      // { 
        if(APIData.ResponseBody && APIData.ResponseBody[curindex])
        {
         // postdetailid_ = APIData.ResponseBody[curindex].postdetailid
          if(APIData.ResponseBody[curindex].details.VipReceipts)//totalVIPReceiptsPending
          {
            if(APIData.ResponseBody[curindex].details.VipReceipts.Row !== undefined)
            {
              let data = APIData.ResponseBody[curindex].details.VipReceipts.Row.Column
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.name ==="DepartmentName")
                {
                  VIPReceiptsPendingDepartmentName = element.content
                }
                if(element.name ==="OrgName")
                {
                  VIPReceiptsPendingOrgName = element.content
                }
                if(element.name ==="EmployeeName")
                {
                  VIPReceiptsPendingEmployeeName = element.content
                }
                if(element.name ==="Total")
                {
                  totalVIPReceiptsPending = element.content
                }
                if(element.name ==="NumberOfElectronicVipreceipt")
                {
                  NumberOfElectronicVipreceipt = element.content
                }
                if(element.name ==="NumberOfPhysicalVipreceipt")
                {
                  NumberOfPhysicalVipreceipt = element.content
                }
                                
              }             
            }
  
          }
           if(APIData.ResponseBody[curindex].details.ReceiptPending)//totalReceiptsPending
          {
            if(APIData.ResponseBody[curindex].details.ReceiptPending.Row !== undefined)
            {
              let ReceiptPending = APIData.ResponseBody[curindex].details.ReceiptPending.Row.Column
              for (let index = 0; index < ReceiptPending.length; index++) {
                const element = ReceiptPending[index];
                if(element.name ==="DepartmentName")
                {
                  ReceiptsPendingDepartmentName = element.content
                }
                if(element.name ==="OrgName")
                {
                  ReceiptsPendingOrgName = element.content
                }
                if(element.name ==="EmployeeName")
                {
                  ReceiptsPendingEmployeeName = element.content
                }
                if(element.name ==="Total")
                {
                  totalReceiptsPending = element.content
                }
                if(element.name ==="ElectronicReceipt")
                {
                  ElectronicReceipt = element.content
                }
                if(element.name ==="PhysicalReceipt")
                {
                  PhysicalReceipt = element.content
                }
                
                               
              }
            }
  
          }
           if(APIData.ResponseBody[curindex].details.FilePending)//totalFilesPendingCnt
          {
            if(APIData.ResponseBody[curindex].details.FilePending.Row !== undefined)
            {
              let FilePending = APIData.ResponseBody[curindex].details.FilePending.Row.Column
              for (let index = 0; index < FilePending.length; index++) {
                const element = FilePending[index];
                if(element.name ==="DepartmentName")
                {
                  FilesPendingDepartmentName = element.content
                }
                if(element.name ==="OrgName")
                {
                  FilesPendingOrgName = element.content
                }
                if(element.name ==="EmployeeName")
                {
                  FilesPendingEmployeeName = element.content
                }
                if(element.name ==="Total")
                {
                  totalFilesPendingCnt = element.content
                }
                if(element.name ==="ElectronicFile")
                {
                  ElectronicFile = element.content
                }
                if(element.name ==="PhysicalFile")
                {
                  PhysicalFile = element.content
                }
                               
              }
            }
  
          }
           if(APIData.ResponseBody[curindex].details.FileClosed)//totalFilesClosed
          {
            if(APIData.ResponseBody[curindex].details.FileClosed.Row !== undefined)
            {
              let FileClosed = APIData.ResponseBody[curindex].details.FileClosed.Row.Column
              for (let index = 0; index < FileClosed.length; index++) {
                const element = FileClosed[index];
                if(element.name ==="DepartmentName")
                {
                  FilesClosedDepartmentName = element.content
                }
                if(element.name ==="OrgName")
                {
                  FilesClosedOrgName = element.content
                }
                if(element.name ==="EmployeeName")
                {
                  FilesClosedEmployeeName = element.content
                }
                if(element.name ==="Total")
                {
                  totalFilesClosed = element.content
                }
                if(element.name ==="ElectronicFile")
                {
                  ElectronicFileFileClosed = element.content
                }
                if(element.name ==="PhysicalFile")
                {
                  PhysicalFileFileClosed = element.content
                }
                               
              }
            }
  
          }
           if(APIData.ResponseBody[curindex].details.ReceiptClosed)//totalReceiptsClosed
          {
            if(APIData.ResponseBody[curindex].details.ReceiptClosed.Row !== undefined)
            {
              let ReceiptClosed = APIData.ResponseBody[curindex].details.ReceiptClosed.Row.Column
              for (let index = 0; index < ReceiptClosed.length; index++) {
                const element = ReceiptClosed[index];
                if(element.name ==="DepartmentName")
                {
                  ReceiptsClosedDepartmentName = element.content
                }
                if(element.name ==="OrgName")
                {
                  ReceiptsClosedOrgName = element.content
                }
                if(element.name ==="EmployeeName")
                {
                  ReceiptsClosedEmployeeName = element.content
                }
                if(element.name ==="Total")
                {
                  totalReceiptsClosed = element.content
                }
                if(element.name ==="ElectronicFile")
                {
                  ElectronicFileReceiptClosed = element.content
                }
                if(element.name ==="PhysicalFile")
                {
                  PhysicalFileReceiptClosed = element.content
                }
                               
              }
            }
  
          }
        }
  
         APIData ={
          eofficestat:{
            ////,
             FileClosed:{
               FilesClosedDepartmentName:FilesClosedDepartmentName,
               FilesClosedOrgName:FilesClosedOrgName,
               FilesClosedEmployeeName:FilesClosedEmployeeName,
               totalFilesClosed:totalFilesClosed,
               ElectronicFileFileClosed:ElectronicFileFileClosed,
               PhysicalFileFileClosed:PhysicalFileFileClosed
             },
            ////
             FilePending:{
               totalFilesPendingCnt:totalFilesPendingCnt,
               FilesPendingDepartmentName:FilesPendingDepartmentName,
               FilesPendingOrgName:FilesPendingOrgName,
               FilesPendingEmployeeName:FilesPendingEmployeeName,
               ElectronicFile:ElectronicFile,
               PhysicalFile:PhysicalFile
             },
             //,
             ReceiptClosed:{
               ReceiptsClosedDepartmentName:ReceiptsClosedDepartmentName,
               ReceiptsClosedOrgName:ReceiptsClosedOrgName,
               ReceiptsClosedEmployeeName:ReceiptsClosedEmployeeName,
               totalReceiptsClosed:totalReceiptsClosed,
               PhysicalFileReceiptClosed:PhysicalFileReceiptClosed,
               ElectronicFileReceiptClosed:ElectronicFileReceiptClosed
   
             },
             ////
             ReceiptPending:{
               totalReceiptsPending:totalReceiptsPending,
               ReceiptsPendingDepartmentName:ReceiptsPendingDepartmentName,
               ReceiptsPendingOrgName:ReceiptsPendingOrgName,
               ReceiptsPendingEmployeeName:ReceiptsPendingEmployeeName,
               ElectronicReceipt:ElectronicReceipt,
               PhysicalReceipt:PhysicalReceipt,
   
             },
             ////
             VIPReceiptsPending:{
               VIPReceiptsPendingDepartmentName:VIPReceiptsPendingDepartmentName,
               VIPReceiptsPendingEmployeeName:VIPReceiptsPendingEmployeeName,
               VIPReceiptsPendingOrgName:VIPReceiptsPendingOrgName,
               totalVIPReceiptsPending:totalVIPReceiptsPending,
               NumberOfElectronicVipreceipt:NumberOfElectronicVipreceipt,
               NumberOfPhysicalVipreceipt:NumberOfPhysicalVipreceipt
             },
   
             postdetailid:postdetailid_
   
           }
        }
         APIData_.push(APIData)
       // dispatch(prepareFinalObject("APIData",APIData));
        // dispatch(prepareFinalObject("searchScreenMdmsData",response.ResponseBody))


     // }
     
      
  
     // return true;
    } catch (e) {
    //  alert('1')
    //dispatch(toggleSpinner());
      console.log(e);
    }
    if(APIData_.length == 0)
    {
     let APIDataTemp ={
        eofficestat:{
         ////,
          FileClosed:{
            FilesClosedDepartmentName:FilesClosedDepartmentName,
            FilesClosedOrgName:FilesClosedOrgName,
            FilesClosedEmployeeName:FilesClosedEmployeeName,
            totalFilesClosed:totalFilesClosed,
            ElectronicFileFileClosed:ElectronicFileFileClosed,
            PhysicalFileFileClosed:PhysicalFileFileClosed
          },
         ////
          FilePending:{
            totalFilesPendingCnt:totalFilesPendingCnt,
            FilesPendingDepartmentName:FilesPendingDepartmentName,
            FilesPendingOrgName:FilesPendingOrgName,
            FilesPendingEmployeeName:FilesPendingEmployeeName,
            ElectronicFile:ElectronicFile,
            PhysicalFile:PhysicalFile
          },
          //,
          ReceiptClosed:{
            ReceiptsClosedDepartmentName:ReceiptsClosedDepartmentName,
            ReceiptsClosedOrgName:ReceiptsClosedOrgName,
            ReceiptsClosedEmployeeName:ReceiptsClosedEmployeeName,
            totalReceiptsClosed:totalReceiptsClosed,
            PhysicalFileReceiptClosed:PhysicalFileReceiptClosed,
            ElectronicFileReceiptClosed:ElectronicFileReceiptClosed

          },
          ////
          ReceiptPending:{
            totalReceiptsPending:totalReceiptsPending,
            ReceiptsPendingDepartmentName:ReceiptsPendingDepartmentName,
            ReceiptsPendingOrgName:ReceiptsPendingOrgName,
            ReceiptsPendingEmployeeName:ReceiptsPendingEmployeeName,
            ElectronicReceipt:ElectronicReceipt,
            PhysicalReceipt:PhysicalReceipt,

          },
          ////
          VIPReceiptsPending:{
            VIPReceiptsPendingDepartmentName:VIPReceiptsPendingDepartmentName,
            VIPReceiptsPendingEmployeeName:VIPReceiptsPendingEmployeeName,
            VIPReceiptsPendingOrgName:VIPReceiptsPendingOrgName,
            totalVIPReceiptsPending:totalVIPReceiptsPending,
            NumberOfElectronicVipreceipt:NumberOfElectronicVipreceipt,
            NumberOfPhysicalVipreceipt:NumberOfPhysicalVipreceipt
          },

          postdetailid:postdetailid_

        }
      }
      APIData_.push(APIDataTemp)
      const errorMessage = {
        labelName: "No records found",
        labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_DATAS_HEADING"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
    dispatch(prepareFinalObject("APIData",APIData_));
    dispatch(toggleSpinner());
  }
  const getMdmsData = async (state, dispatch) => {
    const tenantId =  getTenantId();
    // let mdmsBody = {
    //   eOfficeRequest: {
    //     orgid: 37,
    //     postdetailid:212,
       
    //   }
    // };
    const userInfo = JSON.parse(getUserInfo());
    let employeeCode ='11819';
    if(userInfo){
      
      const queryParams = [{ key: "uuids", value: userInfo.uuid },{ key: "tenantId", value:  tenantId }];
      try { 
        const payload = await httpRequest(
          "post",
          "/egov-hrms/employees/_search",
          "_search",
          queryParams
        );
        if(payload){ 
          employeeCode = payload.Employees[0].code;
          // dispatch(prepareFinalObject("searchScreen.empCode", payload.Employees[0].code));
          // dispatch(prepareFinalObject("empCode", payload.Employees[0].code));
        }
        
      } catch (e) {
        console.log(e);
      }
    }
    let postdetailid =[]
    let orgid = 37
    // call api integration-services/eoffice/v1/_getPostDetailsId
   // dispatch(toggleSpinner());
    let Request ={
      employeePostDetailMap:{
        //employeeCode:"11819",// need to replace by login user id
        employeeCode:employeeCode,
      }
    }
    try {
      let response_ = await httpRequest(
          "post",
          "/integration-services/eoffice/v1/_getPostDetailsId",
          "_getPostDetailsId",
          [],
          Request
      );  


      if (response_ && response_.ResponseBody) {
        //[{"post_detail_id" : "1882"},{"post_detail_id" : "2323"}]
        if(response_.ResponseBody.length ===0)
        {
          const errorMessage = {
            labelName: "No records found",
            labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_DATAS_HEADING"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
        else{
          for (let index = 0; index < response_.ResponseBody.length; index++) {
            //postdetailid =[];
            const element = response_.ResponseBody[index];
            let postdetail = response_.ResponseBody[index].postdetail
           // let post = response_.ResponseBody[index].post
            orgid = response_.ResponseBody[index].org_unit_id
            //let valuesArray = stringify(postdetail)
           let  valuesArray = JSON.parse(postdetail);
           //let valuesArray_ = JSON.parse(post);
            for (let index = 0; index < valuesArray.length; index++) {
              const element = valuesArray[index];  
              //const element_ = valuesArray_[index];
              postdetailid.push(
                {
                  name:`${element.post_detail_id}-${element.post}`,
                  code:element.post_detail_id,
                  orgid:orgid
                }
                
                )
            }
            // call get in loop
           
            /// end          
          }

        }
          

       //set post detail
       dispatch(prepareFinalObject("postDetails",postdetailid));
    //    if(APIData_.length == 0)
    // {
      let APIData =[];
     let APIDataTemp ={
        eofficestat:{
          totalFilesClosed:0,
          totalFilesPendingCnt:0,
          totalReceiptsClosed:0,
          totalReceiptsPending:0,
          totalVIPReceiptsPending:0,
          postdetailid:0

        }
      }     
      APIData.push(APIDataTemp);
   // }
    dispatch(prepareFinalObject("APIData",APIData));
        
        //dispatch(toggleSpinner());
     // }   

      }
      else{
        const errorMessage = {
          labelName: "No records found",
          labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_DATAS_HEADING"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
  } catch (error) {
    
      dispatch(toggleSpinner());
      console.log(error);
  }
    //
    let mdmsBody = {
      eOfficeRequest: {
       // orgid: 37, // set from  integration-services/eoffice/v1/_getPostDetailsId responce
        orgid: orgid,
        postdetailid:postdetailid,
       
      }
    };
   
  };
  
  const header = getCommonHeader({
    labelName: "View E-Office Stat",
    labelKey: "INTIGRATION_EOFFICE_STATE_HEADING_HOME"
  });
  const RegisterReviewResult = {
    uiFramework: "material-ui",
    name: "e-office-stat",
    beforeInitScreen: (action, state, dispatch) => {
    //  resetFields(state, dispatch);
      const tenantId = getTenantId();   
      dispatch(prepareFinalObject("searchScreen",{}));
      const propertyTaxId = getQueryArg(
        window.location.href,
        "propertyId"
      );
 
     // let  APIData =sampleeofficestat();
     
  
      getData(action, state, dispatch).then(responseAction => {    
      
      });
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
                //...header
              },
              
            }
          },
          searchforn:getCommonCard({
          wnsApplicationSearch: getCommonContainer({

            applicationType: getSelectField({
              label: { labelName: "To Date", labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_NAME_HEADING" },
              placeholder: { labelName: "Select to Date", labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_NAME_HEADING" },
              sourceJsonPath: "postDetails",
              jsonPath: "searchScreen.postdetailid",
              props: {                
                optionValue: "code",
                optionLabel: "name"
                // hasLocalization: false
              },
              gridDefination: { xs: 12, sm: 4 },
              required: false
            })
          }),
          button: getCommonContainer({
            buttonContainer: getCommonContainer({
              searchButton: {
                componentPath: "Button",
                gridDefination: { xs: 12, sm: 6 },
                props: {
                  variant: "contained",
                  style: {
                    color: "white",
                    margin: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                    borderRadius: "2px",
                    width: "220px",
                    height: "48px"
                  }
                },
                children: { buttonLabel: getLabel({ labelKey: "INTIGRATION_EOFFICE_GET" }) },
                onClickDefination: {
                  action: "condition",
                  callBack: geteOfficedata
                }
              },
            })
          }),
        }),
    breakAfterSearch: getBreak(),
          PensionReviewBottom: {
            uiFramework: "custom-containers-local",        
            componentPath: "EofficestatContainer",
            moduleName: "egov-integration",
              props: {
                dataPath: "records",
                moduleName: "RTI",
                pageName:"INTIGRATION_ESTAT",
  
              }
          },
         
        }
      },
      
    }
  };
  
  export default RegisterReviewResult;
  