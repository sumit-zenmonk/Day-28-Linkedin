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

export interface ApplicantUser {
    uuid: string;
    name: string;
    email: string;
}

export interface Application {
    uuid: string;
    job: Job;
    user: ApplicantUser;
    created_at: string;
}
export interface EmploymentHistory {
    uuid: string;
    company_name: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface EducationHistory {
    uuid: string;
    school_name: string;
    start_date: string;
    end_date: string;
    specialization: string | null;
}

export interface EmployeeUser {
    uuid: string;
    name: string;
    email: string;
    role: string;
    employment_histories: EmploymentHistory[];
    education_histories: EducationHistory[];
}

export interface Employee {
    uuid: string;
    user: EmployeeUser;
    created_at: string;
}

export interface JobState {
    jobs: Job[];
    job: Job | null;
    applications: Application[];
    applicationsLoading: boolean;
    applicationsError: string | null;
    totalApplications: number;
    employees: Employee[];
    employeeLoading: boolean;
    employeeError: string | null;
    loading: boolean;
    error: string | null;
    status: "idle" | "pending" | "success" | "failed";
}