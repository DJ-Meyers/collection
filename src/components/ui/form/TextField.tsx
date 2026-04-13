import { inputClass, labelClass, errorClass } from './styles';

type TextFieldProps = {
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
} & (
  | {
      type?: 'text';
      value: string | null;
      onChange: (value: string | null) => void;
    }
  | {
      type: 'number';
      value: number | null;
      onChange: (value: number | null) => void;
      min?: number;
      max?: number;
    }
);

export function TextField(props: TextFieldProps) {
  const { label, required, placeholder, disabled, error } = props;

  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {props.type === 'number' ? (
        <input
          type="number"
          min={props.min}
          max={props.max}
          className={inputClass + (disabled ? ' disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed' : '')}
          value={props.value ?? ''}
          onChange={(e) => props.onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type="text"
          className={inputClass + (disabled ? ' disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed' : '')}
          value={props.value ?? ''}
          onChange={(e) => props.onChange(e.target.value || null)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
