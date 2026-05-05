import { ModelId, AnalysisResult } from '../types';
import { puter } from '@heyputer/puter.js';

export const chatWithAI = async (
  prompt: string, 
  model: ModelId = 'poolside/laguna-m.1:free'
): Promise<string> => {
  try {
    // Advanced Forensic Research Protocol Wrapper
    const auditContext = `[AUDIT_MODE: STOCHASTIC_PATTERN_ANALYSIS]
You are Ice Cube, a specialized code forensics and structural integrity engine.
Your analysis must utilize Deep Pattern Recognition to:
1. Trace logical dependencies across the entire code block.
2. Identify non-obvious race conditions and memory leaks.
3. Detect "Silent Failures" where code runs but produces incorrect state.
4. Provide structured refactoring suggestions with complexity impacts.
5. Explain the mathematical or logical reason for every vulnerability.

Do not use conversational filler. Focus strictly on binary/logic forensic audit.
If vulnerabilities are found, rank them by Criticality (P0-P3).

QUERY: ${prompt}`;

    const response = await puter.ai.chat(auditContext, { model });
    
    // Detailed path selection for Ice Cube Engine (Puter.js)
    if (!response) return "No response from Cloud.";
    
    const message = response.message;
    if (!message) return response.toString() || "Empty response object.";

    const content = message.content;
    
    // Handle string content
    if (typeof content === 'string') return content;
    
    // Handle array content (common in advanced/reasoning models)
    if (Array.isArray(content)) {
      return content
        .map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return (item as any).text || (item as any).content || '';
          }
          return '';
        })
        .join('\n');
    }

    return response.toString() || "Untyped response.";
  } catch (error) {
    console.error('Ice Cube Engine Error:', error);
    throw error;
  }
};

export const analyzeText = (text: string): AnalysisResult => {
  // Heuristic-based analysis as per prompt requirements
  const sentimentScore = (text.match(/happy|great|excellent|good|love|awesome|perfect/gi) || []).length - 
                        (text.match(/bad|terrible|horrible|wrong|error|fail|sad/gi) || []).length;
  
  const sentiment = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';
  
  // Basic hallucination probability based on complexity and certain fuzzy keywords
  const hasFuzzyKeywords = /maybe|perhaps|likely|possibly|i think/gi.test(text);
  const hallucinationProbability = hasFuzzyKeywords ? 0.35 : 0.1;
  
  // Key topics extraction (simple word frequency)
  const words = text.toLowerCase().match(/\b(\w{5,})\b/g) || [];
  const freq: Record<string, number> = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  const keyTopics = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  const complexityScore = Math.min(100, Math.floor(text.length / 20) + (words.length * 2));

  return {
    sentiment,
    hallucinationProbability,
    keyTopics,
    complexityScore
  };
};

export const safetyCheck = (prompt: string): { safe: boolean; reason?: string } => {
  const riskyKeywords = [/ignore previous instructions/i, /system prompt/i, /password/i, /secret/i, /hack/i];
  
  for (const regex of riskyKeywords) {
    if (regex.test(prompt)) {
      return { safe: false, reason: 'Safety violation: Potentially harmful or restricted query detected.' };
    }
  }
  
  return { safe: true };
};
