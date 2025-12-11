/**
 * Compatible AI tools that work with PromptFinder workflows
 * Used for SEO, Schema.org markup, and UI display
 */

export const COMPATIBLE_AI_TOOLS = [
  { name: 'ChatGPT', slug: 'chatgpt' },
  { name: 'Claude', slug: 'claude' },
  { name: 'Gemini', slug: 'gemini' },
  { name: 'Copilot', slug: 'copilot' }
] as const;

export type AITool = typeof COMPATIBLE_AI_TOOLS[number];

/**
 * Get the display names of compatible AI tools for a given workflow tool setting
 * @param tool - The workflow's tool setting (e.g., 'any', 'cursor', 'chatgpt')
 * @returns Array of tool names to display
 */
export function getCompatibleToolNames(tool: string = 'any'): string[] {
  // If workflow is for a specific tool, only show that tool
  if (tool && tool !== 'any') {
    // Check if it's one of the known tools
    const specificTool = COMPATIBLE_AI_TOOLS.find(t => t.slug === tool.toLowerCase());
    if (specificTool) {
      return [specificTool.name];
    }
    // For tools like "cursor" that aren't in our list, capitalize and return
    return [tool.charAt(0).toUpperCase() + tool.slice(1)];
  }
  
  // Default: return all tools for "any" or undefined
  return COMPATIBLE_AI_TOOLS.map(t => t.name);
}

/**
 * Get formatted string for display: "ChatGPT • Claude • Gemini • Copilot"
 */
export function getCompatibleToolsDisplay(tool: string = 'any'): string {
  return getCompatibleToolNames(tool).join(' • ');
}

/**
 * Get tool names for Schema.org softwareRequirements
 * Uses full product names for clarity
 */
export function getSchemaToolRequirements(tool: string = 'any'): string[] {
  if (tool && tool !== 'any') {
    const toolMap: Record<string, string> = {
      chatgpt: 'ChatGPT',
      claude: 'Claude',
      gemini: 'Gemini',
      copilot: 'Microsoft Copilot',
      cursor: 'Cursor'
    };
    return [toolMap[tool.toLowerCase()] || tool];
  }
  
  return ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot'];
}

/**
 * Get short tool list for meta descriptions: "ChatGPT, Claude or Gemini"
 */
export function getMetaDescriptionTools(tool: string = 'any'): string {
  const tools = getCompatibleToolNames(tool);
  
  if (tools.length === 1) {
    return tools[0];
  }
  
  // For meta: "ChatGPT, Claude or Gemini" (only first 3 to keep it short)
  const shortList = tools.slice(0, 3);
  if (shortList.length === 2) {
    return `${shortList[0]} or ${shortList[1]}`;
  }
  
  return `${shortList.slice(0, -1).join(', ')} or ${shortList[shortList.length - 1]}`;
}

