import { visit } from 'unist-util-visit';

export function remarkArticleLink() {
    // Regex to match something starting with @ and ending with .md (e.g., @path/to/article.md)
    const regex = /@([\w\-/]+\.md)/g;

    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            if (!node.value || !regex.test(node.value)) return;

            regex.lastIndex = 0; // Reset regex pointer
            const nodes = [];
            let lastIndex = 0;
            let match: RegExpMatchArray;

            while ((match = regex.exec(node.value)) !== null) {
                const matchIndex = match.index;
                const articlePath = match[1]; // path/to/article.md

                // Add text before the match, if any
                if (matchIndex > lastIndex) {
                    nodes.push({
                        type: 'text',
                        value: node.value.slice(lastIndex, matchIndex),
                    });
                }

                // Add the custom component node
                nodes.push({
                    type: 'articleLink', // Custom node type
                    data: {
                        hName: 'ArticleLink', // Tells rehype/renderers the HTML/Component tag name
                        hProperties: {
                            path: articlePath, // Passed as a prop to your Solid component
                        },
                    },
                    children: [],
                });

                lastIndex = regex.lastIndex;
            }

            // Add remaining text after the last match
            if (lastIndex < node.value.length) {
                nodes.push({
                    type: 'text',
                    value: node.value.slice(lastIndex),
                });
            }

            // Replace the old text node with our new split nodes
            parent.children.splice(index, 1, ...nodes);

            // Return the next index to skip visiting the nodes we just created
            return index + nodes.length;
        });
    };
}
