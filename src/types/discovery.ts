// Type definitions for User Discovery Profile
export interface UserDiscoveryProfile {
    // Stage 1: Background
    background?: {
        employmentStatus?: 'employed' | 'unemployed' | 'self-employed' | 'student';
        industry?: string;
        yearsOfExperience?: number;
        education?: 'high-school' | 'bachelors' | 'masters' | 'phd' | 'other';
        degrees?: string[]; // e.g., ["MBA", "BS Computer Science"]
        certifications?: string[]; // e.g., ["CPA", "PMP", "AWS Certified"]
        skills?: string[];

        // Work dissatisfaction insights
        workFrustrations?: string[]; // e.g., ["lack of autonomy", "low pay", "toxic culture"]
        primaryPainPoint?: 'autonomy' | 'compensation' | 'culture' | 'growth' | 'purpose' | 'flexibility' | 'recognition';
        whatToEscape?: string; // free-form description
    };

    // Stage 2: Motivation & Goals
    motivation?: {
        primaryReason?: string; // why they want to start
        riskTolerance?: 'low' | 'medium' | 'high';
        timeline?: 'immediate' | '3-6months' | '6-12months' | '1year+';
        capitalAvailable?: 'under10k' | '10k-50k' | '50k-100k' | '100k+' | 'seeking-funding';
        successDefinition?: string; // what success looks like to them
    };

    // Stage 3: Assessments
    assessments?: {
        businessAcumen?: {
            score: number; // 0-100
            strengths?: string[];
            weaknesses?: string[];
            responses?: Array<{ question: string; answer: string; correct: boolean }>;
        };
        personality?: {
            // Big Five / OCEAN traits (0-100 scale)
            openness?: number;
            conscientiousness?: number;
            extraversion?: number;
            agreeableness?: number;
            neuroticism?: number;
        };
        decisionStyle?: 'analytical' | 'intuitive' | 'balanced' | 'risk-seeking' | 'collaborative';
    };

    // Metadata
    stage: 'background' | 'motivation' | 'assessment' | 'complete';
    completedAt?: Date;
    lastUpdated: Date;
}
