import { setFieldProperty, handleFieldChange } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import commonConfig from "config/common.js";

const tenantId = getTenantId();

const formConfig = {
  name: "complaint",
  idJsonPath: "services[0].serviceRequestId",
  fields: {
    media: {
      id: "media",
      jsonPath: "actionInfo[0].media",
      file: true,
      errorMessage: "CS_FILE_UPLOAD_FAILED",
    },
    name: {
      id: "add-complaint",
      jsonPath: "services[0].citizen.name",
      required: true,
      floatingLabelText: "ES_CREATECOMPLAINT_COMPLAINT_NAME",
      hintText: "ES_CREATECOMPLAINT_COMPLAINT_NAME_PLACEHOLDER",
      numcols: 6,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      errorText: "",
    },
    phone: {
      id: "complainant-mobile-no",
      type: "number",
      pattern: "^([0-9]){10}$",
      jsonPath: "services[0].citizen.mobileNumber",
      required: true,
      floatingLabelText: "ES_CREATECOMPLAINT_MOBILE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "ES_CREATECOMPLAINT_MOBILE_NUMBER_PLACEHOLDER",
      numcols: 6,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      errorText: "",
    },
    department: {
      id: "department",
      required: true,
      jsonPath: "services[0].department",
      floatingLabelText: "CS_ADDCOMPLAINT_DEPARTMENT",
      hintText: "HR_DEPARTMENT_PLACEHOLDER",
      errorMessage: "HR_DEPARTMENT_PLACEHOLDER",
      boundary: true,
      dropDownData: [],
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        if(field && field.value){
       //   dispatch(setFieldProperty("complaint", "complaintType", "disabled", false));
        }
        else{
       //   dispatch(setFieldProperty("complaint", "complaintType", "disabled", true));
        }
      //  dispatch(setFieldProperty("complaint", "complaintType", "value", ""));
        },
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorText: "",
      numcols: 2,
      value:"",
    },
    complaintType: {
      id: "complaint-type",
      jsonPath: "services[0].serviceCode",
      required: true,
      floatingLabelText: "CS_ADDCOMPLAINT_COMPLAINT_TYPE",
      errorMessage: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      hintText: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      numcols: 2,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      errorText: "",
    },
    latitude: {
      id: "latitude",
      jsonPath: "services[0].addressDetail.latitude",
    },
    longitude: {
      id: "longitude",
      jsonPath: "services[0].addressDetail.longitude",
    },
    city: {
      id: "city",
      jsonPath: "services[0].addressDetail.city",
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "ES_CREATECOMPLAINT_SELECT_PLACEHOLDER",
      errorMessage: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      required: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorText: "",
      dropDownData: [],
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
     //   dispatch(setFieldProperty("complaint", "mohalla", "value", ""));
      },
      beforeFieldChange: ({ action, dispatch, state }) => {
        if (get(state, "common.prepareFormData.services[0].addressDetail.city") !== action.value) {
          const moduleValue = action.value;
          dispatch(fetchLocalizationLabel(getLocale(), moduleValue, moduleValue));
        }
        return action;
      },
      labelsFromLocalisation: true,
     /* dataFetchConfig: {
        dependants: [
          {
            fieldKey: "mohalla",
          },
        ],
      }, */
    },
    mohalla: {
      id: "mohalla",
      required: true,
      jsonPath: "services[0].addressDetail.mohalla",
      floatingLabelText: "CS_CREATECOMPLAINT_MOHALLA",
      hintText: "CS_CREATECOMPLAINT_MOHALLA_PLACEHOLDER",
      errorMessage: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      boundary: true,
      dropDownData: [],
    /*  dataFetchConfig: {
        url: "egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality",
        action: "",
        queryParams: [],
        requestBody: {},
        isDependent: true,
        hierarchyType: "ADMIN",
      },
          */
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      errorText: "",
    },
    houseNo: {
      id: "houseNo",
      jsonPath: "services[0].addressDetail.houseNoAndStreetName",
      floatingLabelText: "CS_ADDCOMPLAINT_HOUSE_NO",
      hintText: "CS_ADDCOMPLAINT_HOUSE_NO_PLACEHOLDER",
      errorMessage: "PT_HOUSE_NO_ERROR_MESSAGE",
      value: "",
    },
    landmark: {
      id: "landmark",
      jsonPath: "services[0].addressDetail.landmark",
      floatingLabelText: "CS_ADDCOMPLAINT_LANDMARK",
      hintText: "CS_ADDCOMPLAINT_LANDMARK_PLACEHOLDER",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      errorText: "",
    },
    additionalDetails: {
      id: "additional details",
      jsonPath: "services[0].description",
      floatingLabelText: "CS_ADDCOMPLAINT_COMPLAINT_DETAILS",
      hintText: "CS_ADDCOMPLAINT_COMPLAINT_DETAILS_PLACEHOLDER",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      errorText: "",
      maxlength: "500"
    },
    tenantId: {
      id: "add-complaint-tenantid",
      jsonPath: "services[0].tenantId",
      value: commonConfig.tenantId,
    },
  },
  submit: {
    type: "submit",
    label: "CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT",
    id: "addComplaint-submit-complaint",
  },
  afterInitForm: (action, store, dispatch) => {
    try {
      let state = store.getState();
      const { localizationLabels } = state.app;
      const { cities, citiesByModule } = state.common;
      const {categoriesById ,complaintDepartment , complaintSector} = state.complaints
      const { PGR } = citiesByModule || {};
      if (PGR) {
        // for department
        let arrayOfDepartment =[];
        let i=0;
        const getNestedObjFormat = (categories) => {
          let categoryList = {};
          Object.values(categories).map((item) => {
            set(categoryList, item.code , item);
          });
          return transform(categoryList);
        };
        
        const transform = (input) => {
          return Object.keys(input).reduce((result, itemKey) => {
            const item = Object.assign({}, input[itemKey]);
            if(item && item.code){
              if(item.code != "undefined"){
             const duplicate_flag =   arrayOfDepartment.find(ele => ele.value === item.code);
             let DepLable="";
             if(! duplicate_flag){
               let codevalue = ""+item.code;
               if(codevalue.includes("DEP")){
                  DepLable = `PGRDEPT.${item.code.toUpperCase()}`;
               }else{
                   DepLable = item.name;
               }
              
              arrayOfDepartment.push({ label: getTranslatedLabel(DepLable, localizationLabels) , value: item.code });
             }
                 
              }
              i++;
            }
            return result;
          }, []);
        };

const categoryList = getNestedObjFormat(complaintDepartment);
dispatch(setFieldProperty("complaint", "department", "dropDownData", arrayOfDepartment));
arrayOfDepartment =[];
const sectorList = getNestedObjFormat(complaintSector);
dispatch(setFieldProperty("complaint", "mohalla", "dropDownData", arrayOfDepartment));
        const tenants = PGR.tenants;
        const dd = tenants.reduce((dd, tenant) => {
          let selected = cities.find((city) => {
            return city.code === tenant.code;
          });
          if (selected) {
            const label = `TENANT_TENANTS_${selected.code.toUpperCase().replace(/[.]/g, "_")}`;
            dd.push({ label: getTranslatedLabel(label, localizationLabels), value: selected.code });
          }
          return dd;
        }, []);
        dispatch(setFieldProperty("complaint", "city", "dropDownData", dd));
      }
      let city = get(state, "form.complaint.fields.city.value");
      let mohalla = get(state, "form.complaint.fields.mohalla.value");
      if (!city) {
         dispatch(handleFieldChange("complaint", "city", tenantId));
      } else {
        if (city) {
          dispatch(handleFieldChange("complaint", "city", city));
        }
        if (mohalla) {
          dispatch(handleFieldChange("complaint", "mohalla", mohalla));
        }
      }
      return action;
    } catch (e) {
      console.log(e);
    }
  },
  action: "_create",
  saveUrl: "/rainmaker-pgr/v1/requests/_create",
  redirectionRoute: "/complaint-submitted",
};

export default formConfig;
