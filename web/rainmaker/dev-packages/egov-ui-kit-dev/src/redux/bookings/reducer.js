import * as actionTypes from "./actionTypes";
import { transformById } from "egov-ui-kit/utils/commons";
import isEmpty from "lodash/isEmpty";


// console.log('hello reducer file',actionTypes);
// const mergeServiceWithActions = (payload) => {
//   return (
//     payload &&
//     payload.actionHistory &&
//     payload.actionHistory.reduce((result, item, index) => {
//       if (!isEmpty(item) && !isEmpty(item.actions) && payload.services[index]) {
//         result.push({
//           ...payload.services[index],
//           actions: item.actions,
//         });
//       }
//       return result;
//     }, [])
//   );
// };

const intialState = {
  loading: false,
  error: false,
  errorMessage: "",
  byId: {},
  categoriesById: {},
  complaintDepartment: [],
  complaintSector: [],
  order: ""
};
console.log('intialState in reducer==>>',intialState);
const complaintsReducer = (state = intialState, action) => {
  const { type, overWrite } = action;
  switch (type) {

    case actionTypes.APPLICATION_FETCH_COMPLETE:
      console.log('action.payload in reducer',action.payload)
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        applicationData: action.payload
      };

    case actionTypes.CREATE_WATER_TANKER_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        createWaterTankerApplicationData: action.payload
      };
    case actionTypes.CREATE_PARKCCAPP_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        createPACCApplicationData: action.payload
      };
      case actionTypes.CREATE_PACCAPP_ERROR:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          error: true,
          errorMessage: action.error,
        };
        case actionTypes.UPDATE_PARKCCAPP_COMPLETE:
          return {
            ...state,
            loading: false,
            fetchSuccess: true,
            updatePACCApplicationData: action.payload
          };
  
      case actionTypes.UPDATE_PACCAPP_ERROR:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          error: true,
          errorMessage: action.error,
        };


    case actionTypes.CREATE_WATER_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };



    case actionTypes.CREATE_PACCAPP_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };


    case actionTypes.DOWNLOAD_BWT_APPLICATION_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadBWTApplicationDetails: action.payload
      };
    case actionTypes.DOWNLOAD_BWT_APPLICATION_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.DOWNLOAD_RECEIPT_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadPaymentReceiptDetails: action.payload
      };

    case actionTypes.DOWNLOAD_LETTER_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadPermissionLetterDetails: action.payload
      };
    case actionTypes.DOWNLOAD_LETTER_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_APPLICATION_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadApplicationDetails: action.payload
      };
    case actionTypes.PAYMENT_FETCH_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        paymentData: action.payload,

      };

    case actionTypes.HISTORY_FETCH_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        HistoryData: action.payload,
      };
    case actionTypes.AFTER_PAYMENT_FETCH_DETAILS:
      console.log('action.payload,', action.payload)
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        fetchPaymentAfterPayment: action.payload,
      };



    case actionTypes.MCCAPPLICATION_FETCH_COMPLETE:
      console.log("in mcc sucess")
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        MccApplicationData: action.payload
      };
    case actionTypes.MCCAPPLICATION_FETCH_ERROR:
      console.log("in mcc failure")
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.APPLICATION_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.DOWNLOAD_RECEIPT_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.DOWNLOAD_APPLICATION_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.HISTORY_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.AFTER_PAYMENT_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };


    case actionTypes.PAYMENT_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };




    case actionTypes.COMPLAINTS_CATEGORIES_FETCH_SUCCESS:
      let categoriesById = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].ServiceDefs, "serviceCode");
      return {
        ...state,
        loading: false,
        categoriesById: {
          ...state.categoriesById,
          ...categoriesById,
        },
      };
    case actionTypes.COMPLAINTS_DEPARTMENT_FETCH_SUCCESS:
      let complaintDepartment = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].PgrDepartment, "code");
      return {
        ...state,
        loading: false,
        complaintDepartment: {
          ...state.complaintDepartment,
          ...complaintDepartment,
        },
      };
  

      case actionTypes.APPLICATION_SECTOR_FETCH_SUCCESS:
        let applicationSector = transformById(action.payload.MdmsRes["Booking"].Sector, "code");
        let applicationPmode = transformById(action.payload.MdmsRes["Booking"].Payment_Mode, "code");
        let sImageUrl = action.payload.MdmsRes["Booking"].Booking_Config
        console.log('payload in sImageUrl', sImageUrl)
        //  let a = action.payload.MdmsRes["Booking"];
  
        // console.log('applicationSector,Payment_Mode',applicationPmode,'aaaaa',a)
        return {
          ...state,
          loading: false,
          applicationSector: {
            ...state.applicationSector,
            ...applicationSector,
          },
          applicationPmode: {
            ...state.applicationPmode,
            ...applicationPmode,
          },
          sImageUrl: {
            ...state.sImageUrl,
            ...sImageUrl,
          },
        };

    case actionTypes.APPLICATION_TYPE_FETCH_SUCCESS:
       let applicationType = action.payload.MdmsRes["Booking"];
      console.log('applicationType', applicationType)
      return {
        ...state,
        loading: false,
        applicationType: {
          ...state.applicationType,
          ...applicationType,
        },
      };
    
   

        

    case actionTypes.COMPLAINTS_SECTOR_FETCH_SUCCESS:
      let complaintSector = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].Sector, "code");
      console.log('complaintSector', complaintSector)
      return {
        ...state,
        loading: false,
        complaintSector: {
          ...state.complaintSector,
          ...complaintSector,
        },
      };
    case actionTypes.COMPLAINTS_SORT_ORDER:
      return {
        ...state,
        loading: false,
        order: action.order,
      };

    case actionTypes.COMPLAINTS_SEND_MESSAGE:
      return {
        ...state,
        loading: false,
        ShareMetaData: action.message,
      };
    case actionTypes.COMPLAINTS_SEND_MESSAGE_SHAREMEDIA:
      return {
        ...state,
        loading: false,
        ShareMetaData: {
          ...state.ShareMetaData,
          shareMedia: action.message,
        },
      };
    case actionTypes.PAYMENT_PER_DAY_FETCH_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        perDayRate: action.payload
      };
    case actionTypes.PAYMENT_PER_DAY_FETCH_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.OSBMPAYMENT_PER_DAY_FETCH_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        OSBMperDayRate: action.payload
      };
    case actionTypes.OSBMPAYMENT_PER_DAY_FETCH_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_NEWRECEIPT_COMPLETE_CG:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadReceiptDetailsforCG: action.payload
      };
    case actionTypes.DOWNLOAD_NEWRECEIPT_ERROR_CG:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_PLMCC_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadMccPermissionLetter: action.payload
      };
    case actionTypes.DOWNLOAD_PLMCC_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_RECEIPT_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadPaymentReceiptDetails: action.payload
      };
    case actionTypes.DOWNLOAD_RECEIPT_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_MCCAPP_COMPLETE:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadMccAppp: action.payload
      };
    case actionTypes.DOWNLOAD_MCCAPP_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_RECEIPT_COMPLETE_CG:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadPaymentReceiptDetailsforCG: action.payload
      };
    case actionTypes.DOWNLOAD_RECEIPT_ERROR_CG:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.DOWNLOAD_APPLICATION_COMPLETE_CG:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadApplicationDetailsforCG: action.payload
      };
    case actionTypes.DOWNLOAD_APPLICATION_ERROR_CG:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.DOWNLOAD_APPLICATION_COMPLETE_PCC:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadApplicationDetailsforPCC: action.payload
      };
    case actionTypes.DOWNLOAD_APPLICATION_ERROR_PCC:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_PERMISSIONLETTER_COMPLETE_PCC:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadPermissionLetterDetailsforPCC: action.payload
      };
    case actionTypes.DOWNLOAD_PERMISSIONLETTER_ERROR_PCC:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.DOWNLOAD_RECEIPT_COMPLETE_PCC:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        DownloadReceiptDetailsforPCC: action.payload
      };
    case actionTypes.DOWNLOAD_RECEIPT_ERROR_PCC:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case actionTypes.COMPLAINTS_SEND_MESSAGE_SHARECONTENT_TO:
      const shareCont = state.ShareMetaData.shareContent;
      shareCont.map((elem) => {
        elem.to = action.message;
      });
      return {
        ...state,
        loading: false,
        ShareMetaData: {
          ...state.ShareMetaData,
          shareContent: shareCont,
        },
      };
      case actionTypes.DOWNLOAD_ESAMPARK_APP_COMPLETE_PCC:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          Downloadesamparkdetails: action.payload
        };
      case actionTypes.DOWNLOAD_ESAMPARK_APP__ERROR_PCC:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          error: true,
          errorMessage: action.error,
        };
        case actionTypes.DOWNLOAD_ESAMPARK_PL_COMPLETE_PCC:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          Downloadesamparkdetailspl: action.payload
        };
      case actionTypes.DOWNLOAD_ESAMPARK_APP__ERROR_PCC:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          error: true,
          errorMessage: action.error,
        };
        case actionTypes.FACILATION_CHARGES_FETCH_SUCCESS:
          // let facilationChargesSuccess = transformById(action.payload.MdmsRes["BillingService"].TaxHeadMaster, "code");          
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          facilationChargesSuccess: action.payload
        };
        // return {
        //   ...state,
        //   loading: false,
        //   facilationChargesSuccess: {
        //     ...state.facilationChargesSuccess,
        //     ...facilationChargesSuccess,
        //   }
        // }
      case actionTypes.DOWNLOAD_ESAMPARK_APP__ERROR_PCC:
        return {
          ...state,
          loading: false,
          fetchSuccess: true,
          error: true,
          errorMessage: action.error,
        };
        //REFUNDINIT_COMPLETE
        case actionTypes.REFUNDINIT_COMPLETE:
          return {
            ...state,
            loading: false,
            fetchSuccess: true,
            dataforRefund: action.payload,
          };

        case actionTypes.DOWNLOAD_WATERTANER_RECEIPT_COMPLETE:
          return {
            ...state,
            loading: false,
            fetchSuccess: true,
            waterTankerPaymentReceipt: action.payload,
          }

        case actionTypes.FACILATION_FETCH_SUCCESS:
          let applicationFetchfaciliation = transformById(action.payload.MdmsRes["BillingService"].TaxHeadMaster, "code");
          console.log("applicationFetchfaciliation--",applicationFetchfaciliation)
          let TaxHeadMaster = action.payload.MdmsRes.BillingService.TaxHeadMaster
          console.log("TaxHeadMaster--",TaxHeadMaster)
          var facilation;
          var arrayName = [];
          arrayName.push(action.payload.MdmsRes.BillingService.TaxHeadMaster)
          console.log("arrayName--",arrayName)
        //  for(let i = 0; i < arrayName.length; i++){
        //    if(arrayName[i].code==="FACILITATION_CHARGE")
        //      {
        //         facilation = facilitationCharge
        //       }
        //   }
        //   console.log("facilation--Inreducer",facilation)
   
        return {
          ...state,
          loading: false,
          arrayName: {
            ...state.arrayName,
            ...arrayName,
          },
        };
              
    default:
      return state;
  }
};

export default complaintsReducer;
