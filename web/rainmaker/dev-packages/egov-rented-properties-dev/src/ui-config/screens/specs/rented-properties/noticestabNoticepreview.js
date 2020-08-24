import {
    getCommonHeader,getCommonCard,getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg} from "egov-ui-framework/ui-utils/commons";
import { get } from "lodash";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getImages } from "./property-transitImages";
import { getReviewDocuments } from "./applyResource/review-documents";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getNoticeReviewProperty, getNoticeViolationPreviewReviewRentDetails, getNoticeRecoveryPreviewReviewRentDetails} from "./applyResource/review-property";


const reviewNoticePropertyDetails = getNoticeReviewProperty(false);
const reviewNoticeViolationRentDetails = getNoticeViolationPreviewReviewRentDetails(false);
const reviewNoticeRecoveryRentDetails = getNoticeRecoveryPreviewReviewRentDetails(false);
const reviewNoticeDocuments = getReviewDocuments(false,"apply","SingleProperties[0].applicationDocuments",true);
let NoticedetailsId = getQueryArg(window.location.href, "NoticedetailsId");

const header = getCommonContainer({
    header : getCommonHeader({
    labelName: "Notice Summary",
    labelKey: "RP_NOTICE_PREVIEW_SUMMARY"
  })
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
      name: urls[index].split("?")[0].split("/").pop().slice(13)
      }));
      return { ...item, applicationDocuments };
    });
    // const {Properties} = payload;
    // const {owners = []} = propertyArr[0]
    // const findOwner = propertyArr.find(item => !!item.activeState) || {}
    // if(!!findOwner.isPrimaryOwner){
    //     dispatch(
    //         prepareFinalObject(
    //             "SingleProperties[0].originalAllottee",
    //             findOwner.ownerDetails.name
    //         )
    //         )
    // }
    singleNoticeDetails = [...singleNoticeDetails,notices]  
    dispatch(prepareFinalObject("SingleProperties[0]", singleNoticeDetails[0]));

    if(singleNoticeDetails[0].noticeType === "Violation"){
        let path = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeRecoveryRentDetails"
        dispatch(
          handleField(
            "noticestabNoticepreview",
            path,
            "visible",
            false
          )
        );
       }
    else if(singleNoticeDetails[0].noticeType === "Recovery"){
        let path = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeViolationRentDetails"
        let pathdoc = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeDocuments"
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
    }
    
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
                                labelName: "DOWNLOAD",
                                labelKey: "RP_APPLICATION_BUTTON_DOWN"
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
                                labelName: "PRINT",
                                labelKey: "RP_APPLICATION_BUTTON_PRINT"
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