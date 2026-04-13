import { useMemo } from 'react';
import { ORIGIN_MARKS } from '../../../data/constants';
import { SelectField, type SelectOption } from './SelectField';

interface OriginSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function OriginSelect({
  value,
  onChange,
  label = 'Origin Mark',
  placeholder,
  disabled,
  error,
}: OriginSelectProps) {
  const options: SelectOption[] = useMemo(
    () => ORIGIN_MARKS.map((m) => ({ value: m.value, label: m.label, image: m.sprite })),
    [],
  );

  return (
    <SelectField
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      imageClassName="rounded-full bg-gray-700 p-0.5"
    />
  );
}
