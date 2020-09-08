import {
    getCommonHeader, getTextField, getSelectField, getCommonContainer, getCommonSubHeader, getLabel, getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopup,showHideAdhocVendorPopup } from "../../utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { createUpdateFineMaster,updateVendorMaster } from "../../../../../ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css";
import { getUserInfo, setapplicationMode } from "egov-ui-kit/utils/localStorageUtils";
import { searchResultApiResponse } from "../searchResource/searchResultApiResponse";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

// const hasButton = getQueryArg(window.location.href, "hasButton");
// let enableButton = true;
// enableButton = hasButton && hasButton === "false" ? false : true;

const updateVendorMasterDetails = async (state, dispatch, applnid) => {
    let response = await updateVendorMaster(state, dispatch);
    // setapplicationMode('PENDING');
    let responseStatus = get(response, "status", "");
    // if (responseStatus == "SUCCESS" || responseStatus == "success") {
    //     let errorMessage =
    //         getLabel({
    //             labelName: 'Item Master Inserted successfully!',
    //             labelKey: "EC_VENDOR_MASTER_SUCCESS_TOASTER"
    //         });
    //     dispatch(toggleSnackbar(true, errorMessage, "success"));
    //     dispatch(prepareFinalObject("VendorMaster", {}));
    //     showHideAdhocVendorPopup(state, dispatch, "create")
    //     searchResultApiResponse('', state, dispatch);
    // }
    // else {
    //     let errorMessage =
    //         getLabel({
    //             labelName: "Submission Falied, Try Again later!",
    //             labelKey: "EC_FINE_MASTER_FAILED_TOASTER"
    //         });
    //     dispatch(toggleSnackbar(true, errorMessage, "error"));
    // }

};

export const adhocPopup = getCommonContainer({
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
                            labelName: "EDIT Vendor Master",
                            labelKey: "EC_POPUP_VENDOR_MASTER_HEADER"
                        },
                        {
                            style: {
                                fontSize: "20px"
                            }
                        }
                    )
                }
            },
            closebtns: {
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
                            callBack: (state, dispatch) =>
                                showHideAdhocVendorPopup(state, dispatch, "create")
                        }
                    }
                }
            },
        }
    },
    vendorMasterCard: getCommonContainer(
        {
            vendorMasterContainer: getCommonContainer({
                vendorMasterIdControl: getTextField({
                    label: {
                        labelName: "Vendor ID",
                        labelKey: "EC_POPUP_VENDOR_MASTER_LABEL"
                    },
                    placeholder: {
                        labelName: "Fine Master ID",
                        labelKey: "EC_POPUP_VENDOR_MASTER_ID_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    jsonPath: "VendorMaster.vendorUuid",
                    props: {

                        style: {
                            width: "100%"
                        },
                    },
                    visible: false,
                }),
                vendorMasterCOVNumberControl: getTextField({
                    label: {
                        labelName: "COV Number",
                        labelKey: "EC_POPUP_COV_NUMBER_LABEL"
                    },
                    placeholder: {
                        labelName: "COV Number",
                        labelKey: "EC_POPUP_COV_NUMBER_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    jsonPath: "VendorMaster.covNo",
                    required: true,
                    pattern: getPattern('Amount'),
                    // props: {

                    //     style: {
                    //         width: "100%"
                    //     },
                    // },
                    // visible: false,
                }),
                venderMasterName: getTextField({
                    label: {
                        labelName: "Name",
                        labelKey:  "EC_POPUP_NAME_LABEL"
                    },
                    placeholder: {
                        labelName: "Name",
                        labelKey: "EC_POPUP_VENDER_NAME_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    jsonPath: "VendorMaster.name",
                    required: true,
                    pattern: getPattern('Name'),
                    props: {
                        style: {
                            width: "100%"
                        },
                    },
                    // beforeFieldChange: (action, state, dispatch) => {
                    //     try {
                            
                    //         if (action.value === 'Seizure of Vehicles') {
                    //             dispatch(
                    //                 prepareFinalObject(
                    //                     "applyScreenMdmsData.egec.Numberofvioalation-new", 
                    //                     get(state,'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.VehicleType',[])
                    //                 )
                    //             );
                    //         } else {
                    //             dispatch(
                    //                 prepareFinalObject(
                    //                     "applyScreenMdmsData.egec.Numberofvioalation-new", 
                    //                     get(state,'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.NumberOfViolation',[])
                    //                 )
                    //             );
                    //         }
                    //     } catch (e) {
                    //         console.log(e);
                    //     }
                    // },
                }),
                venderMasterFather: getTextField({
                    label: {
                        labelName: "Father's Name / Spouse Name",
                        labelKey: "EC_POPUP_VENDOR_FATHER_SPOUSE_NAME_LABEL"
                    },
                    placeholder: {
                        labelName: "Father's Name / Spouse Name",
                        labelKey: "EC_POPUP_VENDOR_FATHER_SPOUSER_NAME_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    jsonPath: "VendorMaster.fatherSpouseName",
                    required: true,
                    pattern: getPattern('VillageName'),
                }),
               vendorMasterResidentialAddress: getTextField({
                    label: {
                        labelName: "Residential Address",
                        labelKey: "EC_POPUP_VENDOR_RESIDENTIAL_ADDRESS_LABEL"
                    },
                    placeholder: {
                        labelName: "Residential Address",
                        labelKey: "EC_POPUP_VENDOR_RESIDENTIAL_ADDRESS_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    props: {
                        style: {
                            width: "100%"
                        },

                    },
                    jsonPath: "VendorMaster.address",
                    required: true,
                    pattern: getPattern('Address'), ///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
                }),
                vendorMasterMobileNumber: getTextField({
                    label: {
                        labelName: "Mobile Number",
                        labelKey: "EC_POPUP_VENDOR_MOBILE_NUMBER_LABEL"
                    },
                    placeholder: {
                        labelName: "Mobile Number",
                        labelKey: "EC_POPUP_VENDOR_MOBILE_NUMBER_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    props: {
                        style: {
                            width: "100%"
                        },

                    },
                    jsonPath: "VendorMaster.contactNumber",
                    required: true,
                    pattern: getPattern('MobileNo'), ///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
                }),
                vendorCategory: getTextField({
                    label: {
                        labelName: "Category Of Vender",
                        labelKey: "EC_POPUP_VENDOR_CATEGORY_LABEL"
                    },
                    placeholder: {
                        labelName: "Category Of Vender",
                        labelKey: "EC_POPUP_VENDOR_CATEGORY_PLACEHOLDER"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 12
                    },
                    props: {
                        style: {
                            width: "100%"
                        },

                    },
                    jsonPath: "VendorMaster.vendorCategory",
                    required: true,
                    pattern: getPattern('Name'), ///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
                }),
            })
        },
        {
            style: {
                marginTop: "24px"
            }
        }
    ),

    div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            style: {
                width: "100%",
                //textAlign: "right",
                display: "flex"
            }
        },
        children: {
            cancelApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    // align: "right"
                },
                // visible: enableButton,
                props: {
                    variant: "contained",
                    color: "primary",
                    style: {
                        color: "white",
                        borderRadius: "2px",
                        minWidth: "200px",
                        height: "48px",
                        marginRight: "16px"
                    }
                },

                children: {
                    cancelIconInsideButton: {
                        uiFramework: "custom-atoms",
                        componentPath: "Icon",
                        props: {
                            iconName: "close",
                            // style: {
                            //   fontSize: "24px"
                            // }
                        }
                    },

                    buttonLabel: getLabel({
                        labelName: "CANCEL",
                        labelKey: 'EC_POPUP_SEARCH_RESULTS_VENDER_MASTER_CANCEL_APP_BUTTON'
                    })
                },
                onClickDefination: {
                    action: "condition",
                    callBack: (state, dispatch) => {
                        dispatch(prepareFinalObject("VendorMaster", []));
                        showHideAdhocVendorPopup(state, dispatch, "create")
                    }
                },
                roleDefination: {
                    rolePath: "user-info.roles",
                    roles: ["challanEAO"],
                    //path : "tradelicence/apply"

                }
            },
            saveApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    // align: "left"
                },
                // visible: enableButton,
                props: {
                    variant: "contained",
                    color: "primary",
                    style: {
                        color: "white",
                        borderRadius: "2px",
                        minWidth: "200px",
                        height: "48px",
                        marginRight: "16px"

                    }
                },
                onClickDefination: {
                    action: "condition",
                    callBack: updateVendorMasterDetails
                },
                roleDefination: {
                    rolePath: "user-info.roles",
                    roles: ["challanEAO"],
                    //path : "tradelicence/apply"

                }
            },
        },
        gridDefination: {
            xs: 12,
            sm: 12
        }
    }
});