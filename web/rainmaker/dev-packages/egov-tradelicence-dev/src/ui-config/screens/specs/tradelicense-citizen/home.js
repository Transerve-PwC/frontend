import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData, getTradeTypes } from "./citizenSearchResource/citizenFunctions";
import { cityPicker } from "./citypicker";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";

const header = getCommonHeader(
  {
    labelName: "Trade License",
    labelKey: "TL_COMMON_TL"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const tenantId = process.env.REACT_APP_DEFAULT_TENANT_ID;

const _cardItems = [
    {
        label: {
            labelKey: "TL_APPLY_RC_PEDAL_RICKSHAW_REHRI",
            labelName: "Apply for Registration Certificate for Pedal Rickshaw/ Loading Rehri"
        },
        icon: <TradeLicenseIcon />,
        route: `apply?tenantId=${tenantId}&tlType=1`
    },
    {
        label: {
            labelKey: "TL_APPLY_DL_PEDAL_RICKSHAW_REHRI",
            labelName: "Apply for Driving License for Pedal Rickshaw/ Loading Rehri"
        },
        icon: <TradeLicenseIcon />,
        route: `apply?tenantId=${tenantId}&tlType=2`
    },
    {
        label: {
            labelKey: "TL_APPLY_LICENSE_DHOBI_GHAT",
            labelName: "Apply for License for Dhobi Ghat"
        },
        icon: <TradeLicenseIcon />,
        route: `apply?tenantId=${tenantId}&tlType=3`
    },
    {
      label: {
          labelKey: "TL_APPLY_RENEWAL_RENT_DEED_SHOP",
          labelName: "Apply for Renewal of Rent Deed of Platform/Shop at Old Book Market"
      },
      icon: <TradeLicenseIcon />,
      route: `apply?tenantId=${tenantId}&tlType=4`
    },
    {
        label: {
            labelKey: "TL_MY_APPLICATIONS",
            labelName: "My Applications"
        },
        icon: <FormIcon />,
        route: "my-applications"
    }
]

const cardItems = [{
                label: {
                    labelKey: "Apply",
                    labelName: "Apply"
                },
                icon: <TradeLicenseIcon />,
                route: `apply?tenantId=${tenantId}`
              },
              {
                label: {
                    labelKey: "TL_MY_APPLICATIONS",
                    labelName: "My Applications"
                },
                icon: <FormIcon />,
                route: "my-applications"
              }
]

const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    getTradeTypes(action, state, dispatch)
    // fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      // props: {
      //   className: "common-div-css"
      // },
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: [],
            history: {}
          }
        },
        listCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-tradelicence",
          componentPath: "HowItWorks"
        }
      },
      props: {
        style: {
          padding: "0px 8px"
        }
      }
    },
    // div: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Div",
    //   props: {
    //     className: "common-div-css"
    //   },
    //   children: {
    //     header: header,
    //     applyCard: {
    //       uiFramework: "custom-atoms",
    //       componentPath: "Div",
    //       children: {
    //         card: getCommonCard({
    //           applicationSuccessContainer: getCommonContainer({
    //             icon: {
    //               uiFramework: "custom-atoms",
    //               componentPath: "Icon",
    //               props: {
    //                 iconName: "book",
    //                 variant: "outlined",
    //                 style: {
    //                   fontSize: "110px",
    //                   width: 120,
    //                   height: 100,
    //                   color: "rgba(0, 0, 0, 0.6)",
    //                   marginLeft: -22
    //                 },
    //                 iconSize: "110px"
    //               }
    //             },
    //             body: {
    //               uiFramework: "custom-atoms",
    //               componentPath: "Div",
    //               children: {
    //                 header: getCommonHeader({
    //                   labelName: "Apply for New Trade License",
    //                   labelKey: "TL_COMMON_APPL_NEW_LIC"
    //                 }),
    //                 break: getBreak(),
    //                 applyButton: {
    //                   componentPath: "Button",
    //                   props: {
    //                     variant: "contained",
    //                     color: "primary",
    //                     style: {
    //                       width: "200px",
    //                       height: "48px",
    //                       marginRight: "40px"
    //                     }
    //                   },
    //                   children: {
    //                     collectPaymentButtonLabel: getLabel({
    //                       labelName: "APPLY",
    //                       labelKey: "TL_APPLY"
    //                     })
    //                   },
    //                   onClickDefination: {
    //                     action: "condition",
    //                     callBack: showCityPicker
    //                   },
    //                   roleDefination: {
    //                     rolePath: "user-info.roles",
    //                     roles: ["CITIZEN"]
    //                   }
    //                 }
    //               }
    //             }
    //           })
    //         }),
    //         break: getBreak(),
    //         searchResults: searchResults
    //       }
    //     }
    //   }
    // },
    cityPickerDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: cityPicker
          }
        }
      }
    }
  }
};

export default tradeLicenseSearchAndResult;