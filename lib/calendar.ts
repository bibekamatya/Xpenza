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
    primary: "text-teal-600 hover:bg-teal-50 hover:text-teal-700",
    selected:
      "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg ring-2 ring-teal-200 ring-offset-2",
    selectedHover: "hover:from-teal-600 hover:to-teal-700",
    focus: "focus:ring-teal-500",
    range: "bg-teal-100 text-teal-700",
    rangeHover: "hover:bg-teal-200",
  },
  blue: {
    primary: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
    selected:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-200 ring-offset-2",
    selectedHover: "hover:from-blue-600 hover:to-blue-700",
    focus: "focus:ring-blue-500",
    range: "bg-blue-100 text-blue-700",
    rangeHover: "hover:bg-blue-200",
  },
  green: {
    primary: "text-green-600 hover:bg-green-50 hover:text-green-700",
    selected:
      "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ring-2 ring-green-200 ring-offset-2",
    selectedHover: "hover:from-green-600 hover:to-green-700",
    focus: "focus:ring-green-500",
    range: "bg-green-100 text-green-700",
    rangeHover: "hover:bg-green-200",
  },
  purple: {
    primary: "text-purple-600 hover:bg-purple-50 hover:text-purple-700",
    selected:
      "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg ring-2 ring-purple-200 ring-offset-2",
    selectedHover: "hover:from-purple-600 hover:to-purple-700",
    focus: "focus:ring-purple-500",
    range: "bg-purple-100 text-purple-700",
    rangeHover: "hover:bg-purple-200",
  },
};
