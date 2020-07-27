import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTextInut } from 'src/hooks/useTextInput';

import { proxyFilterText } from '../../store/proxies';
import shared from '../shared.module.css';

export function TextFilter() {
  const [onChange, text] = useTextInut(proxyFilterText);
  const { t } = useTranslation();
  return (
    <input
      className={shared.input}
      type="text"
      value={text}
      placeholder={t("Filter")}
      onChange={onChange}
    />
  );
}
