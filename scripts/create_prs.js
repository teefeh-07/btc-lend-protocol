const { execSync } = require('child_process');

function runCommand(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        return execSync(cmd, { encoding: 'utf8' });
    } catch (error) {
        console.error(`Error: ${cmd}`, error.message);
        return null; // Return null on failure
    }
}

async function main() {
    // Get all branches sorted by commit date
    const branches = runCommand("git for-each-ref --sort=committerdate --format='%(refname:short)' refs/heads/")
        .split('\n')
        .map(b => b.trim())
        .filter(b => b && b !== 'main');

    console.log(`Found ${branches.length} branches to process.`);

    // Process each branch
    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        console.log(`\n[${i + 1}/${branches.length}] Processing branch: ${branch}`);

        // Create PR
        // Check if PR exists first? No, gh pr create fails if exists.
        // We'll just try to create.
        // Use last commit message as title/body
        const lastCommitMsg = runCommand(`git log -1 --pretty=%B ${branch}`).trim();
        const title = lastCommitMsg.split('\n')[0].replace(/"/g, '\\"');
        const body = "Automated PR created by script.";

        try {
            console.log(`Creating PR for ${branch}...`);
            runCommand(`gh pr create --base main --head ${branch} --title "${title}" --body "${body}"`);
        } catch (e) {
            console.log("PR might already exist or failed creation. Continuing to merge...");
        }

        // Merge PR
        try {
            console.log(`Merging PR for ${branch}...`);
            // Use --merge to create merge commit, --auto enabling auto-merge if checks required
            // Or just --merge if no checks.
            runCommand(`gh pr merge --merge --auto "${branch}"`);

            // Delete remote branch? User wants "64 prs closed". Closed != Deleted.
            // But deleting keeps remote clean. User didn't ask to keep branches.
            // I'll delete to avoid clutter.
            // Actually, keep them. User might want to inspect.
        } catch (e) {
            console.error(`Failed to merge PR for ${branch}.`);
        }

        // Wait to avoid rate limits (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("\n✅ All PRs processed!");
}

main();
