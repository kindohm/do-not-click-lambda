import type { Context } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
} from "firebase/firestore";

const firebaseConfig = JSON.parse(process.env.FB_CONFIG ?? "{}");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example usage
interface MyDocType {
  fingerprint: string;
  date: string;
  response: string;
}

async function getAllDocuments<T = DocumentData>(
  collectionName: string,
  pageSize: number = 100
): Promise<(T & { id: string })[]> {
  const colRef = collection(db, collectionName);
  const allDocs: (T & { id: string })[] = [];

  let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;
  let hasMore = true;

  while (hasMore) {
    const q: Query = lastVisible
      ? query(
          colRef,
          orderBy("__name__"),
          startAfter(lastVisible),
          limit(pageSize)
        )
      : query(colRef, orderBy("__name__"), limit(pageSize));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      hasMore = false;
    } else {
      snapshot.docs.forEach((doc) => {
        allDocs.push({ id: doc.id, ...doc.data() } as T & { id: string });
      });
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      hasMore = snapshot.docs.length === pageSize;
    }
  }

  return allDocs;
}

export default async (req: Request, context: Context) => {
  const docs = await getAllDocuments<MyDocType>("clicks");
  return new Response(JSON.stringify(docs));
};
