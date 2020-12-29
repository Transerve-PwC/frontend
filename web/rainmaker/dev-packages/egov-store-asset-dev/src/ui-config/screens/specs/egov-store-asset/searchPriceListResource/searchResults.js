import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Suplier Name":
      return getLocaleLabels(
        "Suplier Name",
        "STORE_SUPPLIER_MASTER_SUPPLIER_NAME",
        localisationLabels
      );

     
    case "Material Type Description":
      return getLocaleLabels(
        "Material Type Description",
        "STORE_COMMON_TABLE_COL_MATERIAL_DESC",
        localisationLabels
      );
      case "Parent Material Type Name":
        return getLocaleLabels(
          "Parent Material Type Name",
          "HR_COMMON_TABLE_COL_PRNT_MATERIAL_NAME",
          localisationLabels
        );
        case "Store Name":
          return getLocaleLabels(
            "Store Name",
            "STORE_COMMON_TABLE_COL_STORE_NAME",
            localisationLabels
          );
          case "Material Name":
            return getLocaleLabels(
              "Material Name",
              "STORE_COMMON_TABLE_COL_STORE_NAME",
              localisationLabels
            );
            case "Agrement No":
              return getLocaleLabels(
                "Agrement No",
                "STORE_PRICE_AGREMENT_NO",
                localisationLabels
              );
              case "Agrement Start Date":
                return getLocaleLabels(
                  "Agrement Start Date",
                  "STORE_PRICE_AGREMENT_START_DATE",
                  localisationLabels
                );
                case "Agrement End Date":
                  return getLocaleLabels(
                    "Agrement End Date",
                    "STORE_PRICE_AGREMENT_END_DATE",
                    localisationLabels
                  );
            case "Rate Type":
        return getLocaleLabels(
          "Rate Type",
          "STORE_PRICE_RATE_TYPE",
          localisationLabels
        );
    case "Active":
      return getLocaleLabels(
        "Active",
        "STORE_COMMON_TABLE_COL_ACTIVE",
        localisationLabels
      );
    case "Search Results for Price List":
      return getLocaleLabels(
        "Search Results for Price List",
        "STORE_MATERIAL_PRICE_LIST_RESULTS_TABLE_HEADING",
        localisationLabels
      );
  }
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("Suplier Name"),
     // getTextToLocalMapping("Material Name"),
     getTextToLocalMapping("Agrement No"), 
     getTextToLocalMapping("Agrement Start Date"), 
     getTextToLocalMapping("Agrement End Date"), 
      getTextToLocalMapping("Rate Type"),     
      getTextToLocalMapping("Active"),
      {
        name: "id",
        options: {
          display: false
        }
      },
    ],
    title: getTextToLocalMapping("Search Results for Price List"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      },
    },
  },
};

const onRowClick = (rowData) => {
  let tenantId = getTenantId();
 console.log(rowData);
 window.location.href = `view-price-list?id=${rowData[6]}&tenantId=${tenantId}`;
};


