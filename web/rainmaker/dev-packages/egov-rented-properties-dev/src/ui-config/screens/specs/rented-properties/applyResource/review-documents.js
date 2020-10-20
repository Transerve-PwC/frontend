import {
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { changeStep, changePropertyStep } from "./footer";
  
  export const getReviewDocuments = (isEditable = true, screenKey, sourceJsonPath = "PropertiesTemp[0].reviewDocData", isPropertyMaster = false ) => {
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          header: {
            gridDefination: {
              xs: 8,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "Images",
              labelKey: screenKey == "notice-violation" ? "RP_COMMON_VIOLATION_NOTICE_DOCS" :"RP_COMMON_DOCS"
            })
          },
          editSection: {
            componentPath: "Button",
            props: {
              color: "primary",
              style: {
                padding: "0px 16px",
                minHeight: "initial"
              }
            },
            gridDefination: {
              xs: 4,
              sm: 2,
              align: "right"
            },
            visible: isEditable,
            children: {
              editIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "edit"
                }
              },
              buttonLabel: getLabel({
                labelName: "Edit",
                labelKey: "RP_SUMMARY_EDIT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                !!isPropertyMaster ? changePropertyStep(state, dispatch, screenKey, "", 1) : changeStep(state, dispatch, screenKey, "", 1);
              }
            }
          },
          documents: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "DownloadFileContainer",
            props: {
              sourceJsonPath,
              className: "review-documents",
              noticeflag: true
            }
          }
        }
      }
    });
  };

  export const getReviewDocumentsNoticePreview = (isEditable = true, screenKey, sourceJsonPath = "PropertiesTemp[0].reviewDocData", isPropertyMaster = false ) => {
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "Images",
              labelKey: screenKey == "notice-violation" ? "RP_COMMON_VIOLATION_NOTICE_DOCS" :"RP_COMMON_VIOLATION_NOTICE_DOCS"
            })
          },
          editSection: {
            componentPath: "Button",
            props: {
              color: "primary"
            },
            gridDefination: {
              xs: 12,
              sm: 2,
              align: "right"
            },
            visible: isEditable,
            children: {
              editIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "edit"
                }
              },
              buttonLabel: getLabel({
                labelName: "Edit",
                labelKey: "RP_SUMMARY_EDIT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                !!isPropertyMaster ? changePropertyStep(state, dispatch, screenKey, "", 1) : changeStep(state, dispatch, screenKey, "", 1);
              }
            }
          },
          documents: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "DownloadFileContainerNotice",
            props: {
              sourceJsonPath,
              className: "review-documents",
            }
          }
        }
      }
    });
  };
