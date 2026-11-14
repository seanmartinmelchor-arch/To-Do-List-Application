// All communication with the backend lives here.
import { API_BASE_URL } from '../config';

// One helper for every request. It turns server and network problems
// into readable error messages that the screens can show to the user.
async function request(path = '', options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (e) {
    throw new Error('Cannot reach the server. Check that the backend is running and the API address in src/config.js is correct.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // response had no JSON body
  }

  if (!response.ok) {
    throw new Error((data && data.message) || `Request failed (${response.status})`);
  }
  return data;
}

export const getTasks = () => request();
export const getTask = (id) => request(`/${id}`);
export const createTask = (task) => request('', { method: 'POST', body: JSON.stringify(task) });
export const updateTask = (id, task) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(task) });
export const completeTask = (id) => request(`/${id}/complete`, { method: 'PATCH' });
export const deleteTask = (id) => request(`/${id}`, { method: 'DELETE' });
