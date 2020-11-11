import { fetchData } from "./searchResource/citizenSearchFunctions";
import {
    getCommonContainer,
    getCommonHeader,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { searchForm } from "./searchResource/searchForm";
import { httpRequest } from "../../../../ui-utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
// const header = getCommonHeader(
//     {
//         labelName: "My Applications",
//         labelKey: "BK_MY_BK_APPLICATIONS_HEADER",
//     },
//     {
//         classes: {
//             root: "common-header-cont",
//         },
//     }
// );

const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `My Applications`,
        labelKey: "BK_MY_BK_APPLICATIONS_HEADER",
    }),
});

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                        },
                    ],
                },
                {
                    moduleName: "Booking",
                    masterDetails: [
                        {
                            "name": "Status"
                        },
                         {
                            "name": "ApplicationType"
                        }
                    ],
                },
            ],
        },
    };
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        payload.MdmsRes.Booking.ApplicationType = payload.MdmsRes.Booking.ApplicationType.filter(el => el.code !== "NLUJM")
        let park = {"name":"Parks","id":"7","code":"Parks","tenantId":"ch.chandigarh","active":"true"};
        payload.MdmsRes.Booking.ApplicationType.push(park);

        let parkStatus = {"name":"Parks","id":"7","code":"Parks","tenantId":"ch.chandigarh","active":"true","status":[{"name":"Initiated","code":"INITIATED","active":true},{"name":"Approved","code":"APPROVED","active":true},{"name":"Rejected","code":"REJECTED","active":true},{"name":"Panding Payment","code":"PENDINGPAYMENT","active":true},{"name":"Panding Approval","code":"PENDINGAPPROVAL","active":true}]};
        payload.MdmsRes.Booking.Status.push(parkStatus);

        let cc = {"name":"Community Center","id":"8","code":"Community Center","tenantId":"ch.chandigarh","active":"true"};
        payload.MdmsRes.Booking.ApplicationType.push(cc);

        let ccStatus = {"name":"Community Center","id":"8","code":"Community Center","tenantId":"ch.chandigarh","active":"true","status":[{"name":"Initiated","code":"INITIATED","active":true},{"name":"Approved","code":"APPROVED","active":true},{"name":"Rejected","code":"REJECTED","active":true},{"name":"Panding Payment","code":"PENDINGPAYMENT","active":true},{"name":"Panding Approval","code":"PENDINGAPPROVAL","active":true}]};
        payload.MdmsRes.Booking.Status.push(ccStatus);
        console.log(payload.MdmsRes, "Type Application");
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

const callBackForMyNewLocationApps = async (state, dispatch) => {
    const myNewLocationAppsURL = `/egov-services/my-newlocation-apps`;
    dispatch(setRoute(myNewLocationAppsURL));
};
const screenConfig = {
    uiFramework: "material-ui",
    name: "my-applications",
    beforeInitScreen: (action, state, dispatch) => {
        getMdmsData(action, state, dispatch).then((response) => {
            fetchData(action, state, dispatch);
        });
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
                id: "search",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 8,
                                sm: 8,
                            },
                            ...header,
                        },
                        addNewLocButton: {
                            componentPath: "Button",
                            props: {
                                variant: "contained",
                                color: "primary",
                                style: {},
                            },
                            gridDefination: {
                                xs: 4,
                                align: "right",
                            },
                            children: {
                                // editIcon: {
                                //     uiFramework: "custom-atoms",
                                //     componentPath: "Icon",
                                //     props: {
                                //         iconName: "edit",
                                //     },
                                // },
                                buttonLabel: getLabel({
                                    labelName: "My New Location Requests",
                                    labelKey: "BK_OSWMCC_MY_LOCATION_REQUESTS",
                                }),
                            },
                            onClickDefination: {
                                action: "condition",
                                callBack: callBackForMyNewLocationApps,
                            },
                            visible: true,
                        },
                    },
                },
                applicationSearch: {
                    uiFramework: "custom-atoms",
                    componentPath: "Form",
                    props: {
                        id: "apply_form1",
                        style: {
                            marginLeft: 8,
                            marginRight: 8,
                        },
                    },
                    children: {
                        searchForm,
                    },
                },
                applicationsCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "SingleApplication",
                    visible: true,
                    props: {
                        contents: [
                            {
                                label: "BK_MY_BK_APPLICATION_NUMBER_LABEL",
                                jsonPath: "bkApplicationNumber",

                            },
                            {
                                label: "BK_MY_BK_APPLICATION_STATUS_LABEL",
                                jsonPath: "bkApplicationStatus",
                                prefix : "BK_"
                            },
                            // {
                            //     label: "BK_MY_BK_APPLICATION_TYPE_LABEL",
                            //     jsonPath: "bkBookingType",
                            // },
                            {
                                label: "BK_MY_BK_APPLICATION_TYPE_LABEL",
                                jsonPath: "businessService",
                                prefix : "BK_"
                            },
                        ],
                        moduleName: "MyBooking",
                        homeURL: "/egov-services/applyservices",
                    },
                },
            },
        },
    },
};

export default screenConfig;
