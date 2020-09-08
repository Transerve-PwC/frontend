import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css"
import { gotoApplyWithStep,gotoApplyWithStepPressNote } from "../../utils/index";

export const documentsEventSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Event Documents",
          labelKey: "PR_EVENT_DOCUMENTS"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "event-added-documents"
    }
  }
});
export const documentsPressNoteSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Documents",
          labelKey: "NOC_SUMMARY_DOCUMENTS_HEADER﻿"
        })
      },
     
    }
  },
  
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "press-added-documents"
    }
  }
});
export const documentslibrarySummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Uploaded library Documents",
          labelKey: "PR_UPLOADED_COMMUNICATION_DOCUMENTS"
        })
      },
      
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview1",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview1",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});


export const documentsSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Documents",
         labelKey: "PR_SUMMARY_DOCUMENTS_HEADER"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});

export const documentslibrarySummary1 = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Uploaded library Documents",
          labelKey: "PR_UPLOADED_PRESS_NOTES_DOCUMENTS"
        })
      },
      
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview2",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview2",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});
export const documentslibrarySummary2 = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Uploaded library Documents",
          labelKey: "PR_UPLOADED_ADVERTISEMENTS_DOCUMENTS"
        })
      },
      
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview3",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview3",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});
export const documentslibrarySummary3 = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Uploaded library Documents",
          labelKey: "PR_UPLOADED_NEWS_CLIPPINGS_DOCUMENTS"
        })
      },
      
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview4",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview4",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});
export const documentslibrarySummary4 = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Uploaded library Documents",
          labelKey: "PR_UPLOADED_PHOTO_GALLERY_DOCUMENTS"
        })
      },
      
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview5",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview5",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});
export const documentslibrarySummary5 = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Uploaded library Documents",
          labelKey: "PR_UPLOADED_AUDIO_VISUALS_DOCUMENTS"
        })
      },
      
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PR_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadDeleteFileContainer",
    props: {
      sourceJsonPath: "documentsPreview6",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('libraryFirstRole')],
   }
  },
  body1: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "documentsPreview6",
      className: "pr-review-documents"
    },
	 roleDefination: {
      rolePath: "user-info.roles",
      roles: [localStorage.getItem('librarySecondRole')],
   }
  },
});