import React from "react";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.split("-")[0];

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
        {t("language.select")}
      </span>
      <Select value={currentLang} onValueChange={val => i18n.changeLanguage(val)}>
        <SelectTrigger className="w-32 h-8 rounded-full border-amber-200 bg-white/80 dark:bg-slate-900/80 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.filter(l => l.code === "en" || l.code === "am").map(lang => (
            <SelectItem key={lang.code} value={lang.code} className="flex items-center gap-2">
              <span className="mr-1 text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
