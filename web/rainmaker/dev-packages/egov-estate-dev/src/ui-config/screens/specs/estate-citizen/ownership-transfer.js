import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const type = getQueryArg(window.location.href, "type");

console.log(type)