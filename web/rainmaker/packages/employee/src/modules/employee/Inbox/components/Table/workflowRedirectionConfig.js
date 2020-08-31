export const getWFConfig = (module,businessService) => {
  console.log("module", module, module.toUpperCase(),businessService);
  switch (module.toUpperCase()) {
    case "TL-SERVICES":
      if(businessService === "MasterRP") {
        return {
          INITIATED: "/rented-properties/apply",
          DEFAULT: "/rented-properties/search-preview",
        };
      } else if(businessService === "OwnershipTransferRP") {
        return {
          INITIATED: "/rented-properties/ownership-search-preview",
          DEFAULT: "/rented-properties/ownership-search-preview",
        };
      } else if(businessService === "DuplicateCopyOfAllotmentLetterRP") {
        return {
          INITIATED: "/rented-properties/search-duplicate-copy-preview",
          DEFAULT: "/rented-properties/search-duplicate-copy-preview",
        };
      } else if(businessService === "PermissionToMortgage") {
        return {
          INITIATED: "/rented-properties/mortgage-search-preview",
          DEFAULT: "/rented-properties/mortgage-search-preview",
        };
      } else {
        return {
          INITIATED: "/tradelicence/apply",
          DEFAULT: "/tradelicence/search-preview",
        };
      }
    case "RENTEDPROPERTIES": 
      if(businessService === "MasterRP") {
      return {
        INITIATED: "/rented-properties/apply",
        DEFAULT: "/rented-properties/search-preview",
      };
    } else if(businessService === "OwnershipTransferRP") {
      return {
        INITIATED: "/rented-properties/ownership-search-preview",
        DEFAULT: "/rented-properties/ownership-search-preview",
      };
    } else if(businessService === "DuplicateCopyOfAllotmentLetterRP") {
      return {
        INITIATED: "/rented-properties/search-duplicate-copy-preview",
        DEFAULT: "/rented-properties/search-duplicate-copy-preview",
      };
    } else if(businessService === "PermissionToMortgage") {
      return {
        INITIATED: "/rented-properties/mortgage-search-preview",
        DEFAULT: "/rented-properties/mortgage-search-preview",
      };
    }
    case "WS-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "SW-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "FIRENOC":
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview",
      };
    case "BPA-SERVICES":
      return {
        INITIATED: "/egov-bpa/search-preview",
        DEFAULT: "/egov-bpa/search-preview",
      };
    case "BPAREG":
      return {
        DEFAULT: "/bpastakeholder/search-preview",
      };
    case "PT-SERVICES":
      return {
        INITIATED: "/property-tax/application-preview",
        DEFAULT: "/property-tax/application-preview",
      };
    case "PT":
      if(businessService=="PT.CREATE"){
        return {
          INITIATED: "/property-tax/application-preview",
          DEFAULT: "/property-tax/application-preview",
        }; 
      }else{
        return {
          INITIATED: "/pt-mutation/search-preview",
          DEFAULT: "/pt-mutation/search-preview",
        }; 
      }
      // new module rediraection for case "RRP_SERVICE ,DOE_SERVICE, DOP_SERVICE":
      case "RRP_SERVICE":
        return {
          INITIATED: "/pms/pmsmap",
          DEFAULT: "/pms/pmsmap",
        };
        case "DOE_SERVICE":
          return {
            INITIATED: "/pms/pmsmap",
            DEFAULT: "/pms/pmsmap",
          };
          case "DOP_SERVICE":
          return {
            INITIATED: "/pms/pmsmap",
            DEFAULT: "/pms/pmsmap",
          };
      
    }
};