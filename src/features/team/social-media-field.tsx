"use client";

import { Trash2 } from "lucide-react";
import type { TeamMemberInput } from "@/schemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconButton } from "@/components/admin/icon-button";
import { StatusToggle } from "@/components/ui/status-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PLATFORMS = [
  "facebook",
  "instagram",
  "whatsapp",
  "x",
  "linkedin",
  "youtube",
  "snapchat",
  "tiktok",
] as const;
type Platform = (typeof PLATFORMS)[number];

type SocialLink = TeamMemberInput["socialMedia"][Platform];

export function SocialMediaField({
  control,
}: {
  control: import("react-hook-form").Control<TeamMemberInput>;
}) {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Social Media</span>
      <FormField
        control={control}
        name="socialMedia"
        render={({ field }) => {
          const current = (field.value ?? {}) as Partial<
            Record<Platform, SocialLink>
          >;
          const selected = PLATFORMS.filter(
            (k): k is Platform => current[k] !== undefined && current[k] !== null,
          );
          const available = PLATFORMS.filter(
            (k) => current[k] === undefined || current[k] === null,
          );

          const addPlatform = (key: Platform) => {
            const next: Partial<Record<Platform, SocialLink>> = {
              ...current,
              [key]: { href: "", visible: true },
            };
            field.onChange(next);
          };

          const removePlatform = (key: Platform) => {
            const next: Partial<Record<Platform, SocialLink>> = { ...current };
            delete next[key];
            field.onChange(next);
          };

          return (
            <div className="space-y-3">
              {available.length > 0 && (
                <Select
                  value={undefined}
                  onValueChange={(v) => addPlatform(v as Platform)}
                >
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
                            <Input
                              placeholder="https://..."
                              value={f.value as string}
                              onChange={(e) => f.onChange(e.target.value)}
                              onBlur={f.onBlur}
                            />
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
                            <span
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              <StatusToggle
                                checked={!!f.value}
                                onCheckedChange={() => f.onChange(!f.value)}
                                aria-label={
                                  f.value === false
                                    ? `Show ${label}`
                                    : `Hide ${label}`
                                }
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {f.value === false
                              ? `Show ${label}`
                              : `Hide ${label}`}
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
                <p className="text-sm text-muted-foreground">
                  No social media added yet.
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
