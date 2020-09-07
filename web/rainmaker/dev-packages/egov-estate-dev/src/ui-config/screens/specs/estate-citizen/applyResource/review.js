import { getCommonSubHeader, getCommonGrayCard, getLabelWithValue, getCommonContainer, getCommonCard, getCommonTitle, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "../footer";
import {preview} from '../preview.json'

const headerDiv = (isEditable = true, label, index) => {
  return {
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
          },
          ...getCommonSubHeader({
              labelName: label,
              labelKey: label
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
                labelKey: "TL_SUMMARY_EDIT"
            })
        },
        visible: isEditable,
        onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "apply", "", index);
        }
    }
    }
    }
  }
}

export const viewFour = (section) => {
  const {fields = [], type} = section
  switch(type) {
    case "DOCUMENTS" : {
      return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-estate",
        componentPath: "DownloadFileContainer",
        props: {
          sourceJsonPath: section.sourceJsonPath,
          className: "review-documents"
        }
      }
    }
    default: {
      const field_types = fields.reduce((acc, field) => {
        return {
        ...acc, 
        [field.label]: getLabelWithValue({
          labelName: field.label,
          labelKey: field.label
        },
        { jsonPath: field.jsonPath })
        }
      }, {})
      return getCommonContainer(field_types)
    }
  }
}


export const setThirdStep = async (state, dispatch) => {
    const {sections = []} = preview;
    const details = sections.reduce((acc, section, index) => {
      return {
        ...acc,
        [section.header]: getCommonGrayCard({
          headerDiv: headerDiv(true, section.header, index),
          viewFour: viewFour(section)
        })
      }
    }, {})
    const reviewDetails = getCommonCard({
      header: getCommonTitle({
        labelName: "Summary",
        labelKey: "RP_PM_SUMMARY_HEADER"
      }),
      ...details
    })
     return reviewDetails
  }