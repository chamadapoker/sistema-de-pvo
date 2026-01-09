export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  blocked?: boolean;
  accessUntil?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  order: number;
  _count?: {
    equipments: number;
  };
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  description?: string;
  categoryId: number;
  category?: Category;
  imagePath: string;
  thumbnailPath?: string;
  country?: string;
  manufacturer?: string;
  year?: number;
  descriptionSource?: 'MANUAL' | 'AI_GENERATED';
  createdAt: string;
  updatedAt: string;
}

export interface StandardTest {
  id: string;
  name: string;
  description?: string;
  duration: number;
  questionCount: number;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
    results: number;
  };
}

export interface TestQuestion {
  id: string;
  testId: string;
  equipmentId: string;
  equipment?: Equipment;
  order: number;
  displayTime: number;
}

export type TestType = 'FREE' | 'STANDARD' | 'TRAINING';

export interface TestResult {
  id: string;
  userId: string;
  testId?: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  totalTime: number;
  testType: TestType;
  answers: string;
  completedAt: string;
  user?: User;
  test?: StandardTest;
}

export interface TestAnswer {
  equipmentId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}
