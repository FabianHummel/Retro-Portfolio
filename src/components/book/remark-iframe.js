import { visit } from 'unist-util-visit';

export function remarkHtmlIframe() {
    return (tree) => {
        // Wir suchen nach 'html' Knoten (das ist der Standardtyp für rohes HTML in Remark)
        visit(tree, 'html', (node, index, parent) => {
            if (!node.value || !node.value.startsWith('<iframe')) return;

            // Reguläre Ausdrücke, um src und title aus dem HTML-String zu fischen
            const srcMatch = node.value.match(/src=["']([^"']+)["']/);
            const titleMatch = node.value.match(/title=["']([^"']+)["']/);

            if (!srcMatch) return;

            const getAttr = (attr) => {
                const match = node.value.match(new RegExp(`${attr}=["']([^"']+)["']`, 'i'));
                return match ? match[1] : undefined;
            };

            const attrRegex = /([\w-]+)=["']([^"']*)["']/g;
            let match;

            const rawHtml = node.value;
            const properties = {};


            while ((match = attrRegex.exec(rawHtml)) !== null) {
                const key = match[1].toLowerCase();
                const value = match[2];

                // SolidJS mag 'class', React mag 'className'. Wir mappen zur Sicherheit beide.
                if (key === 'classname' || key === 'class') {
                    properties['class'] = value;
                } else {
                    properties[key] = value;
                }
            }

            // Falls kein src gefunden wurde, brechen wir ab
            // @ts-ignore
            if (!properties.src) return;

            // HTML-String-Knoten in ein strukturiertes AST-Element umwandeln
            Object.assign(node, {
                type: 'markdownIFrame',
                data: {
                    hName: 'MarkdownIFrame', // Rendert das native HTML <iframe> Tag
                    hProperties: {
                        ...properties,
                    },
                },
                children: [],
            });
        });
    };
}
