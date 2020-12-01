import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceOpenSpace/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceOpenSpace/nocDetails";
import jp from "jsonpath";

import { documentDetails } from "./applyResourceOpenSpace/documentDetails";
import { summaryDetails } from "./applyResourceOpenSpace/summaryDetails";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTenantId,
    setapplicationType,
    setapplicationNumber,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import set from "lodash/set";
import get from "lodash/get";

import {
    prepareDocumentsUploadData,
    getSearchResultsView,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_OSB_APPLICANT_DETAILS" },
    { labelName: "Booking Details", labelKey: "BK_OSB_BOOKING_DETAILS" },
    { labelName: "Documents", labelKey: "BK_OSB_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_OSB_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);
export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for open space`,
        labelKey: "BK_OSB_APPLY",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: "NA",
        },
        visible: false,
    },
});

export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form1",
    },
    children: {
        personalDetails,
    },
};

export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form2",
    },
    children: {
        bookingDetails,
    },
    visible: false,
};

export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form3",
    },
    children: {
        documentDetails,
    },
    visible: false,
};

export const formwizardFourthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form4",
    },
    children: {
        summaryDetails,
    },
    visible: false,
};

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
                            name: "Sector",
                        },
                        {
                            name: "CityType",
                        },
                        {
                            name: "PropertyType",
                        },
                        {
                            name: "Area",
                        },
                        {
                            name: "Duration",
                        },
                        {
                            name: "Category",
                        },
                        {
                            name: "VillageCity",
                        },
                        {
                            name: "Type_of_Construction",
                        },
                        {
                            name: "Documents",
                        },
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

        payload.MdmsRes.Booking.Documents = [
            {

                "code": "DOC.DOC_PICTURE",
                "description":"DOC.DOC_PICTURE.PICTURE_DESCRIPTION",
                "active":true,
                "documentType":"DOC",
                "dropdownData":[],
                "hasDropdown":false,
                "required":true

            },
            {

                "code": "BUILDING_PLAN_APPROVAL",
                "description":"BUILDING_PLAN_APPROVAL_DESCRIPTION",
                "active":true,
                "documentType":"BUILDING_PLAN_APPROVAL",
                "dropdownData":[],
                "hasDropdown":false,
                "required":true

            }
        ];

        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

export const prepareEditFlow = async (
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    if (applicationNumber) {
        let response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        setapplicationNumber(applicationNumber);
        // setApplicationNumberBox(state, dispatch, applicationNumber);

        dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));

        let fileStoreIds = Object.keys(response.documentMap);
        let fileStoreIdsValue = Object.values(response.documentMap);
        let fileUrls =
            fileStoreIds.length > 0
                ? await getFileUrlFromAPI(fileStoreIds)
                : {};
        dispatch(prepareFinalObject("documentsUploadReduxOld.documents", [
			{
				fileName: fileStoreIdsValue[0],
				fileStoreId: fileStoreIds[0],
				fileUrl: fileUrls[fileStoreIds[0]],
			},
		]));
    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applyopenspace",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        setapplicationType("OSBM");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
		);
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const step = getQueryArg(window.location.href, "step");
        dispatch(
            prepareFinalObject(
                "Booking.bkApplicantName",
                JSON.parse(getUserInfo()).name
            )
        ),
            dispatch(
                prepareFinalObject(
                    "Booking.bkMobileNumber",
                    JSON.parse(getUserInfo()).mobileNumber
                )
            );
        // dispatch(prepareFinalObject("Booking.bkEmail", "HELLO@GMAIL.COM"));
        // dispatch(prepareFinalObject("Booking.bkHouseNo", "2"));
        // dispatch(prepareFinalObject("Booking.bkCompleteAddress", "hello address"));
        // dispatch(prepareFinalObject("Booking.bkSector", "SECTOR-2"));
        // dispatch(prepareFinalObject("Booking.bkType", "Residential"));
        // dispatch(prepareFinalObject("Booking.bkAreaRequired", "Less than 1000 sqft"));
        // dispatch(prepareFinalObject("Booking.bkDuration", "2"));
        // dispatch(prepareFinalObject("Booking.bkCategory", "Cat-A"));
        // dispatch(prepareFinalObject("Booking.bkVillCity", "City"));
        // dispatch(prepareFinalObject("Booking.bkConstructionType", "New"));
        //Set Module Name
        set(state, "screenConfiguration.moduleName", "services");

        // Set MDMS Data
        getMdmsData(action, state, dispatch).then((response) => {
            prepareDocumentsUploadData(state, dispatch, "apply_osbm");
        });

		// Search in case of EDIT flow
        if (applicationNumber !== null ) {
			set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            prepareEditFlow(state, dispatch, applicationNumber, tenantId);
        }

        // Code to goto a specific step through URL
        if (step && step.match(/^\d+$/)) {
            let intStep = parseInt(step);
            set(
                action.screenConfig,
                "components.div.children.stepper.props.activeStep",
                intStep
            );
            let formWizardNames = [
                "formwizardFirstStep",
                "formwizardSecondStep",
                "formwizardThirdStep",
                "formwizardFourthStep",
            ];
            for (let i = 0; i < 4; i++) {
                set(
                    action.screenConfig,
                    `components.div.children.${formWizardNames[i]}.visible`,
                    i == step
                );
                set(
                    action.screenConfig,
                    `components.div.children.footer.children.previousButton.visible`,
                    step != 0
                );
            }
        }

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 10,
                            },
                            ...header,
                        },
                    },
                },
                stepper,
                formwizardFirstStep,
                formwizardSecondStep,
                formwizardThirdStep,
                formwizardFourthStep,
                footer,
            },
        },
    },
};

export default screenConfig;
