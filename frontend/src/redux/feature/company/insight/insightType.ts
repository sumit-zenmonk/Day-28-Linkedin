export interface CompanyUser {
    uuid: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface Employee {
    uuid: string;
    user_uuid: string;
    created_at: string;
}

export interface Job {
    uuid: string;
    position: string;
    location: string;
    role: string;
    min_salary: number;
    max_salary: number;
    created_at: string;
}

export interface CompanyInsight {
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

    user?: CompanyUser;
    employees?: Employee[];
    jobs?: Job[];
}

export interface InsightState {
    company: CompanyInsight | null;
    loading: boolean;
    error: string | null;
    status: "idle" | "pending" | "success" | "failed";
}