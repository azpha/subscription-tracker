import { useCallback } from "react";
import { debounce } from "lodash";

export default function StyledInput({
  placeholder,
  onChange,
  type = "text",
  value,
  defaultValue,
  shouldDebounce = false,
  dark = true,
}: {
  placeholder: string;
  onChange: (v: string) => void;
  type?: string;
  value?: string;
  defaultValue?: string | number;
  shouldDebounce?: boolean;
  dark?: boolean;
}) {
  const debounced = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 500),
    [onChange]
  );

  return (
    <input
      type={type}
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        if (shouldDebounce) {
          debounced(e.target.value);
        } else {
          onChange(e.target.value);
        }
      }}
      className={`${
        dark ? "bg-black text-white" : "bg-white text-black"
      } rounded-lg p-2 block`}
    />
  );
}
