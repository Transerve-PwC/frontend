import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getCommonHeader,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
//   import { searchApiCall } from "./functions";
import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getHeaderSideText } from "../../utils";
import get from 'lodash/get';
import { httpRequest } from '../../../../../ui-utils/index';
import set from 'lodash/set';


const getPlumberRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "RadioGroupContainer",
  gridDefination: { xs: 12, sm: 12 },
  jsonPath: "applyScreen.additionalDetails.detailsProvidedBy",
  props: {
    label: { key: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" },
    buttons: [
      { labelKey: "WS_PLUMBER_ULB", value: "ULB" },
      { labelKey: "WS_PLUMBER_SELF", value: "Self" },
    ],
    required: false
  },
  type: "array"
};
let IsEdit = false;

export const additionDetails = getCommonCard({
  header: getCommonHeader({
    labelKey: "WS_COMMON_ADDN_DETAILS_HEADER"
  }),
  connectiondetailscontainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_CONNECTION_DETAILS"
    }),

    connectionDetails: getCommonContainer({
      division: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_DIVISION" },
        placeholder: { labelKey: "WS_SERV_DETAIL_DIVISION_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        required: true,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.Division",
        jsonPath: "applyScreen.div",
        props: {         
          disabled: false
        },
       // pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      subdiv: getTextField({
        label: { labelKey: "WS_SERV_DETAIL_SUB_DIVISION" },
        placeholder: { labelKey: "WS_SERV_DETAIL_SUB_DIVISION_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        //sourceJsonPath: "applyScreenMdmsData.ws-services-masters.subDivision",
        jsonPath: "applyScreen.subdiv",
        props: {         
          disabled: true
        },
       // pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      billGroup: {
        ...getSelectField({
         // ...getTextField({
          label: { labelKey: "WS_SERV_DETAIL_BILL_GROUP" },
          placeholder: { labelKey: "WS_SERV_DETAIL_BILL_GROUP_PLACEHOLDER" },
          required: true,
         sourceJsonPath: "applyScreenMdmsData.ws-services-masters.billGroup",
          //sourceJsonPath: "ledgerlist",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.billGroup"
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            // let sectotecode = get(
            //   state.screenConfiguration.preparedFinalObject,
            //   "applyScreen.property.address.locality.code"
            // )             
            // let ledgerGroup = `${sectotecode}${action.value}`
            // dispatch(
            //   prepareFinalObject(
            //     "applyScreen.ledgerGroup",
            //     ledgerGroup
            //   )
            // )
          }
         
        }
      },
      ledgerNo: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_LEDGER_NO" },
          placeholder: { labelKey: "WS_SERV_DETAIL_LEDGER_NO_PLACEHOLDER" },
          required: true,
          //sourceJsonPath: "applyScreenMdmsData.ws-services-masters.Ledger",
          sourceJsonPath: "ledgerlist",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.ledgerNo"
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            let sectotecode = get(
              state.screenConfiguration.preparedFinalObject,
              "applyScreen.property.address.locality.code"
            )
             
            let ledgerGroup = `${sectotecode}${action.value}`
            dispatch(
              prepareFinalObject(
                "applyScreen.ledgerGroup",
                ledgerGroup
              )
            )
          }
         
        }
      },
      ledgerGroup:
      getTextField({
       label: { labelKey: "WS_SERV_DETAIL_LEDGER_GROUP" },
       placeholder: { labelKey: "WS_SERV_DETAIL_LEDGER_GROUP_PLACEHOLDER" },
       gridDefination: { xs: 12, sm: 6 },        
       jsonPath: "applyScreen.ledgerGroup",
       pattern: /^[0-9]*$/i,
       props: {         
         disabled: true
       },
       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
     }),
     ccCode: getTextField({
      label: { labelKey: "WS_SERV_DETAIL_CC_CODE" },
      placeholder: { labelKey: "WS_SERV_DETAIL_CC_CODE_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      
      jsonPath: "applyScreen.ccCode",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
    }),
      connectionType: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_CONN_TYPE" },
          placeholder: { labelKey: "WS_ADDN_DETAILS_CONN_TYPE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.connectionType",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_INVALID_BILLING_PERIOD",
          jsonPath: "applyScreen.connectionType"
        }),
        afterFieldChange: async (action, state, dispatch) => {
          let connType = await get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
          console.log('connType');
          console.log(connType);
          if (connType === undefined || connType === "Non Metered" || connType === "Bulk-supply" || connType !== "Metered") {
            showHideFeilds(dispatch, false);
          }
          else {
            showHideFeilds(dispatch, true);
          }
        }
      },
      numberOfTaps: getTextField({
        label: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" },
        placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfTaps",
        //pattern: /^[0-9]*$/i,
        pattern: getPattern("numeric-only"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      }),
      ferruleSize: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        pattern: getPattern("AlphaNumValidation"),
        visible:true,
        props:{
          disabled:IsEdit
        },
        jsonPath: "applyScreen.ferruleSize",
        //pattern: /^[0-9]*$/i,
        
       // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      // waterSourceType: {
      //   ...getSelectField({
      //     label: { labelKey: "WS_SERV_DETAIL_WATER_SOURCE" },
      //     placeholder: { labelKey: "WS_ADDN_DETAILS_WARER_SOURCE_PLACEHOLDER" },
      //     required: false,
      //     sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSource",
      //     gridDefination: { xs: 12, sm: 6 },
      //     errorMessage: "ERR_INVALID_BILLING_PERIOD",
      //     jsonPath: "applyScreen.waterSource"
      //   }),
      //   beforeFieldChange: async (action, state, dispatch) => {
      //     if (action.value === "GROUND") {
      //       dispatch(
      //         prepareFinalObject(
      //           "waterSubSourceForSelectedWaterSource",
      //           get(
      //             state.screenConfiguration.preparedFinalObject,
      //             "applyScreenMdmsData.ws-services-masters.GROUND"
      //           )
      //         )
      //       )
      //     } else if (action.value === "SURFACE") {
      //       dispatch(
      //         prepareFinalObject(
      //           "waterSubSourceForSelectedWaterSource",
      //           get(
      //             state.screenConfiguration.preparedFinalObject,
      //             "applyScreenMdmsData.ws-services-masters.SURFACE"
      //           )
      //         )
      //       )
      //     } else if (action.value === "BULKSUPPLY") {
      //       dispatch(
      //         prepareFinalObject(
      //           "waterSubSourceForSelectedWaterSource",
      //           get(
      //             state.screenConfiguration.preparedFinalObject,
      //             "applyScreenMdmsData.ws-services-masters.BULKSUPPLY"
      //           )
      //         )
      //       )
      //     }
      //   }
      // },
      // waterSubSource: getSelectField({
      //   label: { labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" },
      //   placeholder: { labelKey: "WS_ADDN_DETAILS_WARER_SUB_SOURCE_PLACEHOLDER" },
      //   required: false,
      //   sourceJsonPath: "waterSubSourceForSelectedWaterSource",
      //   gridDefination: { xs: 12, sm: 6 },
      //   errorMessage: "ERR_INVALID_BILLING_PERIOD",
      //   jsonPath: "applyScreen.waterSubSource"
      // }),
      
      // pipeSize: {
      //   ...getSelectField({
      //     label: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE" },
      //     sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
      //     placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
      //     required: true,
      //     visible:false,
      //     gridDefination: { xs: 12, sm: 6 },
      //     jsonPath: "applyScreen.pipeSize"
      //   }),
      //   beforeFieldChange: async (action, state, dispatch) => {
  
      //     if(action.value)
      //     {
      //       const {applyScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
      //       const pipeSize = applyScreenMdmsData['ws-services-calculation'].PipeSize.filter(pipeSize => pipeSize.size == action.value);
  
      //        if(pipeSize&&pipeSize[0])
      //        {            
      //         dispatch(
      //           prepareFinalObject(
      //             "applyScreen.sanctionedCapacity",
      //             pipeSize[0].SanctionCapacity
      //           )
      //         )
      //         dispatch(
      //           prepareFinalObject(
      //             "applyScreen.meterRentCode",
      //             pipeSize[0].MeterRentCode
      //           )
      //         )
      //        }
      //     }
         
      //   }
      // },
      // contractValue: getTextField({
      //   label: { labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE" },
      //   placeholder: { labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE_PLACEHOLDER" },
      //   gridDefination: { xs: 12, sm: 6 },
      //   pattern: getPattern("Name"),
      //   visible:false,
      //   jsonPath: "applyScreen.contractValue",
      //   pattern: /^[0-9]*$/i,
        
      //  // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      // }),





      noOfWaterClosets: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfWaterClosets",
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      noOfToilets: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfToilets",
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      })
    }),
  }),
  // plumberDetailsContainer: getCommonGrayCard({
  //   subHeader: getCommonTitle({
  //     labelKey: "WS_COMMON_PLUMBER_DETAILS"
  //   }),
  //   plumberDetails: getCommonContainer({
  //     getPlumberRadioButton,
  //     plumberLicenceNo: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_PLACEHOLDER"
  //       },
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       pattern: /^[0-9]*$/i,
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.plumberInfo[0].licenseNo"
  //     }),
  //     plumberName: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_PLACEHOLDER"
  //       },
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       pattern: getPattern("Name"),
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.plumberInfo[0].name"
  //     }),
  //     plumberMobNo: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL_PLACEHOLDER"
  //       },
  //       gridDefination: { xs: 12, sm: 6 },
  //       iconObj: { label: "+91 |", position: "start" },
  //       required: false,
  //       pattern: getPattern("MobileNo"),
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.plumberInfo[0].mobileNumber"
  //     }),
  //   })
  // }),
  // roadCuttingChargeContainer: getCommonGrayCard({
  //   subHeader: getCommonTitle({
  //     labelKey: "WS_ROAD_CUTTING_CHARGE_DETAILS"
  //   }),
  //   roadDetails: getCommonContainer({
  //     roadType: getSelectField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_ROAD_TYPE_PLACEHOLDER"
  //       },
  //       required: false,
  //       sourceJsonPath: "applyScreenMdmsData.sw-services-calculation.RoadType",
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       errorMessage: "ERR_INVALID_BILLING_PERIOD",
  //       jsonPath: "applyScreen.roadType"
  //     }),
  //     enterArea: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_AREA_PLACEHOLDER"
  //       },
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       pattern: getPattern("Amount"),
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.roadCuttingArea"
  //     })
  //   }),
  // }),
  OtherChargeContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_OTHER_CHARGE_DETAILS"
    }),
    chargesDetails: getCommonContainer({
      enterSecurityAmount: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_SECURITY_CHARGES_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_SECURITY_CHARGES_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.waterApplication.securityCharge"
      }),
      IsFerruleApplicable: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-wns",
        componentPath: "CheckboxContainerConnHolder",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          label: {
            name: "Ferrule Applicable",
            key: "WS_ADDN_DETAILS_IS_FERRULEAPPLICABLE",
          },
          jsonPath: "applyScreen.waterApplication.isFerruleApplicable",
          required: false,
          isChecked: false
        },
        type: "array",
        section:"SECURITY",
        jsonPath: "applyScreen.waterApplication.isFerruleApplicable"
      },
    }),
  }),
  activationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_ACTIVATION_DETAILS"
    }),
    activeDetails: getCommonContainer({
      connectionExecutionDate: getDateField({
        label: { labelName: "connectionExecutionDate", labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          },
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.connectionExecutionDate"
      }),
      meterID: getTextField({
        label: {
          labelKey: "WS_SERV_DETAIL_METER_ID"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_METER_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[a-z0-9]+$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.meterId"
      }),
      meterInstallationDate: getDateField({
        label: { labelName: "meterInstallationDate", labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          },
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.meterInstallationDate"
      }),
      initialMeterReading: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.initialMeterReading"
      }),
      meterCount: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_COUNT"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_COUNT_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.meterCount"
      }),

      mfrCode: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_MFRCODE" },
          placeholder: { labelKey: "WS_SERV_DETAIL_MFRCODE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.MFRCode",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.mfrCode",
          props: {
            optionValue: "Code",
            optionLabel: "MakeOfMeter",
            
          },
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            let MFRCode = get(
              state.screenConfiguration.preparedFinalObject,
              "applyScreenMdmsData.ws-services-masters.MFRCode"
            )
            MFRCode = MFRCode.filter(x=>x.Code === action.value)
             if(MFRCode&&MFRCode[0])
            {
              dispatch(
                prepareFinalObject(
                  "applyScreen.meterDigits",
                  MFRCode[0].Digit
                )
              )
            }
           
          }
         
        }
      },
      meterDigits:
      getTextField({
       label: { labelKey: "WS_SERV_DETAIL_METER_DIGIT" },
       placeholder: { labelKey: "WS_SERV_DETAIL_METER_DIGIT_PLACEHOLDER" },
       gridDefination: { xs: 12, sm: 6 },        
       jsonPath: "applyScreen.meterDigits",
       pattern: /^[0-9]*$/i,
       props: {         
         disabled: true
       },
       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
     }),
     meterUnit: {
      ...getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_METER_UNIT" },
        placeholder: { labelKey: "WS_SERV_DETAIL_METER_UNIT_PLACEHOLDER" },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.MeterUnit",
        gridDefination: { xs: 12, sm: 6 },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.meterUnit",
        props: {
          optionValue: "Name",
          optionLabel: "Name",
          
        },
      }),
      beforeFieldChange: async (action, state, dispatch) => {

        if(action.value)
        {
          
         
        }
       
      }
    },
    sanctionedCapacity:
    getTextField({
     label: { labelKey: "WS_SERV_DETAIL_SANCTION_CAPACITY" },
     placeholder: { labelKey: "WS_SERV_DETAIL_SANCTION_CAPACITY_PLACEHOLDER" },
     gridDefination: { xs: 12, sm: 6 },        
     jsonPath: "applyScreen.sanctionedCapacity",
     pattern: /^[0-9]*$/i,
     props: {         
       disabled: true
     },
     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
   }),
   meterRentCode:
   getTextField({
    label: { labelKey: "WS_SERV_DETAIL_METER_RENT_CODE" },
    placeholder: { labelKey: "WS_SERV_DETAIL_METER_RENT_CODE_PLACEHOLDER" },
    gridDefination: { xs: 12, sm: 6 },        
    jsonPath: "applyScreen.meterRentCode",
    pattern: /^[0-9]*$/i,
    props: {         
      disabled: true
    },
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
  }),
    })
  })
});

const showHideFeilds = (dispatch, value) => {
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId",
      "visible",
      value
    )
  );
}