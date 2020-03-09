import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import {
  Moon,
  Command,
  Activity,
  Globe,
  Link2,
  Settings,
  File
} from 'react-feather';

import { connect } from './StateProvider';
import { switchTheme } from '../store/app';

import SvgYacd from './SvgYacd';
import s from './SideBar.module.css';

const { useCallback } = React;

const icons = {
  activity: Activity,
  globe: Globe,
  command: Command,
  file: File,
  settings: Settings,
  link: Link2
};

const SideBarRow = React.memo(function SideBarRow({
  isActive,
  to,
  iconId,
  labelText
}) {
  const Comp = icons[iconId];
  const className = cx(s.row, isActive ? s.rowActive : null);
  return (
    <Link to={to} className={className}>
      <Comp />
      <div className={s.label}>{labelText}</div>
    </Link>
  );
});

SideBarRow.propTypes = {
  isActive: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  iconId: PropTypes.string,
  labelText: PropTypes.string
};

const pages = [
  {
    to: '/',
    iconId: 'activity',
    labelText: 'Overview'
  },
  {
    to: '/proxies',
    iconId: 'globe',
    labelText: 'Proxies'
  },
  {
    to: '/rules',
    iconId: 'command',
    labelText: 'Rules'
  },

  {
    to: '/connections',
    iconId: 'link',
    labelText: 'Conns'
  },
  {
    to: '/configs',
    iconId: 'settings',
    labelText: 'Config'
  },
  {
    to: '/logs',
    iconId: 'file',
    labelText: 'Logs'
  }
];

function SideBar({ dispatch }) {
  const location = useLocation();
  const switchThemeHooked = useCallback(() => {
    dispatch(switchTheme());
  }, [dispatch]);
  let { t } = useTranslation();
  return (
    <div className={s.root}>
      <a
        href="https://github.com/KevinWee/yacd"
        className={s.logoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={s.logo}>
          <SvgYacd width={80} height={80} />
        </div>
      </a>

      <div className={s.rows}>
        {pages.map(({ to, iconId, labelText }) => (
          <SideBarRow
            key={to}
            to={to}
            isActive={location.pathname === to}
            iconId={iconId}
            labelText={t(labelText)}
          />
        ))}
      </div>
      <div className={s.themeSwitchContainer} onClick={switchThemeHooked}>
        <Moon size={20} />
      </div>
    </div>
  );
}

// SideBar.propTypes = {
//   location: PropTypes.shape({
//     pathname: PropTypes.string
//   }).isRequired
// };

const mapState = () => null;
export default connect(mapState)(SideBar);
