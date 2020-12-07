import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const RadioGroupWithIconContainer = Loadable({
  loader: () => import("./RadioGroupWithIconContainer"),
  loading: () => <Loading />
});
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
const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});
const SummaryDetailsContainer = Loadable({
  loader: () => import("./SummaryDetailsContainer"),
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

const MultiItemsWithImageContainer = Loadable({
  loader: () => import("./MultiItemsWithImageContainer"),
  loading: () => <Loading />
});
const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
});
const BookingCalenderContainer = Loadable({
  loader: () => import("./BookingCalenderContainer"),
  loading: () => <Loading />
});
const BookingMediaContainer = Loadable({
  loader: () => import("./BookingMediaContainer"),
  loading: () => <Loading />
});
const TextFieldContainerReadOnly = Loadable({
  loader: () => import("./TextFieldContainerReadOnly"),
  loading: () => <Loading />
});
const RefundAmountContainer = Loadable({
  loader: () => import("./RefundAmountContainer"),
  loading: () => <Loading />
});

const RefundFeeAmountContainer = Loadable({
  loader: () => import("./RefundFeeAmountContainer"),
  loading: () => <Loading />
});
const modifiedBookingPaymentCard = Loadable({
  loader: () => import("./modifiedBookingPaymentCard"),
  loading: () => <Loading />
});


export {
  RadioGroupWithIconContainer,
  TextFieldContainerReadOnly,
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  EstimateCardContainer,
  DocumentListContainer,
  SummaryDetailsContainer,
  PaymentRedirectPage,
  DialogContainer,
  MultiItemsWithImageContainer,
  WorkFlowContainer,
  BookingCalenderContainer,
  BookingMediaContainer,
  RefundAmountContainer,
  RefundFeeAmountContainer,
  modifiedBookingPaymentCard
};
