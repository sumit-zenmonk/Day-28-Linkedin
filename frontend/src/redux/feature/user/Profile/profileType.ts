export interface ProfileImage {
    uuid: string;
    image_url: string;
}

export interface Profile {
    uuid: string;
    user_uuid: string;
    bio?: string;
    mobile_number?: string;
    profile_img?: ProfileImage;
    count: number,
    impressions: number
}

export interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    status: "idle" | "pending" | "success" | "failed";
}