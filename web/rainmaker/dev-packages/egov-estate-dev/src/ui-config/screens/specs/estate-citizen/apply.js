import { getCommonHeader, getTextField, getCommonContainer, getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { stepper } from '../estate/applyResource/applyConfig'
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {dataFormat} from './sample.json'
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

const textFieldObj = item => {
    const {label, placeHolder, ...rest} = item
    return getTextField({
        label: {
            labelName: label,
            labelKey: label
        },
        placeholder: {
            labelName: placeHolder,
            labelKey: placeHolder
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        ...rest
    })
}

const getDetailsContainer = ({fields = []}) => {
    const values = fields.reduce((acc, field) => {
        if(field.type === "text_field") {
            return {...acc, [field.label]: textFieldObj(field)}
        } else {
            return acc
        }
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