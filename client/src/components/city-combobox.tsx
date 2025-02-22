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

// Indian cities with states
const cities = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Chandigarh", state: "Punjab & Haryana" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Patna", state: "Bihar" },
  { city: "Kochi", state: "Kerala" },
  { city: "Guwahati", state: "Assam" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Dehradun", state: "Uttarakhand" },
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Shimla", state: "Himachal Pradesh" },
  // Add more cities as needed
].sort((a, b) => a.city.localeCompare(b.city));

export function CityCombobox({ value, onChange }: { 
  value: string, 
  onChange: (value: string) => void 
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? cities.find((city) => `${city.city}, ${city.state}` === value)?.city
            : "Select city..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {cities.map((city) => (
              <CommandItem
                key={city.city}
                onSelect={() => {
                  onChange(`${city.city}, ${city.state}`)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === `${city.city}, ${city.state}` ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.city}, {city.state}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
