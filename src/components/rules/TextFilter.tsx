import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTextInut } from 'src/hooks/useTextInput';
import { ruleFilterText } from 'src/store/rules';

import shared from '../shared.module.css';

export function TextFilter() {
  const [onChange, text] = useTextInut(ruleFilterText);
  const { t } = useTranslation();
  return (
    <input
      className={shared.input}
      type="text"
      value={text}
      onChange={onChange}
      placeholder={t("Filter")}
    />
  );
}
