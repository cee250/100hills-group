// ========================================
// FIREBASE CONFIG - 1000 HILLS GROUP
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyABeFEPPKjKVFU14cx4s__uwWLRpHa5J2c",
    authDomain: "luxury-properties-36554.firebaseapp.com",
    projectId: "luxury-properties-36554",
    storageBucket: "luxury-properties-36554.firebasestorage.app",
    messagingSenderId: "214959691683",
    appId: "1:214959691683:web:864ba0f961cfefd7baac16"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Collection references
const SERVICES_COLLECTION = 'services';
const TEAM_COLLECTION = 'team';
const PORTFOLIO_COLLECTION = 'portfolio';
const TESTIMONIALS_COLLECTION = 'testimonials';
const CLIENTS_COLLECTION = 'clients';

// Export for use in other files
window.db = db;
window.auth = auth;
window.storage = storage;