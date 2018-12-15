import { Client } from './client';
// import { IData } from './types';

test('client', async () => {
    const client = new Client();
    await client.LoadAllData();
}
