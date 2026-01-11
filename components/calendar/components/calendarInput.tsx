"use client";

import type React from "react";

import { forwardRef } from "react";
import { Calendar, X } from "lucide-react";

interface CalendarInputProps {
  value: string;
  placeholder?: string;
  disabled: boolean;
  label?: string;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  onCalendarClick: () => void;
  readOnly?: boolean;
  isRangeMode?: boolean;
  required: boolean;
  onClear?: () => void;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(
  (
    {
      value,
      placeholder,
      disabled,
      label,
      onKeyDown,
      onChange,
      onFocus,
      onClick,
      onCalendarClick,
      readOnly,
      isRangeMode,
      required,
      onClear,
      containerClassName,
      labelClassName,
      inputWrapperClassName,
      inputClassName,
      buttonClassName,
    },
    ref
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      // In range mode, block all keyboard input except calendar opening shortcuts
      if (isRangeMode) {
        // Only allow Alt+Down to open calendar and Escape to close
        if (event.key === "ArrowDown" && event.altKey) {
          onKeyDown(event);
          return;
        }
        if (event.key === "Escape") {
          onKeyDown(event);
          return;
        }
        // Block all other keys in range mode
        event.preventDefault();
        return;
      }

      // Normal keyboard handling for single date mode
      onKeyDown(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      // In range mode, immediately blur to prevent cursor
      if (isRangeMode) {
        event.target.blur();
        return;
      }
      onFocus(event);
    };

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      // In range mode, open calendar instead of focusing input
      if (isRangeMode) {
        event.preventDefault();
        onCalendarClick();
        return;
      }
      onClick(event);
    };

    return (
      <div className={containerClassName || "relative"}>
        {label && (
          <label
            htmlFor="calendar-input"
            className={
              labelClassName ||
              `mb-1 block text-sm font-medium text-gray-700 ${required ? "required" : ""}`
            }
          >
            {label}
          </label>
        )}

        <div
          className={
            inputWrapperClassName ||
            `flex h-10 w-full items-center rounded-md border bg-white text-left transition-all ${
              disabled
                ? "cursor-not-allowed bg-gray-50 text-gray-400"
                : "border-gray-200 hover:border-gray-300"
            }`
          }
        >
          <input
            id="calendar-input"
            ref={ref}
            type="text"
            value={value}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            onFocus={handleFocus}
            onClick={handleClick}
            readOnly={readOnly}
            tabIndex={isRangeMode ? -1 : 0}
            className={
              inputClassName ||
              `flex-1 bg-transparent px-3 py-2 text-sm outline-none ${
                readOnly || isRangeMode ? "cursor-pointer select-none" : ""
              }`
            }
            disabled={disabled}
            aria-describedby={label ? `${label}-description` : undefined}
          />
          <button
            type="button"
            onClick={isRangeMode && value ? onClear : onCalendarClick}
            className={
              buttonClassName ||
              "flex h-full w-10 items-center justify-center text-gray-400 hover:text-gray-600 focus:ring-0 focus:outline-none focus:ring-inset"
            }
            disabled={disabled}
            aria-label={
              isRangeMode && value ? "Clear selection" : "Open calendar"
            }
          >
            {isRangeMode && value ? (
              <X className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

CalendarInput.displayName = "CalendarInput";

export default CalendarInput;
