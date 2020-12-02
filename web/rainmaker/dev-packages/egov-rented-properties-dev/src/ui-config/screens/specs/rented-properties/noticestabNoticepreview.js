import {
    getCommonHeader,getCommonCard,getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg} from "egov-ui-framework/ui-utils/commons";
import { get } from "lodash";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getImages } from "./property-transitImages";
import { getReviewDocuments,getReviewDocumentsNoticePreview } from "./applyResource/review-documents";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { set } from "lodash";
import {downloadNoticeContainer} from "./applyResource/footer"
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getNoticeReviewProperty, getNoticeViolationPreviewReviewRentDetails, getNoticeRecoveryPreviewReviewRentDetails} from "./applyResource/review-property";

const reviewNoticePropertyDetails = getNoticeReviewProperty(false);
const reviewNoticeViolationRentDetails = getNoticeViolationPreviewReviewRentDetails(false);
const reviewNoticeRecoveryRentDetails = getNoticeRecoveryPreviewReviewRentDetails(false);
const reviewNoticeDocuments = getReviewDocumentsNoticePreview(false,"apply","SingleProperties[0].applicationDocuments",true);
let NoticedetailsId = getQueryArg(window.location.href, "NoticedetailsId");

const headerViolation = getCommonContainer({
  header : getCommonHeader({
    labelName: "Violation Notice",
  labelKey: "RP_NOTICE_VIOLATION_HEADER"
}),
applicationNumber: {
  uiFramework: "custom-atoms-local",
  moduleName: "egov-rented-properties",
  componentPath: "ApplicationNoContainer",
  props: {
    number: NoticedetailsId,
    notice:"Notice"
  }
}
});
const headerRecovery = getCommonContainer({
  header : getCommonHeader({
  labelName: "Recovery Notice",
  labelKey: "RP_NOTICE_RECOVERY_HEADER"
}),
applicationNumber: {
  uiFramework: "custom-atoms-local",
  moduleName: "egov-rented-properties",
  componentPath: "ApplicationNoContainer",
  props: {
    number: NoticedetailsId,
    notice:"Notice"
  }
}
});


const getData = async(action, state, dispatch) => {
    let NoticedetailsId = getQueryArg(window.location.href, "NoticedetailsId");
    let NoticeId = NoticedetailsId;
    const { screenConfiguration } = state;
    let propertyArr = get(
        screenConfiguration.preparedFinalObject,
        "Properties[0]",
        []);
    let singleNoticeDetails = propertyArr.notices.filter(item => item.memoNumber === NoticeId)
      
    let notices = await getImages(singleNoticeDetails);
    notices = notices.map(item => {
      let { applicationDocuments, urls } = item;
      applicationDocuments = applicationDocuments.map((image, index) => ({ ...image, url: urls[index],
      name: decodeURIComponent(urls[index].split("?")[0].split("/").pop().slice(13))
      }));
      return { ...item, applicationDocuments };
    });
    singleNoticeDetails = [...singleNoticeDetails,notices]  
    dispatch(prepareFinalObject("SingleProperties[0]", singleNoticeDetails[0]));

    const findOwner = propertyArr.owners.find(item => !!item.activeState)
    const orgOwner = propertyArr.owners.find(item => !!item.isPrimaryOwner)
    const currentownerId = propertyArr.propertyDetails.currentOwner
    const findCurrentOwner = propertyArr.owners.find(item => item.id === currentownerId)
    if(!!findCurrentOwner){
        dispatch(
            prepareFinalObject(
                "SingleProperties[0].OwnerName",
                findCurrentOwner.ownerDetails.name
            )
            )
    }
    if(!!findOwner.activeState){
        dispatch(
            prepareFinalObject(
                "SingleProperties[0].allotmentStartdate",
                findOwner.ownerDetails.allotmentStartdate
            )
            )
        dispatch(
            prepareFinalObject(
                "SingleProperties[0].allotmenNumber",
                findOwner.allotmenNumber
            )
            )
      
    }

    const printCont = downloadNoticeContainer(
      action,
      state,
      dispatch,
      status,
    );

    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );
    
    if(singleNoticeDetails[0].noticeType === "Violation"){
        let path = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeRecoveryRentDetails"
        let headerPathVio = "components.div.children.headerDiv.children.header1"
        dispatch(
          handleField(
            "noticestabNoticepreview",
            path,
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "noticestabNoticepreview",
            headerPathVio,
            "visible",
            true
          )
        );
       }
    else if(singleNoticeDetails[0].noticeType === "Recovery"){
        let path = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeViolationRentDetails"
        let pathdoc = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeDocuments"
        let headerPathRec = "components.div.children.headerDiv.children.header2"
        dispatch(
          handleField(
            "noticestabNoticepreview",
            path,
            "visible",
            false
          )
        );

        dispatch(
            handleField(
              "noticestabNoticepreview",
              pathdoc,
              "visible",
              false
            )
          );    
          dispatch(
            handleField(
              "noticestabNoticepreview",
              headerPathRec,
              "visible",
              true
            )
          );    
    }
    dispatch(
      handleField(
        "noticestabNoticepreview",
        "components.div.children.headerDiv.children.header1.children.applicationNumber",
        "props.number",
        NoticeId
      )
    );   

    dispatch(
      handleField(
        "noticestabNoticepreview",
        "components.div.children.headerDiv.children.header2.children.applicationNumber",
        "props.number",
        NoticeId
      )
    ); 
    
}


const noticeDocumentDetails = getCommonCard({
        reviewNoticePropertyDetails,
        reviewNoticeViolationRentDetails,
        reviewNoticeRecoveryRentDetails,
        reviewNoticeDocuments
    })

const NoticedetailsPreview = {
    uiFramework: "material-ui",
    name: "noticestabNoticepreview",
    beforeInitScreen: (action, state, dispatch) => {
        getData(action, state, dispatch)
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
                        header1: {
                            gridDefination: {
                              xs: 12,
                              sm: 8
                            },
                            ...headerViolation,
                            visible: false
                          },
                          header2: {
                            gridDefination: {
                              xs: 12,
                              sm: 8
                            },
                            ...headerRecovery,
                            visible: false
                          },
                          helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                              color: "primary",
                              style: { justifyContent: "flex-end" }
                            },
                            gridDefination: {
                              xs: 12,
                              sm: 4,
                              align: "right"
                            }
                          }
                    },
                  
                },
                formwizardFirstStep: noticeDocumentDetails
            }
        }
    }
}

export default NoticedetailsPreview