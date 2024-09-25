import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check } from "lucide-react";
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";

const MultiSelectContext = createContext(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const onValueChangeHandler = useCallback(
    (val) => {
      if (value.includes(val)) {
        onValueChange(value.filter((item) => item !== val));
      } else {
        onValueChange([...value, val]);
      }
    },
    [value, onValueChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex
        );
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      if ((e.key === "Backspace" || e.key === "Delete") && value.length > 0) {
        if (inputValue.length === 0) {
          if (activeIndex !== -1 && activeIndex < value.length) {
            onValueChange(value.filter((item) => item !== value[activeIndex]));
            const newIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;
            setActiveIndex(newIndex);
          } else {
            onValueChange(
              value.filter((item) => item !== value[value.length - 1])
            );
          }
        }
      } else if (e.key === "Enter") {
        setOpen(true);
      } else if (e.key === "Escape") {
        if (activeIndex !== -1) {
          setActiveIndex(-1);
        } else {
          setOpen(false);
        }
      } else if (dir === "rtl") {
        if (e.key === "ArrowRight") {
          movePrev();
        } else if (e.key === "ArrowLeft" && (activeIndex !== -1 || loop)) {
          moveNext();
        }
      } else {
        if (e.key === "ArrowLeft") {
          movePrev();
        } else if (e.key === "ArrowRight" && (activeIndex !== -1 || loop)) {
          moveNext();
        }
      }
    },
    [value, inputValue, activeIndex, loop, onValueChange, dir]
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn(
          "overflow-visible bg-transparent flex flex-col space-y-0",
          className
        )}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef(
  ({ className, children, options = [], ...props }, ref) => {
    const { value, onValueChange, activeIndex } = useMultiSelect();
    // console.log(options);
    const mousePreventDefault = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-1 p-1 py-2 border border-muted rounded-lg bg-background",
          className
        )}
        {...props}
      >
        {value.map((item, index) => (
          <Badge
            key={item}
            className={cn(
              "px-1 rounded-xl flex items-center gap-1",
              activeIndex === index && "ring-2 ring-muted-foreground "
            )}
            variant={"secondary"}
          >
            <span className="text-xs">
              {options.find((opt) => opt.value === item)?.label || item}
            </span>
            <button
              aria-label={`Remove ${item} option`}
              aria-roledescription="button to remove option"
              type="button"
              onMouseDown={mousePreventDefault}
              onClick={() => onValueChange(item)}
            >
              <span className="sr-only">Remove {item} option</span>
              <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    );
  }
);

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorInput = forwardRef(
  ({ className, ...props }, ref) => {
    const { setOpen, inputValue, setInputValue, activeIndex, setActiveIndex } =
      useMultiSelect();
    return (
      <CommandPrimitive.Input
        {...props}
        ref={ref}
        value={inputValue}
        onValueChange={activeIndex === -1 ? setInputValue : undefined}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onClick={() => setActiveIndex(-1)}
        className={cn(
          "ml-2 bg-transparent outline-none placeholder:text-muted-foreground placeholder:text-sm flex-1 h-[22px]",
          className,
          activeIndex !== -1 && "caret-transparent"
        )}
      />
    );
  }
);

MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorContent = forwardRef(
  ({ children }, ref) => {
    const { open } = useMultiSelect();
    return (
      <div ref={ref} className="relative">
        {open && children}
      </div>
    );
  }
);

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef(
  ({ className, children }, ref) => {
    return (
      <CommandList
        ref={ref}
        className={cn(
          "p-2 flex flex-col gap-2 rounded-md scrollbar-thin scrollbar-track-transparent transition-colors scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg w-full absolute bg-white shadow-md z-10 border border-muted top-0",
          className
        )}
      >
        {children}
        <CommandEmpty>
          <span className="text-muted-foreground">No results found</span>
        </CommandEmpty>
      </CommandList>
    );
  }
);

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const { value: Options, onValueChange, setInputValue } = useMultiSelect();

    const mousePreventDefault = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const isIncluded = Options.includes(value);
    return (
      <CommandItem
        ref={ref}
        {...props}
        onSelect={() => {
          onValueChange(value);
          setInputValue("");
        }}
        className={cn(
          "rounded-md cursor-pointer px-2 py-1 transition-colors flex justify-between ",
          className,
          isIncluded && "opacity-50 cursor-default",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
        onMouseDown={mousePreventDefault}
      >
        {children}
        {isIncluded && <Check className="h-4 w-4" />}
      </CommandItem>
    );
  }
);

MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
