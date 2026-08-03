import { createClient } from '@supabase/supabase-js';
import { LetterRecord, CertificateRecord } from '../types';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

  console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY:", supabaseAnonKey);
console.log("SUPABASE CLIENT:", supabase);

const LOCAL_STORAGE_KEY = 'friendship_living_letters_db';

// Get local cache
const getLocalLetters = (): LetterRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save local cache
const saveLocalLetters = (letters: LetterRecord[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(letters));
  } catch (err) {
    console.error('Failed to write local letters cache', err);
  }
};

// Fetch latest letter for a given author from Supabase or Local Fallback
export async function fetchLatestLetter(author: string, defaultContent: string, recipient: string): Promise<LetterRecord> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('author', author)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        // Cache locally for offline resiliency
        const currentLocal = getLocalLetters().filter((l) => l.author !== author);
        saveLocalLetters([...currentLocal, data[0]]);
        return data[0];
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local storage', e);
    }
  }

  // Fallback to local storage
  const localList = getLocalLetters();
  const authorLetters = localList.filter((l) => l.author === author);
  if (authorLetters.length > 0) {
    authorLetters.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return authorLetters[0];
  }

  // Return initial placeholder record
  const initialRecord: LetterRecord = {
    id: `letter-init-${Date.now()}`,
    author,
    recipient,
    content: defaultContent,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Save initial record to local storage
  saveLocalLetters([...localList, initialRecord]);
  return initialRecord;
}

// Save or create new letter for author
export async function saveLetter(author: string, recipient: string, content: string): Promise<LetterRecord> {
  const now = new Date().toISOString();
  const newRecord: LetterRecord = {
    id: `letter-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    author,
    recipient,
    content,
    created_at: now,
    updated_at: now,
  };

  // Always update local cache immediately
  const localList = getLocalLetters();
  const updatedLocal = [newRecord, ...localList];
  saveLocalLetters(updatedLocal);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('letters')
        .insert([newRecord])
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (err) {
      console.warn('Supabase save failed, relying on local sync', err);
    }
  }

  return newRecord;
}

const PROMISE_STORAGE_KEY = 'friendship_promise_db';
const ANSWERS_STORAGE_KEY = 'friendship_answers_db';

const CERTIFICATES_STORAGE_KEY = 'friendship_certificates_db';

const getLocalCertificates = (): CertificateRecord[] => {
  try {
    const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalCertificates = (list: CertificateRecord[]) => {
  try {
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to write local certificates cache', err);
  }
};

export async function fetchCertificate(
  sceneId: string,
  friendName: string
): Promise<CertificateRecord> {

  const defaultSignature =
    sceneId === "SCENE_8"
      ? "/signatures/default-scene8.png"
      : "/signatures/default-scene9.png";

  // -----------------------------
  // SUPABASE
  // -----------------------------
  if (supabase) {
    try {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("sceneId", sceneId)
        .single();

      // Existing certificate
      if (data) {
        return data as CertificateRecord;
      }

      // First time -> create default certificate
      const newRecord: CertificateRecord = {
        id: sceneId,
        sceneId,
        friendName,
        signatureData: defaultSignature,
        signedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data: inserted } = await supabase
        .from("certificates")
        .insert([newRecord])
        .select()
        .single();

      return inserted as CertificateRecord;

    } catch (err) {
      console.warn("Certificate fetch failed:", err);
    }
  }

  // -----------------------------
  // LOCAL STORAGE FALLBACK
  // -----------------------------

  const local = getLocalCertificates().find(
    (c) => c.sceneId === sceneId
  );

  if (local) return local;

  const newRecord: CertificateRecord = {
    id: sceneId,
    sceneId,
    friendName,
    signatureData: defaultSignature,
    signedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveLocalCertificates([
    ...getLocalCertificates(),
    newRecord,
  ]);

  return newRecord;
}

export async function saveCertificate(
  sceneId: string,
  friendName: string,
  signatureData: string
): Promise<CertificateRecord> {

  const now = new Date().toISOString();

  const updatedRecord: CertificateRecord = {
    id: sceneId,
    sceneId,
    friendName,
    signatureData,
    signedAt: now,
    updatedAt: now,
  };

  // -------------------------
  // LOCAL STORAGE
  // -------------------------

  const localCertificates = getLocalCertificates();

  const index = localCertificates.findIndex(
    (c) => c.sceneId === sceneId
  );

  if (index >= 0) {
    localCertificates[index] = updatedRecord;
  } else {
    localCertificates.push(updatedRecord);
  }

  saveLocalCertificates(localCertificates);

  // -------------------------
  // SUPABASE
  // -------------------------

  if (supabase) {
    try {

      const { data } = await supabase
        .from("certificates")
        .select("sceneId")
        .eq("sceneId", sceneId)
        .single();

      if (data) {

        const { data: updated } = await supabase
          .from("certificates")
          .update({
            friendName,
            signatureData,
            signedAt: now,
            updatedAt: now,
          })
          .eq("sceneId", sceneId)
          .select()
          .single();

        return updated as CertificateRecord;

      } else {

        const { data: inserted } = await supabase
          .from("certificates")
          .insert([updatedRecord])
          .select()
          .single();

        return inserted as CertificateRecord;
      }

    } catch (err) {

      console.warn("Certificate save failed", err);

    }
  }

  return updatedRecord;
} 
// Save promise acceptance inside Supabase and Local Storage
export async function savePromiseAcceptance(
  promiseText: string,
  acceptedBy: string = 'Both Best Friends'
) {
  const now = new Date().toISOString();
  const record = {
    id: `promise-${Date.now()}`,
    promiseText,
    acceptedAt: now,
    acceptedBy,
  };

  try {
    localStorage.setItem(PROMISE_STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    console.error('Failed to save local promise acceptance', e);
  }

  if (supabase) {
    try {
      await supabase.from('promises').insert([record]);
    } catch (e) {
      console.warn('Supabase promise save failed, using local storage fallback', e);
    }
  }

  return record;
}

// Save two questions answers inside Supabase and Local Storage
export async function saveTwoQuestionsAnswers(
  answer1: 'YES' | 'NO',
  answer2: 'YES' | 'NO'
) {
  const now = new Date().toISOString();
  const record = {
    id: `answers-${Date.now()}`,
    answer1,
    answer2,
    createdAt: now,
  };

  try {
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    console.error('Failed to save local answers', e);
  }

  if (supabase) {
    try {
      await supabase.from('answers').insert([record]);
    } catch (e) {
      console.warn('Supabase answers save failed, using local storage fallback', e);
    }
  }

  return record;
}

