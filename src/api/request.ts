
export const getProject = async (projectId: string, token: string) => {
  const response = await fetch('https://design.penpot.app/api/rpc/command/get-file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'insomnia/10.3.1',
      'Authorization': `Token ${token}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id: projectId })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.statusText}`);
  }

  return response.json();
};
