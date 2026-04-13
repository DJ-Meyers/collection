import { Card } from './Card';

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
        {title}
      </h2>
      {children}
    </Card>
  );
}
