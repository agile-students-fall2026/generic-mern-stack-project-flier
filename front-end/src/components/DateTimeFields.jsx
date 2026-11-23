const labelClass = "flex flex-col feature-copy text-(--soft-black) gap-2";
const inputClass = "w-full rounded-2xl px-4 py-3 bg-(--paper) inset-shadow-sm shadow-md body-copy";

function PickerField({ label, type, value, onChange }) {
  return (
    <label className={labelClass}>
      {label}*
      <span className="relative block min-w-0">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          required
        />
      </span>
    </label>
  );
}

export default function DateTimeFields({ date, time, onDateChange, onTimeChange }) {
  return (
    <div className="flex flex-row justify-between">
      <PickerField label="Date" type="date" value={date} onChange={onDateChange} />
      <PickerField label="Time" type="time" value={time} onChange={onTimeChange} />
    </div>
  );
}
