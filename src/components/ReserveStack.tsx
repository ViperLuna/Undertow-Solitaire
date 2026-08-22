import { CardBack } from "./Card";

interface ReserveStackProps {
  label: string;
  count: number;
}

export function ReserveStack({ label, count }: ReserveStackProps) {
  return (
    <div className="reserve-stack">
      {count > 0 ? <CardBack /> : <div className="card card--empty" />}
      <div className="reserve-stack__label">
        {label}
        <span className="reserve-stack__count">{count}</span>
      </div>
    </div>
  );
}
