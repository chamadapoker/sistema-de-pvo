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
                .order('created_at', { ascending: false });

            if (error) throw error;

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
                    user_id: user.id,
                    test_id: resultData.testId,
                    score: score,
                    correct_answers: correctCount,
                    total_questions: resultData.answers.length,
                    total_time: resultData.totalTime,
                    test_type: resultData.testType,
                    answers: JSON.stringify(resultData.answers),
                    completed_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            // Map back to camelCase for return
            const mapped = {
                ...data,
                userId: data.user_id,
                testId: data.test_id,
                correctAnswers: data.correct_answers,
                totalQuestions: data.total_questions,
                totalTime: data.total_time,
                testType: data.test_type,
                completedAt: data.completed_at
            };

            return mapped as TestResult;
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
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            if (error) throw error;

            // Map
            return data.map((item: any) => ({
                ...item,
                userId: item.user_id,
                testId: item.test_id,
                correctAnswers: item.correct_answers,
                totalQuestions: item.total_questions,
                totalTime: item.total_time,
                testType: item.test_type,
                completedAt: item.completed_at
            })) as TestResult[];
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
                    name: testData.title || testData.name,
                    description: testData.description,
                    duration: (testData.questionCount || 20) * (testData.time_per_question || 30),
                    question_count: testData.questionCount || testData.questions?.length || 20,
                    creator_id: user?.id,
                    location: testData.location,
                    category_id: testData.category_id,
                    status: 'SCHEDULED'
                })
                .select()
                .single();

            if (error) throw error;

            if (testData.questions && testData.questions.length > 0) {
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
        return this.createTest({ ...data, questions: eqIds });
    },

    // ---- IMPLEMENTED METHODS ----

    async deleteTest(testId: string): Promise<void> {
        const { error } = await supabase.from('tests').delete().eq('id', testId);
        if (error) throw error;
    },

    async activateTest(testId: string): Promise<void> {
        const { error } = await supabase
            .from('tests')
            .update({ status: 'ACTIVE' })
            .eq('id', testId);
        if (error) throw error;
    },

    async finishTest(testId: string): Promise<void> {
        const { error } = await supabase
            .from('tests')
            .update({ status: 'FINISHED' })
            .eq('id', testId);
        if (error) throw error;
    },

    async updateTest(testId: string, updates: any): Promise<void> {
        const { error } = await supabase
            .from('tests')
            .update(updates)
            .eq('id', testId);
        if (error) throw error;
    },

    async getTestAttempts(testId: string): Promise<any[]> {
        // Try to join with public.users or fall back
        // Since we don't have FK setup to public.users on test_results (user_id is just UUID), join might fail.
        // We will fetch results and then try to fetch public.users if needed.
        // Or assume user_id is enough for now, or use auth.users if possible (but we can't select email easily).

        // Let's try to select just * first.
        const { data, error } = await supabase
            .from('test_results')
            .select(`*`)
            .eq('test_id', testId)
            .order('score', { ascending: false });

        if (error) throw error;

        // Populate minimal user info (email) manually if needed, 
        // OR rely on the fact that we might have set up a view or something.
        // For this Demo, we might just show User ID if join fails, or use Client side fetch.
        // Actually, let's try to map it if we can.

        return data.map((r: any) => ({
            ...r,
            completedAt: r.completed_at,
            correctAnswers: r.correct_answers,
            totalQuestions: r.total_questions,
            // Mock user object so UI doesn't crash
            user: { email: 'ID: ' + r.user_id.substring(0, 8) + '...' }
        }));
    },

    async getTestStatistics(testId: string): Promise<any> {
        const { data } = await supabase.from('test_results').select('score').eq('test_id', testId);
        if (!data || data.length === 0) return { average: 0, count: 0, max: 0, min: 0 };

        const scores = data.map(d => d.score);
        return {
            count: scores.length,
            average: scores.reduce((a, b) => a + b, 0) / scores.length,
            max: Math.max(...scores),
            min: Math.min(...scores)
        };
    },

    async getTestQuestions(testId: string): Promise<any[]> {
        const { data } = await supabase.from('test_questions').select('*').eq('test_id', testId);
        return data || [];
    },

    // ---- MOCKED / COMPLICATED CORRECTION LOGIC ----

    // These require a 'student_answers' table or complex JSON parsing.
    // Leaving as mocks for now to ensure stability of current working features.

    async getTestsNeedingCorrection(): Promise<any[]> { return []; },
    async getAttemptForCorrection(_attemptId: string): Promise<any> { return { attempt: {}, answers: [] }; },
    async getTestAttemptsForCorrection(_testId: string): Promise<any[]> { return []; },
    async createAttempt(_testId: string): Promise<any> { return {}; },
    async updateAttempt(_attemptId: string, _updates: any): Promise<void> { },
    async completeAttempt(_attemptId: string, _score: number, _correct: number, _total: number, _time: number, _answers: any[]): Promise<void> { },
    async getStudentAttempt(_testId: string): Promise<any> { return null; },
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
    async calculateWrittenTestScore(_attemptId: string): Promise<void> { }
};
