import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  searchApiCall
} from "./searchFunctions";
import get from "lodash/get";
import {
  ESTATE_APPROVED_STATE,
  BB_PM_APPROVED_STATE,
  MM_APPROVED_STATE
} from "../../../../../ui-constants";
import {
  displayCustomErr,
  displayDefaultErr,
  _getPattern,
  ifUserRoleExists
} from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const branchType = getQueryArg(window.location.href, "branchType") || "ESTATE_BRANCH";

const searchBy = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
  },
  props: {
    label: {
      name: "Search By",
      key: "ES_SEARCH_BY_LABEL"
    },
    buttons: [{
        labelName: "File No.",
        labelKey: "ES_FILE_NUMBER_LABEL",
        value: "File Number"
      },
      {
        label: "Site No.",
        labelKey: "ES_SITE_NUMBER_LABEL",
        value: "Site Number"
      }
    ],
    value: "File Number",
    jsonPath: "citizenSearchScreen.searchBy",
    required: true
  },
  required: true,
  jsonPath: "citizenSearchScreen.searchBy",
  beforeFieldChange: (action, state, dispatch) => {
    let branchType = getQueryArg(window.location.href, "branchType") || "ESTATE_BRANCH";
    if (action.value) {
      if (action.value == "File Number") {
        // let siteNumberContainerItems =  ["category", "subCategory", "siteNumber", "sectorNumber"];
        let siteNumberContainerItems = branchType === 'MANI_MAJRA' ? ["sectorNumber","houseNumber","street","mohalla"] : ["category", "subCategory", "siteNumber", "sectorNumber"];
        dispatch(
          handleField(
            "property-search",
            "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
            "visible",
            true
          )
        )

        siteNumberContainerItems.map(item => {
          dispatch(
            handleField(
              "property-search",
              `components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.${item}`,
              "visible",
              false
            )
          )
        })
        
      }
      else {
        // let siteNumberContainerItems = ["category", "siteNumber", "sectorNumber"];
        let siteNumberContainerItems = branchType === 'MANI_MAJRA' ? ["sectorNumber","houseNumber","street","mohalla"] : ["category", "siteNumber", "sectorNumber"];
        dispatch(
          handleField(
            "property-search",
            "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
            "visible",
            false
          )
        )
        siteNumberContainerItems.map(item => {
          dispatch(
            handleField(
              "property-search",
              `components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.${item}`,
              "visible",
              true
            )
          )
        })
      }
    }
  }
};

export const resetFields = (state, dispatch) => {
  let fileNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenFileNo.fileNumber", "");
  let category = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.category", "");
  let subCategory = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.subCategory", "");
  let siteNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.siteNumber", "");
  let sectorNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.sectorNumber", "");
  let houseSiteNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.houseNumber", "");
  let mohalla = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.mohalla", "");
  let street = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.street", "");

  if (fileNumber) {
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children.fileNumber",
        "props.value",
        ""
      )
    )
  }

  if (category) {
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.category",
        "props.value",
        ""
      )
    )
  }

  if (subCategory) {
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
        "props.value",
        ""
      )
    )
  }

  if (siteNumber) {
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.siteNumber",
        "props.value",
        ""
      )
    )
  }

  if (sectorNumber) {
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.sectorNumber",
        "props.value",
        ""
      )
    )
  }

  if(houseSiteNumber){
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.houseNumber",
        "props.value",
        ""
      )
    )
  }

  if(mohalla){
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.mohalla",
        "props.value",
        ""
      )
    )
  }

  if(street){
    dispatch(
      handleField(
        "property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.street",
        "props.value",
        ""
      )
    )
  }
}


export const estateApplication = getCommonCard({
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for a property",
    labelKey: "ES_HOME_SEARCH_RESULTS_DESC"
  }),
  searchBoxContainer: getCommonContainer({
    searchBy: searchBy,
    fileNumberContainer: getCommonContainer({
      fileNumber: getTextField({
        label: {
          labelName: "File No.",
          labelKey: "ES_FILE_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter File No.",
          labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        required: true,
        minLength: 1,
        maxLength: 50,
        jsonPath: "searchScreenFileNo.fileNumber",
        pattern: _getPattern("fileNumber"),
        errorMessage:"ES_ERR_FILE_NUMBER",
        afterFieldChange: (action, state, dispatch) => {
            if (action.value.length > 50) {
                displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
            }
            else {
              displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_FILE_NUMBER", action.screenKey);
            }
        }
      })
    }),
    siteNumberContainer: getCommonContainer({
      category: getSelectField({
        label: {
            labelName: "Category",
            labelKey: "ES_CATEGORY_LABEL"
        },
        placeholder: {
            labelName: "Select Category",
            labelKey: "ES_CATEGORY_PLACEHOLDER"
        },
        visible: false,
        required: true,
        jsonPath: "searchScreenSiteNo.category",
        errorMessage:"ES_ERR_CATEGORY",
        sourceJsonPath: "searchScreenMdmsData.EstateServices.categories",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        beforeFieldChange: (action, state, dispatch) => {
            if (action.value == "CAT.RESIDENTIAL"  || action.value == "CAT.COMMERCIAL") {
              dispatch(
                  handleField(
                      "property-search",
                      "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                      "visible",
                      true
                  )
              );
  
              const categories = get(
                  state.screenConfiguration.preparedFinalObject,
                  "searchScreenMdmsData.EstateServices.categories"
              )
  
              const filteredCategory = categories.filter(item => item.code === action.value)
              dispatch(
                  handleField(
                      "property-search",
                      "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                      "props.data",
                      filteredCategory[0].SubCategory
                  )
              )
          }
          else {
            dispatch(
              handleField(
                  "property-search",
                  "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                  "visible",
                  false
              )
          );
          }
        }
      }),
      subCategory: getSelectField({
        label: {
          labelName: "Sub Category",
          labelKey: "ES_SUBCATEGORY_LABEL"
        },
        placeholder: {
            labelName: "Select Sub Category",
            labelKey: "ES_SUBCATEGORY_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchScreenSiteNo.subCategory",
        visible: false,
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage:"ES_ERR_SUB_CATEGORY"
      }),
      siteNumber: getTextField({
        label: {
          labelName: "Site Number",
          labelKey: "ES_SITE_NUMBER_LABEL"
        },
        placeholder: {
            labelName: "Enter Site Number",
            labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        //errorMessage: "ES_ERR_MAXLENGTH_50",
        required: true,
        visible: false,
        minLength: 1,
        maxLength: 50,
        jsonPath: "searchScreenSiteNo.siteNumber",
        pattern: _getPattern("file-number-only-with-no-firstdigit-zero"),
        errorMessage:"ES_ERR_SITE_BOOTH_NUMBER",
        afterFieldChange: (action, state, dispatch) => {
          if (action.value.length > 50) {
            displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
          }    else if(action.value.length < 2){
            displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MINLENGTH_2", action.screenKey);
        }
        else {
            displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_SITE_BOOTH_NUMBER",action.screenKey);
        }
        }
      }),
      sectorNumber: getSelectField({
        label: {
            labelName: "Sector Number",
            labelKey: "ES_SECTOR_NUMBER_LABEL"
        },
        placeholder: {
            labelName: "Select Sector Number",
            labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
        },
        // required: true,
        visible: false,
        jsonPath: "searchScreenSiteNo.sectorNumber",
        sourceJsonPath: "searchScreenMdmsData.EstateServices.sector",
        gridDefination: {
            xs: 12,
            sm: 6
        }
      }),
      houseNumber: getTextField({
        label: {
          labelName: "House Number",
          labelKey: "ES_HOUSE_NUMBER_LABEL"
        },
        placeholder: {
            labelName: "Enter House Number",
            labelKey: "ES_HOUSE_NUMBER_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_MAXLENGTH_50",
        required: true,
        visible: false,
        minLength: 1,
        maxLength: 50,
        jsonPath: "searchScreenSiteNo.houseNumber",
        pattern: _getPattern("fileNumber"),
        errorMessage:"ES_ERR_HOUSE_NUMBER",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HOUSE_NUMBER", action.screenKey);
    }
  }
      }),
      street: getTextField({
        label: {
          labelName: "Street",
          labelKey: "ES_STREET_LABEL"
        },
        placeholder: {
            labelName: "Enter Street Name",
            labelKey: "ES_STREET_NAME_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_MAXLENGTH_50",
        required: true,
        visible: false,
        minLength: 1,
        maxLength: 50,
        jsonPath: "searchScreenSiteNo.street",
        pattern:_getPattern("street"),
        errorMessage:"ES_ERR_STREET_NUMBER",
        afterFieldChange: (action, state, dispatch) => {
          if (action.value.length > 50) {
            displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
          }else if(action.value.length < 2){
            displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_STREET_MINLENGHT_2", action.screenKey);
          }
          else{
            displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_STREET_NUMBER", action.screenKey);
          }
        }
      }),
      mohalla: getTextField({
        label: {
          labelName: "Mohalla",
          labelKey: "ES_MOHALLA_LABEL"
        },
        placeholder: {
            labelName: "Enter Mohalla",
            labelKey: "ES_MOHALLA_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_MAXLENGTH_50",
        required: true,
        visible: false,
        minLength: 1,
        maxLength: 50,
        errorMessage:"ES_ERR_MOHALLA_FEILD",
        jsonPath: "searchScreenSiteNo.mohalla",
        pattern: _getPattern("alphabet"),
        afterFieldChange: (action, state, dispatch) => {
            if (action.value.length > 50) {
                displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
            }
            else {
              displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MOHALLA_FEILD", action.screenKey);
            }
        }
      })
    })
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "70%",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "70%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            const roleExists = ifUserRoleExists("ES_EB_FINANCIAL_OFFICER");
            const type=getQueryArg(window.location.href,"type")
            const branchType = getQueryArg(window.location.href, "branchType") || "ESTATE_BRANCH";
            if(type==="payment" && branchType==="ESTATE_BRANCH" && process.env.REACT_APP_NAME !== "Citizen" &&  roleExists){
              searchApiCall(state, dispatch, [
                { key: "branchType", value: branchType }
              ])
            }
            else{
            let approvedState;
            switch (branchType) {
              case "BUILDING_BRANCH":
                approvedState = BB_PM_APPROVED_STATE;
                break;
              case "MANI_MAJRA":
                approvedState = MM_APPROVED_STATE;
                break;
              default:
                approvedState = ESTATE_APPROVED_STATE;
                break;
            }
            searchApiCall(state, dispatch, [
              { key: "state", value: approvedState },
              { key: "branchType", value: branchType }
            ])
          }
          }
        }
      }
    })
  })
});

