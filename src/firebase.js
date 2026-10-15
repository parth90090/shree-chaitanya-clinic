import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  set, 
  update, 
  remove, 
  onValue, 
  get,
  serverTimestamp 
} from "firebase/database";

// Firebase Realtime Database Configuration
export const FIREBASE_DB_URL = "https://shree-chaitanya-clinic-default-rtdb.asia-southeast1.firebasedatabase.app";
export const FIREBASE_PROJECT_ID = "shree-chaitanya-clinic";

const firebaseConfig = {
  databaseURL: FIREBASE_DB_URL,
  projectId: FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-dummy-key-for-rtdb-public-rules",
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:100000000000:web:shreechaitanya"
};

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);

/**
 * Listen to real-time appointments updates from Firebase RTDB.
 * Returns an unsubscribe function.
 */
export function subscribeToAppointments(onData, onError) {
  try {
    const appointmentsRef = ref(db, "appointments");
    return onValue(
      appointmentsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          // Realtime Database might return an object keyed by ID or an array
          let list = [];
          if (Array.isArray(val)) {
            list = val.filter(Boolean);
          } else if (typeof val === "object" && val !== null) {
            list = Object.values(val);
          }
          // Sort latest first
          list.sort((a, b) => {
            const timeA = new Date(a.date || a.createdAt).getTime() || 0;
            const timeB = new Date(b.date || b.createdAt).getTime() || 0;
            return timeB - timeA;
          });
          onData(list);
        } else {
          onData([]);
        }
      },
      (error) => {
        console.warn("[Firebase RTDB] Real-time listener error:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error("[Firebase RTDB] Failed to attach listener:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Save a new appointment or overwrite an existing appointment record
 */
export async function saveAppointmentToFirebase(appointment) {
  if (!appointment || !appointment.id) {
    throw new Error("Invalid appointment record: missing ID");
  }
  const cleanId = String(appointment.id).replace(/[.#$[\]/]/g, "_");
  const appointmentRef = ref(db, `appointments/${cleanId}`);
  
  const payload = {
    ...appointment,
    updatedAt: new Date().toISOString()
  };

  await set(appointmentRef, payload);
  return payload;
}

/**
 * Update specific fields of an appointment (e.g. status, emailSent)
 */
export async function updateAppointmentInFirebase(id, updates) {
  if (!id) return;
  const cleanId = String(id).replace(/[.#$[\]/]/g, "_");
  const appointmentRef = ref(db, `appointments/${cleanId}`);
  
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await update(appointmentRef, payload);
  return payload;
}

/**
 * Delete an appointment record from Firebase
 */
export async function deleteAppointmentFromFirebase(id) {
  if (!id) return;
  const cleanId = String(id).replace(/[.#$[\]/]/g, "_");
  const appointmentRef = ref(db, `appointments/${cleanId}`);
  await remove(appointmentRef);
}

/**
 * Clear all appointments from Firebase Realtime Database
 */
export async function clearAllAppointmentsFromFirebase() {
  const appointmentsRef = ref(db, "appointments");
  await set(appointmentsRef, null);
}

/**
 * Quick ping / test to check if RTDB is readable and writable
 */
export async function testFirebaseConnection() {
  try {
    const testRef = ref(db, "appointments");
    await get(testRef);
    return { success: true, message: "Connected to Firebase Realtime Database" };
  } catch (err) {
    return {
      success: false,
      code: err.code || "permission-denied",
      message: err.message
    };
  }
}
