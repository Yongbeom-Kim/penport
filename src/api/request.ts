import { PenpotFileSchema, type PenpotFile } from "../types/penpot";

export const getFile = async (
  projectId: string,
  token: string
): Promise<PenpotFile> => {
  const response = await fetch(
    "https://design.penpot.app/api/rpc/command/get-file",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/10.3.1",
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ id: projectId }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch project: ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  if (data.data?.typographies) {
    Object.values(data.data.typographies).forEach((typography: any) => {
      if (typography.lineHeight)
        typography.lineHeight = parseFloat(typography.lineHeight);
      if (typography.fontSize)
        typography.fontSize = parseFloat(typography.fontSize);
      if (typography.letterSpacing)
        typography.letterSpacing = parseFloat(typography.letterSpacing);
    });
  }

  return PenpotFileSchema.parse(data);
};
