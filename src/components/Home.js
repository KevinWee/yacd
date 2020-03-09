import React, { Suspense } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ContentHeader from './ContentHeader';
import TrafficChart from './TrafficChart';
import TrafficNow from './TrafficNow';
import Loading from './Loading';
import s0 from './Home.module.css';

export default function Home() {
  let { t } = useTranslation();
  return (
    <div>
      <ContentHeader title={t('Overview')} />
      <div className={s0.root}>
        <div>
          <TrafficNow />
        </div>
        <div className={s0.chart}>
          <Suspense fallback={<Loading height="200px" />}>
            <TrafficChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
