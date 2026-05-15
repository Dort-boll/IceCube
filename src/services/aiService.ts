import { ModelId, AnalysisResult } from '../types';
import { puter } from '@heyputer/puter.js';

export const chatWithAI = async (
  prompt: string, 
  model: ModelId = 'poolside/laguna-m.1:free'
): Promise<string> => {
  try {
    // Advanced Forensic Research Protocol Wrapper
    const auditContext = `[AUDIT_MODE: AUTONOMOUS_ICE_CUBE_V4]
You are Ice Cube, an elite autonomous forensic engine.
You operate on a recursive self-refining logic chain. 

GOALS:
1. DEEP FORENSICS: Trace data flow through hidden abstractions.
2. ADVERSARIAL THINKING: Model exploit vectors for detected anomalies.
3. AUTONOMOUS REASONING: Include a <THOUGHTS> block with internal logic.
4. BUG_CHAIN_ANALYSIS: Map how minor flaws cascade.

REQUIREMENTS:
- Output markdown with # FORENSIC_REPORT.
- Include ## VULNERABILITY_CHAIN and ## REMEDIATION_STRATEGY.
- Identify potential 0-day vectors with an INTEGRITY_SCORE (0-100).

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
  // Enhanced forensic metrics
  const vulnerabilityCount = (text.match(/vulnerability|exploit|bug|failure|anomaly|risk|critical/gi) || []).length;
  const chainCount = (text.match(/chain|sequence|step|leads to/gi) || []).length;
  
  const complexityScore = Math.min(100, (vulnerabilityCount * 15) + (chainCount * 10) + (text.length / 50));
  
  const hasHighRisk = /critical|p0|p1|impact: high/gi.test(text);
  const sentiment = hasHighRisk ? 'negative' : 'neutral';
  
  const words = text.toLowerCase().match(/\b(\w{5,})\b/g) || [];
  const freq: Record<string, number> = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  const keyTopics = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  return {
    sentiment,
    hallucinationProbability: Math.max(0.05, 0.2 - (vulnerabilityCount * 0.02)), // Higher bug count usually means more grounded analysis in this context
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
