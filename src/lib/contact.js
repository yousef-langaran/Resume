import fs from "fs";
import path from "path";

const CONTACTS_FILE = path.join(process.cwd(), "data", "contacts.json");

function ensureDataDir() {
  const dataDir = path.dirname(CONTACTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function saveContact(contact) {
  ensureDataDir();
  let contacts = [];
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
      contacts = JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading contacts:", error);
  }

  contacts.unshift({
    ...contact,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf-8");
}

export function getContacts() {
  ensureDataDir();
  if (!fs.existsSync(CONTACTS_FILE)) return [];
  try {
    const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}
