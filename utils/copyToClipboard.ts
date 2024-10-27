export function copyToClipboard(text: string) {
    function fallbackCopyToClipboard(text: string) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        fallbackCopyToClipboard(text);
    }
}
