"use client";

import * as React from "react";
import {
  AsYouType,
  getExampleNumber,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHONE_COUNTRIES, type PhoneCountry } from "@/data/mock-data/phones";
import { cn } from "@/lib/utils";

// Sorted by dial-code length, longest first, so parsing a stored value like
// "+1264 555 1234" matches Anguilla's "+1264" before the shorter US "+1".
const COUNTRIES_BY_DIALCODE_LENGTH = [...PHONE_COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length,
);

const DEFAULT_COUNTRY: PhoneCountry =
  PHONE_COUNTRIES.find((c) => c.iso2 === "MD") ?? PHONE_COUNTRIES[0];

function parsePhoneValue(value: string): {
  country: PhoneCountry;
  digits: string;
} {
  if (value) {
    const match = COUNTRIES_BY_DIALCODE_LENGTH.find((c) =>
      value.startsWith(c.dialCode),
    );
    if (match) {
      return {
        country: match,
        digits: value.slice(match.dialCode.length).replace(/\D/g, ""),
      };
    }
  }
  return { country: DEFAULT_COUNTRY, digits: value.replace(/\D/g, "") };
}

// --- Digit grouping --------------------------------------------------------
//
// AsYouType only groups digits once it can match them against a real,
// assignable number pattern for the country — feed it something that isn't a
// plausible real number (test data, a half-remembered number, etc.) and it
// just gives up and hands the raw digits straight back, with no spaces at
// all. That's not what we want from an input mask: the grouping should be a
// fixed visual shape for the country, applied to whatever the person types,
// valid or not.
//
// So instead of calling AsYouType live on every keystroke, we derive each
// country's group shape *once* from a real example number for that country
// (e.g. Moldova mobile numbers group as 3-2-3 digits: "791 23 456"), then
// apply that fixed shape mechanically to the raw digits as they're typed.

/** Chops `formatted` off right after its `prefixDigitCount`-th digit,
 *  discarding the dial-code portion (and any separator right after it) so
 *  only the local-number portion remains — the part this input displays. */
function stripDialCodePrefix(
  formatted: string,
  prefixDigitCount: number,
): string {
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === prefixDigitCount) {
        return formatted.slice(i + 1).replace(/^[\s\-()]+/, "");
      }
    }
  }
  return "";
}

// One-time, per-country lookup of digit-group sizes, e.g. Moldova -> [3, 2, 3].
// Built from libphonenumber-js's own example numbers, so it stays correct
// without us having to hand-maintain a format per country.
const COUNTRY_GROUP_SHAPES = new Map<string, number[]>(
  PHONE_COUNTRIES.map((c) => {
    try {
      const example = getExampleNumber(c.iso2 as CountryCode, examples);
      if (!example) return [c.iso2, []] as const;
      const prefixDigitCount = c.dialCode.replace("+", "").length;
      const formatted = new AsYouType().input(example.number);
      const local = stripDialCodePrefix(formatted, prefixDigitCount);
      const groups = local
        .split(/[^0-9]+/)
        .filter(Boolean)
        .map((group) => group.length);
      return [c.iso2, groups] as const;
    } catch {
      return [c.iso2, []] as const;
    }
  }),
);

/** Applies a fixed group shape (e.g. [3, 2, 3]) to raw digits, regardless of
 *  whether those digits form a real number. Digits past the shape's total
 *  length just spill onto the end unformatted, rather than being dropped. */
function groupDigits(digits: string, groups: number[]): string {
  if (!groups.length) return digits;
  const parts: string[] = [];
  let i = 0;
  for (const size of groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  let result = parts.join(" ");
  if (i < digits.length) {
    result += (result ? " " : "") + digits.slice(i);
  }
  return result;
}

const FlagImg = React.memo(function FlagImg({
  iso2,
  className,
}: {
  iso2: string;
  className?: string;
}) {
  return (
    <img
      src={`https://flagcdn.com/w20/${iso2.toLowerCase()}.png`}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      decoding="async"
      className={cn("shrink-0 rounded-[2px] object-cover", className)}
    />
  );
});

// Built once at module load, not per render. Previously this 240-row list
// (flag + 2 spans each, ~1000 elements) was recreated inline in JSX on
// every render — including every keystroke in the number field, since that
// updates this same component's state. That's what caused the lag.
const COUNTRY_OPTIONS = PHONE_COUNTRIES.map((c) => (
  <SelectItem key={c.iso2} value={c.iso2} textValue={`${c.name} ${c.dialCode}`}>
    <span className="flex w-full items-center gap-2">
      <FlagImg iso2={c.iso2} className="h-[15px] w-5" />
      <span className="flex-1 truncate leading-none">{c.name}</span>
      <span className="text-muted-foreground leading-none">{c.dialCode}</span>
    </span>
  </SelectItem>
));

export interface PhoneInputProps {
  /** Combined value, e.g. "+373 79123456" — digits only, no display spaces. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  placeholder = "00 000 000",
  className,
  disabled,
}: PhoneInputProps) {
  // Seeded once from the incoming value (mirrors how this form already
  // seeds react-hook-form via defaultValues rather than syncing live).
  const [country, setCountry] = React.useState<PhoneCountry>(
    () => parsePhoneValue(value).country,
  );
  // Raw digits only — no spaces. Spaces are purely a display concern,
  // handled below via groupDigits, so the stored/emitted value stays simple.
  const [digits, setDigits] = React.useState<string>(
    () => parsePhoneValue(value).digits,
  );

  // Groups the raw digits per the selected country's fixed shape (e.g.
  // Moldova: "791 23 456", US: "201 555 0123") — see COUNTRY_GROUP_SHAPES
  // above for why this doesn't call AsYouType live on every keystroke.
  const formattedNumber = React.useMemo(() => {
    if (!digits) return "";
    const groups = COUNTRY_GROUP_SHAPES.get(country.iso2) ?? [];
    return groupDigits(digits, groups);
  }, [country.iso2, digits]);

  // Measure the whole field (code selector + number input together) so the
  // dropdown can match that width instead of Radix's default of matching
  // just the narrow trigger.
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = React.useState<number>();

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setDropdownWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const emit = React.useCallback(
    (dialCode: string, rawDigits: string) => {
      onChange(rawDigits ? `${dialCode} ${rawDigits}` : "");
    },
    [onChange],
  );

  const handleCountryChange = React.useCallback(
    (iso2: string) => {
      const next = PHONE_COUNTRIES.find((c) => c.iso2 === iso2);
      if (!next) return;
      setCountry(next);
      emit(next.dialCode, digits);
    },
    [emit, digits],
  );

  const handleNumberChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digitsOnly = e.target.value.replace(/\D/g, "");
      // Limit to 10 digits (most phone numbers are 10 digits or less)
      const limitedDigits = digitsOnly.slice(0, 10);
      setDigits(limitedDigits);
      emit(country.dialCode, limitedDigits);
    },
    [emit, country.dialCode],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex h-12 w-full items-stretch overflow-hidden rounded-lg bg-slate-100 focus-within:ring-1 focus-within:ring-slate-300",
        className,
      )}
    >
      <Select
        value={country.iso2}
        onValueChange={handleCountryChange}
        disabled={disabled}
      >
        <SelectTrigger className="!h-full w-auto min-w-[108px] shrink-0 gap-1.5 rounded-none border-0 border-r border-slate-200 bg-transparent !py-0 pl-3 pr-2 text-slate-600 shadow-none focus:ring-0 focus:ring-offset-0">
          <SelectValue>
            <span className="flex items-center gap-1.5 whitespace-nowrap leading-none">
              <FlagImg iso2={country.iso2} className="h-[15px] w-5" />
              <span className="leading-none">{country.dialCode}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="z-[100] max-h-72"
          style={
            dropdownWidth
              ? { width: dropdownWidth, minWidth: dropdownWidth }
              : undefined
          }
        >
          {COUNTRY_OPTIONS}
        </SelectContent>
      </Select>

      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={formattedNumber}
        onChange={handleNumberChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={12}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          const digitsOnly = target.value.replace(/\D/g, "");
          if (digitsOnly.length > 10) {
            target.value = formattedNumber.slice(0, -1);
          }
        }}
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-slate-600 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
