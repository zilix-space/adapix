'use client'

import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import {
  RadioGroup,
  RadioGroupItem,
} from '@design-system/react/components/ui/radio-group'
import { useTheme } from '@design-system/react/components/ui/theme-provider'

export function SettingsApparenceForm() {
  const { setTheme, theme } = useTheme()
  const { dict } = useDictionary()

  return (
    <div>
      <RadioGroup
        onValueChange={(value) => setTheme(value)}
        defaultValue={theme}
        className="grid max-w-md grid-cols-2 gap-8 pt-2"
      >
        <label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="light" className="sr-only" />
          <div className="items-center rounded border-2 border-muted p-1 hover:border-accent">
            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
              <div className="space-y-2 rounded bg-white p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded bg-[#ecedef]" />
              </div>
              <div className="flex items-center space-x-2 rounded bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded bg-[#ecedef]" />
              </div>
              <div className="flex items-center space-x-2 rounded bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded bg-[#ecedef]" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            {dict.dashboard.settings.theme.form.light}
          </span>
        </label>
        <label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="dark" className="sr-only" />
          <div className="items-center rounded border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-2 rounded-sm bg-zinc-950 p-2">
              <div className="space-y-2 rounded bg-zinc-800 p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded bg-zinc-400" />
                <div className="h-2 w-[100px] rounded bg-zinc-400" />
              </div>
              <div className="flex items-center space-x-2 rounded bg-zinc-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-zinc-400" />
                <div className="h-2 w-[100px] rounded bg-zinc-400" />
              </div>
              <div className="flex items-center space-x-2 rounded bg-zinc-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-zinc-400" />
                <div className="h-2 w-[100px] rounded bg-zinc-400" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            {dict.dashboard.settings.theme.form.dark}
          </span>
        </label>
      </RadioGroup>
    </div>
  )
}
