import { PathLike, readFileSync } from "node:fs";
import AdmZip from "adm-zip";
import { UnrecoverableError } from "../types/errors";

export const unzipPenpotFile = (file: PathLike | Buffer): AdmZip => {
  const zipFile = file instanceof Buffer ? file : readFileSync(file);
  const zip = new AdmZip(zipFile);
  
  const zipEntries = zip.getEntries();
  if (zipEntries.length === 0) {
    throw new UnrecoverableError("No entries found in the Penpot file.");
  }
  
  return zip;
}

export const isColorEntry = (entry: AdmZip.IZipEntry): boolean => {
  const result = /colors\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.json$/.test(entry.entryName as string)
  return result;
}

export const isTypographyEntry = (entry: AdmZip.IZipEntry): boolean => {
  const result = /typographies\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.json$/.test(entry.entryName as string)
  return result;
}



