const screenConfig = {
    uiFramework: "material-ui",
    name: "PaymentRedirectPage",

    components: {
      div: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-rented-properties",
        componentPath: "PaymentRedirectPage",
        props: {
          className: "payment-redirect-page"
        }
      }
    }
  };

  export default screenConfig;