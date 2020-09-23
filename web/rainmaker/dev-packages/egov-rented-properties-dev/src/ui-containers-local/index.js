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
const DownloadFileContainerNotice = Loadable({
  loader: () => import("./DownloadFileContainerNotice"),
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

const ResubmitActionContainer = Loadable({
  loader: () => import("./ResubmitActionContainer"),
  loading: () => <Loading />
});

const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
})

const MultipleOwnerContainer = Loadable({
  loader: () => import("./MultipleOwnerContainer"),
  loading: () => <Loading/>
})

const MultipleDocumentsContainer = Loadable({
  loader: () => import("./MultipleDocumentsContainer"),
  loading: () => <Loading/>
})

const RentSummaryCardContainer = Loadable({
  loader: () => import("./RentSummaryCardContainer"),
  loading: () => <Loading />
});

export {
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  DownloadFileContainerNotice,
  EstimateCardContainer,
  AutosuggestContainer,
  DocumentListContainer,
  PaymentRedirectPage,
  DialogContainer,
  ResubmitActionContainer,
  WorkFlowContainer,
  MultipleOwnerContainer,
  MultipleDocumentsContainer,
  RentSummaryCardContainer
};
