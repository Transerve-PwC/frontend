import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";

const DataSourceTypes = {
    MDMS: "mdms",
    LOCAL: "local"
  }

class MDMSDatasource {
    values = {
    };
    async get(item) {
        if(!!item.values.cacheable && !!this.values[item.name] && !!this.values[item.name].values) {
            return this.values[item.name].values
        } else {
            const payload = {
                MdmsCriteria: {
                    tenantId: getTenantId(),
                    moduleDetails: [
                        {
                            moduleName: item.values.moduleName,
                            masterDetails: [
                                {name: item.values.masterName, filter: item.values.masterName}
                            ]
                        }
                    ]
                }
            }
            try {
                const response = await httpRequest("post",
                "/egov-mdms-service/v1/_search",
                "_search",
                [],
                payload)
                return response.MdmsRes[item.values.masterName]
            } catch (error) {
                console.log(error)
            }
        }
    }
 }
  
 class LocalDatasource {
    async get(item) {
        return item.values;
    }
 }
  
 class DatasourceGetter {
   datasources = {};
    constructor() {
        this.datasources[DataSourceTypes.MDMS] = new MDMSDatasource({});
        this.datasources[DataSourceTypes.LOCAL] = new LocalDatasource({});
    }
  
   getDatasource(type) {
        return this.datasources[type]
    }
 }
  
const datasourceGetter = new DatasourceGetter();

 export const getOptions = (item) => {
    return datasourceGetter.getDatasource(item.type).get(item);
 }