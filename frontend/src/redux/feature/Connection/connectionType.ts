import { ConnectionStatusEnum } from "@/enums/connection.status";

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

export interface ConnectionRequest {
    uuid: string;
    user_uuid: string;
    connected_user_uuid: string;
    connected_user: {
        uuid: string;
        name: string;
        email: string;
        profile?: {
            uuid: string;
            bio?: string;
            mobile_number?: string;
            profile_img?: {
                uuid: string;
                image_url: string;
            };
        };
    };
}

export interface NetworkConnection {
    uuid: string;
    status: string;
    connected_user: {
        uuid: string;
        name: string;
        email: string;
        profile?: {
            bio?: string;
            profile_img?: {
                image_url: string;
            };
        };
    };
}

export interface ConnectionPostImage {
    uuid: string;
    type: string;
    image_url: string;
}

export interface ConnectionPost {
    uuid: string;
    user_uuid: string;
    content: string;
    images: ConnectionPostImage[];
    user: {
        uuid: string;
        name: string;
        email: string;
        profile: Profile | null;
    };
    created_at: string;
}

export interface ConnectionState {
    connections: Connection[];
    connectionRequests: ConnectionRequest[];
    receivedConnectionRequests: ConnectionRequest[];
    network: NetworkConnection[];
    connectionPosts: ConnectionPost[];
    postsTotalDocuments: number;
    connectionsTotalDocuments: number;
    networkTotalDocuments: number;
    loading: boolean;
    error: string | null;
}