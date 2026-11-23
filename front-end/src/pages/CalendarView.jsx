import { useState } from "react";
import FlyerCarousel from "../components/FlyerCarousel";
import { useFlyers } from "../hooks/useFlyers";
import chevronLeft from "../assets/chevron-left-40px-black.svg";
import chevronRight from "../assets/chevron-right-40px-black.svg";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function eventDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function dayLabel(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const today = startOfDay(new Date());

function calendarCells(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const leadingBlanks = new Date(year, month, 1).getDay();
  const dayCount = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: leadingBlanks }, () => null);
  for (let day = 1; day <= dayCount; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

export default function CalendarView() {
  const { flyers, loading, error } = useFlyers();
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState(today);
  const selectedKey = eventDateKey(selected);
  const events = flyers.filter((flyer) => eventDateKey(flyer.starts_at) === selectedKey);

  function shiftMonth(delta) {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + delta, 1);
    const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const day = Math.min(selected.getDate(), lastDay);
    setVisibleMonth(nextMonth);
    setSelected(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day));
  }

  return (
    <section className="flex flex-col h-full bg-(--parchment) text-(--soft-black) rounded-4xl inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {/* Calendar */}
        <div className="p-8 gap-2 flex flex-col">
          {/* Month and Switch Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              className="flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
            >
              <img src={chevronLeft} alt="" aria-hidden="true" />
            </button>
            <h1 className="heading text-center">
              {monthLabel(visibleMonth)}
            </h1>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
            >
              <img src={chevronRight} alt="" aria-hidden="true" />
            </button>
          </div>

          {/* Weekdays and Dates */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row text-center">
              {WEEKDAYS.map((weekday) => (
                <div key={weekday} className="basis-[14.2857%] feature-copy text-(--soft-black)/60">
                  {weekday}
                </div>
              ))}
            </div>
            <div className="flex flex-row flex-wrap text-center">
              {calendarCells(visibleMonth).map((date, index) => {
                if (!date) {
                  return <div key={`blank-${index}`} className="basis-[14.2857%] grow-0 shrink-0" />;
                }
                const isSelected = eventDateKey(date) === selectedKey;
                return (
                  <div key={eventDateKey(date)} className="basis-[14.2857%] grow-0 shrink-0 py-1">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={dayLabel(date)}
                      onClick={() => setSelected(date)}
                      className={`mx-auto flex size-10 items-center justify-center rounded-full feature-copy ${
                        isSelected ? "bg-(--nyu-indigo) text-(--paper)" : ""
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Flyer display */}
        <div className="flex flex-col bg-(--nyu-indigo) text-(--paper) p-8 gap-2 h-full pb-28">
          <h2 className="heading">{dayLabel(selected)}</h2>
          <FlyerCarousel category="calendar" flyers={events} loading={loading} error={error} />
        </div>
      </div>
    </section>
  );
}
