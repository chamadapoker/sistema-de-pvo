import { supabase } from '../lib/supabase';

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
    // Listar todas as provas (instrutor)
    async getAllTests(): Promise<ScheduledTest[]> {
        try {
            const { data, error } = await supabase
                .from('tests')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) throw error;
            return data as ScheduledTest[];
        } catch (error) {
            console.error('Erro ao buscar testes', error);
            return [];
        }
    },

    // Listar provas do aluno
    async getStudentTests(): Promise<ScheduledTest[]> {
        return this.getAllTests();
    },

    // Obter detalhes de uma prova
    async getTest(testId: string, _password?: string): Promise<ScheduledTest> {
        try {
            const { data, error } = await supabase
                .from('tests')
                .select('*')
                .eq('id', testId)
                .single();

            if (error) throw error;
            return data as ScheduledTest;
        } catch (error: any) {
            throw error;
        }
    },

    // Enviar resultado
    async submitResult(resultData: { testId?: string; answers: any[]; totalTime: number; testType: string }): Promise<TestResult> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            // Calculate score simple logic or just store raw data. 
            // Assuming the backend did logic, here we might need to trust the client sending correct/score or recalculate.
            // For now, we trust the caller has calculated score or we store raw answers.
            // Simplifying: just storing the result.

            const correctCount = resultData.answers.filter((a: any) => a.isCorrect).length;
            const score = (correctCount / resultData.answers.length) * 100 || 0;

            const { data, error } = await supabase
                .from('test_results')
                .insert({
                    userId: user.id,
                    testId: resultData.testId,
                    score: score,
                    correctAnswers: correctCount,
                    totalQuestions: resultData.answers.length,
                    totalTime: resultData.totalTime,
                    testType: resultData.testType,
                    answers: JSON.stringify(resultData.answers),
                    completedAt: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data as TestResult;
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao salvar resultado');
        }
    },

    // Obter meus resultados
    async getMyResults(): Promise<TestResult[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('test_results')
                .select(`
                    *,
                    test:tests(*)
                `)
                .eq('userId', user.id)
                .order('completedAt', { ascending: false });

            if (error) throw error;
            return data as TestResult[];
        } catch (error) {
            console.error('Erro ao buscar resultados', error);
            return [];
        }
    },

    // Criar prova (Adm/Instrutor)
    async createTest(testData: any): Promise<ScheduledTest> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Insert test
            const { data: test, error } = await supabase
                .from('tests')
                .insert({
                    name: testData.name,
                    description: testData.description,
                    duration: testData.duration,
                    questionCount: testData.questionCount || testData.questions?.length || 0,
                    creatorId: user?.id
                })
                .select()
                .single();

            if (error) throw error;

            // If there are questions, insert them. Assuming 'test_questions' table exists or similar logic
            if (testData.questions && testData.questions.length > 0) {
                const questionsToInsert = testData.questions.map((q: any, index: number) => ({
                    testId: test.id,
                    equipmentId: q.equipmentId,
                    order: index
                }));

                // Note: You might need to check if 'test_questions' table exists in your schema
                // await supabase.from('test_questions').insert(questionsToInsert);
            }

            return test as ScheduledTest;
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao criar teste');
        }
    },

    // ---- MOCKED / NOT IMPLEMENTED ----

    async activateTest(_testId: string): Promise<void> { console.warn('activateTest not implemented'); },
    async finishTest(_testId: string): Promise<void> { console.warn('finishTest not implemented'); },
    async getTestStatistics(_testId: string): Promise<any> { return {}; },
    async createAttempt(_testId: string): Promise<any> { return {}; },
    async updateAttempt(_attemptId: string, _updates: any): Promise<void> { },
    async completeAttempt(_attemptId: string, _score: number, _correct: number, _total: number, _time: number, _answers: any[]): Promise<void> { },
    async getTestAttempts(_testId: string): Promise<any[]> { return []; },
    async getStudentAttempt(_testId: string): Promise<any> { return null; },
    async deleteTest(_testId: string): Promise<void> {
        await supabase.from('tests').delete().eq('id', _testId);
    },
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
        // Fallback to simple create logic
        return this.createTest({ ...data, questions: eqIds.map(id => ({ equipmentId: id })) });
    },
    async getTestQuestions(_testId: string): Promise<any[]> { return []; }
};
