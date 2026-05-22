import { i as collection, j as getDocs, k as deleteDoc, h as setDoc, e as doc, f as db, l as serverTimestamp, m as onSnapshot } from "./firebase-CeVmTMBf.js";
const COLLECTION = "localState";
const MANIFEST_DOC = "localStateManifest";
const MANAGED_PREFIXES = ["zyrox.", "zyrox-", "_zyrox"];
const MAX_INLINE_VALUE_BYTES = 7e5;
const VALUE_CHUNK_CHARS = 65e4;
let restoreInProgress = false;
let autosyncUid = null;
let autosyncTimer = null;
let originalSetItem = null;
let originalRemoveItem = null;
function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
function isManagedKey(key) {
  return MANAGED_PREFIXES.some((prefix) => key.startsWith(prefix));
}
function encodeKey(key) {
  return btoa(unescape(encodeURIComponent(key))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function byteSize(value) {
  return new Blob([value]).size;
}
function readManagedLocalState() {
  const items = [];
  if (!canUseStorage()) return items;
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !isManagedKey(key)) continue;
    const value = window.localStorage.getItem(key);
    if (value == null) continue;
    items.push({ key, value });
  }
  return items;
}
async function deleteChunks(uid, id) {
  const chunks = await getDocs(collection(db, "users", uid, COLLECTION, id, "chunks"));
  await Promise.all(chunks.docs.map((chunk) => deleteDoc(chunk.ref)));
}
function chunkValue(value) {
  const chunks = [];
  for (let index = 0; index < value.length; index += VALUE_CHUNK_CHARS) {
    chunks.push(value.slice(index, index + VALUE_CHUNK_CHARS));
  }
  return chunks;
}
async function saveLocalStateItem(uid, item) {
  const id = encodeKey(item.key);
  const ref = doc(db, "users", uid, COLLECTION, id);
  if (byteSize(item.value) <= MAX_INLINE_VALUE_BYTES) {
    await deleteChunks(uid, id);
    await setDoc(ref, {
      key: item.key,
      value: item.value,
      chunked: false,
      chunks: 0,
      updatedAt: serverTimestamp()
    });
    return;
  }
  const chunks = chunkValue(item.value);
  await deleteChunks(uid, id);
  await setDoc(ref, {
    key: item.key,
    value: "",
    chunked: true,
    chunks: chunks.length,
    updatedAt: serverTimestamp()
  });
  await Promise.all(
    chunks.map(
      (value, index) => setDoc(doc(db, "users", uid, COLLECTION, id, "chunks", String(index).padStart(4, "0")), {
        value
      })
    )
  );
}
function clearManagedLocalState() {
  if (!canUseStorage()) return;
  const keys = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key && isManagedKey(key)) keys.push(key);
  }
  keys.forEach((key) => window.localStorage.removeItem(key));
}
async function saveLocalStateToFirestore(uid) {
  if (!canUseStorage() || restoreInProgress) return;
  const items = readManagedLocalState();
  const localKeys = new Set(items.map((item) => item.key));
  const stateCollection = collection(db, "users", uid, COLLECTION);
  const existing = await getDocs(stateCollection);
  await Promise.all([
    ...items.map((item) => saveLocalStateItem(uid, item)),
    ...existing.docs.filter((snap) => {
      const data = snap.data();
      return data.key ? !localKeys.has(data.key) : true;
    }).map(async (snap) => {
      await deleteChunks(uid, snap.id);
      await deleteDoc(snap.ref);
    }),
    setDoc(
      doc(db, "users", uid, "data", MANIFEST_DOC),
      {
        keys: Array.from(localKeys),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )
  ]);
}
async function restoreLocalStateFromFirestore(uid, options = {}) {
  if (!canUseStorage()) return false;
  const snap = await getDocs(collection(db, "users", uid, COLLECTION));
  if (snap.empty) return false;
  restoreInProgress = true;
  try {
    if (options.replaceLocal) clearManagedLocalState();
    const restoredItems = await Promise.all(snap.docs.map(async (item) => {
      const data = item.data();
      if (typeof data.key !== "string") return null;
      if (data.chunked) {
        const chunks = await getDocs(collection(db, "users", uid, COLLECTION, item.id, "chunks"));
        const value = chunks.docs.sort((left, right) => left.id.localeCompare(right.id)).map((chunk) => {
          const chunkData = chunk.data();
          return chunkData.value ?? "";
        }).join("");
        return { key: data.key, value };
      }
      if (typeof data.value === "string") return { key: data.key, value: data.value };
      return null;
    }));
    restoredItems.forEach((item) => {
      if (item) window.localStorage.setItem(item.key, item.value);
    });
  } finally {
    restoreInProgress = false;
  }
  return true;
}
function scheduleLocalStateSync(uid) {
  if (!canUseStorage() || restoreInProgress) return;
  if (autosyncTimer) clearTimeout(autosyncTimer);
  autosyncTimer = setTimeout(() => {
    saveLocalStateToFirestore(uid).catch(() => {
    });
  }, 900);
}
function startLocalStateAutosync(uid) {
  if (!canUseStorage()) return () => {
  };
  autosyncUid = uid;
  if (!originalSetItem) {
    originalSetItem = window.localStorage.setItem.bind(window.localStorage);
    originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);
    window.localStorage.setItem = (key, value) => {
      originalSetItem?.(key, value);
      if (autosyncUid && isManagedKey(key)) scheduleLocalStateSync(autosyncUid);
    };
    window.localStorage.removeItem = (key) => {
      originalRemoveItem?.(key);
      if (autosyncUid && isManagedKey(key)) scheduleLocalStateSync(autosyncUid);
    };
  }
  scheduleLocalStateSync(uid);
  return () => {
    if (autosyncUid === uid) autosyncUid = null;
  };
}
function startRealtimeSync(uid, onRemoteChange) {
  let initialized = false;
  const manifestRef = doc(db, "users", uid, "data", MANIFEST_DOC);
  const unsub = onSnapshot(manifestRef, (snap) => {
    if (!initialized) {
      initialized = true;
      return;
    }
    if (!snap.exists() || restoreInProgress) return;
    void restoreLocalStateFromFirestore(uid, { replaceLocal: true }).then(() => onRemoteChange()).catch(() => {
    });
  });
  return unsub;
}
export {
  clearManagedLocalState,
  restoreLocalStateFromFirestore,
  saveLocalStateToFirestore,
  scheduleLocalStateSync,
  startLocalStateAutosync,
  startRealtimeSync
};