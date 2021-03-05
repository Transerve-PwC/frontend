import {
  getStepperObject,
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getPattern,
  getCommonTitle,
  getCommonParagraph,
  getCommonGrayCard,
  getTextField,
  getSelectField,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { footer } from "./applyResource/footer";
import { getPropertyIDDetails, propertyID, propertyHeader } from "./applyResource/propertyDetails";
import { getPropertyDetails } from "./applyResource/property-locationDetails";
import { getHolderDetails, sameAsOwner, holderHeader } from "./applyResource/connectionHolder";
import { ownerDetailsHeader, getOwnerDetails, ownershipType
,getMultipleOwnerDetails
} from "./applyResource/ownerDetails";
import { additionDetails } from "./applyResource/additionalDetails";
import { OwnerInfoCard } from "./applyResource/connectionDetails";
import { MultiownerDetailsDetails } from "./applyResource/MultipleownerDetailsDetails"; 
import {getCommentDetails,commentHeader} from './applyResource/comment';
import {PropertyUsageHeader,getPropertyUsageDetails} from './applyResource/propertyUsageDetails'
import {getConnectionConversionDetails , ConnectionConversionHeader} from './applyResource/connectionConversionDetails'
import { httpRequest } from "../../../../ui-utils";
import {
  prepareDocumentsUploadData,
  getSearchResultsForSewerage,
  getSearchResults,
  getPropertyResults,
  handleApplicationNumberDisplay,
  findAndReplace,
  prefillDocuments
} from "../../../../ui-utils/commons";
import commonConfig from "config/common.js";
import { reviewDocuments } from "./applyResource/reviewDocuments";
import { reviewOwner } from "./applyResource/reviewOwner";
import { reviewConnectionDetails } from "./applyResource/reviewConnectionDetails";
import { togglePropertyFeilds, toggleSewerageFeilds, toggleWaterFeilds } from '../../../../ui-containers-local/CheckboxContainer/toggleFeilds';
import { getLocale,getTenantId,getUserInfo,setModule } from "egov-ui-kit/utils/localStorageUtils";
import cloneDeep from "lodash/cloneDeep";
export const stepperData = () => {
  if (process.env.REACT_APP_NAME === "Citizen") {
    return [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  } else {
    return [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_ADDN_DETAILS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  }
}
let IsEdit = process.env.REACT_APP_NAME === "Citizen"?false:true;

const displaysubUsageType = (usageType, dispatch, state) => {

  let UsageCategory = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreenMdmsData.PropertyTax.subUsageType"
        );
      let  subUsageType=[];
      if(UsageCategory !== undefined)
      {
      UsageCategory.forEach(item=>{
        if(item.code.split(`${usageType.split('.')[0]}.`).length==2){
          subUsageType.push({
              active:item.active,
              name:item.name,
              code:item.code,
              fromFY:item.fromFY
            })
          }
      });
    }
          dispatch(prepareFinalObject("applyScreenMdmsData.subUsageType",subUsageType));
}
const displayUsagecategory = (usageType, dispatch, state) => {

  let subTypeValues = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreenMdmsData.ws-services-masters.wsCategory"
        );

      let subUsage=[];
      if(subTypeValues!== undefined)
      {
      subUsage = subTypeValues.filter(cur => {
                  return (cur.applicationType === usageType ) 
                });
          if(subUsage&&subUsage[0])
          {
            dispatch(prepareFinalObject("propsubusagetypeForSelectedusageCategory",subUsage[0].category));
          }
        }
          
}
export const stepper = getStepperObject({ props: { activeStep: 0 } }, stepperData());

const getLabelForWnsHeader = () => {
  const wnsHeader =  window.localStorage.getItem("WNS_STATUS");

  if(wnsHeader)
    return `${wnsHeader}_HEADER`;
  else if( process.env.REACT_APP_NAME === "Citizen")
    return  "WS_APPLY_NEW_CONNECTION_HEADER"
  else
  {
    const wnsHeaderTepm =  window.localStorage.getItem("wns_workflow");

  if(wnsHeaderTepm)
    return `${wnsHeaderTepm}_DETAIL_HEADER`;  
  else  
    return "WS_APPLICATION_NEW_CONNECTION_HEADER"
  }
   
}

export const header = getCommonContainer({
  headerDiv: getCommonContainer({
    header: getCommonHeader({
      labelKey: getLabelForWnsHeader()
    })
  }),

  applicationNumberWater: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA" },
    visible: false
  },

  applicationNumberSewerage: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA" },
    visible: false
  }

});

export const reviewConnDetails = reviewConnectionDetails();

export const reviewOwnerDetails = reviewOwner(process.env.REACT_APP_NAME !== "Citizen");

export const reviewDocumentDetails = reviewDocuments();

const summaryScreenCitizen = getCommonCard({
  reviewConnDetails,
  reviewDocumentDetails,
});
const summaryScreenEMP = getCommonCard({
  reviewConnDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
})
let summaryScreen = process.env.REACT_APP_NAME === "Citizen" ? summaryScreenCitizen : summaryScreenEMP;
export const documentDetails = getCommonCard({
  header: getCommonTitle(
    { labelName: "Required Documents", labelKey: "WS_DOCUMENT_DETAILS_HEADER" },
    { style: { marginBottom: 18 } }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "WS_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "DocumentListContainer",
    props: {
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "WS_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      pageName:"wns",
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      maxFileSize: 6000
    },
    type: "array"
  }
});

export const getMdmsData = async (state,dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
       // { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }] },
        { moduleName: "tenant", masterDetails: [{ name: "tenants" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }, { name: "RoadType" }] },
        { moduleName: "ws-services-calculation", masterDetails: [{ name: "PipeSize" }] },
        {
          moduleName: "PropertyTax",
          masterDetails: [
          {name: "UsageCategory"},
          {name:"Floor"},
          {name:"OwnerShipCategory"},
          ]
        },
        {
          moduleName: "ws-services-masters", masterDetails: [
            { name: "Documents" },
            { name: "waterSource" },
            { name: "connectionType" },
            { name: "PropertySearch" },
            {name : "WaterApplicationType"},
            {name : "Ledger"},
            {name : "subDivision"},
            {name : "Division"},
            {name:"MeterUnit"},
            {name:"MFRCode"},
            {name:"sectorList"},
            {name:"swSectorList"},
            {name:"tariffType"},
            {name:"wsCategory"},
            { name: "wsWorkflowRole" },
            {name:"billGroup"},
            {name:"wsDocument"}
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    let UsageType=[] , subUsageType=[]; let OwnerShipCategory=[];
    if (payload.MdmsRes['ws-services-calculation'].PipeSize !== undefined && payload.MdmsRes['ws-services-calculation'].PipeSize.length > 0) {
      let pipeSize = [];
      payload.MdmsRes['ws-services-calculation'].PipeSize.forEach(obj => pipeSize.push({ code: obj.size, name: obj.id, isActive: obj.isActive, charges : obj.charges }));
      payload.MdmsRes['ws-services-calculation'].pipeSize = pipeSize;
      let waterSource = [], GROUND = [], SURFACE = [], BULKSUPPLY = [];
      payload.MdmsRes['ws-services-masters'].waterSource.forEach(obj => {
        waterSource.push({
          code: obj.code.split(".")[0],
          name: obj.name,
          isActive: obj.active
        });
        if (obj.code.split(".")[0] === "GROUND") {
          GROUND.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          });
        } else if (obj.code.split(".")[0] === "SURFACE") {
          SURFACE.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          });
        } else if (obj.code.split(".")[0] === "BULKSUPPLY") {
          BULKSUPPLY.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          })
        }
      })
      let filtered = waterSource.reduce((filtered, item) => {
        if (!filtered.some(filteredItem => JSON.stringify(filteredItem.code) == JSON.stringify(item.code)))
          filtered.push(item)
        return filtered
      }, [])
      payload.MdmsRes['ws-services-masters'].waterSource = filtered;
      payload.MdmsRes['ws-services-masters'].GROUND = GROUND;
      payload.MdmsRes['ws-services-masters'].SURFACE = SURFACE;
      payload.MdmsRes['ws-services-masters'].BULKSUPPLY = BULKSUPPLY;
    }
    if( payload.MdmsRes['PropertyTax'].UsageCategory !== undefined){
      payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
        if(item.code.split(".").length<=1){
            UsageType.push({
              active:item.active,
              name:item.name,
              code:item.code,
              fromFY:item.fromFY
            })
          }
      });
       payload.MdmsRes.PropertyTax.UsageType=UsageType;
      
       payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
        if(item.code.split(".").length==2){
          subUsageType.push({
              active:item.active,
              name:item.name,
              code:item.code,
              fromFY:item.fromFY
            })
          }
      });
      payload.MdmsRes.PropertyTax.subUsageType=subUsageType;
    }

    if(payload.MdmsRes['PropertyTax'].OwnerShipCategory !== undefined)
    {
      payload.MdmsRes.PropertyTax.OwnerShipCategory.forEach(item=>{
        if(item.code.split("INDIVIDUAL.").length==2){
          OwnerShipCategory.push({
              active:item.active,
              name:item.name,
              code:item.code,
             // fromFY:item.fromFY
            })
          }
      });
      payload.MdmsRes.PropertyTax.OwnerShipCategory=OwnerShipCategory;

    }
    let cities = state.common.cities || [];
    let City = []
    for (let index = 0; index < cities.length; index++) {
      const element = cities[index];
      
      City.push(
        {
          name:element.city.name,
          code:element.code
        }
      )
    }
   // dispatch(prepareFinalObject("applyScreenMdmsData.City", City));
    payload.MdmsRes.City = City
    dispatch(prepareFinalObject("applyScreen.property.address.city", City[0].name));
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    if(payload.MdmsRes['ws-services-masters'].sectorList !== undefined)
    dispatch(prepareFinalObject("applyScreenMdmsData.ws-services-masters.wssectorList", payload.MdmsRes['ws-services-masters'].sectorList));
    //
  } catch (e) { console.log(e); }
};

export const getData = async (action, state, dispatch) => {
  const applicationNo = getQueryArg(window.location.href, "applicationNumber");
  let tenantId = getQueryArg(window.location.href, "tenantId");
  const propertyID = getQueryArg(window.location.href, "propertyId");
  await getMdmsData(state, dispatch);
  setModule("rainmaker-ws,rainmaker-pt");
 // setModule("rainmaker-pt");
    const userInfo = JSON.parse(getUserInfo());
     tenantId = getTenantId()// process.env.REACT_APP_NAME === "Citizen" ? (userInfo.permanentCity || userInfo.tenantId): getTenantId();
      dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
  if (applicationNo) {
    //Edit/Update Flow ----
   // let queryObject = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNo }];
    let queryObject = [{ key: "applicationNumber", value: applicationNo }];
    if (getQueryArg(window.location.href, "action") === "edit") {
      handleApplicationNumberDisplay(dispatch, applicationNo)
      let payloadWater, payloadSewerage;
      if (applicationNo.includes("SW")) {
        try { payloadSewerage = await getSearchResultsForSewerage(queryObject, dispatch) } catch (error) { console.error(error); }
        payloadSewerage.SewerageConnections[0].water = false;
        payloadSewerage.SewerageConnections[0].sewerage = true;
        dispatch(prepareFinalObject("SewerageConnection", payloadSewerage.SewerageConnections));
      } else {
        try { payloadWater = await getSearchResults(queryObject) } catch (error) { console.error(error); };
        payloadWater.WaterConnection[0].water = true;
        payloadWater.WaterConnection[0].sewerage = false;
        if(payloadWater.WaterConnection[0].activityType === "NEW_TUBEWELL_CONNECTION"){
          payloadWater.WaterConnection[0].water = false;
          payloadWater.WaterConnection[0].tubewell = true;
          dispatch(prepareFinalObject("applyScreen.water", false));
          dispatch(prepareFinalObject("applyScreen.tubewell", true));
          toggleWaterFeilds(action, false);
        }
        //set modify property
        payloadWater.WaterConnection[0].property.subusageCategory = payloadWater.WaterConnection[0].property.usageCategory;
        if(payloadWater.WaterConnection[0].property.usageCategory !==undefined)
        
        payloadWater.WaterConnection[0].property.usageCategory = payloadWater.WaterConnection[0].property.usageCategory.split('.')[0];        
        payloadWater.WaterConnection[0].property.noOfFloors = String(payloadWater.WaterConnection[0].property.noOfFloors);

        
        dispatch(prepareFinalObject("WaterConnection", payloadWater.WaterConnection));
       
        if(payloadWater && payloadWater.WaterConnection.length > 0){
          const {usageCategory } = payloadWater.WaterConnection[0].waterProperty;
          const {applicationStatus,proposedPipeSize} = payloadWater.WaterConnection[0];
          let subTypeValues = get(
                state.screenConfiguration.preparedFinalObject,
                "applyScreenMdmsData.PropertyTax.subUsageType"
              );
    
            let subUsage=[];
            if(subTypeValues !== undefined)
            {
              subUsage = subTypeValues.filter(cur => {
                        return (cur.code.startsWith(usageCategory))
                      });
                dispatch(prepareFinalObject("propsubusagetypeForSelectedusageCategory",subUsage));

            }            
    // binddependent dropdown object Property Sub Usage Type , Uses Caregory
    const usageCategory_ = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.usageCategory");
    const waterApplicationType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].waterApplicationType");
    const activityType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].waterApplicationType");
    displaysubUsageType(usageCategory_, dispatch, state);
    displayUsagecategory(waterApplicationType, dispatch, state);
                // check for security deposite for PENDING_FOR_SECURITY_DEPOSIT//PENDING_ROADCUT_NOC_BY_CITIZEN
                if(applicationStatus === "PENDING_FOR_SECURITY_DEPOSIT" || applicationStatus === "PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT"){
                    //regular
                    if(waterApplicationType ==='REGULAR')
                    {
                      if(proposedPipeSize == 15 && activityType ==='NEW_WS_CONNECTION'){
                        const {applyScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
  
                        const pipeSize = applyScreenMdmsData['ws-services-calculation'].PipeSize.filter(pipeSize => pipeSize.size == 15);
                        const securityCharges = pipeSize[0].charges[0].security;
                
                        dispatch(
                          handleField(
                            "apply",
                            "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.enterSecurityAmount",
                            "props.value",
                            securityCharges
                          )
                        );
                       
                        applyScreen.waterApplication.securityCharge
  
                        dispatch(
                          handleField(
                            "apply",
                            "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.enterSecurityAmount",
                            "props.disabled",
                            true
                          )
                        );
                        payloadWater.WaterConnection[0].securityCharge = securityCharges;
                         //set security
                        dispatch(prepareFinalObject("applyScreen.securityCharge", securityCharges));
                        dispatch(prepareFinalObject("WaterConnection[0].securityCharge", securityCharges));
                        payloadWater.WaterConnection[0].waterApplication.securityCharge = securityCharges;
                        dispatch(prepareFinalObject("applyScreen.waterApplication.securityCharge", securityCharges));
                        //
                      }else{
                        dispatch(
                          handleField(
                            "apply",
                            "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.enterSecurityAmount",
                            "props.disabled",
                            false
                          )
                        );
                      }
                    }
                    else
                    {
                      dispatch(
                        handleField(
                          "apply",
                          "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.enterSecurityAmount",
                          "props.disabled",
                          false
                        ))

                    }
                  
                    

                }
                else {
                  dispatch(prepareFinalObject("applyScreen.waterApplication.isFerruleApplicable",true));
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.enterSecurityAmount",
                      "props.disabled",
                      true
                    )
                  );
                }
        }
      }
      const waterConnections = payloadWater ? payloadWater.WaterConnection : []
      const sewerageConnections = payloadSewerage ? payloadSewerage.SewerageConnections : [];
      let combinedArray = waterConnections.concat(sewerageConnections);
      combinedArray[0].property.subusageCategory = combinedArray[0].property.subusageCategory;
      if(combinedArray[0].property.usageCategory !==undefined)
      combinedArray[0].property.usageCategory = combinedArray[0].property.usageCategory.split('.')[0];
      combinedArray[0].property.noOfFloors = String(combinedArray[0].property.noOfFloors);
      const {applyScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
      if(applyScreenMdmsData['ws-services-calculation'] !== undefined)
      {
      if(applyScreenMdmsData['ws-services-calculation'].PipeSize)
      {
      const pipeSize = applyScreenMdmsData['ws-services-calculation'].PipeSize.filter(pipeSize => pipeSize.size == combinedArray[0].proposedPipeSize);

       if(pipeSize&&pipeSize[0])
       {  
         set(combinedArray[0],'sanctionedCapacity',pipeSize[0].SanctionCapacity)          
         set(combinedArray[0],'meterRentCode',pipeSize[0].MeterRentCode)
        dispatch(
          prepareFinalObject(
            "applyScreen.sanctionedCapacity",
            pipeSize[0].SanctionCapacity
          )
        )
        dispatch(
          prepareFinalObject(
            "applyScreen.meterRentCode",
            pipeSize[0].MeterRentCode
          )
        )
       }
      }
    }
      dispatch(prepareFinalObject("applyScreen", findAndReplace(combinedArray[0], "null", "NA")));
      // For oldvalue display
      let oldcombinedArray = cloneDeep(combinedArray[0]);
      dispatch(prepareFinalObject("applyScreenOld", findAndReplace(oldcombinedArray, "null", "NA")));
      if(combinedArray[0].connectionHolders && combinedArray[0].connectionHolders !== "NA"){
        combinedArray[0].connectionHolders[0].sameAsPropertyAddress = false;
        dispatch(prepareFinalObject("connectionHolders", combinedArray[0].connectionHolders));
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
            "props.isChecked",
            false
          )
        ); 
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails",
            "visible",
            true
          )
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.connectionHolderDetails.visible",
          true
        );       
      }
      else
      {
        // combinedArray[0].connectionHolders[0].sameAsPropertyAddress = true;        
        // combinedArray[0].connectionHolders[0].name = combinedArray[0].property.owners[0].name ==='NA'?'':propertyObj.owners[0].name;
        // combinedArray[0].connectionHolders[0].mobileNumber = combinedArray[0].property.owners[0].mobileNumber ==='NA'?'':propertyObj.owners[0].mobileNumber;
        // combinedArray[0].connectionHolders[0].fatherOrHusbandName = combinedArray[0].property.owners[0].fatherOrHusbandName ==='NA'?'':propertyObj.owners[0].fatherOrHusbandName;;
        // combinedArray[0].connectionHolders[0].correspondenceAddress = combinedArray[0].property.owners[0].correspondenceAddress ==='NA'?'':propertyObj.owners[0].correspondenceAddress;;
        // combinedArray[0].connectionHolders[0].ownerType = combinedArray[0].property.owners[0].ownerType ==='NA'?'':propertyObj.owners[0].ownerType;;
      dispatch(prepareFinalObject("connectionHolders[0].sameAsPropertyAddress", true));
      dispatch(prepareFinalObject("connectionHolders[0].name", combinedArray[0].property.owners[0].name ==='NA'?'':combinedArray[0].property.owners[0].name));
      dispatch(prepareFinalObject("connectionHolders[0].mobileNumber", combinedArray[0].property.owners[0].mobileNumber ==='NA'?'':combinedArray[0].property.owners[0].mobileNumber));
      dispatch(prepareFinalObject("connectionHolders[0].fatherOrHusbandName", combinedArray[0].property.owners[0].fatherOrHusbandName ==='NA'?'':combinedArray[0].property.owners[0].fatherOrHusbandName));
      dispatch(prepareFinalObject("connectionHolders[0].correspondenceAddress", combinedArray[0].property.owners[0].correspondenceAddress ==='NA'?'':combinedArray[0].property.owners[0].correspondenceAddress));
      dispatch(prepareFinalObject("connectionHolders[0].ownerType", combinedArray[0].property.owners[0].ownerType ==='NA'?'':combinedArray[0].property.owners[0].ownerType));
    
       // dispatch(prepareFinalObject("connectionHolders", combinedArray[0].connectionHolders));
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
            "props.isChecked",
            true
          )
        ); 
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails",
            "visible",
            true
          )
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.connectionHolderDetails.visible",
          true
        ); 

      }
      let data = get(state.screenConfiguration.preparedFinalObject, "applyScreen")
      if (data.connectionType !== "Metered") {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID",
            "visible",
            false
          )
        );
      }
      if (data.additionalDetails !== undefined && data.additionalDetails.detailsProvidedBy !== undefined) {
        if (data.additionalDetails.detailsProvidedBy === "Self") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberLicenceNo",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberName",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberMobNo",
              "visible",
              false
            )
          );
        } else if (data.additionalDetails.detailsProvidedBy === "ULB") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberLicenceNo",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberName",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberMobNo",
              "visible",
              true
            )
          );
        }
      }
      let propId = get(state.screenConfiguration.preparedFinalObject, "applyScreen.property.propertyId")
      dispatch(prepareFinalObject("searchScreen.propertyIds", propId));

      let docs = get(state, "screenConfiguration.preparedFinalObject");
      prepareDocumentsUploadData(state, dispatch);
      await prefillDocuments(
        docs,
        "displayDocs",
        dispatch
      );
    }
  } else if (propertyID) {
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "propertyIds", value: propertyID }];
    let payload = await getPropertyResults(queryObject, dispatch);
    let propertyObj = payload.Properties[0];
    dispatch(prepareFinalObject("applyScreen.property", findAndReplace(propertyObj, null, "NA")));
    dispatch(prepareFinalObject("searchScreen.propertyIds", propertyID));

     //set applyScreen.waterProperty.usageCategory
     if(propertyObj)
     {
       //set Connection Holder Details same as in Owner Information

    //connectionHolders[0].mobileNumber
    dispatch(prepareFinalObject("applyScreen.waterProperty.usageCategory",  propertyObj.usageCategory));
    dispatch(prepareFinalObject("connectionHolders[0].name", propertyObj.owners[0].name ==='NA'?'':propertyObj.owners[0].name));
    dispatch(prepareFinalObject("connectionHolders[0].mobileNumber", propertyObj.owners[0].mobileNumber==='NA'?'':propertyObj.owners[0].mobileNumber));
    dispatch(prepareFinalObject("connectionHolders[0].emailId", propertyObj.owners[0].emailId==='NA'?'':propertyObj.owners[0].emailId));
    dispatch(prepareFinalObject("connectionHolders[0].correspondenceAddress", propertyObj.owners[0].correspondenceAddress==='NA'?'':propertyObj.owners[0].correspondenceAddress));
    //dispatch(prepareFinalObject("connectionHolders[0].ownerType", propertyObj.owners[0].ownerType==='NA'?'NONE':propertyObj.owners[0].ownerType));
    prepareDocumentsUploadData(state, dispatch);
     }
     
  }
  //set document
  // dispatch(prepareFinalObject("applyScreen.property.subusageCategory", "RESIDENTIAL.PLOTTED"));
  // dispatch(prepareFinalObject("applyScreen.waterProperty.usageSubCategory", "PRIVATEHOUSESWITHINSECTORS"));
  // dispatch(prepareFinalObject("applyScreen.waterApplicationType", "REGULAR"));
  // prepareDocumentsUploadData(state, dispatch);

  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail",
      "visible",
      true
    )
  )
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail",
      "visible",
      false
    )
  )
};

const getApplyScreenChildren = () => {
 const wnsStatus =  window.localStorage.getItem("WNS_STATUS");
 
 if(wnsStatus){
  switch(wnsStatus){
    case "UPDATE_CONNECTION_HOLDER_INFO" : return {connectionHolderDetails }; 
    case "REACTIVATE_CONNECTION":
    case "TEMPORARY_DISCONNECTION":
    case "PERMANENT_DISCONNECTION":
       return {commentSectionDetails };  
    case "CONNECTION_CONVERSION":
    return {connConversionDetails};
    case "APPLY_FOR_REGULAR_INFO":
    case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION": 
    case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION": 
      return { IDDetails, OwnerInfoCard,Details, propertyUsageDetails, ownerDetails,connectionHolderDetails,  };
    default :    return { IDDetails,OwnerInfoCard, Details, propertyUsageDetails,ownerDetails, connectionHolderDetails,  };
  }
 }
 else {
   return { IDDetails,OwnerInfoCard, Details,  propertyUsageDetails,ownerDetails, connectionHolderDetails,  };
 }

}

const propertyDetail = getPropertyDetails();
const propertyIDDetails = getPropertyIDDetails();
const ownerDetail = getOwnerDetails();
const MultiownerDetail = getMultipleOwnerDetails();
//const ownerMulDetail = getMultipleOwnerDetails();
// const MaterialIndentDetailsCard = {
//   uiFramework: "custom-containers-local",
//   moduleName: "egov-store-asset",
//   componentPath: "MultiItem",
//   props: {
//     scheama: getCommonGrayCard({
//       storeDetailsCardContainer: getCommonContainer(
//         {

//           MaterialDescription: {
//             ...getTextField({
//               label: {
//                 labelName: "Material Description",
//                 labelKey: "STORE_MATERIAL_DESCRIPTION"
//               },
//               placeholder: {
//                 labelName: "Material Description",
//                 labelKey: "STORE_MATERIAL_DESCRIPTION"
//               },
//               props:{
//                 disabled:true
//               },
//               required: false,
//               pattern: getPattern("Name") || null,
//               jsonPath: "indents[0].indentDetails[0].material.description"
//             })
//           },
//           UOMName: {
//             ...getSelectField({
//               label: {
//                 labelName: "UOM Name",
//                 labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
//               },
//               placeholder: {
//                 labelName: "Indent Purpose",
//                 labelKey: "STORE_MATERIAL_INDENT_UOM_NAME_SELECT"
//               },
             
//               required: false,
//               pattern: getPattern("Name") || null,
//               jsonPath: "indents[0].indentDetails[0].uom.code",
//               sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
//               props: {
//                 disabled:true,
//                 optionLabel: "name",
//                 optionValue: "code"
//               },
//             })
//           },
         
//         },
//         {
//           style: {
//             overflow: "visible"
//           }
//         }
//       )
//     }),
//     onMultiItemDelete:(state, dispatch)=>{       

//     },
//     onMultiItemAdd: (state, muliItemContent) => {
     
//       return muliItemContent;
//     },
//     items: [],
//     hasAddItem:!false,
//     isReviewPage:true,
//     addItemLabel: {
//       labelName: "ADD",
//       labelKey: "STORE_MATERIAL_COMMON_CARD_ADD"
//     },
//     headerName: "Store",
//     totalIndentQty:false,
//     headerJsonPath:
//       "children.cardContent.children.header.children.head.children.Accessories.props.label",
//     sourceJsonPath: "indents[0].indentDetails",
//      //Update Total value when delete any card configuration settings     
//     cardtotalpropes:{
//       totalIndentQty:false,
//       pagename:`creatindent`,
//       cardJsonPath:"components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items",
//       jasonpath:"indents[0].indentDetails",
//       InputQtyValue:"indentQuantity",
//       TotalValue:"totalValue",
//       TotalQty:"userQuantity"
//     },
//     prefixSourceJsonPath:
//       "children.cardContent.children.storeDetailsCardContainer.children"
//   },
//   type: "array"
// };
const holderDetails = getHolderDetails();
const commentDetails = getCommentDetails();
 const connectionConversionDetails =getConnectionConversionDetails();
 const propertyUsage = getPropertyUsageDetails();
export const ownerDetails = getCommonCard({ ownerDetailsHeader, 
  ownershipTypeInput: {
    ...getSelectField({
      label: { labelName: "Ownership Type", labelKey: "WS_OWN_DETAIL_OWNERSHIP_TYPE_LABEL" },
      placeholder: {
        labelName: "Select Purpose of Issue",
        labelKey: "WS_OWN_DETAIL_OWNERSHIP_TYPE_LABEL"
      },

      required: true,
     // errorMessage:"STORE_VALIDATION_PURPOSE_OF_ISSUE_SELECT",
      jsonPath: "applyScreen.property.ownershipCategory",
      sourceJsonPath: "applyScreenMdmsData.PropertyTax.OwnerShipCategory",
    props: {
      // data: [
      //   {
      //     code: "A",
      //     name: "Single"
      //   },
      //   {
      //     code: "B",
      //     name: "Multiple"
      //   },
       
      // ],
      optionValue: "code",
      optionLabel: "name",
      disabled: IsEdit,
    },
    }),
    beforeFieldChange: (action, state, dispatch) => {
      //ReturntoSupplier In case user has selected ‘return to supplier’
      //dispatch(prepareFinalObject("applyScreen.connectionHolders[0].ownerType", action.value));
      if(action.value === "INDIVIDUAL.MULTIPLEOWNERS")
      {
        dispatch(handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail",
            "visible",
            false
          ))
          dispatch(handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail",
            "visible",
            true
          ))
        
        }
      else
      {
        dispatch(handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail",
            "visible",
            true
          ))
          dispatch(handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail",
            "visible",
            false
          ))
          if(state.screenConfiguration.preparedFinalObject.applyScreen.property)
          {
          if(state.screenConfiguration.preparedFinalObject.applyScreen.property.owners)
          {
            let owners = state.screenConfiguration.preparedFinalObject.applyScreen.property.owners
            if(owners.length>0)
            {
              owners = owners.filter(x=>x.isDeleted !== false)
              dispatch(prepareFinalObject("applyScreen.property.owners",owners));
            }
          }
          }
          

        
        }
    }
    
  },
  
  ownerDetail ,MultiownerDetail});
export const IDDetails = getCommonCard({ propertyHeader, propertyID, propertyIDDetails });//propertyID
export const Details = getCommonCard({ propertyDetail });
export const connectionHolderDetails = getCommonCard({ holderHeader, sameAsOwner, holderDetails })
export const propertyUsageDetails = getCommonCard({PropertyUsageHeader,propertyUsage});
export const commentSectionDetails = getCommonCard({commentHeader,commentDetails})
export const connConversionDetails = getCommonCard({ ConnectionConversionHeader,connectionConversionDetails})
export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form1" },
  children: getApplyScreenChildren(),
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form2" },
  children: { documentDetails },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form3" },
  children: { additionDetails },
  visible: false
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form4" },
  children: { summaryScreen },
  visible: false
};

const pageReset = (dispatch) => {
  dispatch(prepareFinalObject("WaterConnection", []));
  dispatch(prepareFinalObject("SewerageConnection", []));
  dispatch(prepareFinalObject("applyScreen", {}));
  dispatch(prepareFinalObject("searchScreen", {}));
  dispatch(prepareFinalObject("connectionHolders", []));
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    pageReset(dispatch);
    getData(action, state, dispatch).then(() => { });
    dispatch(prepareFinalObject("applyScreen.water", true));
    dispatch(prepareFinalObject("applyScreen.sewerage", false));
    dispatch(prepareFinalObject("applyScreen.tubewell", false));
    const propertyId = getQueryArg(window.location.href, "propertyId");

    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    if(!applicationNumber)
    {
      window.localStorage.removeItem("WNS_STATUS");
    }

    if (propertyId) {
      togglePropertyFeilds(action, true);
      if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.water") && get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, true);
      } else if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        toggleWaterFeilds(action, false);
        toggleSewerageFeilds(action, true);
      } else {
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, false);
      }
    } else if (applicationNumber && getQueryArg(window.location.href, "action") === "edit") {
     

      togglePropertyFeilds(action, true);
      if (applicationNumber.includes("SW")) {
        dispatch(prepareFinalObject("applyScreen.water", false));
        dispatch(prepareFinalObject("applyScreen.sewerage", true));
        dispatch(prepareFinalObject("applyScreen.tubewell", false));
        toggleWaterFeilds(action, false);
        toggleSewerageFeilds(action, true);
      } else {
       const isTubeWell = window.localStorage.getItem("isTubeWell");
       if(isTubeWell && isTubeWell == "true"){
        dispatch(prepareFinalObject("applyScreen.water", false));
        dispatch(prepareFinalObject("applyScreen.sewerage", false));
        dispatch(prepareFinalObject("applyScreen.tubewell", true));
        toggleWaterFeilds(action, false);
        toggleSewerageFeilds(action, false);
       }else{
        dispatch(prepareFinalObject("applyScreen.water", true));
        dispatch(prepareFinalObject("applyScreen.sewerage", false));
        dispatch(prepareFinalObject("applyScreen.tubewell", false));
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, false);
       }
       
       window.localStorage.removeItem("isTubeWell");
    
      }
    } else {
      // togglePropertyFeilds(action, false)
      // if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.water") && get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
      //   toggleWaterFeilds(action, true);
      //   toggleSewerageFeilds(action, true);
      // } else if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
      //   toggleWaterFeilds(action, false);
      //   toggleSewerageFeilds(action, true);
      // } else {
      //   toggleWaterFeilds(action, true);
      //   toggleSewerageFeilds(action, false);
      // }
      togglePropertyFeilds(action, true)
      if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.water") && get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, false);
      } else if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        toggleWaterFeilds(action, false);
        toggleSewerageFeilds(action, true);
      } else {
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, true);
        if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.water"))
        {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.propertyUsageDetails.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.contractValue.visible",          
          true
        );
        }
        if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage"))
        {
          set(
            action.screenConfig,
            "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.contractValue.visible",          
            false
          );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.propertyUsageDetails.visible",
          false
        );
        }
      }
      // action(
      //   "apply",
      //   "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets",
      //   "visible",
      //   false
      // );

      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets.visible",
        false
      );
    }

    // const tenantId = getTenantId();
    // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

   
    
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: { className: "common-div-css search-preview" },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: { header: { gridDefination: { xs: 12, sm: 10 }, ...header } }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        footer
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: { open: false, maxWidth: "md", screenKey: "apply" }
    }
  }
};

export default screenConfig;