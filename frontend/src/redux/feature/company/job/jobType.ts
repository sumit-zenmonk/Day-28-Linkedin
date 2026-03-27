export interface Tag {
    uuid: string;
    job_uuid: string;
    tag: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Company {
    uuid: string;
    user_uuid: string;
    name: string;
    email: string;
    mobile_number: string;
    industry: string;
    description: string;
    location: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Job {
    uuid: string;
    company_uuid: string;
    position: string;
    location: string;
    role: string;
    min_salary: number;
    max_salary: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    company?: Company;
    tags?: Tag[];
}

export interface JobState {
    jobs: Job[];
    job: Job | null;
    loading: boolean;
    error: string | null;
    status: "idle" | "pending" | "success" | "failed";
}