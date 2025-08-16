import { validateChatInput, ChatRateLimit } from '../inputValidation';

describe('validateChatInput', () => {
  it('should validate normal input', () => {
    const result = validateChatInput('Hello, how are you?');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedInput).toBe('Hello, how are you?');
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty input', () => {
    const result = validateChatInput('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Input cannot be empty');
  });

  it('should reject input that is too long', () => {
    const longInput = 'a'.repeat(501);
    const result = validateChatInput(longInput);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Input is too long (maximum 500 characters)');
  });

  it('should reject HTML tags', () => {
    const result = validateChatInput('<script>alert("xss")</script>');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('HTML tags are not allowed');
  });

  it('should reject dangerous patterns', () => {
    const result = validateChatInput('javascript:alert("xss")');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Input contains potentially unsafe content');
  });

  it('should sanitize special characters', () => {
    const result = validateChatInput('Hello & world < > " \' /');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedInput).toBe('Hello &amp; world &lt; &gt; &quot; &#x27; &#x2F;');
  });
});

describe('ChatRateLimit', () => {
  it('should allow messages under the limit', () => {
    const rateLimit = new ChatRateLimit(5, 1); // 5 messages per minute
    
    for (let i = 0; i < 5; i++) {
      expect(rateLimit.canSendMessage()).toBe(true);
    }
  });

  it('should reject messages over the limit', () => {
    const rateLimit = new ChatRateLimit(2, 1); // 2 messages per minute
    
    expect(rateLimit.canSendMessage()).toBe(true);
    expect(rateLimit.canSendMessage()).toBe(true);
    expect(rateLimit.canSendMessage()).toBe(false);
  });

  it('should reset after time window', (done) => {
    const rateLimit = new ChatRateLimit(1, 0.01); // 1 message per 0.6 seconds
    
    expect(rateLimit.canSendMessage()).toBe(true);
    expect(rateLimit.canSendMessage()).toBe(false);
    
    setTimeout(() => {
      expect(rateLimit.canSendMessage()).toBe(true);
      done();
    }, 700);
  });
});