// API types - TypeScript interfaces for API requests and responses

export interface AskRequest {
    question: string;
}

export interface AskResponse {
    question: string;
    answer: string;
    sources: Array<{
        id: string;
        content: string;
        metadata?: {
            chapter?: string;
            page?: number;
            section?: string;
            [key: string]: any;  // Allow other metadata fields
        };
        score?: number;
    }>;
    timestamp: string;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
    service: string;
}

export interface ErrorResponse {
    error: string;
    details?: string;
    timestamp: string;
}