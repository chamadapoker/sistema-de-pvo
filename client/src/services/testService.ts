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

export const testService = {
    // Listar todas as provas (instrutor)
    async getAllTests(): Promise<ScheduledTest[]> {
        try {
            const { data, error } = await supabase
                .from('tests')
                .select('*')
                .order('created_at', { ascending: false }); // snake_case is likely what DB has, but standard tests might be camel case in frontend

            if (error) throw error;

            // Map keys just in case
            return data.map((t: any) => ({
                ...t,
                createdAt: t.created_at,
                questionCount: t.question_count || t.questionCount || 0,
                creatorId: t.creator_id
            })) as ScheduledTest[];
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
                .select(`
                    *,
                    questions:test_questions(*)
                 `)
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

            const correctCount = resultData.answers.filter((a: any) => a.isCorrect).length;
            const score = resultData.answers.length > 0
                ? (correctCount / resultData.answers.length) * 100
                : 0;

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
                    name: testData.title || testData.name, // Support both fields
                    description: testData.description,
                    duration: (testData.questionCount || 20) * (testData.time_per_question || 30),
                    question_count: testData.questionCount || testData.questions?.length || 20,
                    creator_id: user?.id,
                    location: testData.location,
                    category_id: testData.category_id,
                    status: 'SCHEDULED' // Default status
                })
                .select()
                .single();

            if (error) throw error;

            // If there are specific questions (Written Test), insert them
            // The questions array coming from the frontend is expected to be an array of Equipment IDs for CreateTestWithQuestions call
            // OR map directly if called differently.
            // Based on CreateTestPage.tsx: createTestWithQuestions passes array of IDs.

            // Check if we have 'questions' (implied ID list from logic below)
            if (testData.questions && testData.questions.length > 0) {
                // Map equipment IDs to DB rows
                const questionsToInsert = testData.questions.map((qId: string, index: number) => ({
                    test_id: test.id,
                    equipment_id: qId,
                    question_order: index
                }));

                const { error: qError } = await supabase
                    .from('test_questions')
                    .insert(questionsToInsert);

                if (qError) console.error("Error inserting questions:", qError);
            }

            return test as ScheduledTest;
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao criar teste');
        }
    },

    async createTestWithQuestions(data: any, eqIds: string[]): Promise<ScheduledTest> {
        // Pass eqIds as 'questions' property to the main create function
        return this.createTest({ ...data, questions: eqIds });
    },

    // ---- MOCKED / NOT IMPLEMENTED ----
    async deleteTest(testId: string): Promise<void> {
        const { error } = await supabase.from('tests').delete().eq('id', testId);
        if (error) throw error;
    },

    async activateTest(_testId: string): Promise<void> { console.warn('activateTest not implemented'); },
    async finishTest(_testId: string): Promise<void> { console.warn('finishTest not implemented'); },
    async getTestStatistics(_testId: string): Promise<any> { return {}; },
    async createAttempt(_testId: string): Promise<any> { return {}; },
    async updateAttempt(_attemptId: string, _updates: any): Promise<void> { },
    async completeAttempt(_attemptId: string, _score: number, _correct: number, _total: number, _time: number, _answers: any[]): Promise<void> { },
    async getTestAttempts(_testId: string): Promise<any[]> { return []; },
    async getStudentAttempt(_testId: string): Promise<any> { return null; },
    async updateTest(_testId: string, _updates: any): Promise<void> { console.warn('updateTest not implemented'); },

    async getStudentsWhoMissedTest(_testId: string): Promise<any[]> { return []; },
    async addStudentToTest(_testId: string, _studentId: string): Promise<void> { },
    async addMultipleStudentsToTest(_testId: string, _ids: string[]): Promise<void> { },
    async addMissingStudentsAutomatic(_oldId: string, _newId: string): Promise<number> { return 0; },
    async removeStudentFromTest(_testId: string, _studentId: string): Promise<void> { },
    async getTestAllowedStudents(_testId: string): Promise<any[]> { return []; },
    async canStudentTakeTest(_testId: string): Promise<boolean> { return true; },

    async saveStudentAnswer(_attemptId: string, _qId: string, _text: string, _time?: number): Promise<void> { },
    async getStudentAnswers(_attemptId: string): Promise<any[]> { return []; },
    async correctAnswer(_ansId: string, _correct: boolean, _points: number, _feedback?: string): Promise<void> { },
    async calculateWrittenTestScore(_attemptId: string): Promise<void> { },
    async getTestsNeedingCorrection(): Promise<any[]> { return []; },
    async getAttemptForCorrection(_attemptId: string): Promise<any> { return { attempt: {}, answers: [] }; },
    async getTestAttemptsForCorrection(_testId: string): Promise<any[]> { return []; },

    async getTestQuestions(_testId: string): Promise<any[]> { return []; }
};
