import { httpRequest } from "egov-ui-kit/utils/api";
export const convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  
  export const getDurationDate = (fromDate, toDate) => {
    let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let startDate = new Date(fromDate);
    let finalStartDate =
        startDate.getDate() +
        " " +
        monthNames[startDate.getMonth()] +
        " " +
        startDate.getFullYear();
  
    let endDate = new Date(toDate);
    endDate.setMonth(endDate.getMonth());
    let finalEndDate =
        endDate.getDate() +
        " " +
        monthNames[endDate.getMonth()] +
        " " +
        endDate.getFullYear();
    let finalDate = finalStartDate + " to " + finalEndDate;
    return finalDate;
  };

export const NumInWords = (number) => {
    const first = [
        "",
        "One ",
        "Two ",
        "Three ",
        "Four ",
        "Five ",
        "Six ",
        "Seven ",
        "Eight ",
        "Nine ",
        "Ten ",
        "Eleven ",
        "Twelve ",
        "Thirteen ",
        "Fourteen ",
        "Fifteen ",
        "Sixteen ",
        "Seventeen ",
        "Eighteen ",
        "Nineteen ",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
    let word = "";

    for (let i = 0; i < mad.length; i++) {
        let tempNumber = number % (100 * Math.pow(1000, i));
        if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
            if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                word =
                    first[Math.floor(tempNumber / Math.pow(1000, i))] +
                    mad[i] +
                    " " +
                    word;
            } else {
                word =
                    tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
                    first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
                    mad[i] +
                    " " +
                    word;
            }
        }

        tempNumber = number % Math.pow(1000, i + 1);
        if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
            word =
                first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
                "Hunderd " +
                word;
    }
    return word + "Rupees Only";
};
export const getFileUrlFromAPI = async (fileStoreId,tenantId) => {
  console.log('fileStoreId=========',fileStoreId)

    const queryObject = [
      { key: "tenantId", value: tenantId},
      { key: "fileStoreIds", value: fileStoreId }
    ];
    console.log('queryObject=========',queryObject)
    try {
      const fileUrl = await httpRequest(
        "/filestore/v1/files/url","_search",
        queryObject,{},[],{},true,true
      );
      console.log('fileUrlsbbbbbbbbbbb=========',fileUrl)
      return fileUrl;
    } catch (e) {
      console.log(e);
    }
  };
  // endPoint,
  // action,
  // queryObject = [],
  // requestBody = {},
  // headers = [],
  // customRequestInfo = {},
  // ignoreTenantId = false,
  // isGetMethod=false
  