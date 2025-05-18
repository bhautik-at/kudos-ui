import { useState, useEffect, useRef, forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md';

export type AutocompleteOption = {
  value: string;
  label: string;
};

export type AutocompleteProps = {
  options: AutocompleteOption[];
  placeholder?: string;
  emptyMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  searchPlaceholder?: string;
  openOnFocus?: boolean;
  filterFunction?: (option: AutocompleteOption, searchValue: string) => boolean;
  renderOption?: (option: AutocompleteOption, isSelected: boolean) => React.ReactNode;
};

export const Autocomplete = forwardRef<ElementRef<typeof PopoverTrigger>, AutocompleteProps>(
  (
    {
      options,
      placeholder = 'Select an option',
      emptyMessage = 'No results found.',
      value,
      onChange,
      disabled = false,
      triggerClassName,
      contentClassName,
      searchPlaceholder = 'Search...',
      openOnFocus = false,
      filterFunction,
      renderOption,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const [searchValue, setSearchValue] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Find the selected option based on value
    const selectedOption = options.find(option => option.value === selectedValue);

    // Update internal state when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // Reset search when opening/closing the popover
    useEffect(() => {
      if (!open) {
        // Small delay to prevent flashing empty results when reopening
        const timer = setTimeout(() => setSearchValue(''), 100);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Default filter function
    const defaultFilterFunction = (option: AutocompleteOption, searchValue: string) => {
      return option.label.toLowerCase().includes(searchValue.toLowerCase());
    };

    // Use provided filter function or default
    const finalFilterFunction = filterFunction || defaultFilterFunction;

    // Filter options based on search value
    const filteredOptions = searchValue
      ? options.filter(option => finalFilterFunction(option, searchValue))
      : options;

    // Default render function
    const defaultRenderOption = (option: AutocompleteOption, isSelected: boolean) => (
      <div className="flex items-center justify-between w-full">
        <span className="truncate">{option.label}</span>
        {isSelected && <MdCheck className="ml-2 h-4 w-4 flex-shrink-0 text-primary" />}
      </div>
    );

    // Use provided render function or default
    const finalRenderOption = renderOption || defaultRenderOption;

    const handleSelect = (currentValue: string) => {
      // Find the option value based on the CommandItem value
      const option = options.find(opt => opt.value === currentValue);

      if (option) {
        setSelectedValue(option.value);
        onChange?.(option.value);
        setOpen(false);
      }
    };

    const handleInputChange = (value: string) => {
      setSearchValue(value);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={node => {
            // Handle both the forwarded ref and our local ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            triggerRef.current = node;
          }}
          disabled={disabled}
          onClick={() => !disabled && setOpen(true)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            !selectedValue && 'text-muted-foreground',
            triggerClassName
          )}
          aria-expanded={open}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <MdKeyboardArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent
          className={cn('p-0', contentClassName)}
          style={{
            width: triggerRef.current?.offsetWidth
              ? `${triggerRef.current.offsetWidth}px`
              : 'var(--radix-popover-trigger-width)',
          }}
          align="start"
          sideOffset={4}
          avoidCollisions
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleInputChange}
              className="border-none focus:ring-0"
            />
            <CommandList>
              {filteredOptions.length === 0 && <CommandEmpty>{emptyMessage}</CommandEmpty>}
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className={cn(
                      'cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
                      option.value === selectedValue && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {finalRenderOption(option, option.value === selectedValue)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Autocomplete.displayName = 'Autocomplete';
