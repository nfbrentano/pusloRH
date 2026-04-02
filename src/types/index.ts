export type QuestionType =
  | 'Emoticons'
  | 'Slider'
  | 'Binary'
  | 'LikertAgreement'
  | 'LikertFrequency';

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: QuestionType;
  allowComment: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  openDate: string;
  closeDate: string;
  expectedResponses: number;
  isActive: boolean;
  createdAt: string;
}

export interface Response {
  id: string;
  surveyId: string;
  questionId: string;
  value: number | string;
  comment?: string;
  createdAt: string;
}

export type Locale = 'pt' | 'en';
export type TranslationKey = string;

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type SurveyInput = Omit<Survey, 'id' | 'createdAt'> & {
  questions: Omit<Question, 'id' | 'surveyId'>[];
};

export type ResponseInput = {
  questionId: string;
  value: number | string;
  comment?: string;
};
