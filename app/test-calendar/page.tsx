"use client";

import { useState } from "react";
import { Calendar, DatePicker, PRESET_KEYS } from "bs-ad-calendar-react";
import type { DateOutput, DateRangeOutput } from "bs-ad-calendar-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Output({ value }: { value: unknown }) {
  if (!value) return <p className="text-xs text-slate-600 italic">No selection yet</p>;
  return (
    <pre className="text-xs text-green-400 bg-slate-900 rounded-lg p-3 overflow-auto whitespace-pre-wrap break-all">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default function TestCalendarPage() {
  const [singleBS, setSingleBS] = useState<DateOutput | null>(null);
  const [singleAD, setSingleAD] = useState<DateOutput | null>(null);
  const [rangeBS, setRangeBS] = useState<DateRangeOutput | null>(null);
  const [rangePresets, setRangePresets] = useState<DateRangeOutput | null>(null);
  const [pickerBS, setPickerBS] = useState<DateOutput | null>(null);
  const [pickerAD, setPickerAD] = useState<DateOutput | null>(null);
  const [nepali, setNepali] = useState<DateOutput | null>(null);
  const [constrained, setConstrained] = useState<DateOutput | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">bs-ad-calendar-react — Test Page</h1>
          <p className="text-slate-400 text-sm mt-1">
            Testing all features · Branch:{" "}
            <code className="text-blue-400">test/bs-ad-calendar-react</code>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* 1. BS Single */}
          <Section title="1. Calendar — BS single">
            <Calendar calendarType="BS" onDateSelect={setSingleBS} />
            <Output value={singleBS} />
          </Section>

          {/* 2. AD Single */}
          <Section title="2. Calendar — AD single">
            <Calendar calendarType="AD" onDateSelect={setSingleAD} />
            <Output value={singleAD} />
          </Section>

          {/* 3. BS Range */}
          <Section title="3. Calendar — BS range">
            <Calendar calendarType="BS" mode="range" onRangeSelect={setRangeBS} />
            <Output value={rangeBS} />
          </Section>

          {/* 4. Range + Presets */}
          <Section title="4. Calendar — range + presets">
            <Calendar
              calendarType="BS"
              mode="range"
              showRangePresets
              rangePresetsPosition="top"
              presetKeys={[
                PRESET_KEYS.TODAY,
                PRESET_KEYS.THIS_WEEK,
                PRESET_KEYS.LAST_7_DAYS,
                PRESET_KEYS.THIS_MONTH,
                PRESET_KEYS.LAST_MONTH,
                PRESET_KEYS.LAST_3_MONTHS,
                PRESET_KEYS.LAST_YEAR,
              ]}
              onRangeSelect={setRangePresets}
            />
            <Output value={rangePresets} />
          </Section>

          {/* 5. DatePicker BS */}
          <Section title="5. DatePicker — BS">
            <DatePicker
              calendarType="BS"
              placeholder="Select BS date"
              inputClassName="w-full h-10 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm"
              onDateSelect={setPickerBS}
            />
            <Output value={pickerBS} />
          </Section>

          {/* 6. DatePicker AD */}
          <Section title="6. DatePicker — AD">
            <DatePicker
              calendarType="AD"
              placeholder="Select AD date"
              inputClassName="w-full h-10 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm"
              onDateSelect={setPickerAD}
            />
            <Output value={pickerAD} />
          </Section>

          {/* 7. Nepali localization */}
          <Section title="7. Nepali localization">
            <Calendar
              calendarType="BS"
              showNepaliMonths
              showNepaliDays
              showNepaliNumbers
              onDateSelect={setNepali}
            />
            <Output value={nepali} />
          </Section>

          {/* 8. Date constraints */}
          <Section title="8. Date constraints (minDate / maxDate)">
            <Calendar
              calendarType="AD"
              minDate="2024-01-01"
              maxDate="2025-12-31"
              onDateSelect={setConstrained}
            />
            <Output value={constrained} />
          </Section>

          {/* 9. Disabled */}
          <Section title="9. Disabled state">
            <Calendar calendarType="BS" disabled onDateSelect={() => {}} />
            <p className="text-xs text-slate-500">No interaction should be possible.</p>
          </Section>

          {/* 10. Custom colors */}
          <Section title="10. Custom colors">
            <Calendar
              calendarType="BS"
              colors={{ primary: "#10b981", selected: "#059669", today: "#d1fae5" }}
              onDateSelect={() => {}}
            />
          </Section>

          {/* 11. Range presets left */}
          <Section title="11. Range presets — left position">
            <Calendar
              calendarType="BS"
              mode="range"
              showRangePresets
              rangePresetsPosition="left"
              presetKeys={[
                PRESET_KEYS.LAST_7_DAYS,
                PRESET_KEYS.LAST_30_DAYS,
                PRESET_KEYS.THIS_MONTH,
                PRESET_KEYS.LAST_MONTH,
              ]}
              onRangeSelect={() => {}}
            />
          </Section>

          {/* 12. Custom preset labels */}
          <Section title="12. Custom preset labels">
            <Calendar
              calendarType="BS"
              mode="range"
              showRangePresets
              presetKeys={[PRESET_KEYS.LAST_7_DAYS, PRESET_KEYS.THIS_MONTH]}
              presetLabels={{
                [PRESET_KEYS.LAST_7_DAYS]: "पछिल्लो ७ दिन",
                [PRESET_KEYS.THIS_MONTH]: "यो महिना",
              }}
              onRangeSelect={() => {}}
            />
          </Section>

        </div>
      </div>
    </div>
  );
}
