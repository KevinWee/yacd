import * as React from 'react';
import { useTranslation } from 'react-i18next';

import s from './Select.module.css';

type Props = {
  options: Array<string[]>;
  selected: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
};

export default function Select({ options, selected, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <select className={s.select} value={selected} onChange={onChange}>
      {options.map(([value, name]) => (
        <option key={value} value={value}>
          {t(name)}
        </option>
      ))}
    </select>
  );
}
