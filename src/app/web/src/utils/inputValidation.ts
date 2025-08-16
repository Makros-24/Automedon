/**
 * Input validation utilities for secure user input handling
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedInput?: string;
  errors: string[];
}

/**
 * Sanitizes and validates chat input
 */
export function validateChatInput(input: string): ValidationResult {
  const errors: string[] = [];
  
  // Check if input is empty
  if (!input || typeof input !== 'string') {
    errors.push('Input cannot be empty');
    return { isValid: false, errors };
  }

  // Trim whitespace
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    errors.push('Input cannot be empty');
    return { isValid: false, errors };
  }

  // Check length limits
  if (trimmed.length > 500) {
    errors.push('Input is too long (maximum 500 characters)');
    return { isValid: false, errors };
  }

  if (trimmed.length < 1) {
    errors.push('Input is too short');
    return { isValid: false, errors };
  }

  // Basic HTML/Script injection prevention
  const hasHtmlTags = /<[^>]*>/g.test(trimmed);
  const hasScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(trimmed);
  
  if (hasHtmlTags || hasScriptTags) {
    errors.push('HTML tags are not allowed');
    return { isValid: false, errors };
  }

  // Check for potentially dangerous characters/patterns
  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /onmouseover=/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      errors.push('Input contains potentially unsafe content');
      return { isValid: false, errors };
    }
  }

  // Basic sanitization - escape special characters
  const sanitized = trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return {
    isValid: true,
    sanitizedInput: sanitized,
    errors: []
  };
}

/**
 * Rate limiting for chat messages
 */
export class ChatRateLimit {
  private timestamps: number[] = [];
  private readonly maxMessages: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxMessages: number = 10, timeWindowMinutes: number = 1) {
    this.maxMessages = maxMessages;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  canSendMessage(): boolean {
    const now = Date.now();
    
    // Remove old timestamps outside the time window
    this.timestamps = this.timestamps.filter(timestamp => 
      now - timestamp < this.timeWindow
    );

    // Check if under the limit
    if (this.timestamps.length < this.maxMessages) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  getRemainingTime(): number {
    if (this.timestamps.length === 0) return 0;
    
    const oldestTimestamp = Math.min(...this.timestamps);
    const remainingTime = this.timeWindow - (Date.now() - oldestTimestamp);
    
    return Math.max(0, remainingTime);
  }
}