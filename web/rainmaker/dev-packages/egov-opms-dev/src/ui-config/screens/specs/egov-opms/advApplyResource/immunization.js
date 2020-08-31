import {
  getBreak, getCommonCard, getCommonContainer, getCommonGrayCard, getCommonTitle,
  getSelectField, getDateField, getTextField, getPattern, getLabel, getTodaysDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getOPMSPattern } from "../../utils/index"

let previousUoms = [];

var applicationNumberId = getQueryArg(window.location.href, "applicationNumber");

const undertakingButton1 = getCommonContainer({

  exemptionradio: {
    uiFramework: "custom-containers",
    gridDefination: {
      xs: 12,
      sm: 6
    },
    componentPath: "RadioGroupContainer",
  
    jsonPath: "ADVERTISEMENTNOC.exemptedCategory",
    required: false,
    props: {
      required: false,
      label: { name: "Exempted Category", key: "ADV_EXEMPTED_CATEGORY_NOC_PLACEHOLDER" },
      buttons: [
        {
          labelName: "Yes",
          labelKey: "Exempted_Yes",
          value: "1",
          disabled: false
        },
        {
          labelName: "No",
          labelKey: "Exempted_No",
          value: "0",
          disabled: false
        }
      ],
      jsonPath: "ADVERTISEMENTNOC.exemptedCategory",
      defaultValue: "0"
    },
    type: "array",

  },

});


const commonBuildingData = buildingType => {

  return {

    typeOfAdvertisement: {
      ...getSelectField({
        label: {
          labelName: "Type Of Advertisement",
          labelKey: "ADV_TYPE_OF_ADVERTISEMENT_NOC"
        },

        optionLabel: "name",
        optionValue: "name",
        placeholder: {
          labelName: "Type Of Advertisement",
          labelKey: "ADV_TYPE_OF_ADVERTISEMENT_NOC_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.typeOfAdvertisement",
        jsonPath: "ADVERTISEMENTNOC.typeOfAdvertisement",
        required: true,
        setDataInField: true,
        labelsFromLocalisation: true,
        props: {
          className: "applicant-details-error",
          required: true,
          disabled: false
        },
        afterFieldChange: (action, state, dispatch) => {
          try {

            let typecateID =
              get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.typeOfAdvertisement", []).filter(
                item => item.name === action.value
              );
            localStorageSet("this_adv_code", typecateID[0].code);
            localStorageSet("this_adv_id", typecateID[0].id);


            dispatch(
              prepareFinalObject(
                "applyScreenMdmsData.egpm.subTypeOfAdvertisement-new", typecateID[0].subTypeOfAdvertisement
              )
            );

            dispatch(
              prepareFinalObject(
                "applyScreenMdmsData.egpm.duration-new", typecateID[0].durationDropdown
              )
            );
            dispatch(
              prepareFinalObject(
                "ADVERTISEMENTNOC.duration", ""
              )
            );

            dispatch(
              prepareFinalObject(
                "ADVERTISEMENTNOC.subTypeOfAdvertisement", ""
              )
            );

            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.subTypeOfAdvertisement",
                "props.value", ""));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.duration",
                "props.value", ""));



            // dispatch(pFO("Licenses[0].tradeLicenseDetail.structureType", null));
            if (typecateID[0].id === "10010" || typecateID[0].id === "10012") {
              dispatch(
                handleField(
                  "advertisementApply",
                  "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.enterSpace",
                  "props.required", false));
              //disabled
              dispatch(
                handleField(
                  "advertisementApply",
                  "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.enterSpace",
                  "props.disabled", true));
              dispatch(
                handleField(
                  "advertisementApply",
                  "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.enterSpace",
                  "props.value", ''));

            } else {
              let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});

              dispatch(
                handleField(
                  "advertisementApply",
                  "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.enterSpace",
                  "props.required", true));
              //disabled
              if (nocStatus !== "REASSIGN") {
                dispatch(
                  handleField(
                    "advertisementApply",
                    "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.enterSpace",
                    "props.disabled", false));
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      }),
    },
    subTypeOfAdvertisement: {
      ...getSelectField({
        label: {
          labelName: "Sub Type Of Advertisement",
          labelKey: "ADV_SUB_TYPE_OF_ADVERTISEMENT_NOC"
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "subTypeOfAdvertisement"
        // },
        optionLabel: "subTypeOfAdvertisement",
        optionValue: "name",
        placeholder: {
          labelName: "Sub Type Of Advertisement",
          labelKey: "ADV_SUB_TYPE_OF_ADVERTISEMENT_NOC_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.subTypeOfAdvertisement-new",
        jsonPath: "ADVERTISEMENTNOC.subTypeOfAdvertisement",
        required: true,
        props: {
          //className: "applicant-details-error",
          //required: true,
          disabled: false
        },
        beforeFieldChange: (action, state, dispatch) => {
          try {
            let typecateID =
              get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.subTypeOfAdvertisement-new", []).filter(
                item => item.name === action.value
              );
            localStorageSet("this_sub_adv_code", typecateID[0].code);
            localStorageSet("this_sub_adv_id", typecateID[0].id);
          }
          catch (e) {
            console.log(e);
          }
        },
      }),
    },
    fromDatePeriodOfDisplay: getDateField({
      label: {
        labelName: "From Date Period Of Display",
        labelKey: "ADV_FROM_DATE_PERIOD_OF_DISPLAY_NOC"
      },
      placeholder: {
        labelName: "From Date Period Of Display",
        labelKey: "ADV_FROM_DATE_PERIOD_OF_DISPLAY_NOC_PLACEHOLDER"
      },
      jsonPath: "ADVERTISEMENTNOC.fromDateToDisplay",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      props: {
        disabled: false,
      },
      afterFieldChange: (action, state, dispatch) => {
        let today = getTodaysDateInYMD();
        let FromDate = get(state.screenConfiguration.preparedFinalObject, `ADVERTISEMENTNOC.fromDateToDisplay`, []);
        if (FromDate < today) {
          dispatch(toggleSnackbar(true, { labelName: "Display Date should be greater than today!", labelKey: "" },
            "warning"));
          set(state, 'screenConfiguration.preparedFinalObject.ADVERTISEMENTNOC.fromDateToDisplay', '');
          dispatch(prepareFinalObject("ADVERTISEMENTNOC.fromDateToDisplay", ''));
        }
      }
    }),
    toDatePeriodOfDisplay: getDateField({
      label: {
        labelName: "To Date Period Of Display",
        labelKey: "ADV_TO_DATE_PERIOD_OF_DISPLAY_NOC"
      },
      placeholder: {
        labelName: "To Date Period Of Display",
        labelKey: "ADV_TO_DATE_PERIOD_OF_DISPLAY_NOC_PLACEHOLDER"
      },
      jsonPath: "ADVERTISEMENTNOC.toDateToDisplay",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      props: {
        disabled: false,
      },
      afterFieldChange: (action, state, dispatch) => {

        let FromDate = get(state.screenConfiguration.preparedFinalObject, `ADVERTISEMENTNOC.fromDateToDisplay`, []);
        let ToDate = get(state.screenConfiguration.preparedFinalObject, `ADVERTISEMENTNOC.toDateToDisplay`, []);
        if (ToDate < FromDate) {
          dispatch(toggleSnackbar(true, { labelName: "To Date should be greater than or equal to From Date!", labelKey: "" },
            "warning"));
          set(state, 'screenConfiguration.preparedFinalObject.ADVERTISEMENTNOC.toDateToDisplay', '');
          dispatch(prepareFinalObject("ADVERTISEMENTNOC.toDateToDisplay", ''));
        }
      }
    }),
    duration: {
      ...getSelectField({
        label: {
          labelName: "Duration",
          labelKey: "ADV_DURATION_NOC_PLACEHOLDER"
        },
        optionLabel: "duration",
        optionValue: "name",
        placeholder: {
          labelName: "Duration",
          labelKey: "ADV_DURATION_NOC_PLACEHOLDER"
        },
        required: true,
        //pattern: getPattern("Name"),
        //errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        sourceJsonPath: "applyScreenMdmsData.egpm.duration-new",

        jsonPath: "ADVERTISEMENTNOC.duration",
      })
    },



    // duration: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Duration",
    //       labelKey: "ADV_DURATION_NOC"
    //     },

    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Duration",
    //       labelKey: "ADV_DURATION_NOC_PLACEHOLDER"
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.egpm.duration",
    //     jsonPath: "ADVERTISEMENTNOC.duration",
    //     required: true,
    //     props: {
    //       className: "applicant-details-error",
    //       required: true
    //       // disabled: true
    //     },

    //   }),
    // },
    locationOfAdvertisement: {
      ...getTextField({
        label: {
          labelName: "Location  of Advertisement",
          labelKey: "ADV_LOCATION_OF_ADVERTISEMENT_NOC"
        },
        placeholder: {
          labelName: "Location  of Advertisement",
          labelKey: "ADV_LOCATION_OF_ADVERTISEMENT_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ADVERTISEMENTNOC.locationOfAdvertisement",
      })
    },
    landmark: {
      ...getTextField({
        label: {
          labelName: "Landmark",
          labelKey: "ADV_LANDMARK_NOC"
        },
        placeholder: {
          labelName: "Landmark",
          labelKey: "ADV_LANDMARK_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ADVERTISEMENTNOC.advertisementLandmark",
      })
    },
    sector: {
      ...getSelectField({
        label: {
          labelName: "Sector",
          labelKey: "ADV_SECTOR_NOC"
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        optionValue: "name",
        placeholder: {
          labelName: "Sector",
          labelKey: "ADV_SECTOR_NOC_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        jsonPath: "ADVERTISEMENTNOC.advertisementSector",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },

      }),
    },
    subSector: {
      ...getTextField({
        label: {
          labelName: "Sub Sector/Village",
          labelKey: "ADV_SUB_SECTOR_VILLAGE_NOC"
        },
        placeholder: {
          labelName: "Sub Sector/Village",
          labelKey: "ADV_SUB_SECTOR_VILLAGE_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ADVERTISEMENTNOC.advertisementVillageSubSector",
      })
    },
    
    enterSpace: {
      ...getTextField({
        label: {
          labelName: "Enter Space(In Sq.ft.)",
          labelKey: "ADV_ENTER_SPACE_NOC"
        },
        placeholder: {
          labelName: "Enter Space(In Sq.ft.)",
          labelKey: "ADV_ENTER_SPACE_NOC_PLACEHOLDER"
        },
        required: true,
        props: {
          disabled: false,
        },
        pattern: getOPMSPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ADVERTISEMENTNOC.space",
      })
    },
    // advertisementMatterDescription: {
    //   ...getTextField({
    //     label: {
    //       labelName: "Advertisement Matter Description",
    //       labelKey: "ADV_ADVERTISEMENT_MATTER_DESCRIPTION_NOC"
    //     },
    //     placeholder: {
    //       labelName: "Advertisement Matter Description",
    //       labelKey: "ADV_ADVERTISEMENT_MATTER_DESCRIPTION_NOC_PLACEHOLDER"
    //     },
    //     props:{
          
    //                   className:"textfield-enterable-selection",
    //                   multiline: true,
    //                   rows: "4"
    //                 },
    //     required: true,
    //     pattern: getOPMSPattern("Address"),
    //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //     jsonPath: "ADVERTISEMENTNOC.advertisementMatterDescription",
    //   })
    // },
    
    date: {
      ...getTextField({
        label: {
          labelName: "Date",
          labelKey: "ADV_DATE_NOC"
        },
        placeholder: {
          labelName: "Date",
          labelKey: "ADV_DATE_NOC_PLACEHOLDER"
        },
        required: true,
        props: {
          disabled: true,
        },
        //pattern: getPattern("NoOfEmp"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ADVERTISEMENTNOC.date",
      })
    },
    advertisementMatterDescription: {
      ...getTextField({
        label: {
          labelName: "Advertisement Matter Description",
          labelKey: "ADV_ADVERTISEMENT_MATTER_DESCRIPTION_NOC"
        },
        placeholder: {
          labelName: "Advertisement Matter Description",
          labelKey: "ADV_ADVERTISEMENT_MATTER_DESCRIPTION_NOC_PLACEHOLDER"
        },
        
              props:{
          
                      className:"textfield-enterable-selection",
                      multiline: true,
                      rows: "2",


                 
                  },
                 
        required: true,
        pattern: getOPMSPattern("TexrearAddress"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ADVERTISEMENTNOC.advertisementMatterDescription",
      })
    },
    exemptedCategory: undertakingButton1,
    
    // date: getDateField({
    //   label: {
    //     labelName: "Date",
    //     labelKey: "ADV_DATE_NOC"
    //   },
    //   placeholder: {
    //     labelName: "Date",
    //     labelKey: "ADV_DATE_NOC_PLACEHOLDER"
    //   },
    //   jsonPath: "ADVERTISEMENTNOC.date",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   pattern: getPattern("Date"),
    //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //   required: true,
    //   afterFieldChange: (action, state, dispatch) => {
    //     let today = getTodaysDateInYMD();
    //     let FromDate = get(state.screenConfiguration.preparedFinalObject, `ADVERTISEMENTNOC.date`, []);
    //     if (FromDate <= today) {
    //       dispatch(toggleSnackbar(true, { labelName: "Date should be greater than or equal Today!", labelKey: "" },
    //         "warning"));
    //       set(state, 'screenConfiguration.preparedFinalObject.ADVERTISEMENTNOC.date', '');
    //       dispatch(prepareFinalObject("ADVERTISEMENTNOC.date", ''));
    //     }
    //   }

    // }),
   

  };
};

export const immunizationDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Advertisement Details",
      labelKey: "ADV_ADVERTISEMENT_DETAILS_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  immunizationDetailsConatiner: getCommonContainer({
    gridDefination: {
      xs: 12,
      sm: 6
    },
    buildingDataCard: getCommonContainer({
      singleBuildingContainer: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12
        },
        children: {
          singleBuilding: getCommonGrayCard({
            singleBuildingCard: getCommonContainer(commonBuildingData("SINGLE"))
          })
        }
      },
      multipleBuildingContainer: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "applicant-details-error",
          style: {
            display: "none"
          }
        },
        gridDefination: {
          xs: 12
        },
        children: {
          multipleBuilding: {
            uiFramework: "custom-containers",
            componentPath: "MultiItem",
            props: {
              scheama: getCommonGrayCard({
                multipleBuildingCard: getCommonContainer(
                  commonBuildingData("MULTIPLE")
                )
              }),
              items: [],
              addItemLabel: {
                labelKey: "NOC_PROPERTY_DETAILS_ADD_BUILDING_LABEL",
                labelName: "ADD BUILDING"
              },
              sourceJsonPath: "PetNOCs[0].PetNOCsDetails.buildings",
              // prefixSourceJsonPath:
              //   "children.cardContent.children.buildingDataCard.children.multipleBuildingContainer.children",
              prefixSourceJsonPath:
                "children.cardContent.children.multipleBuildingCard.children"
            },
            type: "array"
          }
        }
      }
    })
  })
});
