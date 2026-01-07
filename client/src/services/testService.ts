import { api } from './api';

export interface ScheduledTest {
    id: string;
    name: string;
    description?: string;
    duration: number;
    questionCount: number;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    questions?: any[];
}

export interface TestResult {
    id: string;
    userId: string;
    testId?: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number;
    testType: string;
    answers: string;
    completedAt: string;
    user?: any;
    test?: any;
}

export interface StudentAnswer {
    question_id: string;
    answer_text: string;
    score?: number;
    feedback?: string;
    time_spent_seconds?: number;
    is_correct?: boolean;
}

export interface TestQuestion {
    id: string;
    test_id: string;
    equipment_id: string; // UUID
    question_number: number;
    question_text?: string;
    options?: any;
    correct_answer_id?: number;
    points: number;
    created_at: string;
}

export interface TestAttempt {
    id: string;
    test_id: string;
    student_id: string;
    started_at: string;
    finished_at?: string;
    score?: number;
    points?: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
}

export const testService = {
    // Listar todas as provas (instrutor) - Adjusted to match server response structure if needed
    // Server returns { tests: [] }
    async getAllTests(): Promise<ScheduledTest[]> {
        try {
            const response = await api.get<{ tests: ScheduledTest[] }>('/tests');
            return response.data.tests;
        } catch (error) {
            console.error('Erro ao buscar testes', error);
            return [];
        }
    },

    // Listar provas do aluno (apenas SCHEDULED e ACTIVE)
    // Local API doesn't distinguish nicely yet, so reusing getAllTests or filtering if needed. 
    // For now returning all tests as the server implementation is simple.
    async getStudentTests(): Promise<ScheduledTest[]> {
        return this.getAllTests();
    },

    // Obter detalhes de uma prova
    async getTest(testId: string, password?: string): Promise<ScheduledTest> {
        try {
            const response = await api.get<{ test: ScheduledTest }>(`/tests/${testId}`, {
                params: { password }
            });
            return response.data.test;
        } catch (error: any) {
            throw error;
        }
    },

    // Enviar resultado
    async submitResult(resultData: { testId?: string; answers: any[]; totalTime: number; testType: string }): Promise<TestResult> {
        try {
            const response = await api.post<{ message: string; result: TestResult }>('/tests/results', resultData);
            return response.data.result;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erro ao salvar resultado');
        }
    },

    // Obter meus resultados
    async getMyResults(): Promise<TestResult[]> {
        try {
            const response = await api.get<{ results: TestResult[] }>('/tests/results/me');
            return response.data.results;
        } catch (error) {
            console.error('Erro ao buscar resultados', error);
            return [];
        }
    },

    // Criar prova (Adm/Instrutor)
    async createTest(testData: any): Promise<ScheduledTest> {
        try {
            // Adapt payload to server expectations (server expects { questions: [...] })
            // This might need adjustment based on UI form
            const response = await api.post<{ message: string; test: ScheduledTest }>('/tests', testData);
            return response.data.test;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erro ao criar teste');
        }
    },

    // ---- MOCKED / NOT IMPLEMENTED ----
    // methods that exist in the interface but backend doesn't support yet

    async activateTest(_testId: string): Promise<void> { console.warn('activateTest not implemented'); },
    async finishTest(_testId: string): Promise<void> { console.warn('finishTest not implemented'); },
    async getTestStatistics(_testId: string): Promise<any> { return {}; },
    async createAttempt(_testId: string): Promise<any> { return {}; },
    async updateAttempt(_attemptId: string, _updates: any): Promise<void> { },
    async completeAttempt(_attemptId: string, _score: number, _correct: number, _total: number, _time: number, _answers: any[]): Promise<void> { },
    async getTestAttempts(_testId: string): Promise<any[]> { return []; },
    async getStudentAttempt(_testId: string): Promise<any> { return null; },
    async deleteTest(_testId: string): Promise<void> { console.warn('deleteTest not implemented'); },
    async updateTest(_testId: string, _updates: any): Promise<void> { console.warn('updateTest not implemented'); },

    // Whitelist methods (mocked)
    async getStudentsWhoMissedTest(_testId: string): Promise<any[]> { return []; },
    async addStudentToTest(_testId: string, _studentId: string): Promise<void> { },
    async addMultipleStudentsToTest(_testId: string, _ids: string[]): Promise<void> { },
    async addMissingStudentsAutomatic(_oldId: string, _newId: string): Promise<number> { return 0; },
    async removeStudentFromTest(_testId: string, _studentId: string): Promise<void> { },
    async getTestAllowedStudents(_testId: string): Promise<any[]> { return []; },
    async canStudentTakeTest(_testId: string): Promise<boolean> { return true; },

    // Correction methods
    async saveStudentAnswer(_attemptId: string, _qId: string, _text: string, _time?: number): Promise<void> { },
    async getStudentAnswers(_attemptId: string): Promise<any[]> { return []; },
    async correctAnswer(_ansId: string, _correct: boolean, _points: number, _feedback?: string): Promise<void> { },
    async calculateWrittenTestScore(_attemptId: string): Promise<void> { },
    async getTestsNeedingCorrection(): Promise<any[]> { return []; },
    async getAttemptForCorrection(_attemptId: string): Promise<any> { return { attempt: {}, answers: [] }; },
    async getTestAttemptsForCorrection(_testId: string): Promise<any[]> { return []; },

    async createTestWithQuestions(data: any, eqIds: string[]): Promise<ScheduledTest> {
        // Fallback to simple create
        return this.createTest({ ...data, questions: eqIds.map(id => ({ equipmentId: id })) });
    },
    async getTestQuestions(_testId: string): Promise<any[]> { return []; }
};
