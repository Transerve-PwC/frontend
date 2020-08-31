import { setFieldProperty, handleFieldChange } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getUserInfo, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";

//const tenantId = JSON.parse(getUserInfo()).permanentCity;
const tenantId = "ch.chandigarh"
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
          dispatch(setFieldProperty("complaint", "complaintType", "disabled", false));
        }
        else{
          dispatch(setFieldProperty("complaint", "complaintType", "disabled", true));
        }
        dispatch(setFieldProperty("complaint", "complaintType", "value", ""));
        },
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorText: "",
    },
    complaintType: {
      id: "complaint-type",
      jsonPath: "services[0].serviceCode",
      required: true,
      floatingLabelText: "CS_ADDCOMPLAINT_COMPLAINT_TYPE",
      errorMessage: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      hintText: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
    },
    additionalDetails: {
      id: "additional details",
      jsonPath: "services[0].description",
      floatingLabelText: "CS_ADDCOMPLAINT_COMPLAINT_DETAILS",
      hintText: "CS_ADDCOMPLAINT_COMPLAINT_DETAILS_PLACEHOLDER",
      errorMessage: "Landmark should be less than 300 characters",
      maxlength: "500"
    },
    latitude: {
      id: "latitude",
      jsonPath: "services[0].addressDetail.latitude",
    },
    longitude: {
      id: "longitude",
      jsonPath: "services[0].addressDetail.longitude",
    },
    address: {
      id: "address",
      jsonPath: "services[0].address",
      floatingLabelText: "CS_ADDCOMPLAINT_LOCATION",
      hintText: "CS_COMPLAINT_DETAILS_LOCATION",
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
      errorText: "",
    },
    houseNo: {
      id: "houseNo",
      jsonPath: "services[0].addressDetail.houseNoAndStreetName",
      floatingLabelText: "CS_ADDCOMPLAINT_HOUSE_NO",
      hintText: "CS_ADDCOMPLAINT_HOUSE_NO_PLACEHOLDER",
      errorMessage: "PT_HOUSE_NO_ERROR_MESSAGE",
    },
    landmark: {
      id: "landmark",
      jsonPath: "services[0].addressDetail.landmark",
      floatingLabelText: "CS_ADDCOMPLAINT_LANDMARK",
      hintText: "CS_ADDCOMPLAINT_LANDMARK_PLACEHOLDER",
      errorMessage: "PT_LANDMARK_ERROR_MESSAGE",
    },
    tenantId: {
      id: "add-complaint-tenantid",
      jsonPath: "services[0].tenantId",
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

    let department = get(state, "form.complaint.fields.department");
      if(department && department.value)
        dispatch(setFieldProperty("complaint", "complaintType", "disabled", false));
      else
        dispatch(setFieldProperty("complaint", "complaintType", "disabled", true));

   /*    categoryList.forEach(category => {
        
        if(category && category.nestedItems && category.nestedItems[0].department){
          arrayOfDepartment[i] = category.nestedItems[0].department;
          i++;
        }
       
   })*/
        // code change end here for department
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
     // let mohalla = get(state, "form.complaint.fields.mohalla.value");
      if (!city) {
        dispatch(handleFieldChange("complaint", "city", tenantId));
      } else {
        if (city) {
          dispatch(handleFieldChange("complaint", "city", city));
        }
        if (mohalla) {
         // dispatch(handleFieldChange("complaint", "mohalla", mohalla));
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
