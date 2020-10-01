import { getCommonCard, getCommonHeader, getCommonContainer, getPattern, getTextField, getSelectField, getDateField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import {viewFour} from './review'
import {getOptions} from '../dataSources'
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertDateToEpoch } from "../../utils";
import { setFieldProperty } from './afterFieldChange'
import { get } from "lodash";

const _getPattern = (type) => {
  switch(type) {
    case "Percentage": 
        return /^[1-9][0-9]?$|^100$/i
    case "MobileNo": 
        return /^[6789][0-9]{9}$/i;
  }
}


let _conf = {};
const onFieldChange = (action, state, dispatch) => {
  updateReadOnlyForAllFields(action, state, dispatch);
}

const evaluate = ({application, owners, selectedOwner, selectedPurchaser, purchasers, formula, defaultValue}) => {
  try {
    return eval(formula);
  } catch (e) {
    return defaultValue;
  }
}

const updateReadOnlyForAllFields = (action, state, dispatch) => {
  // Update readonly
  // For each field. get the field config, get componentJsonPath, 
  // dispatch new Value

  const application = get(state, "screenConfiguration.preparedFinalObject.Applications[0]") || {};
  const owners = get(state, "screenConfiguration.preparedFinalObject.property.propertyDetails.owners") || [];
  const applicationDetails = get(application, "applicationDetails")

  const selectedOwner = !!applicationDetails && (!!applicationDetails.transferor || !!applicationDetails.owner) ? owners.find(item => !!applicationDetails.transferor ? item.id === applicationDetails.transferor.id : item.id === applicationDetails.owner.id) : {}
  let purchasers = !!applicationDetails.transferor ? owners.filter(item => item.id !== applicationDetails.transferor.id) : owners;
  const selectedPurchaser = !!applicationDetails.transferee ? purchasers.find(item => item.id === applicationDetails.transferee.id) : {}
  purchasers = purchasers.map(item => ({
    code: item.id,
    label: item.ownerDetails.ownerName
  }))
  const objectValues = Object.values(_conf);
  const fields = objectValues.reduce((prev, curr) => {
    const fieldItems = !!curr.children ? curr.children.cardContent.children.details_container.children : {};
    prev = [...prev, ...Object.values(fieldItems)]
    return prev
  }, []).filter(item => item.componentPath !== "Div")

  const findField = fields.find(item => item.componentJsonpath === action.componentJsonpath && !!item.errorMessage)

  let actionDefiniton = fields.reduce((prev, curr) => {
    const propValues = [{value: "visibility", property: "visible", defaultValue: curr.visible}, {value: "disability", property: "props.disabled", defaultValue: curr.props.disabled}, {value: "prefillValue", property: "props.value", defaultValue: ""}, {value: "dataValue", property: "props.data"}];

    const actions = propValues.reduce((prevValue, currValue) => {
      let evalParams = {application, owners, selectedOwner, selectedPurchaser, purchasers, formula: curr[currValue.value]}
      evalParams = currValue.hasOwnProperty("defaultValue") ? {...evalParams, defaultValue: currValue.defaultValue} : evalParams
      const actionItem = !!curr[currValue.value] ? currValue.value === "prefillValue" ? [{path: curr.componentJsonpath, property: currValue.property, value: evaluate(evalParams)}, {path: curr.componentJsonpath, property: "props.error", value: false}] : [{path: curr.componentJsonpath, property: currValue.property, value: evaluate(evalParams)}] : []
      return [...prevValue, ...actionItem]
    }, [])
    return [...prev, ...actions]
  }, [])

  actionDefiniton = !!findField ? [...actionDefiniton, {path: findField.componentJsonpath, property: "props.errorMessage", value: findField.errorMessage}] : actionDefiniton

  const findIndex = actionDefiniton.findIndex(item => item.path === action.componentJsonpath && item.property === action.property && item.value === action.value)
  // actionDefiniton = [...actionDefiniton.slice(0, findIndex), ...actionDefiniton.slice(findIndex+1)]
  findIndex === -1 && setFieldProperty({dispatch, actionDefiniton})
}

const updateVisibilityForAllFields = () => {
  // Update visibility
}

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

  const arrayReduce = async function(arr, cb, initial) {
    var result = initial;
      for(var i = 0; i < arr.length; i++) {
        result = await cb(result, arr[i]);
      }
      return result
  }

const getField = async (item, fieldData = {}, state) => {
    let {label: labelItem, placeholder, type, pattern, disabled = false, ...rest } = item;
    const {required = false, validations = []} = fieldData
    const minMaxValidation = validations.find(item => item.type === "length")
    const minMaxValue = validations.find(item => item.type === "minmax")
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
      props: { disabled, errorMessage: rest.errorMessage },
      required
    }
  
    fieldProps = !!pattern ? {...fieldProps, pattern: _getPattern(pattern)} : fieldProps
    fieldProps = !!minMaxValidation ? {...fieldProps, minLength: minMaxValidation.params.min, maxLength: minMaxValidation.params.max} : fieldProps
    fieldProps = !!minMaxValue ? {...fieldProps, minValue: minMaxValue.params.min, maxValue: minMaxValue.params.max} : fieldProps

    rest = {...rest, afterFieldChange : onFieldChange }
    switch(type) {
      case "TEXT_FIELD": {
        return getTextField({
          ...fieldProps,
          ...rest
      })
      }
      case "DROP_DOWN": {
        const values = !!item.dataSource ? await getOptions(item.dataSource) : []
        return getSelectField({
          ...fieldProps,
          ...rest,
          data:values,
          optionValue: "code",
          optionLabel: "label",
        })
      }
      case "DATE_FIELD": {
        return {...getDateField({
          ...fieldProps,
          ...rest,
          props: {...fieldProps.props, inputProps: {
            max: getTodaysDateInYMD()
        }
        },
          pattern: getPattern("Date")
        }),
        afterFieldChange: (action, state, dispatch) => {
          dispatch(prepareFinalObject(
            rest.jsonPath, convertDateToEpoch(action.value)
          ))
          onFieldChange(action, state, dispatch)
        }
      }
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

const getDetailsContainer = async (section, data_config, state) => {
    const {fields = []} = section;
    const values = await arrayReduce(fields, async (acc, field) => {
      const findFieldData = data_config.find(item => item.path === field.path)
      const fieldConfig = await getField(field, findFieldData, state)
      return {...acc, [field.label]: fieldConfig}
    }, {})
    return getCommonContainer(values);
}

const expansionSection = (section) => {
  const {fields =[], path, valueJsonPath, sourceJsonPath, header} = section;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-estate",
    componentPath: "ExpansionPanelContainer",
    props: {
      sourceJsonPath,
      jsonPath: path,
      valueJsonPath,
      contents: fields,
      header
    }
  }
}

export const setFirstStep = async (state, dispatch, {data_config, format_config}) => {
    const {sections = []} = format_config
    const uiConfig = await arrayReduce(sections, async (acc, section) => {
        return {
        ...acc, 
        [section.header]: section.type === "EXPANSION_DETAIL" ? expansionSection(section) : getCommonCard({
            header: headerObj(section.header),
            details_container: section.type === "CARD_DETAIL" ? viewFour(section) : await getDetailsContainer(section, data_config, state)
        })
    }
    }, {})

    _conf = uiConfig;
    return uiConfig;
}