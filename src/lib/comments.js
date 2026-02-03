import fs from "fs";
import path from "path";

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json");

function ensureDataDir() {
  const dataDir = path.dirname(COMMENTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readComments() {
  ensureDataDir();
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      const data = fs.readFileSync(COMMENTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading comments:", error);
  }
  return {};
}

function writeComments(comments) {
  ensureDataDir();
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), "utf-8");
}

export function getCommentsBySlug(slug) {
  const comments = readComments();
  return comments[slug] || [];
}

export function addComment(slug, comment) {
  const comments = readComments();
  if (!comments[slug]) {
    comments[slug] = [];
  }

  const newComment = {
    id: Date.now().toString(),
    author: {
      name: comment.name,
      imageSrc: "/assets/img/blog/comment-author.png",
    },
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }),
    text: comment.message,
    createdAt: new Date().toISOString(),
  };

  comments[slug].unshift(newComment);
  writeComments(comments);
  return newComment;
}
