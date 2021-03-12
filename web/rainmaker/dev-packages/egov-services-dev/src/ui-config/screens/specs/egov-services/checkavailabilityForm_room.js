import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle,
    getSelectField,
    getTextField,
    getLabel,
    getCommonApplyFooter
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getTenantId,
    setapplicationType,
    lSRemoveItem,
    lSRemoveItemlocal,
    setapplicationNumber,
    getUserInfo,
    localStorageSet,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    
    convertDateInDMY

} from "../utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getAvailabilityData, getBetweenDays } from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
    getSearchResultsViewForHall,
    getRoomDataForHall,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";




const callBackForReset =async (state, dispatch, action) => {
    


   set(state, "screenConfiguration.preparedFinalObject.availabilityCheckData.bkApplicationNumber", null);

   set(
    state.screenConfiguration.screenConfig["checkavailability_room"],
    "components.div.children.personalDetails.visible",
    false
    );
    set(
     state.screenConfiguration.screenConfig["checkavailability_room"],
     "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector.props.value",
     ""
   
    );

    
    dispatch(prepareFinalObject("Booking", null));
};


const callBackForSearch = async (state, dispatch, action) => {
    let applicationNumber = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkApplicationNumber"
    );
 
    if (applicationNumber) {
        setapplicationNumber(applicationNumber);
        let response = await getSearchResultsViewForHall([
            
            { key: "applicationNumber", value: applicationNumber },
        ]);

        let response2 = await getRoomDataForHall([
            
            { key: "applicationNumber", value: applicationNumber },
        ]);
       
        let bookingsModelList = get(response, "bookingsModelList", []);
    
        if (bookingsModelList[0]!==null && bookingsModelList.length > 0 && response2.data!={}) {
            
            set(
                state.screenConfiguration.screenConfig["checkavailability_room"],
                "components.div.children.personalDetails.visible",
               true
            );
            dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]))
    
            dispatch(prepareFinalObject("roomAvailabilityData", response2.data))

            
            if (response.bookingsModelList[0].timeslots && response.bookingsModelList[0].timeslots.length > 0) {
                if (response.bookingsModelList[0].timeslots && response.bookingsModelList[0].timeslots.length > 1) {
                  var [fromTime, toTimeOne] = response.bookingsModelList[0].timeslots[0].slot.split("-");
                  var [fromTimeTwo, toTime] = response.bookingsModelList[0].timeslots[1].slot.split("-");
                } else {
                  var [fromTime, toTime] = response.bookingsModelList[0].timeslots[0].slot.split("-");
                }
                fromTime = fromTime.trim();
                toTime = toTime.trim();
            
                if (fromTime == "9:00 AM" && toTime == "8:59 AM") {
                    if(response2.data.availableAcRooms==0 && response2.data.availableNonAcRooms==0){
                        set(
                            state.screenConfiguration.screenConfig["checkavailability_room"],
                           "components.div.children.personalDetails.children.cardContent.children.personalDetailsContainer.children.buttonContainer.visible",
                            false
                        );
            
                    }else{
                    
                        set(
                            state.screenConfiguration.screenConfig["checkavailability_room"],
                           "components.div.children.personalDetails.children.cardContent.children.personalDetailsContainer.children.buttonContainer.visible",
                            true
                        );
                    }
                }else{
                    set(
                        state.screenConfiguration.screenConfig["checkavailability_room"],
                       "components.div.children.personalDetails.children.cardContent.children.personalDetailsContainer.children.buttonContainer.visible",
                        false
                    );
                    dispatch(
                        toggleSnackbar(
                            true,
                            { labelName: "Room booking is not allowed for hourly basis.", labelKey: "" },
                            "warning"
                        )
                    );
        
                }
              }
            
           
    
              
            let selectDateArray=[]
            if(new Date(response.bookingsModelList[0].bkFromDate).getTime()===new Date(response.bookingsModelList[0].bkToDate).getTime()){
               
                selectDateArray.push({code: 1 ,name:  `Book For ${convertDateInDMY(response.bookingsModelList[0].bkFromDate)}`})
                
            }else{
                
                selectDateArray.push({code: 1 ,name:  `Book For ${convertDateInDMY(response.bookingsModelList[0].bkFromDate)}`})
                selectDateArray.push({code: 2 ,name:  `Book For ${convertDateInDMY(response.bookingsModelList[0].bkToDate)}`})
                selectDateArray.push({code: 3 ,name:  `Book For ${convertDateInDMY(response.bookingsModelList[0].bkFromDate)} and ${convertDateInDMY(response.bookingsModelList[0].bkToDate)}`})
                
                
            //     selectDateArray.push({code:response.bookingsModelList[0].bkFromDate ,name:  `Book For ${response.bookingsModelList[0].bkFromDate}`})
            //     selectDateArray.push({code:response.bookingsModelList[0].bkToDate  ,name:  `Book For ${response.bookingsModelList[0].bkToDate}`})
            //     selectDateArray.push({code:[response.bookingsModelList[0].bkFromDate,response.bookingsModelList[0].bkToDate ],name:  `Book For Both ${response.bookingsModelList[0].bkFromDate} and ${response.bookingsModelList[0].bkToDate}`})
             }
             let roomTypeArray=[
                {code  : 'AC'},
                {code  : 'NON-AC'},
                {code  : 'Both'},
            ]
            
            dispatch(prepareFinalObject("roomAvailabilityData.roomTypeArray", roomTypeArray))
           
            
            let availableAcRoomsArray=[]
            if(response2.data.availableAcRooms==0){
                localStorageSet('availableAcRoomStatus' , 'Available')
                let roomTypeArray=[
                    {code  : 'NON-AC'},
                ]
                
            dispatch(prepareFinalObject("roomAvailabilityData.roomTypeArray", roomTypeArray))
            }
    
            if(response2.data.availableNonAcRooms==0){
                localStorageSet('availableNonAcRoomStatus' , 'Available') 
                let roomTypeArray=[
                    {code  : 'AC'},
                ]
                
            dispatch(prepareFinalObject("roomAvailabilityData.roomTypeArray", roomTypeArray))
            }
    
            
            for(let i=1 ; i<= response2.data.availableAcRooms; i++){
                
                availableAcRoomsArray.push({code: i})
            }
            let availableNonAcRoomsArray=[]
            for(let i=1 ; i<= response2.data.availableNonAcRooms; i++){
                availableNonAcRoomsArray.push({code: i})
            }
            dispatch(prepareFinalObject("roomAvailabilityData.availableAcRoomsArray",availableAcRoomsArray ))
            dispatch(prepareFinalObject("roomAvailabilityData.availableNonAcRoomsArray", availableNonAcRoomsArray))
            dispatch(prepareFinalObject("roomAvailabilityData.selectDateArray", selectDateArray))
            
          
         
        }
       
        else{
            dispatch(
                toggleSnackbar(
                    true,
                    { labelName: "Please enter correct community center/banquet hall application number!", labelKey: "" },
                    "warning"
                )
            );

        }

        

        
    }

    if (applicationNumber === undefined || applicationNumber === null) {
        dispatch(
            toggleSnackbar(
                true,
                { labelName: "Please enter correct community center/banquet hall application number!", labelKey: "" },
                "warning"
            )
        );
    } 
    
};


export const checkAvailabilitySearch = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Book Room For Community Center/Banquet Halls",
        labelKey: "Book Room For Community Center/Banquet Halls",
    }),

    break: getBreak(),
    availabilitySearchContainer: getCommonContainer({
        bkSector: {
            ...getTextField({
                label: {
                    labelName: "Application Number",
                    labelKey: "Application Number",
                },

                placeholder: {
                    labelName: "Enter Application Number",
                    labelKey: "Enter Application Number",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                jsonPath: "availabilityCheckData.bkApplicationNumber",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,
            },

            children: {
                // previousButtonIcon: {
                //     uiFramework: "custom-atoms",
                //     componentPath: "Icon",
                //     props: {
                //         iconName: "keyboard_arrow_left"
                //     }
                // },
                submitButtonLabel: getLabel({
                    labelName: "Search",
                    labelKey: "BK_CGB_SEARCH_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForSearch,
            },
            visible: true,
        },
        resetButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    //marginLeft: "100px"
                },
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,
            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_CGB_RESET_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset,
            },
            visible: true,
        },
    }),
});
