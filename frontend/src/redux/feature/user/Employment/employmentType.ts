export interface Employment {
    uuid: string;
    user_uuid: string;
    company_name: string;
    company_url?: string;
    start_date: string;
    end_date?: string;
    description?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface EmploymentState {
    employmentList: Employment[];
    loading: boolean;
    error: string | null;
}