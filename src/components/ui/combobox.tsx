'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

export type Option = {
  value: string
  label: string
}

type ComboBoxProps = {
  data: Option[] | undefined
  onChange: (value: string) => void
  defaultValue?: Option
  className?: string
  selectText?: string
  searchText?: string
  disabledText?: string
  notFoundText?: string
  fitParent?: boolean
  disabled?: boolean
}

const ComboBox = ({
  data,
  searchText,
  selectText,
  onChange,
  disabledText,
  notFoundText,
  disabled,
  defaultValue,
  className,
  fitParent = true,
}: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const [selectedValue, setSelectedValue] = React.useState(defaultValue?.value)
  const [popoverWidth, setPopoverWidth] = React.useState<string>('200px')

  const onSelect = (item: Option): void => {
    onChange(item.value)
    setSelectedValue(item.value)
    setOpen(false)
  }

  const comboBoxText = React.useMemo(() => {
    return !data || disabled
      ? disabledText
      : selectedValue
        ? data.find(
            (option) =>
              option.value.toLowerCase() === selectedValue.toLowerCase(),
          )?.label
        : selectText ?? 'Select an option...'
  }, [data, disabled, disabledText, selectedValue, selectText])

  React.useLayoutEffect(() => {
    if (open && buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth
      setPopoverWidth(`${buttonWidth}px`)
    }
  }, [buttonRef, open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          ref={buttonRef}
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto w-full justify-between"
        >
          {comboBoxText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        style={{ width: fitParent ? popoverWidth : undefined }}
      >
        <Command>
          <CommandInput placeholder={searchText ?? 'Search an option...'} />
          <CommandEmpty>{notFoundText ?? 'No option found.'}</CommandEmpty>
          <CommandGroup>
            <ScrollArea
              className="max-h-72"
              style={{ height: data?.length ? data.length * 32 : 32 }}
            >
              {data?.map(({ value, label }) => (
                <CommandItem
                  className="h-8"
                  key={value}
                  onSelect={(label) => onSelect({ label, value })}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export default React.memo(ComboBox)
