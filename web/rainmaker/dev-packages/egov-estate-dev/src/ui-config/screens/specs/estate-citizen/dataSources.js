import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";

var dataSources = {
    "modesOfTransfer": {
        name: "modesOfTransfer",
        type: "local",
        values: [{code: "online"}, {code: "offline"}]
    }
}

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
            if(!!item.values.cacheable) {
                dataSources[item.name] = {
                    name: item.name,
                    type: "mdms",
                    values: response.MdmsRes[item.values.masterName]
                }
            }
            return response.MdmsRes[item.values.masterName]
        } catch (error) {
            console.log(error)
        }
    }
}


const getLocalDataSourceValue = (item) => {
    return dataSources[item.name].values
}


export const getDataSourceValues = (item) => {
    if(item.type === "local") {
        return getLocalDataSourceValue(item);
    } else {
        return getMdmsDataSourceValue(item)
    }
}