// Recursively finds all text nodes.
function findTextNodes(node: SceneNode): ReadonlyArray<TextNode> {
    const textNodes = new Array<TextNode>()
    switch (node.type) {
        case "FRAME":
        case "GROUP":
        case "COMPONENT":
        case "COMPONENT_SET":
            textNodes.push(...node.children.flatMap(n => findTextNodes(n)))
            break;
        case "TEXT":
            textNodes.push(node)
            break;
        default:
            // ignore all other types of nodes. 
            break;
    }
    return textNodes
}

(async function () {
    const selectedNodes = figma.currentPage.selection

    // We want to recursively find all the text nodes for each selected node.
    const textNodes: ReadonlyArray<TextNode> = selectedNodes.flatMap(s => findTextNodes(s))
    for (const textNode of textNodes) {
        if (typeof textNode.fontName === "object") {
            await figma.loadFontAsync(textNode.fontName)
        }
        textNode.characters = textNode.name
    }
    figma.closePlugin()
})()