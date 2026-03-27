export interface Company {
    uuid: string;
    name: string;
    industry: string;
    location: string;
}

export interface Tag {
    uuid: string;
    tag: string;
}

export interface Job {
    uuid: string;
    position: string;
    location: string;
    role: string;
    min_salary: number;
    max_salary: number;
    company: Company;
    tags: Tag[];
    created_at: string;
    deleted_at: string;
}

export interface JobApplication {
    uuid: string;
    job_uuid: string;
    user_uuid: string;
    job: Job;
    created_at: string;
}

export interface JobState {
    jobs: Job[];
    applications: JobApplication[];
    totalDocuments: number;
    loading: boolean;
    error: string | null;
}