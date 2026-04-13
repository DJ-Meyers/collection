import { useMemo } from 'react';
import { GAME_LOCATIONS } from '../../../data/constants';
import { SelectField, type SelectOption } from './SelectField';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function LocationSelect({
  value,
  onChange,
  label = 'Current Location',
  placeholder,
  disabled,
  error,
}: LocationSelectProps) {
  const options: SelectOption[] = useMemo(
    () => GAME_LOCATIONS.map((g) => ({ value: g.name, label: g.name, image: g.boxArt })),
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
    />
  );
}
