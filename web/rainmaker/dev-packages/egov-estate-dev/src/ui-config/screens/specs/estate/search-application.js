import {
    getCommonHeader,
    getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import { estateApplicationSearch } from './searchResource/estateApplication';
import { getStatusList, searchApplicationApiCall } from './searchResource/functions';
import { searchApplicationResults } from './searchResource/searchResults';

import {
    getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";

const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_DISPATCH_OFFICER");
const header = getCommonHeader({
    labelName: "Search Property Master",
    labelKey: "EST_SEARCH_PROPERTY_MASTER_HEADER"
});

const estateSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-application",
    beforeInitScreen: (action, state, dispatch) => {
        const queryObject = [{
            key: "tenantId",
            value: getTenantId()
        },
        {
            key: "businessServices",
            value: "SaleGift"
        }
        ]
        dispatch(prepareFinalObject("searchScreen", {}))
        searchApplicationApiCall(state, dispatch, true)
        // getStatusList( state, dispatch, queryObject, "search-application", "components.div.children.estateApplicationSearch.children.cardContent.children.colonyContainer.children.status", "SaleGift")
        return action
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "search"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 8
                            },
                            ...header
                        },
                    }
                },
                estateApplicationSearch,
                breakAfterSearch: getBreak(),
                searchApplicationResults
            }
        }
    }
};

export default estateSearchAndResult;