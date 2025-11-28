import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting deployment package creation...');

// 1. Run Build
try {
    console.log('📦 Building project...');
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
}

// 2. Create Zip
const output = fs.createWriteStream(path.join(rootDir, 'deploy.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
    console.log(`✅ Deployment package created: deploy.zip (${archive.pointer()} bytes)`);
    console.log('👉 Upload this file to your cPanel File Manager and extract it to public_html');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

// Append files from dist directory
archive.directory(path.join(rootDir, 'dist/'), false);

archive.finalize();
