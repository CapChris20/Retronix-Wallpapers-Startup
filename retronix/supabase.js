import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase credentials (service role key for server-side access)
const supabaseUrl = 'https://nfedqczwuvfwfyvksnak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // replace with service role key

const supabase = createClient(supabaseUrl, supabaseKey);

// Recursive function to get all files from a folder
async function listAllFiles(bucket, folder = '') {
  const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: 100 });

  if (error) {
    console.error('Error listing files:', error.message);
    return [];
  }

  let files = [];

  for (const item of data) {
    if (item.type === 'folder') {
      // Recursively fetch files in subfolders
      const subFiles = await listAllFiles(bucket, folder ? `${folder}/${item.name}` : item.name);
      files = files.concat(subFiles);
    } else {
      files.push(folder ? `${folder}/${item.name}` : item.name);
    }
  }

  return files;
}

async function generateLinks() {
  const bucket = 'retronix-previews';
  const files = await listAllFiles(bucket);

  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  const links = files.map(file => {
    const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(file);
    return publicUrl;
  });

  // Write to TXT file
  fs.writeFileSync('recent_uploads.txt', links.join('\n'), 'utf8');
  console.log(`Saved ${links.length} URLs to recent_uploads.txt`);
}

generateLinks();