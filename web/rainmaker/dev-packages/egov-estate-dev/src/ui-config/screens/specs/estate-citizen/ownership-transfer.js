import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const applicationType = getQueryArg(window.location.href, "applicationType");
const fileNumber = getQueryArg(window.location.href, "fileNumber");

console.log(applicationType)
console.log(fileNumber)