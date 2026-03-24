export interface ProfileImage {
    uuid: string;
    image_url: string;
}

export interface Profile {
    uuid: string;
    bio?: string;
    mobile_number?: string;
    profile_img?: ProfileImage;
}

export interface EmploymentHistory {
    uuid: string;
    company_name: string;
    company_url: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface EducationHistory {
    uuid: string;
    school_name: string;
    school_url: string;
    start_date: string;
    end_date: string;
    specialization?: string | null;
    description?: string | null;
}

export interface Connection {
    uuid: string;
    name: string;
    email: string;
    role: string;
    profile: Profile;
    employment_histories: EmploymentHistory[];
    education_histories: EducationHistory[];
}

export interface ConnectionState {
    connections: Connection[];
    totalDocuments: number;
    loading: boolean;
    error: string | null;
}