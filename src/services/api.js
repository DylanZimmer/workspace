const BASE_URL = 'http://localhost:4000/api/items'; // This matches your server.js

// Get all items from DynamoDB
export async function fetchAllGraphFiles() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error('Failed to fetch graph files');
  }
  return res.json();
}

// Get a specific item (e.g., for a detail page)
export async function fetchGraphFile(pk, sk) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`);
  if (!res.ok) {
    throw new Error('Graph file not found');
  }
  return res.json();
}

// Add a new item
export async function createGraphFile(item) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    throw new Error('Failed to create graph file');
  }
  return res.json();
}

// Update an existing item
export async function updateGraphFile(pk, sk, updates) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error('Failed to update graph file');
  }
  return res.json();
}

// Delete an item
export async function deleteGraphFile(pk, sk) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete graph file');
  }
  return res.json();
}
