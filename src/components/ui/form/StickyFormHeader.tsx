import { Button } from "../Button";

export function StickyFormHeader({
  title,
  formId,
  submitLabel,
  onCancel,
}: {
  title: string;
  formId: string;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-2">
        <Button type="button" rank="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form={formId}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
