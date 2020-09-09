import { getCommonCard, getCommonHeader, getCommonContainer, getPattern, getTextField, getSelectField, getDateField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import {viewFour} from './review'
import get from "lodash/get";
import {getOptions} from '../dataSources'

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

  Array.prototype.aReduce = async function (cb, initial) {
    var result = initial;
    for(var i = 0; i < this.length; i++) {
      result = await cb(result, this[i]);
    }
    return result
  }

const getField = async (item, fieldData = {}, dataSource, state) => {

    const {label: labelItem, placeholder, type, pattern, disabled = false, ...rest } = item
    const {required = true, validations} = fieldData
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
      props: { disabled: eval(disabled) },
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
        const values = !!dataSource ? await getOptions(dataSource) : []
        return getSelectField({
          ...fieldProps,
          ...rest,
          data:values
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

const getDetailsContainer = async (section, data_config, dataSources, state) => {
    const {fields = []} = section;
    const values = await fields.aReduce(async (acc, field) => {
      const findFieldData = data_config.find(item => item.path === field.path)
      const dataSource = dataSources[field.dataSource]
      return {...acc, [field.label]: await getField(field, findFieldData, dataSource, state)}
    }, {})
    return getCommonContainer(values);
}

const expansionSection = (section) => {
  const {fields =[], path, valueJsonPath, sourceJsonPath, header} = section;
  return {}
  // return {
  //   uiFramework: "custom-containers-local",
  //   moduleName: "egov-estate",
  //   componentPath: "ExpansionPanelContainer",
  //   props: {
  //     sourceJsonPath,
  //     jsonPath: path,
  //     valueJsonPath,
  //     contents: fields,
  //     header
  //   }
  // }
}

export const setFirstStep = async (state, dispatch, {data_config, format_config, dataSources}) => {
    let {sections = []} = format_config
    sections = await sections.aReduce(async (acc, section) => {
        return {
        ...acc, 
        [section.header]: section.type === "EXPANSION_DETAIL" ? expansionSection(section) : getCommonCard({
            header: headerObj(section.header),
            details_container: section.type === "CARD_DETAIL" ? viewFour(section) : await getDetailsContainer(section, data_config, dataSources, state)
        })
    }
    }, {})
    return sections;
}