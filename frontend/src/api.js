const API_BASE = 'http://localhost:8000';

export const api = {
  // List all conversations
  async listConversations() {
    const response = await fetch(`${API_BASE}/api/conversations`);
    if (!response.ok) throw new Error('Failed to list conversations');
    return response.json();
  },

  // Get a single conversation
  async getConversation(id) {
    const response = await fetch(`${API_BASE}/api/conversations/${id}`);
    if (!response.ok) throw new Error('Failed to get conversation');
    return response.json();
  },

  // Create a new conversation
  async createConversation() {
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  },

  // Send a message (streaming)
  async sendMessageStream(conversationId, content, onEvent) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/message/stream`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) throw new Error('Failed to send message');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6));
            onEvent(event.type, event);
          } catch (e) {
            console.error('Failed to parse event:', e);
          }
        }
      }
    }
  },

  // Transcribe audio to text
  async transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    const response = await fetch(`${API_BASE}/api/transcribe`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Transcription failed');
    return response.json();
  },

  // Analyze image
  async analyzeImage(imageFile, question = '') {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (question) formData.append('question', question);
    const response = await fetch(`${API_BASE}/api/analyze-image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Image analysis failed');
    return response.json();
  },

  // Extract document text
  async extractDocument(docFile) {
    const formData = new FormData();
    formData.append('document', docFile);
    const response = await fetch(`${API_BASE}/api/extract-document`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Document extraction failed');
    return response.json();
  },
};
