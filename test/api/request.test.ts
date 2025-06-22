import { getFile } from "../../src/api/request";
import { getAccessToken, getFileId, validateEnvironment } from '../../src/utils/config';

validateEnvironment();

it('should get project', async () => {
  await getFile(getFileId(), getAccessToken());
});

it('project not found', async () => {
  await expect(getFile('123', getAccessToken())).rejects.toThrow();
});

it('invalid token', async () => {
  await expect(getFile(getFileId(), 'invalid')).rejects.toThrow();
});
