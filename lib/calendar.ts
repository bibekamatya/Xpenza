export type DateFormat = "YYYY-MM-DD" | "MM/DD/YYYY";
export type ReturnFormat = "iso" | "detailed"; // iso: "YYYY-MM-DD", detailed: {bs, ad}

export interface CalendarPickerProps {
  // Core
  value?: string;
  onChange?: (value: string) => void;
  calendarType?: "BS" | "AD";
  dateFormat?: DateFormat;
  returnFormat?: ReturnFormat; // Default: "iso" (simple string), "detailed" (JSON with both BS/AD)
  disabled?: boolean;
  required?: boolean;

  // Date constraints
  minDate?: string; // ISO format: YYYY-MM-DD
  maxDate?: string; // ISO format: YYYY-MM-DD

  // Range mode
  dateRangeMode?: boolean;
  showQuickSelect?: boolean;
  quickSelectRanges?: Array<{ label: string; value: string }>;
  onQuickSelect?: (rangeType: string) => void;
  activeRange?: string; // Currently active quick select range

  // Display options
  showNepaliDays?: boolean;
  showNepaliMonths?: boolean;
  showTooltip?: boolean;
  showToday?: boolean;
  color?: "teal" | "blue" | "green" | "purple";

  // Input customization
  label?: string;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;

  // Calendar customization
  calendarClassName?: string;
  className?: string;

  // Advanced control
  hideInput?: boolean; // For inline calendar (no input field)
  isOpen?: boolean; // External open state control
  onClose?: () => void;
  referenceElement?: HTMLElement | null; // For filter dropdowns
  customPosition?: React.CSSProperties; // Override positioning (e.g., Floating UI)
}

export interface DateInfo {
  year: number;
  month: number;
  day: number;
}

export interface DateRange {
  start: DateInfo | null;
  end: DateInfo | null;
}

export interface ColorVariant {
  primary: string;
  selected: string;
  selectedHover: string;
  focus: string;
  range: string;
  rangeHover: string;
}

export const colorVariants: Record<string, ColorVariant> = {
  teal: {
    primary: "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300",
    selected:
      "bg-linear-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 text-white shadow-lg",
    selectedHover: "hover:from-teal-600 hover:to-teal-700 dark:hover:from-teal-700 dark:hover:to-teal-800",
    focus: "focus:ring-teal-500 dark:focus:ring-teal-600",
    range: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300",
    rangeHover: "hover:bg-teal-200 dark:hover:bg-teal-800",
  },
  blue: {
    primary: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300",
    selected:
      "bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg ring-2 ring-blue-200 dark:ring-blue-800 ring-offset-2 dark:ring-offset-gray-900",
    selectedHover: "hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800",
    focus: "focus:ring-blue-500 dark:focus:ring-blue-600",
    range: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    rangeHover: "hover:bg-blue-200 dark:hover:bg-blue-800",
  },
  green: {
    primary: "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-300",
    selected:
      "bg-linear-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white shadow-lg ring-2 ring-green-200 dark:ring-green-800 ring-offset-2 dark:ring-offset-gray-900",
    selectedHover: "hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800",
    focus: "focus:ring-green-500 dark:focus:ring-green-600",
    range: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    rangeHover: "hover:bg-green-200 dark:hover:bg-green-800",
  },
  purple: {
    primary: "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-purple-300",
    selected:
      "bg-linear-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white shadow-lg ring-2 ring-purple-200 dark:ring-purple-800 ring-offset-2 dark:ring-offset-gray-900",
    selectedHover: "hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800",
    focus: "focus:ring-purple-500 dark:focus:ring-purple-600",
    range: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
    rangeHover: "hover:bg-purple-200 dark:hover:bg-purple-800",
  },
};
