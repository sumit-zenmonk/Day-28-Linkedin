export interface Message {
    uuid: string;
    content: string;
    sender_uuid: string;
    receiver_uuid: string;
    created_at: string;
}

export interface ChatState {
    messages: Message[];
    loading: boolean;
    current_reciever: any;
    error: string | null;
}
