import { useEffect, useRef, useState } from "react";
import caratDown from "../assets/carat-down-40px-black.svg";
import checkmark from "../assets/check-40px-black.svg";

/* 
 * Renders a custom dropdown for a form field. Parameters are outlined below.
 * label: The name used for accessibility tagging.
 * options: Available choices shaped like {value, label}.
 * value: The current user's selection(s). String for single-select, array of strings for multi-select.
 * onChange: Ensures that inputs are updated correctly to send to the backend.
 * placeholder: Text placeholder when there are no selections made.
 * multiple: Controls the ability to choose multiple options in a dropdown.
 * fieldLabel: Visible text for the dropdown.
*/
export default function CustomDropdown({ label, options, value, onChange, placeholder, multiple = false, fieldLabel }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Normalize user selections to always treat them as arrays
  const selectedValues = multiple ? value : [value];
  // Get the display text for the selected options (necessary for organizations in case IDs are read)
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!dropdownRef.current?.contains(event.target)) {setOpen(false);}
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function selectOption(optionValue) {
    if (multiple) {
      onChange(value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue]);
    } else {
      onChange(optionValue);
      setOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="feature-copy text-(--soft-black)">{fieldLabel}</p>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          aria-label={`${label}: ${selectedLabels.join(", ") || placeholder}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {setOpen(false);}
          }}
          className="flex w-full items-center justify-between rounded-2xl bg-(--paper) px-4 py-3 body-copy inset-shadow-sm shadow-md"
        >
          <span className={selectedLabels.length ? "" : "text-(--soft-black)/50"}>
            {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
          </span>
          <img
            src={caratDown}
            alt=""
            aria-hidden="true"
            className={`size-6 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-label={label}
            aria-multiselectable={multiple || undefined}
            onKeyDown={(event) => {
              if (event.key === "Escape") {setOpen(false);}
            }}
            className="absolute z-20 mt-2 max-h-60 w-full overflow-scroll rounded-2xl bg-(--paper) p-2 shadow-md"
          >
            {options.map((option) => {
              const selected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectOption(option.value)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2 body-copy hover:bg-(--parchment) text-left`}
                >
                  {option.label}
                  {selected && <img src={checkmark} className="size-6" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
