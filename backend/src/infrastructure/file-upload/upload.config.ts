export const mimeCategoryConfig = {
    image: {
        allowed: [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/svg+xml',
            'image/gif',
            'image/webp',
        ],
        maxSize: 50 * 1024 * 1024, // 50MB
    },
    video: {
        allowed: [
            'video/mp4',
            'video/mpeg',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-matroska',
        ],
        maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    },
};