import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getDateField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["SectorId","houseNo",];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-house.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-house",
          `components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
};

export const searchForm = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Criteria",
    labelKey: "STORE_SEARCH_RESULTS_HEADING",
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  }),
  searchFormContainer: getCommonContainer({
    SectorId: {
      ...getSelectField({
        label: {
          labelName: "Sector Name",
          labelKey: "INTIGRATION_SF_SECTOR_NAME"
        },
        placeholder: {
          labelName: " Select Sector Name",
          labelKey: "INTIGRATION_SF_SECTOR_NAME_SELECT"
        },
        required: true,       
        jsonPath: "searchScreen.sectorId",
        // localePrefix: {
        //   moduleName: "PENSION",
        //  masterName: "MODULE"
        // },
        props: {
          optionValue: "SectorId",
          optionLabel: "SectorName",
        },       
        sourceJsonPath:
       "searchScreenMdmsData.RecordSet",
        //"applyScreenMdmsData.tenant",
       
      }),
     
      
    },
    houseNo: {
      ...getTextField({
        label: {
          labelName: "House No",
          labelKey: "INTIGRATION_TH_PT_HOUSE"
        },
        placeholder: {
          labelName: "House No",
          labelKey: "INTIGRATION_TH_PT_HOUSE"
        },
      //  pattern: getPattern("Amount"),
      required: true, 
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "searchScreen.houseNo"
      })
    },
   
  
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "STORE_COMMON_RESET_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "STORE_COMMON_SEARCH_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall,
        },
      },
    }),
  }),
});
