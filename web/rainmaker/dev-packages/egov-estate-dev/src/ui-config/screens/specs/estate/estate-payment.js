import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonHeader, getCommonCard, getCommonContainer, getTextField, getSelectField,getPattern, getCommonGrayCard, getCommonTitle, getLabel  } from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader({
    labelName: "Rent Payment",
    labelKey: "ES_RENT_PAYMENT_HEADER"
  });

const propertyDetailsHeader = getCommonTitle(
    {
        labelName: "Property Details",
        labelKey: "ES_PROPERTY_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )
  const offlinePaymentDetailsHeader = getCommonTitle(
    {
        labelName: "Offline Payment Details",
        labelKey: "ES_OFFLINE_PAYMENT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

  const fileNumberField = {
    label: {
        labelName: "File Number",
        labelKey: "ES_FILE_NUMBER_LABEL"
      },
      placeholder: {
        labelName: "Enter File Number",
        labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
      },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    jsonPath: "searchScreenFileNo.fileNumber",
    placeholder: {
        labelName: "Enter File Number and click on search icon",
        labelKey: "ES_FILE_NUMBER_SEARCH_PLACEHOLDER"
    },
    title: {
      value:
        "If you have already assessed your property, then please search your property by your File Number",
      key: "If you have already assessed your property, then please search your property by your File Number"
    },
    infoIcon: "info_circle",
    errorMessage: "ES_FILE_NUMBER_SEARCH_PLACEHOLDER",
    jsonPath: "searchScreenFileNo.fileNumber",
    iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51"
      },
    //   onClickDefination: {
    //     action: "condition",
    //     callBack: (state, dispatch) => {
    //       getEstateRentPaymentPropertyDetails(state, dispatch);
    //     }
    //   },
    
    afterFieldChange: (action, state, dispatch)=> { 
    //   dispatch(prepareFinalObject("Properties", []))
    //   dispatch(handleField(
    //     "payment",
    //     "components.div.children.detailsContainer.children.rentSummaryDetails",
    //     "visible",
    //     false
    //   ))
    dispatch(
        prepareFinalObject(
          "searchScreen.sectorNumber",
          ""
        )
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.propertyType",
          ""
        )
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.areaOfPropertyInSqFeet",
          ""
        )
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.ratePerSqfeet",
          ""
        )
      )
    dispatch(
        prepareFinalObject(
          "searchScreen.category",
          ""
        )
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.subCategory",
          ""
        )
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.siteNumber",
          ""
        )
      )
    }
  }
  const getEstateRentPaymentPropertyDetails = async (state, dispatch) => {
    try {
      const fileNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenFileNo.fileNumber")
      if(!!fileNumber) {
        const payload = await getPropertyDetails({
          state, dispatch, fileNumber, screenKey: "estate-payment",
          jsonPath: "searchScreenFileNo.fileNumber",
          componentJsonPath:"components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumber"
        })
        if(!!payload) {
          const {Properties} = payload;
          // const {owners = []} = Properties[0]
          // const findOwner = owners.find(item => !!item.activeState) || {}
          dispatch(
            prepareFinalObject(
              "searchScreen.sectorNumber",
              Properties[0].sectorNumber
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.category",
              Properties[0].category
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.subCategory",
              Properties[0].subCategory
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.siteNumber",
              Properties[0].siteNumber
            )
          )
        //   dispatch(
        //     prepareFinalObject(
        //       "searchScreen.propertyId",
        //       Properties[0].propertyDetails.propertyId
        //     )
        //   )
          dispatch(
            prepareFinalObject(
              "searchScreen.propertyType",
              Properties[0].propertyType
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.areaOfPropertyInSqFeet",
              Properties[0].areaOfPropertyInSqFeet
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.ratePerSqfeet",
              Properties[0].ratePerSqfeet
            )
          )
          // dispatch(
          //   prepareFinalObject(
          //     "searchScreen.ownername",
          //     findOwner.ownerDetails.name
          //   )
          // )
  
        //   dispatch(
        //     prepareFinalObject(
        //       "Properties",
        //       Properties
        //     )
        //   )
  
        //   return Properties[0].propertyDetails.propertyId
        }
      }
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
      return false
    }
  }
  
  export const offlinePaymentDetails = getCommonCard({
      header: offlinePaymentDetailsHeader,
      detailsContainer: getCommonContainer({
        paymentType: getSelectField({
            label: {
                labelName: "Payment Type",
                labelKey: "ES_PAYMENT_TYPE_LABEL"
              },
            required: false,
            jsonPath: "Properties[0].paymentType",
            optionValue: "code",
            optionLabel: "name",
            sourceJsonPath: "searchScreenMdmsData.EstatePropertyService.categories",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_PAYMENT_TYPE_FIELD",
            placeholder: {
              labelName: "",
              labelKey: ""
            },
            props: {
              disabled: true
            },
            required: false,
            jsonPath: "Properties[0].paymentType"
          }),
        Amount: getTextField({
            label: {
                labelName: "Amount",
                labelKey: "ES_AMOUNT_LABEL"
            },
            placeholder: {
                labelName: "Enter amount",
                labelKey: "ES_ENTER_AMOUNT_PLACEHOLDER"
            },
            jsonPath: "Properties[0].amount",
            optionValue: "code",
            optionLabel: "label",
            sourceJsonPath: "applyScreenMdmsData.propertyTypes",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_AMOUNT_FIELD",
            placeholder: {
              labelName: "",
              labelKey: ""
            },
            props: {
              disabled: false
            },
            required: false,
            jsonPath: "Properties[0].amount"
        }),
        bankName: getTextField({
            label: {
                labelName: "Bank Name",
                labelKey: "ES_BANK_NAME_LABEL"
            },
            placeholder: {
                labelName: "Enter Bank Name",
                labelKey: "ES_ENTER_BANK_NAME_PLACEHOLDER"
            },
            jsonPath: "Properties[0].bankName",
            optionValue: "code",
            optionLabel: "label",
            sourceJsonPath: "applyScreenMdmsData.propertyTypes",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_BANK_NAME_FIELD",
            placeholder: {
              labelName: "",
              labelKey: ""
            },
            props: {
              disabled: false
            },
            required: false,
            jsonPath: "Properties[0].amount"
        }),
        transactionId: getTextField({
            label: {
                labelName: "Transaction ID",
                labelKey: "ES_TRANSACTION_ID_LABEL"
            },
            placeholder: {
                labelName: "Enter Transaction ID",
                labelKey: "ES_ENTER_TRANSACTION_ID_PLACEHOLDER"
            },
            jsonPath: "Properties[0].transactionId",
            optionValue: "code",
            optionLabel: "label",
            sourceJsonPath: "applyScreenMdmsData.propertyTypes",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_TRANSACTION_ID_FIELD",
            placeholder: {
              labelName: "",
              labelKey: ""
            },
            props: {
              disabled: false
            },
            required: false,
            jsonPath: "Properties[0].transactionId"
        }),
      })
  })
  export const propertyDetails = getCommonCard({
    header: propertyDetailsHeader,
    detailsContainer: getCommonContainer({
      fileNumber: getTextField(fileNumberField),
      category: getSelectField({
        label: {
            labelName: "Category",
            labelKey: "ES_CATEGORY_LABEL"
          },
        required: false,
        jsonPath: "Properties[0].category",
        optionValue: "code",
        optionLabel: "name",
        sourceJsonPath: "searchScreenMdmsData.EstatePropertyService.categories",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_CATEGORY_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].category"
      }),
      subCategory: getSelectField({
        label: {
            labelName: "Sub Category",
            labelKey: "ES_SUB_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Enter Sub Category",
            labelKey: "ES_SUB_CATEGORY_PLACEHOLDER"
          },
        required: false,
        jsonPath: "Properties[0].subCategory",
        optionValue: "code",
        optionLabel: "name",
        sourceJsonPath: "applyScreenMdmsData.propertyTypes",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_SUB_CATEGORY_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].subCategory"
      }),
      sectorNumber: getSelectField({
        label: {
            labelName: "sector number",
            labelKey: "ES_SECTOR NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter sector number",
            labelKey: "ES_SECTOR NUMBER_PLACEHOLDER"
          },
        required: false,
        jsonPath: "Properties[0].sectorNumber",
        optionValue: "code",
        optionLabel: "label",
        sourceJsonPath: "applyScreenMdmsData.propertyTypes",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_SECTOR_NUMBER_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].sectorNumber"
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
        jsonPath: "Properties[0].siteNumber",
        optionValue: "code",
        optionLabel: "label",
        sourceJsonPath: "applyScreenMdmsData.propertyTypes",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "ES_ERR_SITE_NUMBER_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].siteNumber"
      }),
      propertyType: getTextField({
        label: {
        labelName: "Property Type",
        labelKey: "ES_PROPERTY_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Enter Property Type",
        labelKey: "ES_ENTER_PROPERTY_TYPE_PLACEHOLDER"
    },
    required: false,
    jsonPath: "Properties[0].propertyType",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.propertyTypes",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "ES_ERR_PROPERTY_TYPE_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].propertyType"
      }),
      areaOfPropertyInSqFeet: getTextField({
        label: {
            labelName: "Area of property in Square Feet",
            labelKey: "ES_AREA_OF_PROPERTY_IN_SQ_FEET_LABEL"
        },
        placeholder: {
            labelName: "Enter Area of property in Square Feet",
            labelKey: "ES_ENTER_AREA_OF_PROPERTY_IN_SQ_FEET_PLACEHOLDER"
        },
        required: false,
        jsonPath: "Properties[0].areaOfPropertyInSqFeet",
        optionValue: "code",
        optionLabel: "label",
        sourceJsonPath: "applyScreenMdmsData.propertyTypes",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "RP_ERR_AREA_OF_PROPERTY_IN_SQ_FEET_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].areaOfPropertyInSqFeetField"
      }),
      ratePerSqfeet: getTextField({
        label: {
            labelName: "Rate per Square Feet",
            labelKey: "ES_RATE_PER_SQUARE_FEET_LABEL"
        },
        placeholder: {
            labelName: "Enter Rate per Square Feet",
            labelKey: "ES_ENTER_RATE_PER_SQUARE_FEET_PLACEHOLDER"
        },
        required: false,
        jsonPath: "Properties[0].ratePerSqfeet",
        optionValue: "code",
        optionLabel: "label",
        sourceJsonPath: "applyScreenMdmsData.propertyTypes",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        errorMessage: "RP_ERR_RATE_PER_SQUARE_FEET_FIELD",
        placeholder: {
          labelName: "",
          labelKey: ""
        },
        props: {
          disabled: true
        },
        required: false,
        jsonPath: "Properties[0].ratePerSqfeet"
      })
    })
  })

const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      offlinePaymentDetails,
    //   paymentInfo
    },
    visible: true
  }
const payment = {
    uiFramework: "material-ui",
    name: "estate-payment",
    beforeInitScreen: (action, state, dispatch) => {
    //   beforeInitFn(action, state, dispatch);
    //   dispatch(prepareFinalObject("Properties", []));
    //   dispatch(prepareFinalObject("property", {}))
    //   dispatch(prepareFinalObject("paymentInfo", {}))
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
                header: {
                  gridDefination: {
                    xs: 12,
                    sm: 10
                  },
                  ...header
                }
              }
            },
            detailsContainer
            // footer: paymentFooter
          }
        }
      }
}

export default payment;