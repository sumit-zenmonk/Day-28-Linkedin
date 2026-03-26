export interface PostImage {
    uuid?: string;
    image_url: string;
}

export interface PostUserProfileImage {
    image_url: string;
}

export interface PostUserProfile {
    bio?: string;
    mobile_number?: string;
    profile_img?: PostUserProfileImage;
}

export interface PostUser {
    uuid: string;
    name: string;
    email: string;
    profile?: PostUserProfile;
}

export interface Post {
    uuid: string;
    content: string;
    images: PostImage[];
    user: PostUser;
    created_at: string;
}

export interface PostState {
    posts: Post[];
    totalDocuments: number;
    loading: boolean;
    error: string | null;
}