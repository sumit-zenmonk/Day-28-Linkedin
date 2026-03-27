export interface EmployeeProfileImage {
    uuid: string;
    image_url: string;
}

export interface EmployeeProfile {
    uuid: string;
    bio?: string | null;
    mobile_number?: string | null;
    profile_img?: EmployeeProfileImage;
}

export interface EmploymentHistory {
    uuid: string;
    company_name: string;
    start_date: string;
    end_date: string | null;
}

export interface EducationHistory {
    uuid: string;
    school_name: string;
    start_date: string;
    end_date: string;
}

export interface EmployeeUser {
    uuid: string;
    name: string;
    email: string;
    role: string;
    profile: EmployeeProfile;
    employment_histories: EmploymentHistory[];
    education_histories: EducationHistory[];
}

export interface Employee {
    uuid: string;
    user_uuid: string;
    user: EmployeeUser;
    created_at: string;
}

export interface CompanyJob {
    uuid: string;
    name: string;
    email: string;
    mobile_number: string;
    industry: string;
    description: string;
    location: string;
    employees: Employee[];
    created_at: string;
}

export interface EmployeeState {
    jobs: CompanyJob[];
    totalDocuments: number;
    loading: boolean;
    error: string | null;
}