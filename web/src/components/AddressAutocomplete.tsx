import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export type AddressResult = {
  street: string;
  postal_code: string;
  city: string;
  department: string;
  region: string;
};

type BanFeature = {
  properties: {
    label: string;
    name: string;
    postcode: string;
    city: string;
    context: string;
  };
};

export default function AddressAutocomplete({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (address: AddressResult) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<BanFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function search(q: string) {
    clearTimeout(timerRef.current);
    if (q.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`
        );
        const data = await res.json();
        setResults(data.features ?? []);
        setOpen((data.features ?? []).length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      }
    }, 300);
  }

  function handleSelect(feature: BanFeature) {
    const { name, postcode, city, context } = feature.properties;
    const contextParts = context.split(", ");
    const department = contextParts[1] ?? "";
    const region = contextParts[2] ?? "";

    setQuery(feature.properties.label);
    setOpen(false);
    onSelect({
      street: name,
      postal_code: postcode,
      city,
      department,
      region,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="12 rue de la Paix, Paris"
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {results.map((feature, i) => (
            <li
              key={i}
              className={`cursor-pointer rounded-sm px-3 py-2 text-sm ${
                i === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={() => handleSelect(feature)}
            >
              {feature.properties.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
