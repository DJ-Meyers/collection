import { useMemo } from 'react';
import { POKE_BALLS } from '../../../data/constants';
import { getBallSpriteUrl } from '../../../data/pokemon-dex';
import { SelectField, type SelectOption } from './SelectField';

interface BallSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function BallSelect({
  value,
  onChange,
  label = 'Ball',
  placeholder,
  disabled,
  error,
}: BallSelectProps) {
  const options: SelectOption[] = useMemo(
    () => POKE_BALLS.map((b) => ({ value: b, label: b, image: getBallSpriteUrl(b) })),
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
