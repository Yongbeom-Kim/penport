
import { z } from 'zod';

const PenpotFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  projectId: z.string().uuid(),
  createdAt: z.string().datetime(),
  modifiedAt: z.string().datetime(),
  version: z.number(),
  revn: z.number(),
  data: z.object({
    pages: z.array(z.any()),
    colors: z.record(z.any()).optional(),
    typographies: z.record(z.any()).optional()
  })
});

export type PenpotFile = z.infer<typeof PenpotFileSchema>;

export const getFile = async (projectId: string, token: string): Promise<PenpotFile> => {
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
    const errorText = await response.text();
    throw new Error(`Failed to fetch project: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return PenpotFileSchema.parse(data);
};
