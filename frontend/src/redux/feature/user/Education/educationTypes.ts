export interface Education {
    uuid: string;
    user_uuid: string;
    school_name: string;
    school_url?: string;
    start_date?: string;
    end_date?: string;
    specialization?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface EducationState {
    educationList: Education[];
    loading: boolean;
    error: string | null;
}