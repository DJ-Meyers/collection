export function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-gray-900">
        {value != null && value !== '' ? value : (
          <span className="text-gray-400">--</span>
        )}
      </dd>
    </div>
  );
}
