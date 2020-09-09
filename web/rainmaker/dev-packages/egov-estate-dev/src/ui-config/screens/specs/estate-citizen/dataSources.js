import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";

const getMdmsDataSourceValue = async (item) => {
    if(!!item.values.cacheable && !!dataSources[item.name] && !!dataSources[item.name].values) {
        return dataSources[item.name].values
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


const getLocalDataSourceValue = (item) => {
    return item.values
}


export const getDataSourceValues = (item) => {
    if(item.type === "local") {
        return getLocalDataSourceValue(item);
    } else {
        return getMdmsDataSourceValue(item)
    }
}