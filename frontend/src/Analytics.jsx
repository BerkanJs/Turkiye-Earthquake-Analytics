import React from "react";
import RegionModal from "./RegionModal";
import TimeSeriesModal from "./TimeSeriesModal";
import HistogramModal from "./HistogramModal";

import MagnitudeOverTimeModal from "./MagnitudeOverTimeModal";
export default function Analytics({ activeChart, onClose, data }) {
  if (!activeChart) return null;

  switch (activeChart) {
    case "count-by-region":
      return <RegionModal visible={true} onClose={onClose} data={data} />;
    case "mag-over-time":
      return <TimeSeriesModal visible={true} onClose={onClose} data={data} />;
    case "depth-histogram":
      return <HistogramModal visible={true} onClose={onClose} data={data} />;
    case "scatter-plot":
      return <MagnitudeOverTimeModal visible={true} onClose={onClose} data={data} />;
    default:
      return null;
  }
}
