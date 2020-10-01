import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getUserInfo, setTenantId } from "egov-ui-kit/utils/localStorageUtils";
import ParkIcon from "../../../../ui-atoms-local/Icons/ParkIcon";
import OpenSpaceIcon from "../../../../ui-atoms-local/Icons/OpenSpaceIcon";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
const header = getCommonHeader(
    {
        labelName: "SERVICES",
        // labelKey: "BK_APPLY_BOOKINGS_HEADER",
        labelKey: "BK_APPLY",
    },
    {
        classes: {
            root: "common-header-cont",
        },
    }
);
let cardItems = [];
if (role_name === "CITIZEN") {
    const cardlist = [
        {
            label: {
                labelKey: "BK_HOME_OPEN_SPACE_BOOKING",
                labelName: "Book Open Space to Store Building Materials",
            },
            icon: <OpenSpaceIcon width={40} height={50}/>,
            route: "applyopenspace",
            // {
            //   screenKey: "home",
            //   jsonPath: "components.adhocDialog"
            // }
        },
        {
            label: {
                labelKey: "BK_HOME_COMMUNITY_CENTRE_BOOKING",
                labelName: "Book Parks & Community Center/Banquet Halls",
            },
            icon : <ParkIcon width={40} height={50}/>,
            // icon: (
            //     <i
            //         viewBox="0 -8 35 42"
            //         color="primary"
            //         font-size="40px"
            //         class="material-icons module-page-icon"
            //         style={{ fontSize: "50px" }}
            //     >
            //         event
            //     </i>
            // ),
            route: "",
        },
        {
            label: {
                labelKey: "BK_HOME_GROUND_BOOKING",
                labelName: "Book Ground for Commercial Purpose",
            },
            icon: (
                <i
                    viewBox="0 -8 35 42"
                    color="primary"
                    class="material-icons module-page-icon"
                    style={{ fontSize: "50px" }}
                >
                    group_work
                </i>
            ),
            route: "checkavailability",
            // {
            //   screenKey: "citizenMainLanding",
            //   jsonPath: "components.adhocDialog"
            // }
        },
        {
            label: {
                labelKey: "BK_HOME_OPEN_SPACE_MCC_JURISDICTION",
                labelName: "Book Open Space within MCC jurisdiction",
            },
            icon: (
                <i
                    viewBox="0 -8 35 42"
                    color="primary"
                    class="material-icons module-page-icon"
                    style={{ fontSize: "50px" }}
                >
                    room
                </i>
            ),
            route: "checkavailability_oswmcc",
            // {
            //   screenKey: "home",
            //   jsonPath: "components.adhocDialog"
            // }
        },
        {
            label: {
                labelKey: "BK_HOME_WATER_TANKER_BOOKING",
                labelName: "Book Water Tanker",
            },
            icon: (
                <i
                    viewBox="0 -8 35 42"
                    color="primary"
                    class="material-icons module-page-icon"
                    style={{ fontSize: "50px" }}
                >
                    invert_colors
                </i>
            ),
            route: "applywatertanker",
            // {
            //   screenKey: "home",
            //   jsonPath: "components.adhocDialog"
            // }
        },
    ];
    cardItems = cardlist;
}

const PermissionManagementSearchAndResult = {
    uiFramework: "material-ui",
    name: "home",
    beforeInitScreen: (action, state, dispatch) => {
        // let UsertenantInfo = JSON.parse(getUserInfo()).permanentCity;
        // setTenantId(UsertenantInfo);
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
                header: header,
                applyCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "LandingPage",
                    props: {
                        items: cardItems,
                        history: {},
                        module: "SERVICES",
                    },
                },
                // listCard: {
                //   uiFramework: "custom-molecules-local",
                //   moduleName: "egov-services",
                //   componentPath: "HowItWorks",
                // },
            },
        },
        adhocDialog: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-services",
            componentPath: "DialogContainer",
            props: {
                open: false,
                maxWidth: false,
                screenKey: "home",
            },
            children: {
                popup: {},
            },
        },
    },
};

export default PermissionManagementSearchAndResult;
