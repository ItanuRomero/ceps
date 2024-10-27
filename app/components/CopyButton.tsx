'use client'

import { copyToClipboard } from "@/utils/copyToClipboard";

export function CopyButton({text}: {text: string}) {
    return <button onClick={() => copyToClipboard(text)}>Copiar</button>
}