import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const CustomTabContainer = Loadable({
  loader: () => import("./CustomTabContainer"),
  loading: () => <Loading />
});
const LabelContainer = Loadable({
  loader: () => import("./LabelContainer"),
  loading: () => <Loading />
});

const CheckboxContainer = Loadable({
  loader: () => import("./CheckboxContainer"),
  loading: () => <Loading />
});
const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});
const EstimateCardContainer = Loadable({
  loader: () => import("./EstimateCardContainer"),
  loading: () => <Loading />
});
const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});
const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});
const PaymentRedirectPage = Loadable({
  loader: () => import("./PaymentRedirectPage"),
  loading: () => <Loading />
});

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});
const ApproveContainer = Loadable({
  loader: () => import("./ApproveContainer"),
  loading: () => <Loading />
});
const RejectContainer = Loadable({
  loader: () => import("./RejectContainer"),
  loading: () => <Loading />
});
const ReassignContainer = Loadable({
  loader: () => import("./ReassignContainer"),
  loading: () => <Loading />
});
const ForwardContainer = Loadable({
  loader: () => import("./ForwardContainer"),
  loading: () => <Loading />
});
const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});
const UnderTakingContainer = Loadable({
  loader: () => import("./UnderTakingContainer"),
  loading: () => <Loading />
});

const DynamicTableContainer = Loadable({
  loader: () => import("./DynamicTableContainer"),
  loading: () => <Loading />
})
const MultiItem = Loadable({
  loader: () => import("./MultiItem"),
  loading: () => <Loading />
});

const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
})
const InventoryContainer = Loadable({
  loader: () => import("./InventoryContainer"),
  loading: () => <Loading />
})
//EofficestatContainer
const EofficestatContainer = Loadable({
  loader: () => import("./EofficestatContainer"),
  loading: () => <Loading />
})
//Payslip
const PayslipContainer = Loadable({
  loader: () => import("./PayslipContainer"),
  loading: () => <Loading />
})
export {
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  EstimateCardContainer,
  AutosuggestContainer,
  DocumentListContainer,
  PaymentRedirectPage,
  ViewBreakupContainer,
  DialogContainer,
  ApproveContainer,
  RejectContainer,
  ReassignContainer,
  ForwardContainer,
  UnderTakingContainer,
  DynamicTableContainer,
  MultiItem,
  WorkFlowContainer,
  InventoryContainer,
  EofficestatContainer,
  PayslipContainer
};
