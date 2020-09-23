const remoteComponentPath = (moduleName, path) => {
  let component = null;
  switch (moduleName) {
    case "egov-tradelicence":
      if (path === "ui-atoms-local") {
        component = import("egov-tradelicence/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-tradelicence/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-tradelicence/ui-containers-local");
      }
      break;
    case "egov-rented-properties":
      if (path === "ui-atoms-local") {
        component = import("egov-rented-properties/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-rented-properties/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-rented-properties/ui-containers-local");
      }
      break;
    case "egov-estate": 
      if (path === "ui-atoms-local") {
        component = import("egov-estate/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-estate/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-estate/ui-containers-local");
      }
      break;
    case "egov-pt":
      if (path === "ui-atoms-local") {
        component = import("egov-pt/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-pt/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-pt/ui-containers-local");
      }
      break;
    case "egov-common":
      if (path === "ui-atoms-local") {
        component = import("egov-common/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-common/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-common/ui-containers-local");
      }
      break;
    case "egov-noc":
      if (path === "ui-atoms-local") {
        component = import("egov-noc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-noc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-noc/ui-containers-local");
      }
      break;
    case "egov-uc":
      if (path === "ui-atoms-local") {
        component = import("egov-uc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-uc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-uc/ui-containers-local");
      }
      break;
    case "egov-abg":
      if (path === "ui-atoms-local") {
        component = import("egov-abg/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-abg/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-abg/ui-containers-local");
      }
      break;
    case "egov-bpa":
      if (path === "ui-atoms-local") {
        component = import("egov-bpa/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-bpa/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-bpa/ui-containers-local");
      }
      break;
    case "egov-workflow":
      if (path === "ui-atoms-local") {
        component = import("egov-workflow/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-workflow/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-workflow/ui-containers-local");
      }
      break;
    case "egov-wns":
      if (path === "ui-atoms-local") {
        component = import("egov-wns/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-wns/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-wns/ui-containers-local");
      }
      break;
    case "egov-opms":
      if (path === "ui-atoms-local") {
        component = import("egov-opms/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-opms/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-opms/ui-containers-local");
      }
      break;
    case "egov-hc":
      if (path === "ui-atoms-local") {
        component = import("egov-hc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-hc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-hc/ui-containers-local");
      }
      break;
    case "egov-echallan":
      if (path === "ui-atoms-local") {
        component = import("egov-echallan/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-echallan/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-echallan/ui-containers-local");
      }
      break;
    case "egov-nulm":
      if (path === "ui-atoms-local") {
        component = import("egov-nulm/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-nulm/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-nulm/ui-containers-local");
      }
      break;
      case "egov-rti":
        if (path === "ui-atoms-local") {
          component = import("egov-rti/ui-atoms-local");
        } else if (path === "ui-molecules-local") {
          component = import("egov-rti/ui-molecules-local");
        } else if (path === "ui-containers-local") {
          component = import("egov-rti/ui-containers-local");
        }
        break;
        case "egov-integration":
          if (path === "ui-atoms-local") {
            component = import("egov-integration/ui-atoms-local");
          } else if (path === "ui-molecules-local") {
            component = import("egov-integration/ui-molecules-local");
          } else if (path === "ui-containers-local") {
            component = import("egov-integration/ui-containers-local");
          }
          break;
      case "egov-services":
      if (path === "ui-atoms-local") {
        component = import("egov-services/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-services/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-services/ui-containers-local");
      }
      break;
    default:
      break;
  }
  return component;
};

export default remoteComponentPath;
