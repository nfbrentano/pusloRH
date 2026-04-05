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
  questions: Question[];
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

export type UserRole = 'ADMIN' | 'USER' | 'HR';
export type UserStatus = 'Active' | 'Inactive';

export interface Department {
  id: string;
  name: string;
  color: string;
  _count?: {
    users: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus | string;
  departmentId?: string;
  department?: Department;
  createdAt: string;
}

// Input Types for Mutations
export type SurveyInput = Omit<Survey, 'id' | 'createdAt' | 'questions'> & {
  questions: Omit<Question, 'id' | 'surveyId'>[];
};

export type SurveyUpdateInput = Partial<SurveyInput> & {
  isActive?: boolean;
};

export type ResponseInput = {
  questionId: string;
  value: number | string;
  comment?: string;
};

export type UserInput = Omit<User, 'id' | 'createdAt' | 'department'> & {
  password?: string;
};

export type UserUpdateInput = Partial<UserInput>;
