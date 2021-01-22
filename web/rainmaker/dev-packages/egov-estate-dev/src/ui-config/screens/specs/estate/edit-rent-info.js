import { rentDetails } from "./applyResource/paymentDetailsAllotment";
import {
  getCommonCard,
  getBreak,
  getCommonContainer,
  getCommonHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { set, get } from "lodash";
import {
  httpRequest
} from "../../../../ui-utils";
import { WF_ALLOTMENT_OF_SITE } from "../../../../ui-constants";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { validateFields } from "../utils"

const headerRow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Edit Rent Information",
    labelKey: "ES_EDIT_RENT_INFORMATION"
  }),
  fileNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-estate",
    componentPath: "FileNumberContainer",
    props: {
      number: ""
    },
  }
});

const saveButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 15px 0px 0px",
      borderRadius: "inherit",
      right: 0,
      position: "absolute"
    }
  },
  children: {
    saveButtonLabel: getLabel({
      labelName: "Save",
      labelKey: "ES_COMMON_BUTTON_SAVE"
    })
  }
}

const callBackForSaveOrSubmit = async (state, dispatch) => {
  console.log("callBackForSaveOrSubmit");

  let _components = get(
    state.screenConfiguration.screenConfig,
    `edit-rent-info.components.div.children.rentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items`
  )
  let rentItems = get(
    state.screenConfiguration.preparedFinalObject,
    `Properties[0].propertyDetails.paymentConfig.paymentConfigItems`,
    []
  )
  let isStartAndEndYearValid = true;
  let isRentDetailsValid = true;

  if (_components && _components.length > 0) {
    for (var i=0; i<_components.length; i++) {
      if (!_components[i].isDeleted) {
        isRentDetailsValid = validateFields(
          `components.div.children.rentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items[${i}].item${i}.children.cardContent.children.rentCard.children`,
          state,
          dispatch
        )

        const filterRentArr = rentItems.filter(item => !item.isDeleted)
        rentItems = filterRentArr.map((item, index) => ({...item, groundRentStartMonth: !!index ? Number(filterRentArr[index-1].groundRentEndMonth) + 1 : 1, groundRentEndMonth: item.groundRentEndMonth, groundRentAmount: item.groundRentAmount}))

        const rentValidation = rentItems.filter(item => !item.groundRentAmount || !item.groundRentEndMonth)
        isRentDetailsValid = rentValidation.length === 0
        isStartAndEndYearValid = rentItems.every(item => item.groundRentEndMonth > item.groundRentStartMonth)
      }
    }
  }

  if (!isStartAndEndYearValid) {
    let errorMessage = {
      labelName: "End Month should be greater than Start Month",
      labelKey: "ES_ERR_END_MONTH_START_MONTH"
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
  else if (!isRentDetailsValid) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields, then submit !",
      labelKey: "ES_ERR_FILL_MANDATORY_FIELDS_SUBMIT"
    };
    dispatch(toggleSnackbar(true, errorMessage , "warning"));
    return;
  }

  try {
    let properties = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties"
    )

    properties = [{...properties[0], action: ""}]

    const response = await httpRequest(
      "post",
      "/est-services/property-master/_update",
      "",
      [], 
      { Properties: properties }
    );
    if (!!response) {
      let message = {
        labelName: "Rent details updated successfully",
        labelKey: "ES_RENT_DETAILS_UPDATE_SUCCESS"
      };
      dispatch(toggleSnackbar(true, message, "success"));

      dispatch(setRoute(`/estate/rent-information?fileNumber=${properties[0].fileNumber}&tenantId=${getTenantId()}`))
    }
  }
  catch (err) {
    dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber){
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      { key: "fileNumber", value: fileNumber },
    ];
    const response =  await getSearchResults(queryObject)
    dispatch(
      handleField(
        `edit-rent-info`,
        `components.div.children.headerDiv.children.header1.children.fileNumber`,
        `props.number`,
        fileNumber
      )
    )
    if(!!response) {
      let properties = response.Properties;
      let paymentConfigItems = properties[0].propertyDetails.paymentConfig.paymentConfigItems || [];
      

      paymentConfigItems.forEach((element, index) => {
        let startMonth = element.groundRentStartMonth;
        let endMonth = element.groundRentEndMonth;
        set(properties[0], `propertyDetails.paymentConfig.paymentConfigItems[${index}].tillDate`, (endMonth-startMonth)+1);
      });
      
      dispatch(prepareFinalObject("Properties[0]", properties[0]));
      
    }
  }
  dispatch(toggleSpinner());
}

const editRentInfo = {
  uiFramework: "material-ui",
  name: "edit-rent-info",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(toggleSpinner());
    let fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
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
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerRow
            },
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "WorkFlowContainer",
          props: {
            dataPath: "Properties",
            moduleName: WF_ALLOTMENT_OF_SITE,
            updateUrl: "/est-services/property-master/_update",
            style: {
              wordBreak: "break-word"
            }
          }
        },
        rentDetails: getCommonCard({
          rentContainer: rentDetails
        }),
        saveButton: {
          ...saveButton,
          onClickDefination: {
            action: "condition",
            callBack: callBackForSaveOrSubmit
          }
        }
      }
    }
  }
};

export default editRentInfo;