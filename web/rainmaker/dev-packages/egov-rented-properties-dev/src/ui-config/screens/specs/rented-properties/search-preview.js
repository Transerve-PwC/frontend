import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getCommonCard,getTextField,getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { downloadCertificateForm} from "../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getReviewOwner, getReviewProperty, getReviewAddress, getReviewRentDetails, getReviewPaymentDetails,getReviewGrantDetails ,getGrantDetails,getGrantDetailsAvailed} from "./applyResource/review-property";
import { getReviewDocuments } from "./applyResource/review-documents";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject, toggleSnackbar,handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { editFooter,footerReviewTop } from "./applyResource/reviewFooter";
import { httpRequest } from "egov-ui-framework/ui-utils/api.js";
import{formatAmount} from "./searchResource/functions"
import set from "lodash/set"
import { get } from "lodash";
import {applicationNumber} from './apply'
import { setApplicationNumberBox } from "../../../../ui-utils/apply";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
const userInfo = JSON.parse(getUserInfo());
const tenantId = getTenantId();
const {roles = []} = userInfo
const findItem = roles.find(item => item.code === "RP_CLERK");

let transitNumber = getQueryArg(window.location.href, "transitNumber");

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Rented Properties",
    labelKey: "RP_COMMON_RENTED_PROPERTIES"
  }),
  applicationNumber : {
    ...applicationNumber,
    props: {
      ...applicationNumber.props,
      type: "RP_MASTER"
    }
  }
});
const reviewOwnerDetails = getReviewOwner(false);
const reviewPropertyDetails = getReviewProperty(false);
const reviewAddressDetails = getReviewAddress(false);
const reviewRentDetails = getReviewRentDetails(false);
const reviewPaymentDetails = getReviewPaymentDetails(false);
const reviewDocumentDetails = getReviewDocuments(false, "apply")
const grantDetailAvailed=getGrantDetailsAvailed(false)
const reviewGrantDetails = getReviewGrantDetails(false)
const grantDetail=getGrantDetails(false)
export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails,
  reviewAddressDetails,
  reviewOwnerDetails,
  reviewRentDetails,
  reviewPaymentDetails,
  reviewDocumentDetails,
  grantDetailAvailed,
  reviewGrantDetails,
  grantDetail
  
});

export const searchResults = async (action, state, dispatch, transitNumber) => {
  let queryObject = [
    { key: "transitNumber", value: transitNumber }
  ];
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    let owners = properties[0].owners
    owners = owners.map(item => ({...item , ownerDetails: {...item.ownerDetails, posessionStartdate: !!item.isPrimaryOwner ? 
       item.ownerDetails.posessionStartdate : parseInt(item.ownerDetails.allotmentStartdate)}}))
    const grandDetails=properties[0].grantDetails
    let state = properties[0].masterDataState;
    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active)
    applicationDocuments = applicationDocuments.filter(item => !!item.active)
    let {rentSummary} = properties[0]
    let formatrentSummary = {
      balancePrincipal: !!rentSummary ? formatAmount(rentSummary.balancePrincipal.toFixed(2)) : 0,
      balanceInterest: !!rentSummary ? formatAmount(rentSummary.balanceInterest.toFixed(2)) : 0,
      balanceAmount: !!rentSummary ? formatAmount(rentSummary.balanceAmount.toFixed(2)) : 0
    }
    
    properties[0].propertyDetails.interestRate = (properties[0].propertyDetails.interestRate).toString()
    properties[0].propertyDetails.rentIncrementPercentage = (properties[0].propertyDetails.rentIncrementPercentage).toString()
    properties[0].propertyDetails.rentIncrementPeriod = (properties[0].propertyDetails.rentIncrementPeriod).toString()

    properties = [{...properties[0], owners, formatrentSummary, propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
    dispatch(
      prepareFinalObject(
        "PropertiesTemp[0].removedDocs",
        removedDocs
      )
    );
    await setDocuments(
      payload,
      "Properties[0].propertyDetails.applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,'RP'
    );
    setApplicationNumberBox(state, dispatch, transitNumber, "search-preview")

    const getGrantDetailsAvailed = grandDetails !==null
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.propertyReviewDetails.children.cardContent.children.grantDetailAvailed",
        "visible",
        getGrantDetailsAvailed
    ),
  );
  const isGrantDetails = grandDetails ===null
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.propertyReviewDetails.children.cardContent.children.grantDetail",
      "visible",
      isGrantDetails
  ),
);
      const showEstimate = grandDetails !==null
      dispatch(
        handleField(
            "search-preview",
            "components.div.children.propertyReviewDetails.children.cardContent.children.reviewGrantDetails",
            "visible",
            showEstimate
        ),
      );
  
    if(state == "PM_APPROVED"){
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.rightdiv",
          "visible",
          true
        )
      );
    }  
        
    if(state == 'PM_REJECTED'){
      let path = "components.div.children.headerDiv.children.searchButton"
      dispatch(
        handleField(
          "search-preview",
          path,
          "visible",
          false
        )
      );
      let tabs = [
        {
          tabButton: { labelName: "Property Details", labelKey: "RP_PROPERTY_DETAILS" }
        }
      ]
      const props = {
        tabs,
        activeIndex: 0,
        onTabChange
      }
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.tabSection",
          "props",
          props
        )
      );

 
    }
    if(state == "PM_APPROVED" && !!findItem){
    const footer = editFooter(
      action,
      state,
      dispatch,
      status,
      "applicationNumber",
      "tenantId",
      "OwnershipTransferRP"
    );
    process.env.REACT_APP_NAME != "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.footer",
            "visible",
            true
          )
        );
        
  }
    if((state == "PM_PENDINGCLARIFICATION" || state == "PM_REJECTED") && !!findItem){
    const footer = editFooter(
      action,
      state,
      dispatch,
      status,
      "applicationNumber",
      tenantId,
      "OwnershipTransferRP",
      transitNumber

    );
    process.env.REACT_APP_NAME != "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.footer",
            "visible",
            true
          )
        );
        
  }
}
}

const beforeInitFn = async (action, state, dispatch, transitNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(transitNumber){
    await searchResults(action, state, dispatch, transitNumber)
  }
}

export const onTabChange = async(tabIndex, dispatch, state) => {
  transitNumber = getQueryArg(window.location.href, "transitNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let path = ""
  if(tabIndex === 0) {
    path = `/rented-properties/search-preview?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 1) {
    path = `/rented-properties/property-transitImages?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 2) {
    path = `/rented-properties/notices?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 3) {
    path = `/rented-properties/rent-history?transitNumber=${transitNumber}&tenantId=${tenantId}`
  }
  dispatch(setRoute(path))
}

export const tabs = [
  {
    tabButton: { labelName: "Property Details", labelKey: "RP_PROPERTY_DETAILS" },
  },
  {
    tabButton: { labelName: "Transit Site Image", labelKey: "RP_TRANSIT_SITE_IMAGES" },
  },
  {
    tabButton: { labelName: "Notices", labelKey: "RP_NOTICES" },
  },
  {
    tabButton: {labelName: "Rent History", labelKey: "RP_COMMON_RENT_HISTORY"}
  }
]

const buttonComponent = (label) => ({
  componentPath: "Button",
  gridDefination: {
    xs: 12,
    sm: 2
  },
  props: {
    variant: "contained",
    style: {
      color: "white",
      backgroundColor: "#fe7a51",
      borderColor:"#fe7a51",
      borderRadius: "2px",
      height: "48px"
    }
  },
  children: {
    buttonLabel: getLabel({
      labelName: label,
      labelKey: label
    })
  },
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      const { Properties, PropertiesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = PropertiesTemp[0].reviewDocData;
      set(Properties[0],"additionalDetails.documents",documents)
      downloadCertificateForm(Properties, [],'original',tenantId);
    }
  }
})

const handleClose = async (state,dispatch,action) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.adhocDialog",
      "props.open",
      false
  ),
)
let transitNo = getQueryArg(window.location.href, "transitNumber");
await searchResults(action, state, dispatch, transitNo)
let area=get(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.address.area")
let phone=get(state.screenConfiguration.preparedFinalObject,"Properties[0].owners[0].ownerDetails.phone")
let pincode=get(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.address.pincode")
dispatch(
  handleField(
    "search-preview",
    "components.div.children.adhocDialog.children.popup.children.area.children.rateField",
    "props.value",
    area
),
)
dispatch(
  handleField(
    "search-preview",
    "components.div.children.adhocDialog.children.popup.children.phoneNumber.children.phone",
    "props.value",
    phone
),
)
dispatch(
  handleField(
    "search-preview",
    "components.div.children.adhocDialog.children.popup.children.pinCode.children.rateField",
    "props.value",
    pincode
),
)
};

const update = async (state, dispatch) => {
  const {Properties} = state.screenConfiguration.preparedFinalObject
  const locality=Properties[0].propertyDetails.address.area
  const pincode=Properties[0].propertyDetails.address.pincode
  const phone=Properties[0].owners[0].ownerDetails.phone
  if(!locality || !pincode || !phone){
    dispatch(
    toggleSnackbar(
      true,
      { labelName: "Please enter the mandatory feilds", labelKey: "RP_ERR_FILL_RENTED_MANDATORY_FIELDS"},
      "error"
    )
    );
  return
  }
  else{
  try {
  const response = await httpRequest(
    "post",
    "/rp-services/property/_update",
    "",
    [],
    {"Properties": Properties}
  );
  dispatch(handleField(
    "search-preview",
    "components.div.children.adhocDialog",
    "props.open",
    false
  ))
  if(!!response && !!response.Properties.length) {
    let properties = response.Properties;
    //dispatch(prepareFinalObject("Properties", response.Properties))
    let {rentSummary} = properties[0]
    let formatrentSummary = {
      balancePrincipal: !!rentSummary ? formatAmount(rentSummary.balancePrincipal.toFixed(2)) : 0,
      balanceInterest: !!rentSummary ? formatAmount(rentSummary.balanceInterest.toFixed(2)) : 0,
      balanceAmount: !!rentSummary ? formatAmount(rentSummary.balanceAmount.toFixed(2)) : 0
    }
properties=[{...properties[0],formatrentSummary}]
    dispatch(prepareFinalObject("Properties", properties))
   // dispatch(prepareFinalObject("Properties", response.Properties))
  }
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


const phoneField = {
  label: {
    labelName: "phone number",
    labelKey: "RP_COMMON_PHONE_NUMBER"
  },
  placeholder: {
    labelName: "Enter Phone Number",
    labelKey: "RP_COMMON_PHONE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  jsonPath: "Properties[0].owners[0].ownerDetails.phone",
  minLength:10,
  maxLength:10,
  required: true,
  pattern: getPattern("MobileNo"),
  errorMessage: "RP_ERR_PHONE_NUMBER_FIELD",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 10) {
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_PHONE_NUMBER_FIELD_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_PHONE_NUMBER_FIELD_MAXLENGTH"
            )
        )
    }
    else {
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_PHONE_NUMBER_FIELD"
            )
        )
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_PHONE_NUMBER_FIELD"
            )
        )
    }
  }
}

const pincodeField = {
  label: {
    labelName: "Pincode",
    labelKey: "RP_COMMON_PINCODE_LABEL"
  },
  placeholder: {
    labelName: "Enter Pincode",
    labelKey: "RP_COMMON_PINCODE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  jsonPath: "Properties[0].propertyDetails.address.pincode",
  minLength: 6,
  maxLength: 6,
  required: true,
  errorMessage: "RP_ERR_PINCODE_FIELD",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 6) {
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_PINCODE_FIELD_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_PINCODE_FIELD_MAXLENGTH"
            )
        )
    }
    else {
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_PINCODE_FIELD"
            )
        )
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_PINCODE_FIELD"
            )
        )
    }
  }
}

const areaField = {
  label: {
    labelName: "Locality",
    labelKey: "RP_LOCALITY_LABEL"
},
placeholder: {
    labelName: "Enter Locality",
    labelKey: "RP_LOCALITY_PLACEHOLDER"
},
  gridDefination: {
    xs: 12,
    sm: 12
  },
  jsonPath: "Properties[0].propertyDetails.address.area",
  minLength: 3,
  maxLength: 100,
  required: true,
  errorMessage: "RP_ERR_AREA_FIELD",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 100) {
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_AREA_LOCALITY_FIELD_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_AREA_LOCALITY_FIELD_MAXLENGTH"
            )
        )
    }
    else if(action.value.length < 3){
      dispatch(
        handleField(
          "search-preview",
          action.componentJsonpath,
          "errorMessage",
          "RP_ERR_AREA_LOCALITY_FIELD_MINLENGTH"
        )
    )
    dispatch(
        handleField(
          "search-preview",
          action.componentJsonpath,
          "props.errorMessage",
          "RP_ERR_AREA_LOCALITY_FIELD_MINLENGTH"
        )
    )
    }
    else {
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_AREA_FIELD"
            )
        )
        dispatch(
            handleField(
              "search-preview",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_AREA_FIELD"
            )
        )
    }
  }
}

export const editPopup = getCommonContainer({
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
              labelName: "Edit Owner Details",
              labelKey: "RP_EDIT_HEADER"
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
              callBack: (state, dispatch,action) => {
                handleClose(state, dispatch,action);
              }
            }
          }
        }
      }
    }
  },
  phoneNumber: getCommonContainer({
      phone: getTextField(phoneField)
    }),

  pinCode: getCommonContainer({
      rateField: getTextField(pincodeField)
  }),  

  area: getCommonContainer({
    rateField: getTextField(areaField)
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
              labelKey: "RP_UPDATE_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: update
          }
        }
      }
    }
})
const getData = async (action, state, dispatch) => {
  const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: "MasterRP" }]
  await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
}
const rentedPropertiesDetailPreview = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    transitNumber = getQueryArg(window.location.href, "transitNumber");
    beforeInitFn(action, state, dispatch, transitNumber);
    getData(action, state, dispatch)
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 0,
              onTabChange
            },
            type: "array",
          },
          rightdiv: {
            visible:false,
            uiFramework: "custom-atoms",
            componentPath: "Container",
            props: {
              style: { justifyContent: "flex-end", marginTop: 10 }
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              align: "right",
            },
            children: {
              allotmentButton: buttonComponent("Download Allotment Letter"),
            }
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "WorkFlowContainer",
            props: {
              dataPath: "Properties",
              moduleName: "MasterRP",
              updateUrl: "/rp-services/property/_update"
            }
          },
          adhocDialog: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "DialogContainer",
            props: {
              open: false,
              screenKey: "search-preview"
            },
            children: {
              popup: editPopup
            }
          },
        propertyReviewDetails
      }
    }
  }
};

export default rentedPropertiesDetailPreview;