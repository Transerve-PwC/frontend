
import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {

    getTenantId,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
    setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getFileUrlFromAPI,
    getQueryArg,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { generageBillCollection, generateBill, clearlocalstorageAppDetails, calculateCancelledBookingRefundAmount, getAllbillsOfBooking } from "../utils";
import { pccSummary, changedVenueDatepccSummary } from "./summaryResource/pccSummary";
import { pccApplicantSummary,pccBankSummary,roomBookingSummary ,roomDetaiPage} from "./summaryResource/pccApplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary, modifiedBookingPaymentCard } from "./summaryResource/estimateSummary";
import { remarksSummary } from "./searchResource/remarksSummary";
import { footerForParkAndCC } from "./searchResource/citizenFooter";
import { footerReviewTop } from "./searchResource/footer";
import { getLocale, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsView,getSearchResultsViewForRoomBooking } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import { getMasterDataPCC, calculateBetweenDaysCount, convertDateInYMD,prepareRoomCard } from "../utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
let bookingStatus = "";

const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Task Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    },
});



const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId,
    businessService,
    roomapplicationNumber
) => {

    let response = await getSearchResultsViewForRoomBooking([
        { key: "applicationNumber", value: roomapplicationNumber },
      ]);
    response = get(response, "communityCenterRoomBookingMap", []);

    let recData = response[Object.keys(response)[0]];

    dispatch(
        prepareFinalObject(
            "Booking",
            recData
        )
    );
    console.log('recData1234', recData)
    bookingStatus = recData.bkApplicationStatus;
   
    if (bookingStatus === "APPLIED") {
        await generageBillCollection(state, dispatch, roomapplicationNumber, tenantId)
    } else {
        await generateBill(state, dispatch, roomapplicationNumber, tenantId, recData[0].businessService);
    }
    const CitizenprintCont = footerReviewTop(
       action,
       state,
       dispatch,
       bookingStatus,
       roomapplicationNumber,
       tenantId,
       ""
   );

   set(
       action,
       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
       CitizenprintCont
   );

   if(recData !== undefined){
      let roomModel=  recData.roomsModel
      let newRoomModel=   prepareRoomCard(roomModel)
      console.log('newRoomModel', newRoomModel)
      newRoomModel.map( (e)=>{
         if(e.roomApplicationNumber===roomapplicationNumber) {
            dispatch(prepareFinalObject("roomDetailPageData", e));
  
         }
      })
    }
    
  
    
  
    
};



const screenConfig = {
    uiFramework: "material-ui",
    name: "roombooking-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        setapplicationType("BKROOM");
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        const roomapplicationNumber = getQueryArg(
            window.location.href,
            "roomapplicationNumber"
        );
        setapplicationNumber(roomapplicationNumber);
        
        setSearchResponse(
            state,
            action,
            dispatch,
            applicationNumber,
            tenantId,
            businessService,
            roomapplicationNumber
        );
        
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "BKROOM" },
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  
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
                                sm: 8,
                            },
                            ...titlebar,
                        },
                        helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                                color: "primary",
                                style: { justifyContent: "flex-end" },
                            },
                            gridDefination: {
                                xs: 12,
                                sm: 4,
                                align: "right",
                            },
                        },
                    },
                },
              
                body: getCommonCard({
                    estimateSummary: estimateSummary,
                    roomDetaiPage:roomDetaiPage,
                   
                    // modifiedBookingPaymentCard: modifiedBookingPaymentCard,
                    // pccApplicantSummary: pccApplicantSummary,
                    // pccSummary: pccSummary,
                    // changedVenueDatepccSummary: changedVenueDatepccSummary,
                    // pccBankSummary: pccBankSummary, 
                    
                }),
              
            },
        },
    },
};

export default screenConfig;






