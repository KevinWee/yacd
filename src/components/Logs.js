import cx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { areEqual, FixedSizeList as List } from 'react-window';

import { fetchLogs } from '../api/logs';
import useRemainingViewPortHeight from '../hooks/useRemainingViewPortHeight';
import { getClashAPIConfig } from '../store/app';
import { getLogLevel } from '../store/configs';
import { appendLog, getLogsForDisplay } from '../store/logs';
import ContentHeader from './ContentHeader';
import s0 from './Logs.module.css';
import LogSearch from './LogSearch';
import { connect } from './StateProvider';
// import { useStoreState, useActions } from '../misc/store';
import SvgYacd from './SvgYacd';

const { useCallback, memo, useEffect } = React;

const paddingBottom = 30;
const colors = {
  debug: 'none',
  // debug: '#8a8a8a',
  info: '#454545',
  // info: '#147d14',
  warning: '#b99105',
  error: '#c11c1c',
};
const listRef = React.createRef();

function LogLine({ time, even, payload, type }) {
  const className = cx({ even }, s0.log);
  return (
    <div className={className}>
      <div className={s0.logMeta}>
        <div className={s0.logTime}>{time}</div>
        <div className={s0.logType} style={{ backgroundColor: colors[type] }}>
          {type}
        </div>
        <div className={s0.logText}>{payload}</div>
      </div>
    </div>
  );
}

LogLine.propTypes = {
  time: PropTypes.string,
  even: PropTypes.bool,
  payload: PropTypes.string,
  type: PropTypes.string,
};

function itemKey(index, data) {
  const item = data[index];
  return item.id;
}

const Row = memo(({ index, style, data }) => {
  const r = data[index];
  return (
    <div style={style}>
      <LogLine {...r} />
    </div>
  );
}, areEqual);

function Logs({ dispatch, logLevel, apiConfig, logs }) {
  const { hostname, port, secret } = apiConfig;
  const appendLogInternal = useCallback(
    (log) => {
      dispatch(appendLog(log));
    },
    [dispatch]
  );
  useEffect(() => {
    fetchLogs({ hostname, port, secret, logLevel }, appendLogInternal);
  }, [hostname, port, secret, logLevel, appendLogInternal]);
  const [refLogsContainer, containerHeight] = useRemainingViewPortHeight();
  let { t } = useTranslation();
  if (listRef.current) {
    setTimeout(() => {
      listRef.current.scrollToItem(logs.length);
    }, 100);
  }
  return (
    <div>
      <ContentHeader title={t('Logs')} />
      <LogSearch />
      <div ref={refLogsContainer} style={{ paddingBottom }}>
        {logs.length === 0 ? (
          <div
            className={s0.logPlaceholder}
            style={{ height: containerHeight - paddingBottom }}
          >
            <div className={s0.logPlaceholderIcon}>
              <SvgYacd width={200} height={200} />
            </div>
            <div>{t('No logs yet')}</div>
          </div>
        ) : (
          <div className={s0.logsWrapper}>
            <List
              ref={listRef}
              height={containerHeight - paddingBottom}
              width="100%"
              itemCount={logs.length}
              itemSize={80}
              itemData={logs}
              itemKey={itemKey}
            >
              {Row}
            </List>
          </div>
        )}
      </div>
    </div>
  );
}

const mapState = (s) => ({
  logs: getLogsForDisplay(s),
  logLevel: getLogLevel(s),
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(Logs);
