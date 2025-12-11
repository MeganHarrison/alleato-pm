"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CostCodeSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Mock data - in real app would come from API
const costCodes = [
  { code: "01-000", description: "General Conditions" },
  { code: "02-000", description: "Site Work" },
  { code: "03-000", description: "Concrete" },
  { code: "04-000", description: "Masonry" },
  { code: "05-000", description: "Metals" },
  { code: "06-000", description: "Wood & Plastics" },
  { code: "07-000", description: "Thermal & Moisture Protection" },
  { code: "08-000", description: "Doors & Windows" },
  { code: "09-000", description: "Finishes" },
  { code: "10-000", description: "Specialties" },
  { code: "11-000", description: "Equipment" },
  { code: "12-000", description: "Furnishings" },
  { code: "13-000", description: "Special Construction" },
  { code: "14-000", description: "Conveying Systems" },
  { code: "15-000", description: "Mechanical" },
  { code: "16-000", description: "Electrical" },
]

export function CostCodeSelector({
  value,
  onChange,
  placeholder = "Select cost code",
  className,
}: CostCodeSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedCode = costCodes.find((cc) => cc.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[150px] justify-between", className)}
        >
          <span className="truncate">
            {selectedCode ? selectedCode.code : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search cost codes..." />
          <CommandEmpty>No cost code found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {costCodes.map((costCode) => (
              <CommandItem
                key={costCode.code}
                value={`${costCode.code} ${costCode.description}`}
                onSelect={() => {
                  onChange(costCode.code)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === costCode.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{costCode.code}</div>
                  <div className="text-sm text-muted-foreground">
                    {costCode.description}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}