import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.GOOGLE_FIRBASE_PROJECT_ID,
        clientEmail: process.env.GOOGLE_FIRBASE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_FIRBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
});

export default admin;