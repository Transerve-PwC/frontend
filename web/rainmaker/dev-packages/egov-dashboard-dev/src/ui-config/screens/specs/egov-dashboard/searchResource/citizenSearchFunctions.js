import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getSearchResults, getSearchResultsForFilters,  returnNameFromCodeMdmsorViceVersa} from "../../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { set } from "lodash";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { findItemInArrayOfObject } from "egov-ui-framework/ui-utils/commons";


//useful
export const fetchData = async (action, state, dispatch) => {
  dispatch(toggleSpinner());
  const response = await getSearchResults();
  try {
    var serviceRequestType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")

    if (response.services.length > 0) {
        var finalResponse = []
      response.services.map((item,index) => {
        finalResponse.push({createdtime : item.createdtime,
          current_assignee:item.current_assignee,
          lastmodifiedtime: item.lastmodifiedtime, 
          owner_name:item.owner_name,
          offset_: item.offset_,
          service_request_id: item.service_request_id,
          service_request_status: item.service_request_status,
          service_type: returnNameFromCodeMdmsorViceVersa(serviceRequestType,item.service_type, 1 ) || "-",
          servicerequestsubtype: item.servicerequestsubtype,
          tenant_id: item.tenant_id, 
            })
          
        });
        dispatch(prepareFinalObject("searchResults", finalResponse));
        dispatch(prepareFinalObject("myServiceRequestsCount", finalResponse.length)
        );
      }
      else  {
        var finalResponse = []
      
        dispatch(prepareFinalObject("searchResults", finalResponse));
        dispatch(prepareFinalObject("myServiceRequestsCount", finalResponse.length)
        );
      }
  } catch (error) {
    console.log(error);
  }
};
//useful
export const fetchDataForFilterFields = async (state, dispatch) => {
  let flag_api_call = true;
  let fromdate= get(state.screenConfiguration.preparedFinalObject,"myServiceRequests[0].FromDate")
  let Todate= get(state.screenConfiguration.preparedFinalObject,"myServiceRequests[0].ToDate")
  let serviceRequestType = get(state.screenConfiguration.preparedFinalObject, "myServiceRequests[0].servicetype.value") 
  let serviceRequestId = get(state.screenConfiguration.preparedFinalObject, "myServiceRequests[0].servicerequestid")
  let serviceRequestSubtype = get(state.screenConfiguration.preparedFinalObject, "myServiceRequests[0].serviceRequestSubtype")
        
  var date1 = new Date(fromdate);
  var date2 = new Date(Todate);

  if(fromdate === undefined &&
    Todate === undefined) 
    {
      flag_api_call = true;
    }
  else if(fromdate === undefined ||
  fromdate.length === 0 &&
  Todate !== undefined &&
  Todate.length !== 0) 
  {
    flag_api_call = false;
    {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please enter from date", labelKey: "ERR_FILL_FROM_DATE" },
          "warning"
        )
      );
    }
  }
  else if(Todate === undefined ||
    Todate.length === 0 &&
    fromdate !== undefined &&
    fromdate.length !== 0) 
    {
      flag_api_call = false;
      {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please enter to date", labelKey: "ERR_FILL_TO_DATE" },
            "warning"
          )
        );
      }
    }
    
    let fromDateInTime = parseInt(date1.getTime());
    let toDateInTime = parseInt(date2.getTime());
    if(parseInt(fromDateInTime) > parseInt(toDateInTime))
    {
      flag_api_call = false;
      {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "From date should be less than to date", labelKey: "ERR_FROM_DATE_SHOULD_BE_LESS_THAN_TO_DATE" },
            "warning"
          )
        );
      }
    }
    

  var oneDayDifference = 60 * 60 * 24 * 1000;
  toDateInTime = toDateInTime + oneDayDifference
 

  let filterdata = 
  {
      "fromDate":fromDateInTime,
      "toDate":toDateInTime,
      "serviceType": serviceRequestType,
      "service_request_id":serviceRequestId,
      "serviceRequestSubtype":serviceRequestSubtype

  };
  if (flag_api_call === true)
  {

  const response = await getSearchResultsForFilters(filterdata);
  var serviceRequestTypeToBeSent = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")

  
  try {
    
    if (response.services.length > 0) {
      var finalResponse = []
    response.services.map((item,index) => {
      finalResponse.push({createdtime : item.createdtime,
        current_assignee:item.current_assignee,
        lastmodifiedtime: item.lastmodifiedtime, 
        owner_name:item.owner_name,
        offset_: item.offset_,
        service_request_id: item.service_request_id,
        service_request_status: item.service_request_status,
        service_type: returnNameFromCodeMdmsorViceVersa(serviceRequestTypeToBeSent,item.service_type, 1 ) || "-",
        servicerequestsubtype: item.servicerequestsubtype,
        tenant_id: item.tenant_id, 
          })
        
      });
      dispatch(prepareFinalObject("searchResults", finalResponse));
      dispatch(prepareFinalObject("myServiceRequestsCount", finalResponse.length)
      );
    }
    else  {
      var finalResponse = []
    
      dispatch(prepareFinalObject("searchResults", finalResponse));
      dispatch(prepareFinalObject("myServiceRequestsCount", finalResponse.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
  
  }
  
};

export const resetConstraintsFields = (state, dispatch) => {
 //resetting from date
  dispatch(
    handleField(
      "myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.FromDate",
      "props.value",
      ""
    )
  );
  //resetting to date
  dispatch(
    handleField(
      "myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.ToDate",
      "props.value",
      ""
    )
  );
      //resetting servicerequestt id 
  dispatch(
    handleField(
      "myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestId",
      "props.value",
      ""
    )
  );
      //resetting servicerequestt id 
      dispatch(
        handleField(
          "myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestId",
          "props.value",
          ""
        )
      );
//resetting service request type
try{
  var serviceRequestTypePlaceholderMyRequest = get(state, "screenConfiguration.screenConfig.myServiceRequests.components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestType.props.placeholder")
  dispatch(
    handleField(
      "myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestType",
      "props.value",
      serviceRequestTypePlaceholderMyRequest.labelKey
    )
  );
}
catch(e){
  dispatch(
    handleField(
      "myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestType",
      "props.value",
      undefined
    )
  );
}

dispatch(handleField("myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
      "props.value",
      undefined
    )
  );
  dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[0].disabled",
          true
        )
      );
      dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[1].disabled",
          true
        )
      );
      dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[2].disabled",
          true
        )
      );
set(state, "screenConfiguration.preparedFinalObject.myServiceRequests", {});
  
};

export const resetFields = (state, dispatch) => {

  // Clear Dropdown
  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.moduleDashboardDropdown",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.reportDashboardDropdown",
      "props.value",
      ""
    )
  );

  // Clear Date Field
  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
      "props.value",
      ""
    )
  );

  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.dropDownData2", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.reportdefaultDropDownData", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaultFromDate", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaulttoDate", {});
};