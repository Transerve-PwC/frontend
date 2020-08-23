import {
    getCommonHeader,getCommonCard,getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg,setDocuments } from "egov-ui-framework/ui-utils/commons";
import { get } from "lodash";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewDocuments } from "./applyResource/review-documents";
import { getNoticePreviewReviewProperty,getNoticeReviewProperty,getNoticePreviewViolationReviewRentDetails,getNoticePreviewRecoveryReviewRentDetails,getNoticePreviewReviewRentDetails } from "./applyResource/review-property";


const reviewNoticePropertyDetails = getNoticeReviewProperty(false);
const reviewNoticeRentDetails = getNoticePreviewReviewRentDetails(false);
const reviewNoticeDocuments = getReviewDocuments(false,"apply","SingleProperties[0].applicationDocuments");
// const reviewNoticeRentDetailsRecovery = getNoticePreviewRecoveryReviewRentDetails(false);
let NoticedetailsId = getQueryArg(window.location.href, "NoticedetailsId");

const header = getCommonContainer({
    header : getCommonHeader({
    labelName: "Notice Summary",
    labelKey: "RP_NOTICE_PREVIEW_SUMMARY"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-rented-properties",
    componentPath: "ApplicationNoContainer",
    props: {
      number: NoticedetailsId
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
    singleNoticeDetails = [...singleNoticeDetails]
    dispatch(prepareFinalObject("SingleProperties[0]", singleNoticeDetails[0]));
    
}

// let singlePropdata = get(
//     state.screenConfiguration.preparedFinalObject,
//     "SingleProperties[0]",
//     []);
// const noticeDocumentDetails = (singlePropdata[0].noticeType === "Violation") ? getCommonCard({
//     reviewNoticePropertyDetails,
//     reviewNoticeRentDetailsViolation
// }) : getCommonCard({
//     reviewNoticePropertyDetails,
//     reviewNoticeRentDetailsRecovery
// })
const noticeDocumentDetails = getCommonCard({
        reviewNoticePropertyDetails,
        reviewNoticeRentDetails,
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
                        header: {
                            gridDefination: {
                              xs: 12,
                              sm: 10
                            },
                            ...header
                          }
                    }
                },
                rightdiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    props: {
                      style: { justifyContent: "flex-end", marginTop: 10 }
                    },
                    gridDefination: {
                      xs: 12,
                      sm: 12,
                      align: "right"
                    },
                    children: {
                        downloadFormButton: {
                            componentPath: "Button",
                            props: {
                              variant: "outlined",
                              color: "primary",
                              style: {
                                minWidth: "180px",
                                height: "48px",
                                marginRight: "16px"
                              }
                            },
                            children: {
                              downloadFormButtonLabel: getLabel({
                                labelName: "DOWNLOAD CONFIRMATION FORM",
                                labelKey: "TL_APPLICATION_BUTTON_DOWN_CONF"
                              })
                            },
                            // onClickDefination: {
                            //   action: "condition",
                            //   callBack: () => {
                            //   const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
                            //   const documents = LicensesTemp[0].reviewDocData;
                            //   set(Licenses[0],"additionalDetails.documents",documents)
                            //   downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData);
                            //   }
                            // },
                            visible:true
                          },
                          printFormButton: {
                            componentPath: "Button",
                            props: {
                              variant: "outlined",
                              color: "primary",
                              style: {
                                minWidth: "180px",
                                height: "48px",
                                marginRight: "16px"
                              }
                            },
                            children: {
                              printFormButtonLabel: getLabel({
                                labelName: "PRINT CONFIRMATION FORM",
                                labelKey: "TL_APPLICATION_BUTTON_PRINT_CONF"
                              })
                            },
                            // onClickDefination: {
                            //   action: "condition",
                            //   callBack: () => {
                            //   const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
                            //   const documents = LicensesTemp[0].reviewDocData;
                            //   set(Licenses[0],"additionalDetails.documents",documents)
                            //   downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData,'print');
                            //   }
                            // },
                            visible:true
                          }
                    }
                  },
                formwizardFirstStep: noticeDocumentDetails
            }
        }
    }
}

export default NoticedetailsPreview