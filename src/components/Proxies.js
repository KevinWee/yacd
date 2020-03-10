import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useStoreActions } from './StateProvider';
import { getConfigs } from '../store/configs';

import ContentHeader from './ContentHeader';
import ProxyGroup from './ProxyGroup';
import { Zap, Filter, Circle } from 'react-feather';

import ProxyProviderList from './ProxyProviderList';
import { Fab, Action } from 'react-tiny-fab';

import './rtf.css';
import s0 from './Proxies.module.css';

import {
  getDelay,
  getRtFilterSwitch,
  getProxyGroupNames,
  getProxyProviders,
  fetchProxies,
  requestDelayAll
} from '../store/proxies';
import { getClashAPIConfig } from '../store/app';

const { useEffect, useCallback, useRef } = React;

function Proxies({
  dispatch,
  groupNames,
  delay,
  proxyProviders,
  apiConfig,
  filterZeroRT,
  mode
}) {
  const refFetchedTimestamp = useRef({});
  const { toggleUnavailableProxiesFilter } = useStoreActions();
  const requestDelayAllFn = useCallback(
    () => dispatch(requestDelayAll(apiConfig)),
    [apiConfig, dispatch]
  );

  const fetchProxiesHooked = useCallback(() => {
    refFetchedTimestamp.current.startAt = new Date();
    dispatch(fetchProxies(apiConfig)).then(() => {
      refFetchedTimestamp.current.completeAt = new Date();
    });
  }, [apiConfig, dispatch]);
  useEffect(() => {
    // fetch it now
    fetchProxiesHooked();

    // arm a window on focus listener to refresh it
    const fn = () => {
      if (
        refFetchedTimestamp.current.startAt &&
        new Date() - refFetchedTimestamp.current.startAt > 3e4 // 30s
      ) {
        fetchProxiesHooked();
      }
    };
    window.addEventListener('focus', fn, false);
    return () => window.removeEventListener('focus', fn, false);
  }, [fetchProxiesHooked]);
  let { t } = useTranslation();
  let groupNamesMod = [];
  Object.assign(groupNamesMod, groupNames);
  if (mode === 'Rule' || mode === 'Direct') {
    let index = groupNamesMod.indexOf('GLOBAL');
    if (index > -1) {
      groupNamesMod.splice(index, 1);
    }
  } else {
    let index = groupNamesMod.indexOf('GLOBAL');
    if (index > -1) {
      groupNamesMod.splice(0, index);
      groupNamesMod.splice(index, index + 1);
    }
  }
  return (
    <>
      <ContentHeader title={t('Proxies')} />
      <div>
        {groupNamesMod.map(groupName => {
          return (
            <div className={s0.group} key={groupName}>
              <ProxyGroup
                name={groupName}
                delay={delay}
                apiConfig={apiConfig}
                dispatch={dispatch}
              />
            </div>
          );
        })}
      </div>
      <ProxyProviderList items={proxyProviders} />
      <div style={{ height: 60 }} />
      <Fab icon={<Circle />}>
        <Action text={t('Test Latency')} onClick={requestDelayAllFn}>
          <Zap width={16} />
        </Action>
        <Action
          text={
            (filterZeroRT ? t('Show') : t('Hide')) + t(' Unavailable Proxies')
          }
          onClick={toggleUnavailableProxiesFilter}
        >
          <Filter width={16} />
        </Action>
      </Fab>
    </>
  );
}

const mapState = s => ({
  apiConfig: getClashAPIConfig(s),
  groupNames: getProxyGroupNames(s),
  proxyProviders: getProxyProviders(s),
  delay: getDelay(s),
  filterZeroRT: getRtFilterSwitch(s),
  mode: getConfigs(s).mode
});

export default connect(mapState)(Proxies);
