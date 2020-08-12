import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { getTextField, getCommonContainer, getCommonHeader, getLabel, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";


const APPLICATION_TYPE = getLocaleLabels("Application Type","TL_COMMON_TABLE_COL_APP_TYPE")
const FEE_TYPE = getLocaleLabels("Fee Type", "TL_COMMON_TABLE_COL_FEE_TYPE")
const FROM_UOM = getLocaleLabels("From UOM", "TL_COMMON_TABLE_COL_FROM_UOM")
const TO_UOM = getLocaleLabels("To UOM", "TL_COMMON_TABLE_COL_TO_UOM")
const UOM = getLocaleLabels("From UOM", "TL_COMMON_TABLE_COL_UOM")
const RATE = getLocaleLabels("Rate", "TL_COMMON_TABLE_COL_RATE")


const showOrHidePopup = (state, dispatch) => {
  const {fineMasterEditData} = state.screenConfiguration.preparedFinalObject
  const screenKey = fineMasterEditData.businessService.replace(".", "_")
  dispatch(handleField(
    screenKey,
    "components.adhocDialog",
    "props.open",
    false
  ))
}

const updateRate = async (state, dispatch) => {
  const {fineMasterEditData} = state.screenConfiguration.preparedFinalObject
  const {rate} = fineMasterEditData;
  if(!!Number(rate)) {
  try {
  await httpRequest(
    "post",
    "/tl-calculator/ctlbillingslab/_update",
    "",
    [],
    {"CTLBillingSlabs": [fineMasterEditData]}
  );
  const screenKey = fineMasterEditData.businessService.replace(".", "_")
  dispatch(handleField(
    screenKey,
    "components.adhocDialog",
    "props.open",
    false
  ))
  getFineMasterList(state, dispatch, fineMasterEditData.businessService, screenKey)
} catch (error) {
  dispatch(
    toggleSnackbar(
      true,
      { labelName: error.message, labelKey: error.message },
      "error"
    )
  );
}
}
}

const rateField = {
  label: {
    labelName: "Rate",
    labelKey: "TL_COMMON_TABLE_COL_RATE"
  },
  placeholder: {
    labelName: "Enter Rate",
    labelKey: "TL_COMMON_RATE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  required: true,
  jsonPath: "fineMasterEditData.rate",
  pattern: getPattern("Amount")
}

export const fineMasterPopup = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Edit Fine Master",
              labelKey: "TL_FINE_MASTER_EDIT_HEADER"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: showOrHidePopup
            }
          }
        }
      }
    }
  },
  rateCard: getCommonContainer({
      rateField: getTextField(rateField)
    }),
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%",
          textAlign: "right"
        }
      },
      children: {
        updateButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              width: "140px",
              height: "48px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "UPDATE",
              labelKey: "TL_COMMON_UPDATE_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: updateRate
          }
        }
      }
    }
})

export const dialogContainer = (screenKey) => {
  return {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey
      },
      children: {
        popup: fineMasterPopup
      }
  }
}

export const getFineMasterList = async (state, dispatch, businessService, screenKey) => {
    let queryObject = [
        {
          key: "tenantId",
          value: getTenantId()
        }
      ];
      try {
        const response = await httpRequest(
          "post",
          "/tl-calculator/ctlbillingslab/_search",
          "",
          queryObject
        );
        let {CTLBillingSlabs = []} = response;
        CTLBillingSlabs = CTLBillingSlabs.filter(item => item.businessService === businessService).reduce((prev, {applicationType, businessService, ...rest}) => {
          const findIndex = prev.findIndex(item => item.applicationType === applicationType);
          prev = findIndex >= 0 ? [...prev.slice(0, findIndex), {...prev[findIndex], array: [...prev[findIndex].array, {...rest}]}, ...prev.slice(findIndex+1)] : [...prev, {applicationType,businessService, array: [{...rest}]}]
          return prev
        }, []).sort((a,b) => a.applicationType > b.applicationType ? 1 : a.applicationType < b.applicationType ? -1 : 0)
        const data = getTableData(state, dispatch, CTLBillingSlabs, screenKey);
        dispatch(
          handleField(
            screenKey,
            "components.div",
            "children",
            data
          )
        );
      } catch (error) {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: error.message, labelKey: error.message },
            "error"
          )
        );
      }
}

const getTableData = (state, dispatch, list, screenKey) => {
  return list.reduce((prev,item, index) => {
    const data = item.array.map(arrayItem => ({
      [APPLICATION_TYPE]:item.applicationType,
      [FEE_TYPE]: getLocaleLabels(arrayItem.feeType, `${item.businessService}_${arrayItem.feeType}`),
      [FROM_UOM]:arrayItem.fromUom,
      [TO_UOM]:arrayItem.toUom,
      [UOM]:arrayItem.uom,
      [RATE]:arrayItem.rate,
      ["tenantId"]: arrayItem.tenantId,
      ["id"]:arrayItem.id,
      ["type"]: arrayItem.feeType
    })).sort((a, b) => {
      return a[FEE_TYPE] > b[FEE_TYPE] ? 1 : a[FEE_TYPE] < b[FEE_TYPE] ? -1 :0
    })
    const dataItem = {
      uiFramework: "custom-molecules",
      componentPath: "Table",
      props: {
        columns: [
          APPLICATION_TYPE,
          FEE_TYPE,
          FROM_UOM,
          TO_UOM,
          UOM,
          RATE,
          {
            name: "tenantId",
            options: {
              display: false
            }
          },
          {
            name:"id",
            options: {
              display: false
            }
          },
          {
            name:"type",
            options: {
              display: false
            }
          }
          ],
        options: {
          filter: false,
          download: false,
          responsive: "stacked",
          selectableRows: false,
          hover: true,
          pagination:false,
          print:false,
          search:false,
          viewColumns: false,
          onRowClick: (row, index) => {
            onRowClick(row, item.businessService, screenKey, state, dispatch);
          }
        }, 
        data,
        title: getLocaleLabels(`${item.businessService}`, `${item.businessService}`),
        customSortColumn: {
        }
      }
    }

    return {...prev, [item.applicationType]: dataItem, [`middleDiv${index}`]: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { height: 20 }
      }
    }}
  }, {}
  )
}

const onRowClick = (row, businessService, screenKey, state, dispatch) => {
  const fineMasterEditData = {
      businessService,
      applicationType: row[0],
      feeType:row[8],
      fromUom:row[2],
      toUom:row[3],
      uom:row[4],
      rate:row[5],
      id: row[7],
      tenantId: row[6]
  }
  dispatch(prepareFinalObject("fineMasterEditData", fineMasterEditData));

  dispatch(handleField(
    screenKey,
    "components.adhocDialog.children.popup.children.rateCard.children.rateField",
    "props.value",
    fineMasterEditData.rate
  ))

  dispatch(handleField(
    screenKey,
    "components.adhocDialog",
    "props.open",
    true
  ))
}