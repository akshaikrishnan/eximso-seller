export function splitSections(raw: string) {
    // normalize line endings
    const text = raw.replace(/\r\n/g, '\n');

    const htmlStart = text.indexOf('---HTML---');
    const kwStart = text.indexOf('---KEYWORDS---');

    let html = '';
    let kw = '';
    if (htmlStart !== -1 && kwStart !== -1) {
        html = text.slice(htmlStart + '---HTML---'.length, kwStart).trim();
        kw = text.slice(kwStart + '---KEYWORDS---'.length).trim();
    } else {
        // Fallback: no markers? treat all as HTML
        html = text.trim();
    }
    return { html, kw };
}

export function parseKeywords(s: string): string[] {
    if (!s) return [];
    return s
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 15);
}

// Optional: belt-and-suspenders removal in case the model still tries to add code fences.
export function stripFences(s: string) {
    return s.replace(/^\s*```[\s\S]*?\n?|\n?```\s*$/g, '').trim();
}
