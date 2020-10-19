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
import { getApplicationStatusList, getApplicationTypes } from "../../../../ui-utils/commons";

const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_DISPATCH_OFFICER");
const header = getCommonHeader({
    labelName: "Search Applications",
    labelKey: "ES_SEARCH_APPLICATION"
});

const estateSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-application",
    beforeInitScreen: (action, state, dispatch) => {
        dispatch(prepareFinalObject("searchScreen", {}))
        searchApplicationApiCall(state, dispatch, true)
        getApplicationStatusList({state, dispatch, action, screenKey: "search-application", componentJsonPath: "components.div.children.estateApplicationSearch.children.cardContent.children.fileStatusContainer.children.status"})
        getApplicationTypes({state, dispatch, action, screenKey: "search-application", componentJsonPath: "components.div.children.estateApplicationSearch.children.cardContent.children.applicationNumberContainer.children.applicationType"})
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