import {
  getTodaysDateInYMD, getBreak, getCommonCard, getCommonContainer, getTimeField, getCommonTitle, getDateField, getTextField, getSelectField, getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, fetchItemListMasterData } from "../../../../../ui-utils/commons";
import { resetAllFields } from "../../utils";
import "./index.css";
import { set } from "lodash";
import { getVendorDetail } from "../apply";

const getArticleData = async (action, state, dispatch) => {
  try {

    let payload = null;
    return payload = await fetchItemListMasterData(action, state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const showHideMapPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.mapsDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.mapsDialog",
      "props.open",
      !toggle
    )
  );
};

const clearFields = (dispatch) => {
  let screenKey = "apply";
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.NameofViolator',
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.NameofViolator',
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.NameofViolator',
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.NameofViolator',
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.FatherName',
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.FatherName',
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.FatherName',
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.FatherName',
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.ContactNo',
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.ContactNo',
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.ContactNo',
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.ContactNo',
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.EmailId',
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.EmailId',
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.EmailId',
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.EmailId',
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.Address',
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.Address',
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.Address',
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.Address',
      "props.helperText",
      ""
    )
  );
};

const getMapLocator = textSchema => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-echallan",
    componentPath: "MapLocator",
    props: {}
  };
};



export const violationsDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Violations Details",
      labelKey: "EC_VIOLATIONS_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  violationsDetailsContainer: getCommonContainer({
    Date: {
      ...getTextField({
        label: {
          labelName: "Date",
          labelKey: "EC_VIOLATION_DATE_LABEL"
        },
        placeholder: {
          labelName: "DD/MM/YYYY",
          labelKey: "EC_VIOLATION_DATE_PLACEHOLDER"
        },
        sourceJsonPath: "challan[0].Date",
        //pattern: getPattern("Date"),

        errorMessage: "EC_ERR_DEFAULT_INPUT_DATE_FIELD_MSG",
        required: true,
        jsonPath: "eChallan.violationDate",

      })
    },
    Time: {
      ...getTimeField({
        label: {
          labelName: "Time",
          labelKey: "EC_VIOLATION_TIME_LABEL"
        },
        placeholder: {
          labelName: "Select Time",
          labelKey: "EC_VIOLATION_TIME_PLACEHOLDER"
        },
        //pattern: getPattern("Number"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_TIME_FIELD_MSG",
        required: true,
        jsonPath: "eChallan.violationTime",
      })
    },
    EncroachmentCategory: {
      ...getSelectField({
        label: {
          labelName: "Encroachment/Seizure Type",
          labelKey: "EC_ENCROACHMENT_TYPE_LABEL"
        },
        optionLabel: "name",
        optionValue: "code",
        placeholder: {
          labelName: "Select Encroachment/Seizure Category",
          labelKey: "EC_ENCROACHMENT_TYPE_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egec.EncroachmentType",
        jsonPath: "eChallan.encroachmentType",
        required: true,
        errorMessage: "EC_ERR_DEFAULT_INPUT_ENCROACHMENT_TYPE_FIELD_MSG",
        afterFieldChange: (action, state, dispatch) => {
          if (action.value == "Registered Street Vendors") { 
            dispatch(toggleSpinner())
            getVendorDetail(action, state, dispatch);
            dispatch(toggleSpinner())
          }
         }
        ,
        beforeFieldChange: (action, state, dispatch) => {
          try {
            if (action.value !== "") {
              let isEncroachmentchanged = false;
              dispatch(prepareFinalObject("articleSeizedDetails", []));
              let encroachmentType = get(state, 'screenConfiguration.preparedFinalObject.eChallan.encroachmentType', '');

              if (action.value !== encroachmentType) {
                isEncroachmentchanged = true;
                dispatch(prepareFinalObject("articleSeizedGridDetails", []));
                dispatch(
                  handleField(
                    "apply", "components.div.children.formwizardSecondStep.children.ArticleGridDetails",
                    "props.data", [])
                );
                if (action.value === 'Registered Street Vendors') {
                  const objectJsonPath = `components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children`;
                  const children = get(
                    state.screenConfiguration.screenConfig["apply"],
                    objectJsonPath,
                    {}
                  );
                  //resetAllFields(children, dispatch, state, 'apply');
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "required", true));
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "props.required", true));                //hidden
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "visible", true));
                } else {
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "props.value", ""));

                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "required", false));
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "props.required", false));
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.LicenseNo",
                      "visible", false));
                  dispatch(prepareFinalObject("eChallan.licenseNoCov", ''));

                }
                clearFields(dispatch)
              }

              
              dispatch(prepareFinalObject("articleSeizedDetails.Others", ''));
              dispatch(prepareFinalObject("articleSeizedDetails.Quantity", ''));
              dispatch(prepareFinalObject("articleSeizedDetails.VehicleNumber", ''));
              dispatch(prepareFinalObject("articleSeizedDetails.Remark", ''));


              if (action.value === 'Seizure of Vehicles') {
                let dataNumberOfViolation = [];
                dataNumberOfViolation.push({ 'code': "1", 'tenantId': "ch.chandigarh", 'name': "First violation ", 'active': true })
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.egec.Numberofvioalation-new",
                    dataNumberOfViolation
                  )
                );
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.egec.ViolationItemList",
                    get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.VehicleType', [])
                  )
                );
                ///Others
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
                    "props.required", false));
                //disabled
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
                    "props.disabled", true));

                ///Quantity
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
                    "props.required", false));
                //hidden
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
                    "visible", false));
                ///Vehicle Regis
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
                    "props.required", true));
                //hidden
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
                    "visible", true));
              } else {
                getArticleData();
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.egec.Numberofvioalation-new",
                    get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.NumberOfViolation', [])
                  )
                );

                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.egec.ViolationItemList",
                    get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.ItemList', [])
                  )
                );

                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
                    "props.required", false));
                //disabled
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
                    "props.disabled", true));

                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
                    "props.required", true));
                //hidden
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
                    "visible", true));

                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
                    "props.required", false));
                //hidden
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
                    "visible", false));

              }
              if (isEncroachmentchanged) {
                set(state, 'form.apply_Violator_Image.files.echallanViolaterImage', []);
                set(state, 'form.apply_Violator_ID_PROOF.files.echallanViolaterIDProofImage', []);
                set(state, 'form.apply_Violations_Image.files.echallanViolationImage', []);
              }
            }
            // dispatch(pFO("Licenses[0].tradeLicenseDetail.structureType", null));
          } catch (e) {
            console.log(e);
          }
        }
      })
    },
    LicenseNo: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "eChallan.licenseNoCov",
      errorMessage: "EC_ERR_DEFAULT_INPUT_LICENSE_NUMBER_FIELD_MSG",
      required: false,
      visible: false,
      props: {
        isFilterData: true,
        required: false,
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Lisense No", labelKey: "EC_LICENSE_NUMBER_LABEL" },
        placeholder: {
          labelName: "Enter License Number",
          labelKey: "EC_LICENSE_NUMBER_PLACEHOLDER"
        },
        errorMessage: "EC_ERR_DEFAULT_INPUT_LICENSE_NUMBER_FIELD_MSG",
        jsonPath: "eChallan.licenseNoCov",
        sourceJsonPath: "applyScreenMdmsData.egec.vendorList2",
        labelsFromLocalisation: true,
        setDataInField: true,
        suggestions: [],
        fullwidth: true,
        required: true,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      afterFieldChange: (action, state, dispatch) => {
        try 
        {
          dispatch(
            handleField(
              "apply",
              'components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.NumberOFviolations',
              "props.value",0
            )
          );

          let vendorvalue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.vendorList', []);
          let __FOUND = vendorvalue.find(function (vendorRecord, index) {
            if (vendorRecord.code == action.value)
              return true;
          });

          //if (state.screenConfiguration.preparedFinalObject.eChallan.hasOwnProperty('violatorName')) {
          dispatch(prepareFinalObject("eChallan.violatorName", __FOUND !== undefined ? __FOUND.fullname : ''));
          dispatch(prepareFinalObject("eChallan.address", __FOUND !== undefined ? __FOUND.address : ''));
          dispatch(prepareFinalObject("eChallan.fatherName", __FOUND !== undefined ? __FOUND.fatherSpouseName : ''));
          dispatch(prepareFinalObject("eChallan.contactNumber", __FOUND !== undefined ? __FOUND.contactNumber : ''));
          dispatch(prepareFinalObject("eChallan.numberOfViolation", __FOUND !== undefined ? __FOUND.numberOfViolation : '1'));
          dispatch(
            handleField(
              "apply",
              'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.NameofViolator',
              "props.value",
              __FOUND !== undefined ? __FOUND.fullname : ''
            )
          );
          dispatch(
            handleField(
              "apply",
              'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.Address',
              "props.value",
              __FOUND !== undefined ? __FOUND.address : ''
            )
          );
          dispatch(
            handleField(
              "apply",
              'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.FatherName',
              "props.value",
              __FOUND !== undefined ? __FOUND.fatherSpouseName : ''
            )
          );
          dispatch(
            handleField(
              "apply",
              'components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.ContactNo',
              "props.value",
              __FOUND !== undefined ? __FOUND.contactNumber : ''
            )
          );
          dispatch(
            handleField(
              "apply",
              'components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.NumberOFviolations',
              "props.value",
              get(state, 'screenConfiguration.preparedFinalObject.eChallan.numberOfViolation', '1')
            )
          );

          console.log("vcount", __FOUND);
          //}
        } catch (error) {
          console.log('FetchLicense', error);
        }
      }
    },
    NumberOFviolations: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "eChallan.numberOfViolation",
      errorMessage: "EC_ERR_DEFAULT_INPUT_VIOLATION_COUNT_FIELD_MSG",
      required: false,
      props: {
        required: false,
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: {
          labelName: "Number of Violation(s)",
          labelKey: "EC_NUMBER_OF_VIOLATION_LABEL"
        },
        placeholder: {
          labelName: "Select Number of Violations",
          labelKey: "EC_NUMBER_OF_VIOLATION_PLACEHOLDER"
        },
        errorMessage: "EC_ERR_DEFAULT_INPUT_VIOLATION_COUNT_FIELD_MSG",
        jsonPath: "eChallan.numberOfViolation",
        sourceJsonPath: "applyScreenMdmsData.egec.Numberofvioalation-new",
        labelsFromLocalisation: true,
        setDataInField: true,
        suggestions: [],
        fullwidth: true,
        required: true,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      
    },
    // NumberOFviolations: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Number of Violation(s)",
    //       labelKey: "EC_NUMBER_OF_VIOLATION_LABEL"
    //     },
    //     optionLabel: "name",
    //     optionValue: "code",
    //     placeholder: {
    //       labelName: "Select Number of Violations",
    //       labelKey: "EC_NUMBER_OF_VIOLATION_PLACEHOLDER"
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.egec.Numberofvioalation-new",
    //     jsonPath: "eChallan.numberOfViolation",
    //     required: true,
    //     errorMessage: "EC_ERR_DEFAULT_INPUT_VIOLATION_COUNT_FIELD_MSG",
    //   })
    // },
    sector: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "eChallan.sector",
      errorMessage: "EC_ERR_DEFAULT_INPUT_SECTOR_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Sector", labelKey: "EC_VIOLATION_SECTOR_LABEL" },
        placeholder: {
          labelName: "select Violation Sector",
          labelKey: "EC_VIOLATION_SECTOR_PLACEHOLDER"
        },
        jsonPath: "eChallan.sector",
        sourceJsonPath: "applyScreenMdmsData.egec.sector",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: true,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },
    NatureOfViolation: {
      ...getTextField({
        label: {
          labelName: "Nature Of Violation",
          labelKey: "EC_NATURE_OF_VIOLATION_LABEL"
        },
        placeholder: {
          labelName: "Enter Nature Of Violation",
          labelKey: "EC_NATURE_OF_VIOLATION_PLACEHOLDER"
        },
        pattern: getPattern("ECItemDescription"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_NATURE_OF_VIOLATION_FIELD_MSG",
        required: true,
        jsonPath: "eChallan.natureOfViolation",
        props: {
          className: "textfield-enterable-selection",
          multiline: true,
          rows: "4"
        },
      })
    },
    SILocationDetailsConatiner: getCommonContainer({
      propertyGisCoordinates:
      {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "gis-div-css",
          style: {
            width: "100%",
            cursor: "pointer"
          },
          jsonPath:
            "eChallan.latitude"
        },
        jsonPath: "eChallan.latitude",
        onClickDefination: {
          action: "condition",
          callBack: showHideMapPopup
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        children: {
          gisTextField: {
            ...getTextField({
              label: {
                labelName: "Locate on Map",
                labelKey: "EC_VIOLATION_DETAILS_GIS_CORD_LABEL"
              },
              placeholder: {
                labelName: "Select your property location on map",
                labelKey: "EC_VIOLATION_DETAILS_GIS_CORD_PLACEHOLDER"
              },
              jsonPath:
                "eChallan.latitude",
              iconObj: {
                iconName: "gps_fixed",
                position: "end"
              },
              gridDefination: {
                xs: 12,
                sm: 12
              },
              props: {
                disabled: true,
                cursor: "pointer",
                jsonPath:
                  "eChallan.latitude"
              }
            })
          }
        },
        required: true,
        errorMessage: "EC_ERR_DEFAULT_INPUT_LOCATION_FIELD_MSG",
      }
    }),
    mapsDialog: {
      componentPath: "Dialog",
      props: {
        open: false
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          children: {
            popup: getMapLocator()
          }
        }
      }

    },


  }),

});

export const violatorDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Violator Details",
        labelKey: "EC_VIOLATOR_DETAILS_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    violatorDetailsConatiner: getCommonContainer({
      NameofViolator: getTextField({
        label: {
          labelName: "Name Of Violator",
          labelKey: "EC_NAME_OF_VIOLATOR_LABEL"
        },
        placeholder: {
          labelName: "Enter Name Of Violator",
          labelKey: "EC_NAME_OF_VIOLATOR_LABEL"
        },
        pattern: getPattern("ECViolatorName"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_VIOLATOR_NAME_FIELD_MSG",
        required: true,
        jsonPath: "eChallan.violatorName",

      }),

      FatherName: getTextField({
        label: {
          labelName: "Father's Name",
          labelKey: "EC_VIOLATOR_FATHER_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Father Name",
          labelKey: "EC_VIOLATOR_FATHER_NAME_PLACEHOLDER"
        },

        pattern: getPattern("ECViolatorName"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_FATHER_NAME_FIELD_MSG",
        required: false,
        jsonPath: "eChallan.fatherName",
      }),
      ContactNo: getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "EC_VIOLATOR_CONTACT_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "EC_VIOLATOR_CONTACT_NUMBER_PLACEHOLDER"
        },

        pattern: getPattern("MobileNo"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_CONTACT_NUMBER_FIELD_MSG",
        required: true,
        jsonPath: "eChallan.contactNumber"
      }),
      EmailId: getTextField({
        label: {
          labelName: "Email Id",
          labelKey: "EC_VIOLATOR_EMAIL_ID_LABEL"
        },
        placeholder: {
          labelName: "Enter EmailId",
          labelKey: "EC_VIOLATOR_EMAIL_ID_LABEL"
        },

        pattern: getPattern("Email"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_EMAILID_FIELD_MSG",
        required: false,
        jsonPath: "eChallan.emailId"
      }),


      IDProof: {
        ...getSelectField({
          label: { labelName: "ID Proof", labelKey: "EC_VIOLATOR_SELECT_ID_PROOF_LABEL" },
          optionLabel: "name",
          optionValue: "name",
          placeholder: {
            labelName: "Select ID Proof",
            labelKey: "EC_VIOLATOR_SELECT_ID_PROOF_PLACEHOLDER"
          },
          sourceJsonPath: "applyScreenMdmsData.egec.IDProof",
          jsonPath: "eChallan.IDProof",
          required: false,
          props: {
            className: "applicant-details-error",
            required: true
            // disabled: true
          },
          visible: false,
        })
      },
      IDProofValue: getTextField({
        label: {
          labelName: "ID Proof Value",
          labelKey: "EC_VIOLATOR_ID_PROOF_VALUE_LABEL"
        },
        placeholder: {
          labelName: "Enter ID Proof Value",
          labelKey: "EC_VIOLATOR_ID_PROOF_VALUE_PLACEHOLDER"
        },
        jsonPath: "eChallan.IDProofValue",
        pattern: getPattern("Name"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_FIELD_MSG",
        required: false,
        visible: false,
      }),
      Address: getTextField({
        label: {
          labelName: "Address",
          labelKey: "EC_VIOLATOR_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Address",
          labelKey: "EC_VIOLATOR_ADDRESS_PLACEHOLDER"
        },
        props: {
          className: "textfield-enterable-selection",
          multiline: true,
          rows: "4"
        },
        pattern: getPattern("ECViolatorAddress"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_ADDRESS_FIELD_MSG",
        required: true,
        jsonPath: "eChallan.address"
      }),
    }),
  });
