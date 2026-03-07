import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import nafCodes from "@/lib/naf-codes.json";

type NafEntry = { code: string; label: string };

export default function NafCombobox({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (code: string, label: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = (nafCodes as NafEntry[]).find((n) => n.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span className="truncate">
              {selected.code} — {selected.label}
            </span>
          ) : (
            <span className="text-muted-foreground">Rechercher un code NAF...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command
          filter={(value, search) => {
            const entry = (nafCodes as NafEntry[]).find((n) => n.code === value);
            if (!entry) return 0;
            const haystack = `${entry.code} ${entry.label}`.toLowerCase();
            const words = search.toLowerCase().split(/\s+/);
            return words.every((w) => haystack.includes(w)) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Code ou intitule..." />
          <CommandList>
            <CommandEmpty>Aucun code NAF trouve.</CommandEmpty>
            <CommandGroup>
              {(nafCodes as NafEntry[]).map((naf) => (
                <CommandItem
                  key={naf.code}
                  value={naf.code}
                  onSelect={() => {
                    onSelect(naf.code, naf.label);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === naf.code ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="mr-2 font-mono text-xs text-muted-foreground">
                    {naf.code}
                  </span>
                  <span className="truncate">{naf.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
