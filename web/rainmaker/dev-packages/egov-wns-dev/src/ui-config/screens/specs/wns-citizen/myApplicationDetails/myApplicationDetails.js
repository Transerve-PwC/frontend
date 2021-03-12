import { getMyApplicationResults,getSWMyApplicationResults } from "../../../../../ui-utils/commons";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";

export const fetchData = async (action, state, dispatch) => {
    let finalResponse = [];
    let queryObject = [
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber
        }
    ]

    const response = await getMyApplicationResults(queryObject,dispatch);
    const swResponse = await getSWMyApplicationResults(queryObject, dispatch);

    if ((response && response.WaterConnection && response.WaterConnection.length > 0) && (swResponse && swResponse.SewerageConnections && swResponse.SewerageConnections.length > 0)) {
        
        finalResponse = [...response.WaterConnection, ...swResponse.SewerageConnections];
        //finalResponse.push(...response.WaterConnection);
        // push only subapplication
        if (response.WaterConnection.length > 0) {
            for (let i = 0; i < response.WaterConnection.length; i++) {
                // push if WaterConnection.waterapplicationList 
                let waterApplicationList = get(response.WaterConnection[i],'waterApplicationList',[])
                waterApplicationList = waterApplicationList.filter(x=>x.applicationNo !== response.WaterConnection[i].applicationNo)
                for (let j = 0; j < waterApplicationList.length; j++) {
                    finalResponse.push(
                        {
                            service:response.WaterConnection[i].service,
                            activityType:waterApplicationList[j].activityType,
                            applicationNo:waterApplicationList[j].applicationNo,
                            property:response.WaterConnection[i].property,
                            applicationStatus:waterApplicationList[j].applicationStatus,
                            due:response.WaterConnection[i].due,
    
                        }
                    )
                }
                

            }
        }
        
        
    } else if (response && response.WaterConnection && response.WaterConnection.length > 0) {
        finalResponse = response.WaterConnection;
        // push only subapplication
        if (response.WaterConnection.length > 0) {
            for (let i = 0; i < response.WaterConnection.length; i++) {
                // push if WaterConnection.waterapplicationList 
                let waterApplicationList = get(response.WaterConnection[i],'waterApplicationList',[])
                waterApplicationList = waterApplicationList.filter(x=>x.applicationNo !== response.WaterConnection[i].applicationNo)
                for (let j = 0; j < waterApplicationList.length; j++) {
                    finalResponse.push(
                        {
                            service:response.WaterConnection[i].service,
                            activityType:waterApplicationList[j].activityType,
                            applicationNo:waterApplicationList[j].applicationNo,
                            property:response.WaterConnection[i].property,
                            applicationStatus:waterApplicationList[j].applicationStatus,
                            due:response.WaterConnection[i].due,
    
                        }
                    )
                }
                

            }
        }
    } else {
        if (swResponse && swResponse.SewerageConnections && swResponse.SewerageConnections.length > 0) {
            finalResponse = swResponse.SewerageConnections;
        }
    }
    try {
        /*Mseva 2.0 */
        if (finalResponse && finalResponse.length > 0) {
            dispatch(prepareFinalObject("myApplicationResults", finalResponse));
            dispatch(prepareFinalObject("myApplicationsCount", finalResponse.length));
            const myApplicationsCount = finalResponse.length;
            dispatch(
                handleField(
                    "my-applications",
                    "components.div.children.header.children.key",
                    "props.dynamicArray",
                    myApplicationsCount ? [myApplicationsCount] : [0]
                )
            );
        }
    } catch (error) {
        console.log(error);
    };
}