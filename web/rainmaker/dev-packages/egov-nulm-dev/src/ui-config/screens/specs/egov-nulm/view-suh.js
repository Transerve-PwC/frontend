import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { SUHReviewDetails } from "./viewSUHResource/suh-review";
  import { poViewFooter } from "./viewSUHResource/footer";
  import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let status = getQueryArg(window.location.href, "status");

  const applicationNumberContainer = () => {

   if (applicationNumber)
     return {
       uiFramework: "custom-atoms-local",
       moduleName: "egov-nulm",
       componentPath: "ApplicationNoContainer",
       props: {
         number: `${applicationNumber}`,
         visibility: "hidden"
       },
       visible: true
     };
   else return {};
 };
 const statusContainer = () => {

 if(status)
     return {
     uiFramework: "custom-atoms-local",
     moduleName: "egov-nulm",
     componentPath: "ApplicationStatusContainer",
     props: {
      status: `${status}`,
       visibility: "hidden"
     },
     visible: true
   };
  else return {};
};



  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View SUH`,
      labelKey: "NULM_SUH_VIEW"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });
  
  const tradeView = SUHReviewDetails(false);
  
  const getMdmsData = async (dispatch, tenantId) => {
    const tenant = "ch"
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "NULM",
            masterDetails: [
              {
                name: "SEPDocuments",
              }
            ]
          },
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const documentsToShow = [
    {
      documentCode: "NULM_SUH_ADDRESS_PICTURE_1",
      documentType: "AddressPicture1",                    
      isDocumentRequired: true,
      isDocumentTypeRequired: false
    },
    {
      documentCode: "NULM_SUH_ADDRESS_PICTURE_2",
      documentType: "AddressPicture2",
      isDocumentRequired: false,
      isDocumentTypeRequired: false
    },
    {
      documentCode: "NULM_SUH_FACILITY_PICTURE_1",
      documentType: "FacilityPicture1",
      isDocumentRequired: true,
      isDocumentTypeRequired: false
    },
    {
      documentCode: "NULM_SUH_FACILITY_PICTURE_2",
      documentType: "FacilityPicture2",
      isDocumentRequired: false,
      isDocumentTypeRequired: false
    },
    {
      documentCode: "NULM_SUH_PROGRAM_PICTURE_1",
      documentType: "ProgramPicture1",
      isDocumentRequired: true,
      isDocumentTypeRequired: false
    },
    {
      documentCode: "NULM_SUH_PROGRAM_PICTURE_2",
      documentType: "ProgramPicture2",
      isDocumentRequired: false,
      isDocumentTypeRequired: false
    },
    {
      documentCode: "NULM_SMID_DOCUMENT_UPLOAD",
      documentType: "AdditionAttachment",
      isDocumentRequired: true,
      isDocumentTypeRequired: false
    }
  ]
  const getFileUrlDetails = async (state,dispatch,tenantId,response)=>{
    //mdms call
   // getMdmsData(dispatch, tenantId);

   const pictureId = response.ResponseBody[0].addressPicture.map(docInfo => docInfo.filestoreId);
   const documentAttachmentId  = response.ResponseBody[0].documentAttachment.map(docInfo => docInfo.filestoreId);
   const programPictureId = response.ResponseBody[0].programPicture.map(docInfo => docInfo.filestoreId);
   const facilityPictureId = response.ResponseBody[0].suhFacilitiesDetails[0].facilityPicture.map(docInfo => docInfo.filestoreId);
   const fileStoreIds = [...pictureId,...documentAttachmentId,...programPictureId,...facilityPictureId].join();
   const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));

const {addressPicture,documentAttachment,programPicture,suhFacilitiesDetails} = response.ResponseBody[0];
const {facilityPicture} = suhFacilitiesDetails[0];
const applicationDocument =  [...addressPicture,...facilityPicture,...programPicture,...documentAttachment]
   let  documentsUploadRedux ={}
  const documentsPreview = applicationDocument 
                          &&applicationDocument.map((docInfo,index) => {
                            let docObj =  {
                                          title: docInfo.documentType,
                                          linkText: "VIEW", 
                                          link :  (fileUrlPayload &&
                                                    fileUrlPayload[docInfo.filestoreId] &&
                                                    getFileUrl(fileUrlPayload[docInfo.filestoreId])) ||
                                                    "",
                                           name:   (fileUrlPayload &&
                                                      fileUrlPayload[docInfo.filestoreId] &&
                                                      decodeURIComponent(
                                                        getFileUrl(fileUrlPayload[docInfo.filestoreId])
                                                          .split("?")[0]
                                                          .split("/")
                                                          .pop().slice(13)
                                                      )) ||
                                                    `Document - ${index + 1}` 
                                        }

                                        //for populating in update mode
                                    const docsToShow = ["AddressPicture1","AddressPicture2","FacilityPicture1","FacilityPicture2","ProgramPicture1","ProgramPicture2","AdditionAttachment"]
                                          const indexOfDoc = documentsToShow.findIndex(doc =>  doc.documentType === docInfo.documentType )

                                            documentsUploadRedux[indexOfDoc] = {      
                                            ...documentsToShow[indexOfDoc],
                                            "documents":[
                                            {
                                            "fileName":  (fileUrlPayload &&
                                              fileUrlPayload[docInfo.filestoreId] &&
                                              decodeURIComponent(
                                                getFileUrl(fileUrlPayload[docInfo.filestoreId])
                                                  .split("?")[0]
                                                  .split("/")
                                                  .pop().slice(13)
                                              )) ||
                                            `Document - ${index + 1}`,
                                            "fileStoreId": docInfo.filestoreId,
                                            "fileUrl": fileUrlPayload[docInfo.filestoreId]
                                           }
                                          ]
                                         }
                                        

                              return docObj;
                          })
    
          documentsPreview && dispatch(prepareFinalObject("documentsPreview", documentsPreview));
                          
                            
          documentsPreview &&  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));

                       
   
  }
  
const getSUHDetails = async(state, dispatch) =>{
    
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let NulmSuhRequest = {};
  NulmSuhRequest.tenantId = tenantId;
  NulmSuhRequest.applicationId= applicationNumber;
  const requestBody = {NulmSuhRequest}
  let response = await getSearchResults([],requestBody, dispatch,"suh");

  if(response){ 
    getFileUrlDetails(state,dispatch,tenantId,response);
 //   dispatch(prepareFinalObject("NulmSuhRequest", response.ResponseBody[0]));
    if( response.ResponseBody[0]){

      const NulmSuhRequest = { ...response.ResponseBody[0]};
      const facilityArray =  ["isBedding","isWashingOfLinen","isCleaningOfPremises","isRecreationfacilities","isDrinkingWater","isMeals","isLockerForInmates","isFireSafetyMeasure","isOfficeSetUp","isFirstAidKitAndTrainingToStaff", "isDisplayOfEmergencyNumbers","isToilet"]
      facilityArray.forEach(value => {
        if(NulmSuhRequest && NulmSuhRequest.suhFacilitiesDetails && NulmSuhRequest.suhFacilitiesDetails[0][value]===true)
      {
         set( NulmSuhRequest, `suhFacilitiesDetails[0]${value}`, "Yes" );
       }else{
         set( NulmSuhRequest, `suhFacilitiesDetails[0]${value}`, "No" );
       }
     })
   
     const recordArray = ["isAssetInventoryRegister","isAccountRegister", "isAttendanceRegisterOfStaff","isShelterManagementCommitteeRegister", "isPersonnelAndSalaryRegister", "isHousekeepingAndMaintenanceRegister","isComplaintAndSuggestionRegister", "isVisitorRegister","isProfileRegister"];
      recordArray.forEach((value,index) => {
         if(NulmSuhRequest && NulmSuhRequest.suhRecordMaintenance && NulmSuhRequest.suhRecordMaintenance[0][value]===true  ){
           set( NulmSuhRequest, `suhRecordMaintenance[0]${value}`, "Yes" );
         }else{
           set( NulmSuhRequest, `suhRecordMaintenance[0]${value}`, "No" );
         }
       })
   
       const staffArray = ["isManager","isSecurityStaff","isCleaner"];
       staffArray.forEach((value,index) => {
         if(NulmSuhRequest && NulmSuhRequest.suhStaffMaintenance && NulmSuhRequest.suhStaffMaintenance[0][value]===true  ){
           set( NulmSuhRequest, `suhStaffMaintenance[0]${value}`, "Yes" );
         }else{
           set( NulmSuhRequest, `suhStaffMaintenance[0]${value}`, "No" );
         }
       })
   
       const otherDetailArray = ["isConstitutionOfShelterManagementCommittee", "isSocialAudit", "isLinkageToCentralGovtWelfareSchemes", "isLinkageToPublicHealthInitiatives", "isLinkageToOtherGovtSchemes", "isLinkageToLocalCommunity","isLinkageToSocialWorkersAndPhilanthropists","isUserCharges", "isIECAndPromotionalInitiatives", "isQuarterlyReporting","isVisits"];
       otherDetailArray.forEach((value,index) => {
         if(NulmSuhRequest && NulmSuhRequest[value]===true  ){
           set( NulmSuhRequest, `${value}`, "Yes" );
         }else{
           set( NulmSuhRequest, `${value}`, "No" );
         }
       })
   
       if(NulmSuhRequest  && NulmSuhRequest.weatherCondition =="true"){
         set( NulmSuhRequest, "weatherCondition", "Yes" );
       }else{
         set( NulmSuhRequest, "weatherCondition", "No" );
       }

       dispatch(prepareFinalObject(`NulmSuhRequest`, NulmSuhRequest ));
    
  }
  }
}

const roleBasedValidationForFooter = () => {
  if(process.env.REACT_APP_NAME === "Employee"){
      if(status === "Created"){
        return poViewFooter();
      }
      else{
        return {};
      }
  }     
  else{
    if(status==="Drafted")
        return poViewFooter() 
    else
      return{};
  }
 
}

  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-suh",
    beforeInitScreen: (action, state, dispatch) => {
      getSUHDetails(state, dispatch);

      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
        applicationNumber
      );
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.status.props.status",
        status
      );
      
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
          tradeView,
          footer: roleBasedValidationForFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  