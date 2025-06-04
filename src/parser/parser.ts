import { PathLike } from "node:fs";
import { isColorEntry, isTypographyEntry, unzipPenpotFile } from "./file_parser";
import { parseColorData, parseTypographyData } from "./data_parser";
import { Color, Typography } from "../types/penpot";

export const parsePenpotFile = (penpotFile: PathLike | Buffer): { typographies: Typography[], colors: Color[] } => {
  const unzippedPenpotFile = unzipPenpotFile(penpotFile);
  const entries = unzippedPenpotFile.getEntries();
  
  const typographies = entries
    .filter(isTypographyEntry)
    .map(entry => entry.getData().toString())
    .map(data => parseTypographyData(data));
  const colors = entries
    .filter(isColorEntry)
    .map(entry => entry.getData().toString())
    .map(data => parseColorData(data));

  return { typographies, colors };
}