import { getCommonHeader, getTextField, getCommonContainer, getCommonCard, getSelectField, getPattern, getDateField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { stepper } from '../estate/applyResource/applyConfig'
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {dataFormat} from './sample.json'
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";

const header = getCommonHeader({
    labelName: "Apply",
    labelKey: "EST_COMMON_APPLY"
  });

const formwizardFirstStep = {
    uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
  }
}

const headerObj = value => {
    return getCommonHeader({
        labelName: value,
        labelKey: value
    })
}

const getField = item => {

  const {label: labelItem, placeHolder, type, pattern, editable = true, ...rest } = item
  
  let fieldProps = {
    label : {
      labelName: labelItem,
      labelKey: labelItem
    },
     placeholder : {
      labelName: placeHolder,
      labelKey: placeHolder
    },
     gridDefination : {
      xs: 12,
      sm: 6
    },
    props: { disabled: !editable }
  }

  fieldProps = !!pattern ? {...fieldProps, pattern: getPattern(pattern)} : fieldProps

  switch(type) {
    case "text_field": {
      return getTextField({
        ...fieldProps,
        ...rest
    })
    }
    case "dropDown": {
      return getSelectField({
        ...fieldProps,
        ...rest
      })
    }
    case "date": {
      return getDateField({
        ...fieldProps,
        ...rest,
        props: {...fieldProps.props, inputProps: {
          max: getTodaysDateInYMD()
      }
      },
        pattern: getPattern("Date")
      })
    }
    case "text_area": {
      return getTextField({
        ...fieldProps,
        ...rest,
        props:{
          ...fieldProps.props,
          multiline: true,
          rows: "2"
        }
      })
    }
    default: return getTextField({
      ...fieldProps,
      ...rest
  })
  }
}

const getDetailsContainer = ({fields = []}) => {
    const values = fields.reduce((acc, field) => {
      return {...acc, [field.label.replace(/ /g, "_")]: getField(field)}
    }, {})
    return getCommonContainer(values);
}

const getData = async (action, state, dispatch) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
    let { sections = [] } =  dataFormat;
    sections = sections.reduce((acc, section) => {
        return {
        ...acc, 
        [section.header.replace(/ /g, "_")]: getCommonCard({
            header: headerObj(section.header),
            details_container: getDetailsContainer(section)
        })
    }
    }, {})
    console.log("====sections", sections)
    dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep",
          "children",
          sections
        )
      );
}

const commonApply = {
    uiFramework: "material-ui",
    name: "apply",
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
            stepper,
            formwizardFirstStep
          }
        }
      }
}

export default commonApply;