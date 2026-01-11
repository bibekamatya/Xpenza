"use client";

import type React from "react";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import NepaliDate from "nepali-datetime";
import {
  nepaliMonths,
  englishMonths,
  bsEnglishMonths,
  englishDays,
  nepaliDays,
} from "@/components/calendar/utils/calendarMappedData";

import { type CalendarPickerProps, type DateInfo, type DateRange } from "@/lib/calendar";
import { colorVariants } from "@/lib/calendar";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getTodayDate,
  formatDateToString,
  parseDateFromString,
  getBSDateString,
  isDateBefore,
} from "../utils/calendarUtils";

import { useInputValidation } from "../hooks/useInputValidation";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useCalendarKeyboardNavigation } from "../hooks/useCalendarKeyboardNavigation";
import { useCalendarPosition } from "../hooks/useCalendarPosition";
import CalendarInput from "./calendarInput";
import { CalendarPortal } from "./CalendarPortal";
import { CalendarContent } from "./CalendarContent";

export interface DatePickerCalendarRef {
  reset: () => void;
  open: () => void;
}

const DatePickerCalendar = forwardRef<
  DatePickerCalendarRef,
  CalendarPickerProps
>(
  (
    {
      label,
      value,
      onChange,
      className = "",
      calendarType = "BS",
      showNepaliDays = false,
      showNepaliMonths = false,
      showTooltip = true,
      showToday = true,
      color = "teal",
      minDate,
      maxDate,
      disabled = false,
      placeholder,
      dateFormat,
      dateRangeMode = false,
      returnFormat = "iso",
      required = false,
      containerClassName,
      labelClassName,
      inputWrapperClassName,
      inputClassName,
      buttonClassName,
      hideInput,
      isOpen: externalIsOpen,
      calendarClassName,
      showQuickSelect,
      quickSelectRanges,
      onQuickSelect,
      activeRange,
      referenceElement,
      onClose,
      customPosition,
    },
    ref
  ) => {
    // Default date formats based on calendar type
    const defaultDateFormat =
      dateFormat || (calendarType === "BS" ? "YYYY-MM-DD" : "MM/DD/YYYY");

    const defaultPlaceholder =
      placeholder ||
      (dateRangeMode
        ? `${defaultDateFormat} - ${defaultDateFormat}`
        : defaultDateFormat);

    const todayDate = getTodayDate(calendarType);
    const [isOpen, setIsOpen] = useState(false);

    // Use external isOpen if provided
    const actualIsOpen = externalIsOpen !== undefined ? externalIsOpen : isOpen;
    const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
    const [selectedRange, setSelectedRange] = useState<DateRange>({
      start: null,
      end: null,
    });

    // Initialize with selected date if available, otherwise today
    const getInitialDate = () => {
      if (value) {
        if (dateRangeMode && value.includes(" - ")) {
          const [startDateStr] = value.split(" - ");
          const [year, month] = startDateStr.trim().split("-").map(Number);
          return { year, month: month - 1 };
        } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month] = value.split("-").map(Number);
          if (calendarType === "BS") {
            try {
              const bsDate = NepaliDate.fromEnglishDate(year, month - 1, 1);
              return { year: bsDate.getYear(), month: bsDate.getMonth() };
            } catch {
              return { year, month: month - 1 };
            }
          }
          return { year, month: month - 1 };
        }
      }
      return { year: todayDate.year, month: todayDate.month };
    };

    const initialDate = getInitialDate();
    const [currentYear, setCurrentYear] = useState(initialDate.year);
    const [currentMonth, setCurrentMonth] = useState(initialDate.month);
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [focusedDate, setFocusedDate] = useState<number | null>(null);
    const [focusedMonthIndex, setFocusedMonthIndex] = useState(0);
    const [focusedYearIndex, setFocusedYearIndex] = useState(6);
    const [isTyping, setIsTyping] = useState(false);

    const calendarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [yearRangeStart, setYearRangeStart] = useState(() => {
      // Initialize with current year roughly in the middle
      return Math.floor(todayDate.year / 10) * 10 - 2;
    });

    const handleYearRangeChange = useCallback((direction: number) => {
      setYearRangeStart(prev => prev + direction);
    }, []);

    const colors = colorVariants[color];
    const { validateAndFormatInput } = useInputValidation(
      defaultDateFormat,
      calendarType,
      dateRangeMode
    );
    const { handleArrowKeyNavigation } = useKeyboardNavigation(
      defaultDateFormat,
      calendarType,
      dateRangeMode,
      onChange
    );

    const days =
      calendarType === "BS" && showNepaliDays ? nepaliDays : englishDays;

    const months =
      calendarType === "BS"
        ? showNepaliMonths
          ? nepaliMonths
          : bsEnglishMonths
        : englishMonths;

    const getCalendarDays = useMemo(() => {
      const daysInMonth = getDaysInMonth(
        calendarType,
        currentYear,
        currentMonth
      );
      const firstDay = getFirstDayOfMonth(
        calendarType,
        currentYear,
        currentMonth
      );
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    }, [currentYear, currentMonth, calendarType]);

    // Event handlers
    const handleDateSelect = useCallback(
      (day: number) => {
        const newDate = { year: currentYear, month: currentMonth, day };

        if (dateRangeMode) {
          if (
            !selectedRange.start ||
            (selectedRange.start && selectedRange.end)
          ) {
            // Start new range
            setSelectedRange({ start: newDate, end: null });
            const formattedDate = formatDateToString(
              defaultDateFormat,
              currentYear,
              currentMonth,
              day
            );
            setInputValue(formattedDate);
          } else {
            // Complete the range - ensure end is not before start
            const start = selectedRange.start;
            const end = newDate;

            if (isDateBefore(end, start)) {
              // If user selects a date before start, make it the new start
              setSelectedRange({ start: end, end: null });
              const formattedDate = formatDateToString(
                defaultDateFormat,
                currentYear,
                currentMonth,
                day
              );
              setInputValue(formattedDate);
              return;
            }

            setSelectedRange({ start: start, end: end });

            const startFormatted = formatDateToString(
              defaultDateFormat,
              start.year,
              start.month,
              start.day
            );
            const endFormatted = formatDateToString(
              defaultDateFormat,
              end.year,
              end.month,
              end.day
            );
            setInputValue(`${startFormatted} - ${endFormatted}`);

            // Always return AD dates for range mode
            let startAD: string, endAD: string;
            if (calendarType === "BS") {
              try {
                const startNepaliDate = new NepaliDate(
                  start.year,
                  start.month,
                  start.day
                );
                const endNepaliDate = new NepaliDate(
                  end.year,
                  end.month,
                  end.day
                );
                startAD = startNepaliDate.formatEnglishDate("YYYY-MM-DD");
                endAD = endNepaliDate.formatEnglishDate("YYYY-MM-DD");
              } catch {
                startAD = "";
                endAD = "";
              }
            } else {
              startAD = `${start.year}-${String(start.month + 1).padStart(2, "0")}-${String(start.day).padStart(2, "0")}`;
              endAD = `${end.year}-${String(end.month + 1).padStart(2, "0")}-${String(end.day).padStart(2, "0")}`;
            }

            const result =
              returnFormat === "iso"
                ? `${startAD} - ${endAD}`
                : JSON.stringify({
                    bs: { start: startFormatted, end: endFormatted },
                    ad: { start: startAD, end: endAD },
                  });

            onChange?.(result);
            setIsOpen(false);
          }
        } else {
          // Single date mode - always return AD date as primary output
          setSelectedDate(newDate);
          const formattedDate = formatDateToString(
            defaultDateFormat,
            currentYear,
            currentMonth,
            day
          );
          setInputValue(formattedDate);

          let adDateString: string;
          if (calendarType === "BS") {
            try {
              const nepaliDate = new NepaliDate(currentYear, currentMonth, day);
              adDateString = nepaliDate.formatEnglishDate("YYYY-MM-DD");
            } catch {
              adDateString = "";
            }
          } else {
            adDateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          }

          const result =
            returnFormat === "iso"
              ? adDateString
              : JSON.stringify({
                  bs:
                    calendarType === "BS"
                      ? formattedDate
                      : getBSDateString(currentYear, currentMonth, day),
                  ad: adDateString,
                });

          onChange?.(result);
          setIsOpen(false);
        }
      },
      [
        currentYear,
        currentMonth,
        calendarType,
        dateRangeMode,
        selectedRange,
        onChange,
        defaultDateFormat,
        returnFormat,
      ]
    );

    const navigateMonth = useCallback(
      (direction: 1 | -1) => {
        if (direction === 1) {
          if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
          } else {
            setCurrentMonth(prev => prev + 1);
          }
        } else {
          if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
          } else {
            setCurrentMonth(prev => prev - 1);
          }
        }
        setFocusedDate(null);
      },
      [currentMonth]
    );

    const navigateYear = useCallback((direction: 1 | -1) => {
      setCurrentYear(prev => prev + direction);
      setFocusedDate(null);
    }, []);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Skip input processing in range mode since input is disabled
        if (dateRangeMode) return;

        const input = e.target.value;
        setIsTyping(true);

        const formattedInput = validateAndFormatInput(input);
        setInputValue(formattedInput);

        // Try to parse and validate the complete date
        if (formattedInput.length >= 8) {
          const parsedDate = parseDateFromString(
            defaultDateFormat,
            calendarType,
            formattedInput
          );
          if (parsedDate) {
            setSelectedDate(parsedDate);
            setCurrentYear(parsedDate.year);
            setCurrentMonth(parsedDate.month);

            // Generate result
            let result;
            if (calendarType === "BS") {
              try {
                const nepaliDate = new NepaliDate(
                  parsedDate.year,
                  parsedDate.month,
                  parsedDate.day
                );
                const adDateString = nepaliDate.formatEnglishDate("YYYY-MM-DD");
                result = JSON.stringify({
                  bs: formattedInput,
                  ad: adDateString,
                });
              } catch {
                result = JSON.stringify({ bs: formattedInput, ad: "" });
              }
            } else {
              const bsDate = getBSDateString(
                parsedDate.year,
                parsedDate.month,
                parsedDate.day
              );
              result = JSON.stringify({ ad: formattedInput, bs: bsDate });
            }

            onChange?.(result);
          }
        }

        setTimeout(() => setIsTyping(false), 100);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        dateRangeMode,
        validateAndFormatInput,
        defaultDateFormat,
        calendarType,
        onChange,
        isTyping,
      ]
    );

    // Check if a date is today
    const isToday = (year: number, month: number, day: number): boolean => {
      if (!showToday) return false;
      const today = getTodayDate(calendarType);
      return year === today.year && month === today.month && day === today.day;
    };

    // Keyboard navigation - only for single date mode
    const handleInputKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        // In range mode, only allow calendar opening shortcuts
        if (dateRangeMode) {
          switch (event.key) {
            case "ArrowDown":
              if (event.altKey) {
                event.preventDefault();
                setIsOpen(true);
              }
              break;
            case "Escape":
              if (isOpen) {
                event.preventDefault();
                setIsOpen(false);
              }
              break;
          }
          return;
        }

        // Single date mode - full keyboard navigation
        const target = event.target as HTMLInputElement;
        const cursorPos = target.selectionStart || 0;

        // Handle arrow key navigation first
        if (
          handleArrowKeyNavigation(
            event,
            inputValue,
            cursorPos,
            setInputValue,
            setSelectedDate,
            setCurrentYear,
            setCurrentMonth,
            inputRef
          )
        ) {
          return; // Arrow key was handled
        }

        // Handle other keys
        switch (event.key) {
          case "Enter":
            event.preventDefault();
            const parsedDate = parseDateFromString(
              defaultDateFormat,
              calendarType,
              inputValue
            );
            if (parsedDate) {
              setSelectedDate(parsedDate);
              setCurrentYear(parsedDate.year);
              setCurrentMonth(parsedDate.month);
              setIsOpen(false);
            }
            break;

          case "ArrowDown":
            if (event.altKey) {
              event.preventDefault();
              setIsOpen(true);
            }
            break;

          case "Escape":
            if (isOpen) {
              event.preventDefault();
              setIsOpen(false);
            }
            break;
        }
      },
      [
        disabled,
        dateRangeMode,
        isOpen,
        inputValue,
        defaultDateFormat,
        calendarType,
        handleArrowKeyNavigation,
      ]
    );

    const handleInputFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (dateRangeMode) return; // No focus handling in range mode
      },
      [dateRangeMode]
    );

    const handleInputClick = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (dateRangeMode) return; // No click handling in range mode
      },
      [dateRangeMode]
    );

    const handleClear = useCallback(() => {
      if (dateRangeMode) {
        setSelectedRange({ start: null, end: null });
        setInputValue("");
      } else {
        setSelectedDate(null);
        setInputValue("");
      }
      if (onChange) {
        onChange("");
      }
    }, [dateRangeMode, onChange]);

    const resetCalendar = useCallback(() => {
      // Batch state updates for better performance
      setSelectedDate(null);
      setSelectedRange({ start: null, end: null });
      setInputValue("");
      setIsOpen(false);
      // Call onChange synchronously without delay
      if (onChange) {
        onChange("");
      }
    }, [onChange]);

    useImperativeHandle(ref, () => ({
      reset: resetCalendar,
      open: () => setIsOpen(true),
    }));

    // Auto-open calendar when hideInput is true (only on mount)
    useEffect(() => {
      if (hideInput && !isOpen) {
        setIsOpen(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hideInput]); // Remove isOpen from dependencies to prevent conflicts

    // Effects

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        if (
          referenceElement &&
          !referenceElement.contains(target) &&
          calendarRef.current &&
          !calendarRef.current.contains(target) &&
          externalIsOpen === undefined
        ) {
          setIsOpen(false);
          setShowDropdown(false);
          onClose?.();
        }
      };

      if (actualIsOpen && externalIsOpen === undefined) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [actualIsOpen, showDropdown, referenceElement, externalIsOpen]);

    useEffect(() => {
      const handleScroll = () => {
        if (actualIsOpen && !hideInput && externalIsOpen === undefined) {
          setIsOpen(false);
          onClose?.();
        }
      };

      if (actualIsOpen && !hideInput && externalIsOpen === undefined) {
        document.addEventListener("scroll", handleScroll, true);
      }

      return () => {
        document.removeEventListener("scroll", handleScroll, true);
      };
    }, [actualIsOpen, hideInput, externalIsOpen]);

    // Initialize input value from props or set today's date
    useEffect(() => {
      if (!value) {
        // Clear input when value is empty
        setInputValue("");
        setSelectedRange({ start: null, end: null });
        setSelectedDate(null);
      } else if (value) {
        // Handle dash-separated date range for dateRangeMode (YYYY-MM-DD - YYYY-MM-DD)
        if (dateRangeMode && value.includes(" - ")) {
          const [startDateStr, endDateStr] = value.split(" - ");

          const parseDate = (dateStr: string) => {
            const [year, month, day] = dateStr.trim().split("-").map(Number);
            return { year, month: month - 1, day };
          };

          const startDate = parseDate(startDateStr);
          const endDate = parseDate(endDateStr);

          setSelectedRange({ start: startDate, end: endDate });

          const startFormatted = formatDateToString(
            defaultDateFormat,
            startDate.year,
            startDate.month,
            startDate.day
          );
          const endFormatted = formatDateToString(
            defaultDateFormat,
            endDate.year,
            endDate.month,
            endDate.day
          );
          setInputValue(`${startFormatted} - ${endFormatted}`);
          setCurrentYear(startDate.year);
          setCurrentMonth(startDate.month);
        }
        // Handle ISO date string (YYYY-MM-DD)
        else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = value.split("-").map(Number);
          let displayDate: DateInfo;

          if (calendarType === "BS") {
            // Convert AD to BS for display
            try {
              const bsDate = NepaliDate.fromEnglishDate(year, month - 1, day);
              displayDate = {
                year: bsDate.getYear(),
                month: bsDate.getMonth(),
                day: bsDate.getDate(),
              };
            } catch {
              displayDate = { year, month: month - 1, day };
            }
          } else {
            displayDate = { year, month: month - 1, day };
          }

          const formattedDate = formatDateToString(
            defaultDateFormat,
            displayDate.year,
            displayDate.month,
            displayDate.day
          );
          setInputValue(formattedDate);
          setSelectedDate(displayDate);
          setCurrentYear(displayDate.year);
          setCurrentMonth(displayDate.month);
        } else {
          // Handle old JSON format for backward compatibility
          try {
            const parsed = JSON.parse(value);
            const dateStr = calendarType === "BS" ? parsed.bs : parsed.ad;
            if (dateStr) {
              setInputValue(dateStr);
              const parsedDate = parseDateFromString(
                defaultDateFormat,
                calendarType,
                dateStr
              );
              if (parsedDate) {
                setSelectedDate(parsedDate);
                setCurrentYear(parsedDate.year);
                setCurrentMonth(parsedDate.month);
              }
            }
          } catch {
            // Invalid format, ignore
          }
        }
      }
    }, [value, calendarType, defaultDateFormat, dateRangeMode]);

    // Focus management
    useEffect(() => {
      if (isOpen && calendarRef.current && !showDropdown) {
        // Focus the calendar grid for keyboard navigation
        const calendarGrid = calendarRef.current.querySelector('[role="grid"]');
        if (calendarGrid) {
          (calendarGrid as HTMLElement).focus();
        }
      }
    }, [isOpen, showDropdown]);

    const { handleCalendarKeyDown } = useCalendarKeyboardNavigation(
      calendarType,
      currentYear,
      currentMonth,
      focusedDate,
      setFocusedDate,
      navigateMonth,
      navigateYear,
      handleDateSelect,
      setCurrentYear,
      setCurrentMonth
    );

    const calendarPosition =
      customPosition ||
      useCalendarPosition({ referenceElement, inputRef, isOpen: actualIsOpen });
    const showBackdrop =
      !referenceElement &&
      typeof window !== "undefined" &&
      window.innerWidth < 768;

    return (
      <div className={`relative ${className}`}>
        {!hideInput && (
          <CalendarInput
            required={required}
            ref={inputRef}
            value={inputValue}
            placeholder={defaultPlaceholder}
            disabled={disabled}
            readOnly={dateRangeMode}
            isRangeMode={dateRangeMode}
            label={label}
            onKeyDown={handleInputKeyDown}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            onCalendarClick={() => !disabled && setIsOpen(!isOpen)}
            onClear={handleClear}
            containerClassName={containerClassName}
            labelClassName={labelClassName}
            inputWrapperClassName={inputWrapperClassName}
            inputClassName={inputClassName}
            buttonClassName={buttonClassName}
          />
        )}

        {!hideInput && (
          <CalendarPortal
            isOpen={actualIsOpen}
            position={calendarPosition}
            showBackdrop={showBackdrop}
            onBackdropClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          >
            <div ref={calendarRef}>
              <CalendarContent
                currentYear={currentYear}
                currentMonth={currentMonth}
                months={months}
                days={days}
                calendarDays={getCalendarDays}
                selectedDate={selectedDate}
                selectedRange={selectedRange}
                focusedDate={focusedDate}
                dateRangeMode={dateRangeMode}
                calendarType={calendarType}
                showTooltip={showTooltip}
                showToday={showToday}
                showDropdown={showDropdown}
                colors={colors}
                minDate={minDate}
                maxDate={maxDate}
                calendarClassName={calendarClassName}
                focusedYearIndex={focusedYearIndex}
                focusedMonthIndex={focusedMonthIndex}
                yearRangeStart={yearRangeStart}
                showQuickSelect={showQuickSelect}
                quickSelectRanges={quickSelectRanges}
                activeRange={activeRange}
                onNavigateMonth={navigateMonth}
                onNavigateYear={navigateYear}
                onToggleDropdown={() => {
                  setShowDropdown(!showDropdown);
                  setFocusedMonthIndex(currentMonth);
                  setFocusedYearIndex(6);
                }}
                onDateSelect={handleDateSelect}
                onYearChange={setCurrentYear}
                onMonthChange={setCurrentMonth}
                onYearRangeChange={handleYearRangeChange}
                onCloseDropdown={() => setShowDropdown(false)}
                onGoToToday={() => {
                  const today = getTodayDate(calendarType);
                  setCurrentYear(today.year);
                  setCurrentMonth(today.month);
                }}
                onQuickSelect={onQuickSelect}
                onKeyDown={handleCalendarKeyDown}
                isToday={isToday}
              />
            </div>
          </CalendarPortal>
        )}

        {/* Inline calendar when hideInput is true (for bottom sheets) */}
        {actualIsOpen && hideInput && (
          <div className="w-fit">
            <CalendarContent
              currentYear={currentYear}
              currentMonth={currentMonth}
              months={months}
              days={days}
              calendarDays={getCalendarDays}
              selectedDate={selectedDate}
              selectedRange={selectedRange}
              focusedDate={focusedDate}
              dateRangeMode={dateRangeMode}
              calendarType={calendarType}
              showTooltip={showTooltip}
              showToday={showToday}
              showDropdown={showDropdown}
              colors={colors}
              minDate={minDate}
              maxDate={maxDate}
              calendarClassName={calendarClassName || "w-full"}
              focusedYearIndex={focusedYearIndex}
              focusedMonthIndex={focusedMonthIndex}
              yearRangeStart={yearRangeStart}
              showQuickSelect={showQuickSelect}
              quickSelectRanges={quickSelectRanges}
              activeRange={activeRange}
              onNavigateMonth={navigateMonth}
              onNavigateYear={navigateYear}
              onToggleDropdown={() => {
                setShowDropdown(!showDropdown);
                setFocusedMonthIndex(currentMonth);
                setFocusedYearIndex(6);
              }}
              onDateSelect={handleDateSelect}
              onYearChange={setCurrentYear}
              onMonthChange={setCurrentMonth}
              onYearRangeChange={handleYearRangeChange}
              onCloseDropdown={() => setShowDropdown(false)}
              onGoToToday={() => {
                const today = getTodayDate(calendarType);
                setCurrentYear(today.year);
                setCurrentMonth(today.month);
              }}
              onQuickSelect={onQuickSelect}
              onKeyDown={handleCalendarKeyDown}
              isToday={isToday}
            />
          </div>
        )}
      </div>
    );
  }
);

DatePickerCalendar.displayName = "DatePickerCalendar";

export default DatePickerCalendar;
