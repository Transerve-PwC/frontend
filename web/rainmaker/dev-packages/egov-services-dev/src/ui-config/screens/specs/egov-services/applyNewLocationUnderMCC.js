import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceOSWMCC/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceOSWMCC/nocDetails";

import { documentDetails } from "./applyResourceOSWMCC/documentDetails";
import { summaryDetails } from "./applyResourceOSWMCC/summaryDetails";

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
    getNewLocationsSearchResults,
    setApplicationNumberBox,
    getSearchResultsViewForNewLocOswmcc
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_OSWMCC_NEW_LOC_APPLICANT_DETAILS" },
    { labelName: "New Location Details", labelKey: "BK_OSWMCC_NEW_LOC_DETAILS" },
    { labelName: "Documents", labelKey: "BK_OSWMCC_NEW_LOC_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_OSWMCC_NEW_LOC_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);


export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for new location within MCC`,
        labelKey: "BK_OSWMCC_NEW_LOC_APPLY",
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
        documentDetails
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
                            name: "OSWMCC_New_Loc_Documents",
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
        let response = await getSearchResultsViewForNewLocOswmcc([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        setapplicationNumber(applicationNumber);
        setApplicationNumberBox(state, dispatch, applicationNumber);

        dispatch(prepareFinalObject("Booking", response.osujmNewLocationModelList[0]));
        let bookingDocs = response.documentList;
        if (bookingDocs.length > 0) {
            let fileStoreIds = bookingDocs.map(e => e.fileStoreId).join(",");

            const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
            let newLocationImagesPreview = [];
            bookingDocs && bookingDocs.forEach((item, index) => {

                newLocationImagesPreview[index] = {
                    fileName: item.fileName ||
                        `Document - ${index + 1}`,
                    fileStoreId: item.fileStoreId,
                    fileUrl: Object.values(fileUrlPayload)[index].split(",")[0],
                    documentType: item.documentType,

                };

            });
            let part1 = newLocationImagesPreview && newLocationImagesPreview.filter(item => item.documentType == "IDPROOF");
            let part2 = newLocationImagesPreview && newLocationImagesPreview.filter(item => item.documentType != "IDPROOF");
          // dispatch(prepareFinalObject("documentsUploadReduxOld.documents", part1.concat(part2)));
        }


    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applyNewLocationUnderMCC",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        setapplicationType("NLUJM");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const step = getQueryArg(window.location.href, "step");
        dispatch(
            prepareFinalObject(
                "Booking.applicantName",
                JSON.parse(getUserInfo()).name
            )
        ),
            dispatch(
                prepareFinalObject(
                    "Booking.contact",
                    JSON.parse(getUserInfo()).mobileNumber
                )
            );

        //Set Module Name
        set(state, "screenConfiguration.moduleName", "services");

        // Set MDMS Data
        getMdmsData(action, state, dispatch).then((response) => {
            prepareDocumentsUploadData(state, dispatch, "apply_oswmcc_newloc");
        });

        // Search in case of EDIT flow
        if (applicationNumber !== null) {
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
