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

export interface TestAttempt {
    id: string;
    test_id: string;
    user_id: string;
    started_at: string;
    finished_at?: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    score?: number;
}

export interface StudentAnswer {
    id: string;
    attempt_id: string;
    question_id: string;
    answer_text: string;
    is_correct?: boolean;
    points_earned?: number;
    instructor_feedback?: string;
    question?: any;
}

export interface TestQuestion {
    id: string;
    test_id: string;
    equipment_id: string;
    question_order: number;
    points: number;
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

    // Enviar resultado (Modo antigo/compatibilidade)
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

            // Fetch from test_attempts (new system)
            const { data: attempts, error: attError } = await supabase
                .from('test_attempts')
                .select(`
                    *,
                    test:tests(*)
                `)
                .eq('user_id', user.id)
                .eq('status', 'COMPLETED')
                .order('finished_at', { ascending: false });

            if (!attError && attempts && attempts.length > 0) {
                return attempts.map((a: any) => ({
                    id: a.id,
                    userId: a.user_id,
                    testId: a.test_id,
                    score: a.score || 0,
                    correctAnswers: 0, // Need to count from answers if needed
                    totalQuestions: 0,
                    totalTime: 0,
                    testType: 'WRITTEN',
                    answers: '',
                    completedAt: a.finished_at,
                    test: a.test
                }));
            }

            // Fallback to old test_results
            const { data, error } = await supabase
                .from('test_results')
                .select(`
                    *,
                    test:tests(*)
                `)
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            if (error) throw error;

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
        const { data, error } = await supabase
            .from('test_attempts')
            .select(`
                *,
                user:users!user_id(email)
            `)
            .eq('test_id', testId)
            .order('score', { ascending: false });

        if (error && error.code !== 'PGRST116') {
            // Fallback if users table relation issue
            const { data: fallback } = await supabase
                .from('test_attempts')
                .select('*')
                .eq('test_id', testId);

            return fallback?.map((r: any) => ({ ...r, completedAt: r.finished_at })) || [];
        }

        return data?.map((r: any) => ({
            ...r,
            completedAt: r.finished_at,
            user: { email: r.user?.email || 'Aluno' }
        })) || [];
    },

    async getTestStatistics(testId: string): Promise<any> {
        const { data } = await supabase.from('test_attempts').select('score').eq('test_id', testId).eq('status', 'COMPLETED');
        if (!data || data.length === 0) return { average: 0, count: 0, max: 0, min: 0 };

        const scores = data.map(d => d.score || 0);
        return {
            count: scores.length,
            average: scores.reduce((a, b) => a + b, 0) / scores.length,
            max: Math.max(...scores),
            min: Math.min(...scores)
        };
    },

    async getTestQuestions(testId: string): Promise<TestQuestion[]> {
        const { data } = await supabase.from('test_questions').select('*').eq('test_id', testId).order('question_order');
        return data || [];
    },

    // ---- REAL IMPLEMENTATIONS FOR CORRECTION WORKFLOW ----

    async getTestsNeedingCorrection(): Promise<any[]> {
        const { data: tests, error } = await supabase
            .from('tests')
            .select('id, name, created_at')
            .eq('status', 'ACTIVE');

        if (error) throw error;

        const results = await Promise.all(tests.map(async (test: any) => {
            const { data: attempts } = await supabase
                .from('test_attempts')
                .select('id')
                .eq('test_id', test.id)
                .in('status', ['COMPLETED']);

            if (!attempts || attempts.length === 0) return null;

            const attemptIds = attempts.map(a => a.id);
            if (attemptIds.length === 0) return null;

            const { count: uncorrectedCount } = await supabase
                .from('student_answers')
                .select('id', { count: 'exact', head: true })
                .in('attempt_id', attemptIds)
                .is('is_correct', null);

            if (uncorrectedCount && uncorrectedCount > 0) {
                return {
                    test_id: test.id,
                    test_title: test.name,
                    uncorrected_count: uncorrectedCount,
                    created_at: test.created_at
                };
            }
            return null;
        }));

        return results.filter(r => r !== null);
    },

    async getAttemptForCorrection(attemptId: string): Promise<any> {
        const { data: attempt, error } = await supabase
            .from('test_attempts')
            .select(`
                *,
                student:users!user_id(email, raw_user_meta_data)
            `)
            .eq('id', attemptId)
            .single();

        if (error) throw error;

        const { data: answers, error: ansError } = await supabase
            .from('student_answers')
            .select(`
                *,
                question:test_questions(*)
            `)
            .eq('attempt_id', attemptId)
            .order('created_at', { ascending: true });

        if (ansError) throw ansError;

        return {
            ...attempt,
            answers: answers
        };
    },

    async getTestAttemptsForCorrection(testId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('test_attempts')
            .select(`
                *,
                student:users!user_id(email, raw_user_meta_data)
            `)
            .eq('test_id', testId)
            .order('finished_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createAttempt(testId: string): Promise<any> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('test_attempts')
            .insert({
                test_id: testId,
                user_id: user.id,
                status: 'IN_PROGRESS'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateAttempt(attemptId: string, updates: any): Promise<void> {
        const { error } = await supabase
            .from('test_attempts')
            .update(updates)
            .eq('id', attemptId);
        if (error) throw error;
    },

    async saveStudentAnswer(attemptId: string, qId: string, text: string, time?: number): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('student_answers')
            .upsert({
                attempt_id: attemptId,
                question_id: qId,
                answer_text: text,
                time_spent_seconds: time
            }, { onConflict: 'attempt_id, question_id' });

        if (error) throw error;
    },

    async correctAnswer(answerId: string, isCorrect: boolean, points: number, feedback?: string): Promise<void> {
        const { error } = await supabase
            .from('student_answers')
            .update({
                is_correct: isCorrect,
                points_earned: points,
                instructor_feedback: feedback
            })
            .eq('id', answerId);

        if (error) throw error;
    },

    async calculateWrittenTestScore(attemptId: string): Promise<void> {
        const { error } = await supabase.rpc('calculate_attempt_score', { attempt_uuid: attemptId });
        if (error) throw error;
    }
};
