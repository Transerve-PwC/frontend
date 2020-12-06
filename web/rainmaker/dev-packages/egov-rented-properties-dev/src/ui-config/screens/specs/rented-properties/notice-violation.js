import {
    getCommonHeader,getCommonCard
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardFirstStep, noticeViolationForm, formwizardThirdStep} from './applyResource/applyConfig'
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {footer,Violationnoticegenfooter} from './applyResource/footer';
import { searchResults } from "./search-preview";
import { getQueryArg,setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareDocumentTypeObj } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";
import { getReviewDocuments } from "./applyResource/review-documents";
import { imageUploadDetailsProperties } from "./applyResource/imageUploadDetails";
import set from "lodash/set";
const getMdmsData = async (dispatch, body) => {
  let mdmsBody = {
        MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: body
      }
  };
  try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return payload;
  } catch (e) {
      console.log(e);
  }
};

const reviewDocumentDetails = getReviewDocuments(false, "notice-violation")

export const noticeDocumentDetails = getCommonCard({
  reviewDocumentDetails
});

const header = getCommonHeader({
    labelName: "Create Violation Notice",
    labelKey: "RP_VIOLATION_NOTICE_APPLY"
  });

const getData = async(action, state, dispatch) => {
  let payload;
  let propertyIdTransit = getQueryArg(window.location.href, "propertyIdTransit");
  const { screenConfiguration } = state;
  if(!!propertyIdTransit){
    let docdata=get(   screenConfiguration.preparedFinalObject,
      "SingleImage[0].applicationDocuments",
      [])
      if(docdata && docdata.length){
        docdata.map((item,index)=>{
item.documentType=`PROPERTYIMAGE${index+1}`
        })
      }
    payload = get(
      screenConfiguration.preparedFinalObject,
      "SingleImage",
      [])
      dispatch(prepareFinalObject("workflow.ProcessInstances", []))
      await setDocuments(
        payload[0],
        "applicationDocuments",
        "PropertiesTemp[0].reviewDocData",
        dispatch,'RP'
      );
      let path = "components.div.children.imageUploadDetailsProperties"
      dispatch(
        handleField(
          "notice-violation",
          path,
          "visible",
          false
        )
      );
  }
  else if(propertyIdTransit === null || propertyIdTransit === undefined || !propertyIdTransit){
    let docdata=get(   screenConfiguration.preparedFinalObject,
      "SingleImage[0].applicationDocuments",
      [])
      if(docdata && docdata.length){
        docdata.map((item,index)=>{
item.documentType=`PROPERTYIMAGE${index+1}`
        })
      }
    payload = []
    dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    await setDocuments(
      payload[0],
      "applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,'RP'
    );
      let path = "components.div.children.imageUploadDetailsProperties"
          dispatch(
            handleField(
              "notice-violation",
              path,
              "visible",
              true
            )
          );
      let pathDocs = "components.div.children.noticeDocumentDetails"
      dispatch(
        handleField(
          "notice-violation",
          pathDocs,
          "visible",
          false
        )
      );
      let violationDesc = get(state.screenConfiguration.screenConfig["notice-violation"],"components.div.children.formwizardFirstStep.children.ownerDetailsForViolationNotice.children.cardContent.children.detailsContainer.children.violations.props.value")
      dispatch(
          prepareFinalObject(
              "SingleProperties[0].violations",
              violationDesc
          )
          )
  }
  const propertyArr = get(
    screenConfiguration.preparedFinalObject,
    "Properties[0]",
    [])
  const orgOwner = propertyArr.owners.find(item => !!item.isPrimaryOwner)
    if(!!orgOwner){
        dispatch(
            prepareFinalObject(
                "Properties[0].owners[0].ownerDetails.originalAllottee",
                orgOwner.ownerDetails.name
            )
            )
    }
    let violationcomment = get(state.screenConfiguration.screenConfig["notice-violation"],"components.div.children.formwizardFirstStep.children.ownerDetailsForViolationNotice.children.cardContent.children.detailsContainer.children.violations.props.value")
        dispatch(
            prepareFinalObject(
                "Images[0].violations",
                violationcomment
            )
            )
}

const beforeInitFn =async(action, state, dispatch)=>{
  set(state, 'form.newapplication.files.media', []);
  let propertyIdTransit = getQueryArg(window.location.href, "propertyIdTransit");
  !propertyIdTransit ? set(state,'screenConfiguration.preparedFinalObject.Images',[]) : propertyIdTransit = getQueryArg(window.location.href, "propertyIdTransit")
  set(state,'screenConfiguration.preparedFinalObject.SingleProperties',[]);
  set(state,'screenConfiguration.preparedFinalObject.Properties[0].owners[0].ownerDetails.editor',"")
  const transitImagesPayload = [{
    moduleName: "RentedProperties",
    masterDetails: [{name: "applications"}]
  }]
  let documentsRes = await getMdmsData(dispatch, transitImagesPayload);

  if (documentsRes) {
    documentsRes = documentsRes.MdmsRes.RentedProperties.applications[0].documentList;

    documentsRes = documentsRes.filter(item => item.code == "TRANSIT_SITE_IMAGES");
    const imageLength = documentsRes[0].maxCount;
    dispatch(
      handleField(
        "notice-violation",
        "components.div.children.imageUploadDetailsProperties.children.cardContent.children.uploadimage.children.cardContent.children.imageUpload",
        "props.imageLength",
        imageLength
      )
    )
  }
}

const applyNoticeViolation = {
    uiFramework: "material-ui",
    name: "notice-violation",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch);
        getData(action, state, dispatch);
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
                formwizardFirstStep: noticeViolationForm,
                imageUploadDetailsProperties,
                noticeDocumentDetails,
                footer: Violationnoticegenfooter
            }
        }
    }
}

export default applyNoticeViolation