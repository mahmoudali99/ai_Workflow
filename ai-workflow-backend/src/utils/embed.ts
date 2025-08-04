import { v4 as uuidv4 } from 'uuid';

export async function getEmbedding(text: string): Promise<number[]> {
  // FAKE: random vector of 512 numbers for testing
  return Array.from({ length: 512 }, () => Math.random());
}

export async function embedAndStoreChunks(text: string): Promise<string> {
  const { saveChunks } = await import('../vectorStore/memoryStore');
  const docId = uuidv4();
  const chunks = chunkText(text, 500);

  const embeddedChunks = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await getEmbedding(chunk);
      return { id: uuidv4(), text: chunk, embedding };
    })
  );

  saveChunks(docId, embeddedChunks);
  return docId;
}

function chunkText(text: string, size: number): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}
