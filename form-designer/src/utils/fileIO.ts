export function supportsFileSystemAccessAPI() {
    return (
        typeof window !== "undefined" &&
        "showOpenFilePicker" in window &&
        "showSaveFilePicker" in window
    );
}

export async function openTextByPicker(accept: Record<string, string[]>): Promise<{ name: string; text: string } | null> {
    // @ts-ignore
    const picker = window.showOpenFilePicker;
    if (!picker) return null;
    // @ts-ignore
    const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [{ description: "Schema files", accept }],
    });
    const file = await handle.getFile();
    const text = await file.text();
    return { name: file.name, text };
}

export async function saveTextByPicker(
    suggestedName: string,
    text: string,
    mime: string,
    accept: Record<string, string[]>
): Promise<boolean> {
    // @ts-ignore
    const picker = window.showSaveFilePicker;
    if (!picker) return false;
    // @ts-ignore
    const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: "Schema file", accept }],
    });
    const writable = await handle.createWritable();
    await writable.write(new Blob([text], { type: mime }));
    await writable.close();
    return true;
}

export async function saveTextToDirectory(
    fileName: string,
    text: string,
    mime: string
): Promise<boolean> {
    // @ts-ignore
    const dirPicker = window.showDirectoryPicker;
    if (!dirPicker) return false;
    // @ts-ignore
    const dirHandle = await window.showDirectoryPicker();
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(new Blob([text], { type: mime }));
    await writable.close();
    return true;
}

export function downloadText(filename: string, text: string, mime: string) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
