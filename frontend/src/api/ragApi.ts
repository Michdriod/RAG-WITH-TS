// API service for Medical RAG backend

const API_BASE_URL = 'http://localhost:3000/api';

export interface Source {
  page?: number;
  chapter?: string;
  section?: string;
  content: string;
  score: number;
}

export interface AskResponse {
  question: string;
  answer: string;
  sources: Source[];
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
}

export async function askQuestion(question: string): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error || 'Failed to get answer');
  }

  return response.json();
}
