"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import CalendarPicker from "./components/CalendarPicker";
import { useFY } from "@/hooks/useFY";

interface CalendarProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange?: (value: string) => void; // Returns ISO date string
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  dateRangeMode?: boolean;
  showToday?: boolean;
  showTooltip?: boolean;
  minDate?: string; // ISO date string
  maxDate?: string; // ISO date string
  className?: string;
  required?: boolean;
  showIcon?: boolean;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onReset?: () => void;
  hideInput?: boolean;
  isOpen?: boolean;
  calendarClassName?: string;
  showQuickSelect?: boolean;
  quickSelectRanges?: Array<{ label: string; value: string }>;
  onQuickSelect?: (rangeType: string) => void;
  activeRange?: string;
  referenceElement?: HTMLElement | null;
  onClose?: () => void;
}

export interface CalendarRef {
  reset: () => void;
  open: () => void;
}

const CalendarInput = forwardRef<CalendarRef, CalendarProps>((props, ref) => {
  const { isBS } = useFY();
  const { error } = props;

  const handleChange = (value: string) => {
    if (props.onChange) {
      if (isBS) {
        // For BS calendar, add Nepal time to avoid timezone issues
        try {
          const parsed = JSON.parse(value);
          const dateStr = parsed.ad || value;
          const nepalTimeDate = dateStr + "T12:00:00+05:45";
          props.onChange(nepalTimeDate);
        } catch {
          const nepalTimeDate = value + "T12:00:00+05:45";
          props.onChange(nepalTimeDate);
        }
      } else {
        // For AD calendar, use date as-is without timezone conversion
        props.onChange(value);
      }
    }
  };

  const datePickerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      datePickerRef.current?.reset();
      props.onReset?.();
    },
    open: () => {
      datePickerRef.current?.open();
    },
  }));

  return (
    <div>
      <CalendarPicker
        {...props}
        ref={datePickerRef}
        onChange={handleChange}
        required
        calendarType={isBS ? "BS" : "AD"}
        returnFormat="iso"
        dateFormat={isBS ? "YYYY-MM-DD" : "MM/DD/YYYY"}
        className={props.className || "w-full"}
        hideInput={props.hideInput}
        isOpen={props.isOpen}
        calendarClassName={props.calendarClassName}
        showQuickSelect={props.showQuickSelect}
        quickSelectRanges={props.quickSelectRanges}
        onQuickSelect={props.onQuickSelect}
        activeRange={props.activeRange}
        referenceElement={props.referenceElement}
        onClose={props.onClose}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

CalendarInput.displayName = "CalendarInput";

export default CalendarInput;
