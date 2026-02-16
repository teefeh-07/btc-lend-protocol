const { execSync } = require('child_process');

function runCommand(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (error) {
        // console.error(`Command failed: ${cmd}\nError: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log("Fetching branches...");
    // Use format without quotes to be safer on Windows, or handle output
    const rawBranches = runCommand("git for-each-ref --sort=committerdate --format=%(refname:short) refs/heads/");

    if (!rawBranches) {
        console.error("Failed to fetch branches.");
        return;
    }

    const branches = rawBranches.split('\n')
        .map(b => b.trim().replace(/^'|'$/g, '')) // Remove potential quotes
        .filter(b => b && b !== 'main' && b !== "'main'");

    console.log(`Found ${branches.length} branches to process.`);

    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        console.log(`\n[${i + 1}/${branches.length}] Processing: ${branch}`);

        // Create PR
        console.log(`Creating PR...`);
        let prCreated = false;

        // Try creating with --fill
        const createCmd = `gh pr create --base main --head "${branch}" --fill`;
        const out = runCommand(createCmd);

        if (out && out.includes('https://github.com')) {
            console.log(`PR Created: ${out}`);
            prCreated = true;
        } else {
            console.log("PR creation output unclear or failed. It might already exist.");
            // We assume it exists if creation fails (common case)
            prCreated = true;
        }

        // Merge PR
        if (prCreated) {
            console.log(`Merging PR...`);
            const mergeOut = runCommand(`gh pr merge "${branch}" --merge --auto`);
            if (mergeOut) console.log("Merged.");
            else console.log("Merge command failed (or silent).");
        }

        // Wait 3s
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log("\n✅ Done processing all branches.");
}

main();
