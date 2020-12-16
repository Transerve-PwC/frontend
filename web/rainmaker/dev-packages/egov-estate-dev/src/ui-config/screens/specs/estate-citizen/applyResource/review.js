import { getCommonSubHeader, getCommonGrayCard, getLabelWithValue as _getLabelWithValue, getCommonContainer, getCommonCard, getCommonTitle, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "../footer";
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertEpochToDate } from "../../utils";

function getLabelWithValue(labelName, path, visible) {
  const label = _getLabelWithValue(labelName, path);
  label.visible = visible
  // label.gridDefination.xs = 12;
  return label;
}


const headerDiv = (isEditable = true, label, step) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
        style: { marginBottom: "10px" }
    },
    children: {
      header: {
          gridDefination: {
              xs: 8,
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
                labelKey: "ES_SUMMARY_EDIT"
            })
        },
        visible: isEditable,
        onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "_apply", "", step);
        }
    }
    }
    }
  }
}

export const setYesOrNo = (value) => {
  return value == "true" ? "Yes" : "No";
}

const setArrayValues = (value) => { 
  const array = value.map(item => getLocaleLabels(item, item))
  return !!array.length ? array.join(", ") : "-"
}

const callBackForPreview = (type) => (value) => {
  switch(type) {
    case "date": return convertEpochToDate(value)
    case "boolean": return setYesOrNo(value)
    case "array": return setArrayValues(value)
  }
}

export const viewFour = (section, application) => {
  const {fields = [], type} = section
  switch(type) {
    case "DOCUMENTS" : {
      return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-estate",
        componentPath: "DownloadFileContainer",
        props: {
          sourceJsonPath: section.sourceJsonPath,
          className: "review-documents",
          style: {
            wordBreak: "break-word"
          }
        }
      }
    }
    case "LIST": {
      const contents = section.fields.map(item => ({...item, callBack: item.type === "date" ? convertEpochToDate : null}))
      return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-estate",
        componentPath: "MultipleCardContainer",
        props: {
          sourceJsonPath: section.sourceJsonPath,
          contents
        }
      }
    }
    default: {
      const field_types = fields.reduce((acc, field) => {
        const visible = !!field.visibility ? eval(field.visibility) : true
        return {
        ...acc, 
        [field.label]: getLabelWithValue({
          labelName: field.label,
          labelKey: field.label
        },
        { jsonPath: field.jsonPath,
          callBack: !!field.type ? callBackForPreview(field.type) : null
         }, visible)
        }
      }, {})
      return getCommonContainer(field_types)
    }
  }
}

export const setThirdStep = async ({state, dispatch, applicationType, preview, data: application = {}, isEdit = true, showHeader = true}) => {
    const {sections = []} = preview;
    let details = sections.filter(item => !!item.visibility ? eval(item.visibility) : true)
      .reduce((acc, section, index) => {
      const {step, header, isEditable = true} = section
      return {
        ...acc,
        [section.header]: getCommonGrayCard({
          headerDiv: headerDiv(isEdit && isEditable , header, step),
          viewFour: viewFour(section, application)
        })
      }
    }, {})
    details = !!showHeader ? { header: getCommonTitle({
      labelName: "Summary",
      labelKey: "ES_SUMMARY_HEADER"
    }),
    ...details
    } : details
    return details
  }