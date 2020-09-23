import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getTextField,
    getPattern,
    getLabelWithValue,
    getLabel,
    getSelectField,
  } from "egov-ui-framework/ui-config/screens/specs/utils";


  const commentDetails = getCommonContainer({
    remark: getTextField({
      label: {
        labelName: "Remark",
        labelKey: "WS_COMMENT_SECTION_REMARK_LABEL"
      },
      placeholder: {
        labelName: "Enter Remark",
        labelKey: "WS_COMMENT_SECTION_REMARK_LABEL_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Address"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "WaterConnection[0].waterApplication.comments",
      gridDefination: {
        xs: 12,
        sm: 6
      },
    }),
 
 
  });

export const commentHeader = getCommonSubHeader({
       labelKey: "WS_COMMON_COMMENTS_HEADER",
      labelName: "Comment Section"
 })
  
export const getCommentDetails = (isEditable = true) => {
  return getCommonContainer({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          }
        },
      }
    },
    CommentDetails: commentDetails
  });
};