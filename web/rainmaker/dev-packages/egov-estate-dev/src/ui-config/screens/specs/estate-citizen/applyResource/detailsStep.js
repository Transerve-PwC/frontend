import { getCommonCard, getCommonHeader, getCommonContainer, getPattern, getTextField, getSelectField, getDateField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {viewFour} from './review'

const headerObj = value => {
    return getCommonHeader({
        labelName: value,
        labelKey: value
    })
}

export const getRelationshipRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    type: "array"
  };


const getField = (item, fieldData) => {

    const {label: labelItem, placeholder, type, pattern, editable = true, ...rest } = item
    const {required, validations} = fieldData
    let fieldProps = {
      label : {
        labelName: labelItem,
        labelKey: labelItem
      },
       placeholder : {
        labelName: placeholder,
        labelKey: placeholder
      },
       gridDefination : {
        xs: 12,
        sm: 6
      },
      props: { disabled: !editable },
      required
    }
  
    fieldProps = !!pattern ? {...fieldProps, pattern: getPattern(pattern)} : fieldProps
  
    switch(type) {
      case "TEXT_FIELD": {
        return getTextField({
          ...fieldProps,
          ...rest
      })
      }
      case "DROP_DOWN": {
        return getSelectField({
          ...fieldProps,
          ...rest
        })
      }
      case "DATE_FIELD": {
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
      case "TEXT_AREA": {
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
      case "RADIO_BUTTON": {
          const findItem = validations.find(validation => validation.type === "enum")
          const buttons = !!findItem && !!findItem.params && !!findItem.params.values ? findItem.params.values.map(value => 
            ({
                labelName: `COMMON_RELATION_${value}`,
                labelKey: `COMMON_RELATION_${value}`,
                value
            })
            ) : []
          return {
              ...getRelationshipRadioButton,
              jsonPath: rest.jsonPath,
              required,
              props: {
                  label: {
                      name: labelItem,
                      key: labelItem
                  },
                  buttons,
                  jsonPath: rest.jsonPath,
                  required
              }
          }
      }
      default: return getTextField({
        ...fieldProps,
        ...rest
    })
    }
  }

const getDetailsContainer = (section, data_config) => {
    const {fields = []} = section;
    const values = fields.reduce((acc, field) => {
      const findFieldData = data_config.find(item => item.path === field.path)
      return {...acc, [field.label]: getField(field, findFieldData)}
    }, {})
    return getCommonContainer(values);
}

export const setFirstStep = (action, state, dispatch, {screenKey, screenPath, data_config, format_config}) => {
    let {sections = []} = format_config
    sections = sections.reduce((acc, section) => {
        return {
        ...acc, 
        [section.header]: getCommonCard({
            header: headerObj(section.header),
            details_container: section.type === "CARD_DETAIL" ? viewFour(section) : getDetailsContainer(section, data_config)
        })
    }
    }, {})
    dispatch(
        handleField(
          screenKey,
          screenPath,
          "children",
          sections
        )
      );
}