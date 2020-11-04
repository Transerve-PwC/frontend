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

const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});
const ResubmitActionContainer = Loadable({
  loader: () => import("./ResubmitActionContainer"),
  loading: () => <Loading />
});

const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
})

const ExpansionPanelContainer = Loadable({
  loader: () => import("./ExpansionPanelContainer"),
  loading: () => <Loading />
})

const MultipleDocumentsContainer = Loadable({
  loader: () => import("./MultipleDocumentsContainer"),
  loading: () => <Loading/>
})

const NestedListContainer = Loadable({
  loader: () => import("./NestedListContainer"),
  loading: () => <Loading/>
})

const MultipleCardContainer = Loadable({
  loader: () => import("./MultipleCardContainer"),
  loading: () => <Loading/>
})

const MultiSelectContainer = Loadable({
  loader: () => import("./MultiSelectContainer"),
  loading: () => <Loading/>
})

const RentSummaryCardContainer = Loadable({
  loader: () => import("./RentSummaryCardContainer"),
  loading: () => <Loading/>
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
  ResubmitActionContainer,
  WorkFlowContainer,
  ExpansionPanelContainer,
  MultipleDocumentsContainer,
  NestedListContainer,
  MultipleCardContainer,
  MultiSelectContainer,
  RentSummaryCardContainer
};
