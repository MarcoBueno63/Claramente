"use client";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import ptBR from "../public/locales/pt-BR/common.json";

export default function ClientIntlProvider({ children }: { children: React.ReactNode }) {
  // next-intl's `useTranslations('common')` expects messages to be namespaced
  // (e.g. { common: { ... } }). Wrap the loaded common.json under the
  // `common` key so client hooks can resolve translations.
  const messages = { common: ptBR } as const;

  return (
    <NextIntlClientProvider messages={messages} locale="pt-BR">
      {children}
    </NextIntlClientProvider>
  );
}
