export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export enum AIServiceAction {
  SUMMARIZE = 'SUMMARIZE',
  FIX_GRAMMAR = 'FIX_GRAMMAR',
  AUTO_TITLE = 'AUTO_TITLE',
  CONTINUE_WRITING = 'CONTINUE_WRITING'
}

export interface AIResponse {
  text: string;
}
