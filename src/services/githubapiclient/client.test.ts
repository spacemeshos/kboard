import { Client } from './client';

test('client', async () => {
    const client = new Client();
    await client.LoadAllData();
}
