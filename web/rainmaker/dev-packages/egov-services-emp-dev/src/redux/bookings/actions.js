import * as actionTypes from "./actionTypes";
// import {CREATEBWTAPPLICATION,APPLICATION,MCCAPPLICATION, COMPLAINT, CATEGORY,PAYMENT,HISTORY,AFTERPAYMENTAPI,DWONLOADPAYMENTRECEIPT,DOWNLOADBWTAPPLICATION,DOWNLOADAPPLICATION,DWONLOADPERMISSIONLETTER,OSBMPerDayRateAmount,PerDayRateAmount,DWONLOADNEWRECEIPTFORCG,PermissionLetterDWNOSMCC,ApplicationDWNOSMCC, DWONLOADPAYMENTRECEIPTFORCG,DWONLOADAPPLICATIONFORCG,CREATEPACCAPPLICATION } from "../../utils/endPoints";
import {CREATEBWTAPPLICATION,DWONLOADPLFORPCC,DWONLOADRECEIPTFORPCC,APPLICATION,MCCAPPLICATION, COMPLAINT, CATEGORY,PAYMENT,HISTORY,AFTERPAYMENTAPI,DWONLOADPAYMENTRECEIPT,DOWNLOADBWTAPPLICATION,DOWNLOADAPPLICATION,DWONLOADPERMISSIONLETTER,OSBMPerDayRateAmount,PerDayRateAmount,DWONLOADNEWRECEIPTFORCG,PermissionLetterDWNOSMCC,ApplicationDWNOSMCC, DWONLOADPAYMENTRECEIPTFORCG,DWONLOADAPPLICATIONFORCG,DWONLOADAPPFORPCC,CREATEPACCAPPLICATION } from "../../utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";



const applicationSectorFetchSucess = (payload) => {
	return {
		type: actionTypes.APPLICATION_SECTOR_FETCH_SUCCESS,
		payload,
	};
};

const applicationSectorFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_SECTOR_FETCH_ERROR,
		error,
	};
};
const applicationTypeFetchSucess = (payload) => {
	return {
		type: actionTypes.APPLICATION_TYPE_FETCH_SUCCESS,
		payload,
	};
};

const applicationTypeFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_TYPE_FETCH_ERROR,
		error,
	};
};


const applicationFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	 console.log('actionTypes.APPLICATION_FETCH_COMPLETE',actionTypes)
	return {
		type: actionTypes.APPLICATION_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const MCCapplicationFetchComplete = (payload, overWrite) => {
	return {
		type: actionTypes.MCCAPPLICATION_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const MCCapplicationFetchError = (error) => {
	return {
		type: actionTypes.MCCAPPLICATION_FETCH_ERROR,
		error,
	};
};
const downloadReceiptComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};


const createWaterTankerComplete= (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.CREATE_WATER_TANKER_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const createPACCComplete= (payload, overWrite) => {
	return {
		type: actionTypes.CREATE_PARKCCAPP_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadApplicationComplete = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadBWTApplicationComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_BWT_APPLICATION_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};


const paymentFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.PAYMENT_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const fetchAfterPaymentData = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.AFTER_PAYMENT_FETCH_DETAILS,
		payload,
		overWrite: overWrite,
	};
};
const historyFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.HISTORY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};


const complaintSendSMS = (message) => {
	return {
		type: actionTypes.COMPLAINTS_SEND_MESSAGE,
		message,
	};
};

const complaintSendSMSTo = (message) => {
	return {
		type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHARECONTENT_TO,
		message,
	};
};

const complaintSendSMSMedia = (message) => {
	return {
		type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHAREMEDIA,
		message,
	};
};



const applicationFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_FETCH_ERROR,
		error,
	};
};


const downloadReceiptError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_ERROR,
		error,
	};
};

const createPACCError = (error) => {
	return {
		type: actionTypes.CREATE_PACCAPP_ERROR,
		error,
	};
};


const downloadApplicationError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_ERROR,
		error,
	};
};
const downloadBWTApplicationError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_BWT_APPLICATION_ERROR,
		error,
	};
};

const historyFetchError = (error) => {
	return {
		type: actionTypes.HISTORY_FETCH_ERROR,
		error,
	};
};

const fetchAfterPaymentError = (error) => {
	return {
		type: actionTypes.AFTER_PAYMENT_FETCH_ERROR,
		error,
	};
};
const paymentFetchError = (error) => {
	return {
		type: actionTypes.PAYMENT_FETCH_ERROR,
		error,
	};
};
//OS &CG
const OSBMfetchperDayRateComplete = (payload, overWrite) => {
	return {
		type: actionTypes.OSBMPAYMENT_PER_DAY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const OSBMfetchperDayRateError = (error) => {
	return {
		type: actionTypes.OSBMPAYMENT_PER_DAY_FETCH_FETCH_ERROR,
		error,
	};
};

const fetchperDayRateComplete = (payload, overWrite) => {
	return {
		type: actionTypes.PAYMENT_PER_DAY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const fetchperDayRateError = (error) => {
	return {
		type: actionTypes.PAYMENT_PER_DAY_FETCH_FETCH_ERROR,
		error,
	};
};

const downloadPermissionReceiptCompleteforCG = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_NEWRECEIPT_COMPLETE_CG,
		payload,
		overWrite: overWrite,
	};
};

const downloaddPermissionReceiptErrorforCG = (error) => {
	return {
		type: actionTypes.DOWNLOAD_NEWRECEIPT_ERROR_CG,
		error,
	};
};

const downloadMCCPLComplete = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_PLMCC_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const downloadMCCPLError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_PLMCC_ERROR,
		error,
	};
};

const downloadAPPCompleteMCC = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_MCCAPP_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const downloadAPPErrorMCC = (error) => {
	return {
		type: actionTypes.DOWNLOAD_MCCAPP_ERROR,
		error,
	};
};

const downloadReceiptCompleteforCG = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_COMPLETE_CG,
		payload,
		overWrite: overWrite,
	};
};

const downloadReceiptErrorforCG = (error) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_ERROR_CG,
		error,
	};
};
const downloadApplicationCompleteforCG = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_COMPLETE_CG,
		payload,
		overWrite: overWrite,
	};
};

const downloadApplicationErrorforCG = (error) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_ERROR_CG,
		error,
	};
};

const downloadApplicationCompleteforPCC = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_COMPLETE_PCC,
		payload,
		overWrite: overWrite,
	};
};

const downloadApplicationErrorforPCC = (error) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_ERROR_PCC,
		error,
	};
};

const downloadPermissionLetterCompleteforPCC = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_PERMISSIONLETTER_COMPLETE_PCC,
		payload,
		overWrite: overWrite,
	};
};

const downloadPermissionLetterErrorforPCC = (error) => {
	return {
		type: actionTypes.DOWNLOAD_PERMISSIONLETTER_ERROR_PCC,
		error,
	};
};

const downloadReceiptCompleteforPCC = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_COMPLETE_PCC,
		payload,
		overWrite: overWrite,
	};
};

const downloadReceiptErrorforPCC = (error) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_ERROR_PCC,
		error,
	};
};


//Download permission letter

const downloadPermissionLetterComplete= (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_LETTER_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadPermissionLetterError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_LETTER_ERROR,
		error,
	};
};

const complaintSortOrder = (order) => {
	return { type: actionTypes.COMPLAINTS_SORT_ORDER, order };
};

export const getComplaintDisplayOrder = (order) => {
	return async (dispatch, getState) => {
		dispatch(complaintSortOrder(order));
	};
};


export const fetchApplications = (requestBody, hasUsers = true, overWrite) => {
	console.log('requestBody in own module',requestBody)
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(APPLICATION.POST.URL, APPLICATION.POST.ACTION, [], requestBody);
			console.log('payload in emp----2', payload)
			dispatch(applicationFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(applicationFetchError(error.message));
		}
	};
};
export const downloadPaymentReceipt = (requestBody, hasUsers = true, overWrite) => {
	//   requestBody.tenantId = "ch"
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADPAYMENTRECEIPT.POST.URL, DWONLOADPAYMENTRECEIPT.POST.ACTION, [], requestBody);
			console.log('payload5----5', payload)
			dispatch(downloadReceiptComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadReceiptError(error.message));
		}
	};
};
export const downloadApplication = (requestBody, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			console.log('DOWNLOADAPPLICATION in try block',DOWNLOADAPPLICATION)
			const payload = await httpRequest(DOWNLOADAPPLICATION.POST.URL, DOWNLOADAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload6----6', payload)
			dispatch(downloadApplicationComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadApplicationError(error.message));
		}
	};
	
};
export const downloadBWTApplication = (requestBody, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(DOWNLOADBWTAPPLICATION.POST.URL, DOWNLOADBWTAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload6----6', payload)
			dispatch(downloadBWTApplicationComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadBWTApplicationError(error.message));
		}
	};
	
	
};
export const downloadPermissionLetter = (requestBody, hasUsers = true, overWrite) => {
	//   requestBody.tenantId = "ch"
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADPERMISSIONLETTER.POST.URL, DWONLOADPERMISSIONLETTER.POST.ACTION, [], requestBody);
			console.log('payload6----6', payload)
			dispatch(downloadPermissionLetterComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadPermissionLetterError(error.message));
		}
	};
};

export const fetchPayment = (queryObject, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(PAYMENT.POST.URL, PAYMENT.POST.ACTION, queryObject);
			console.log('payload2----2', payload)
			dispatch(paymentFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(paymentFetchError(error.message));
		}
	};
};
export const fetchHistory = (queryObject, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(HISTORY.POST.URL, HISTORY.POST.ACTION, queryObject);
			console.log('payload3----3', payload)
			dispatch(historyFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(historyFetchError(error.message));
		}
	};
};
export const fetchDataAfterPayment = (queryObject, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(AFTERPAYMENTAPI.POST.URL, AFTERPAYMENTAPI.POST.ACTION, queryObject);
			console.log('payload4----4', payload)
			dispatch(fetchAfterPaymentData(payload, overWrite));
		} catch (error) {
			dispatch(fetchAfterPaymentError(error.message));
		}
	};
};
export const createWaterTankerApplication = (requestBody, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";

			const payload = await httpRequest(CREATEBWTAPPLICATION.POST.URL, CREATEBWTAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload10----10', payload)
			dispatch(createWaterTankerComplete(payload, overWrite));
		} catch (error) {
			dispatch(createWaterTankerError(error.message));
		}
	};
};
export const createPACCApplication = (requestBody, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";

			const payload = await httpRequest(CREATEPACCAPPLICATION.POST.URL, CREATEPACCAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload1p----10', payload)
			dispatch(createPACCComplete(payload, overWrite));
		} catch (error) {
			dispatch(createPACCError(error.message));
		}
	};
};


export const sendMessage = (message) => {
	return async (dispatch, getState) => {
		dispatch(complaintSendSMS(message));
	};
};

export const sendMessageTo = (message) => {
	return async (dispatch, getState) => {
		dispatch(complaintSendSMSTo(message));
	};
};

export const sendMessageMedia = (message) => {
	return async (dispatch, getState) => {
		dispatch(complaintSendSMSMedia(message));
	};
};


export const fetchApplicaionSector = () => {
	//Fetching Application sector from MDMS
	let requestBody = {
		MdmsCriteria: {
			tenantId: "ch",//commonConfig.tenantId,
			moduleDetails: [
				{
					moduleName: "Booking",
					masterDetails: [
						{
							name: "Sector",
						},

						{
							"name": "PropertyType"
						},
					],
				},
			],
		},
	};
	return async (dispatch) => {
		try {
			const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
			console.log('payload in fetch sector',payload)
			dispatch(applicationSectorFetchSucess(payload));
		} catch (error) {
			dispatch(applicationSectorFetchError(error.message));
		}
	};
};


export const fetchMccApplications = (requestBody, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(MCCAPPLICATION.POST.URL, MCCAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payloadMCC----2', payload)
			dispatch(MCCapplicationFetchComplete(payload, overWrite));
		} catch (error) {		
			dispatch(MCCapplicationFetchError(error.message));
		}
	};
};


export const fetchApplicationType = () => {
	//Fetching Application sector from MDMS
	let requestBody = {
		MdmsCriteria:{
	    tenantId: "ch",
        moduleDetails: [
            {
                "moduleName": "Booking",
                "masterDetails": [
                     {
                        "name": "Status"
                    },
                     {
                        "name": "ApplicationType"
                    }
                ]
            }
		]
	}
    }
	
	return async (dispatch) => {
		try {
			const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
			console.log('payload--application type',payload)
			dispatch(applicationTypeFetchSucess(payload));
		} catch (error) {
			dispatch(applicationTypeFetchError(error.message));
		}
	};
};


	export const OSBMfetchperDayRate = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(OSBMPerDayRateAmount.POST.URL, OSBMPerDayRateAmount.POST.ACTION,[], requestBody);
			dispatch(OSBMfetchperDayRateComplete(payload, overWrite));
		  } catch (error) {
			dispatch(OSBMfetchperDayRateError(error.message));
		  }
		};
	  };
	
	 export const fetchperDayRate = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(PerDayRateAmount.POST.URL, PerDayRateAmount.POST.ACTION,[], requestBody);
			dispatch(fetchperDayRateComplete(payload, overWrite));
		  } catch (error) {
			dispatch(fetchperDayRateError(error.message));
		  }
		};
	  }; 
	  export const downloadReceiptforCG = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADNEWRECEIPTFORCG.POST.URL, DWONLOADNEWRECEIPTFORCG.POST.ACTION, [], requestBody);
			dispatch(downloadPermissionReceiptCompleteforCG(payload, overWrite));
		  } catch (error) {
			dispatch(downloaddPermissionReceiptErrorforCG(error.message));
		  }
		};
	  };  
	  export const downloadMccPL = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(PermissionLetterDWNOSMCC.POST.URL, PermissionLetterDWNOSMCC.POST.ACTION, [], requestBody);
			dispatch(downloadMCCPLComplete(payload, overWrite));
		  } catch (error) {
			dispatch(downloadMCCPLError(error.message));
		  }
		};
	  };
	  export const downloadMccApp = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(ApplicationDWNOSMCC.POST.URL, ApplicationDWNOSMCC.POST.ACTION, [], requestBody);
			dispatch(downloadAPPCompleteMCC(payload, overWrite));
		  } catch (error) {
			dispatch(downloadAPPErrorMCC(error.message));
		  }
		};
	  };
	  export const downloadPaymentReceiptforCG = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADPAYMENTRECEIPTFORCG.POST.URL, DWONLOADPAYMENTRECEIPTFORCG.POST.ACTION, [], requestBody);
			dispatch(downloadReceiptCompleteforCG(payload, overWrite));
		  } catch (error) {
			dispatch(downloadReceiptErrorforCG(error.message));
		  }
		};
	  };
	  export const downloadApplicationforCG = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADAPPLICATIONFORCG.POST.URL, DWONLOADAPPLICATIONFORCG.POST.ACTION, [], requestBody);
			dispatch(downloadApplicationCompleteforCG(payload, overWrite));
		  } catch (error) {
			dispatch(downloadApplicationErrorforCG(error.message));
		  }
		};
	  };
	  export const downloadAppForPCC = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADAPPFORPCC.POST.URL, DWONLOADAPPFORPCC.POST.ACTION, [], requestBody);
			dispatch(downloadApplicationCompleteforPCC(payload, overWrite));
		  } catch (error) {
			dispatch(downloadApplicationErrorforPCC(error.message));
		  }
		};
	  };
	  export const downloadPLForPCC = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADPLFORPCC.POST.URL, DWONLOADPLFORPCC.POST.ACTION, [], requestBody);
			dispatch(downloadPermissionLetterCompleteforPCC(payload, overWrite));
		  } catch (error) {
			dispatch(downloadPermissionLetterErrorforPCC(error.message));
		  }
		};
	  };
	  export const downloadReceiptForPCC = (requestBody, hasUsers = true, overWrite) => {
		return async (dispatch, getState) => {
		  try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADRECEIPTFORPCC.POST.URL, DWONLOADRECEIPTFORPCC.POST.ACTION, [], requestBody);
			dispatch(downloadReceiptCompleteforPCC(payload, overWrite));
		  } catch (error) {
			dispatch(downloadReceiptErrorforPCC(error.message));
		  }
		};
	  };