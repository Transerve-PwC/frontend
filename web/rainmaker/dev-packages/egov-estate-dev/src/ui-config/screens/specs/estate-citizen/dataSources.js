import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";

const DataSourceTypes = {
    MDMS: "mdms",
    LOCAL: "local"
  }

class MDMSDatasource {
    options;
    cacheable;
    lazyload;
    constructor(options, cacheable = true, lazyload = true) {
        this.options = options;
        this.cacheable = cacheable;
        this.lazyload = lazyload;
        if (!this.lazyload) {
            this.loadValues();
        }
    }

    async loadValues() {
        this.values = [];
        const { moduleName, masterName, filter } = this.options;
        const payload = {

            MdmsCriteria: {
                tenantId: getTenantId(),
                moduleDetails: [
                  {
                    moduleName: moduleName,
                    masterDetails: [
                      { name: masterName, filter }
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
            if(!!response && !!response.MdmsRes) {
                this.values = response.MdmsRes[moduleName][masterName];
            }
        } catch (error) {
            console.log(error);
        }
    }
    async get() {
        if (this.cacheable && !!this.values) {
            return this.values;
        }
        await this.loadValues();
        return this.values;
    }
 }
  
 class LocalDatasource {
    values;
    constructor(values) {
        this.values = values;
    }
    async get() {
        return this.values;
    }
 }
  
 class DatasourceManager {
   datasources = {};

    registerDatasource(config) {
        switch(config.type) {
            case "local" : {
                this.datasources[config.name] = new LocalDatasource(config.values);
                break;
            }
            case "mdms" : {
                this.datasources[config.name] = new MDMSDatasource(config.options, config.cacheable, config.lazyload);
                break;
            }
        }
    }

    getDatasource(datasourceName) {
        const datasource = this.datasources[datasourceName];
        if (!datasource) {
            throw new Error(`Datasource ${datasourceName} has not been registered`);
        }
        return datasource;
    }
}

const datasourceManager = new DatasourceManager();

export const getOptions = async (datasourceName) => {
    return await datasourceManager.getDatasource(datasourceName).get();
}

export const registerDatasource = (config) => {
    datasourceManager.registerDatasource(config);
}