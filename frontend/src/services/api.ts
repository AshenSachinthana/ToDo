const API_URL = 'http://localhost:3000';

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/task`);
  const result = await response.json();
  return result.data;
};

export const createTask = async (Title: string, Description: string) => {
  const response = await fetch(`${API_URL}/task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Title, Description }),
  });
  return response.json();
};

export const completeTask = async (Id: number) => {
  const response = await fetch(`${API_URL}/task/${Id}/complete`, {
    method: 'PATCH',
  });
  return response.json();
};