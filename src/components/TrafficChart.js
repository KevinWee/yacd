import React, { useMemo } from 'react';
import { fetchData } from '../api/traffic';
import useLineChart from '../hooks/useLineChart';
import { useTranslation } from 'react-i18next';
import {
  chartJSResource,
  chartStyles,
  commonDataSetProps
} from '../misc/chart';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../store/app';
import { connect } from './StateProvider';

const chartWrapperStyle = {
  // make chartjs chart responsive
  position: 'relative',
  maxWidth: 1000
};

const mapState = s => ({
  apiConfig: getClashAPIConfig(s),
  selectedChartStyleIndex: getSelectedChartStyleIndex(s)
});

export default connect(mapState)(TrafficChart);

function TrafficChart({ apiConfig, selectedChartStyleIndex }) {
  const Chart = chartJSResource.read();
  const { hostname, port, secret } = apiConfig;
  const traffic = fetchData({ hostname, port, secret });
  const { t } = useTranslation();
  const data = useMemo(
    () => ({
      labels: traffic.labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].up,
          label: t('Upload'),
          data: traffic.up
        },
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].down,
          label: t('Download'),
          data: traffic.down
        }
      ]
    }),
    [traffic, selectedChartStyleIndex, t]
  );

  useLineChart(Chart, 'trafficChart', data, traffic);

  return (
    <div style={chartWrapperStyle}>
      <canvas id="trafficChart" />
    </div>
  );
}
