"use client";

import { Trash2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconButton } from "@/components/admin/icon-button";
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PLATFORMS = ["facebook", "instagram", "whatsapp", "x", "linkedin", "youtube"] as const;
type Platform = (typeof PLATFORMS)[number];

export function SocialMediaField({
  control,
}: {
  control: import("react-hook-form").Control<
    import("@/schemas").TeamMemberInput
  >;
}) {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Social Media</span>
      <FormField
        control={control}
        name="socialMedia"
        render={({ field }) => {
          const current = (field.value ?? {}) as Record<string, unknown>;
          const isSet = (k: Platform) =>
            current[k] !== undefined && current[k] !== null;
          const selected = PLATFORMS.filter(isSet);
          const available = PLATFORMS.filter((k) => !isSet(k));

          const addPlatform = (key: Platform) =>
            field.onChange({ ...current, [key]: { href: "", visible: true } });
          const removePlatform = (key: Platform) => {
            const next = { ...current };
            delete next[key];
            field.onChange(next);
          };

          return (
            <div className="space-y-3">
              {available.length > 0 && (
                <Select value="" onValueChange={(v) => addPlatform(v as Platform)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a social media platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {available.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {selected.map((key) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div key={key} className="flex items-end gap-2">
                    <FormField
                      control={control}
                      name={`socialMedia.${key}.href` as const}
                      render={({ field: f }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...f} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`socialMedia.${key}.visible` as const}
                      render={({ field: f }) => (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <StatusToggle
                              checked={!!f.value}
                              onCheckedChange={(checked) => f.onChange(checked)}
                              aria-label={f.value === false ? `Show ${label}` : `Hide ${label}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {f.value === false ? `Show ${label}` : `Hide ${label}`}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    />
                    <IconButton
                      variant="destructive"
                      label={`Remove ${label}`}
                      icon={<Trash2 />}
                      onClick={() => removePlatform(key)}
                    />
                  </div>
                );
              })}

              {selected.length === 0 && (
                <p className="text-sm text-muted-foreground">No social media added yet.</p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
