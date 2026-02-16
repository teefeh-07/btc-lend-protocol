const { execSync } = require('child_process');

function runCommand(cmd) {
    try {
        // console.log(`Running: ${cmd}`); // Reduce noise
        return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch (error) {
        console.error(`Command failed: ${cmd}\nError: ${error.message}`);
        return null; // Return null on failure
    }
}

async function main() {
    console.log("Fetching branches...");
    const rawBranches = runCommand("git for-each-ref --sort=committerdate --format='%(refname:short)' refs/heads/");

    if (!rawBranches) {
        console.error("Failed to fetch branches.");
        return;
    }

    const branches = rawBranches.split('\n')
        .map(b => b.trim())
        .filter(b => b && b !== 'main');

    console.log(`Found ${branches.length} branches to process.`);

    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        console.log(`\n[${i + 1}/${branches.length}] Processing: ${branch}`);

        // Get last commit message safely
        let title = `Merge ${branch}`;
        let body = "Automated PR created by script.";

        try {
            const logOut = runCommand(`git log -1 --pretty=%B ${branch}`);
            if (logOut) {
                const lines = logOut.split('\n');
                title = lines[0].replace(/"/g, '\\"').substring(0, 100); // Limit title length
                if (lines.length > 1) body = lines.slice(1).join('\n').replace(/"/g, '\\"').substring(0, 500);
            }
        } catch (e) {
            console.warn(`Could not get commit message for ${branch}, using default title.`);
        }

        // Create PR
        console.log(`Creating PR...`);
        // We use --fill to use commit info if title/body fails, but explicit is better to control it.
        // Actually, gh pr create --fill uses the last commit info automatically!
        // Let's try that first as it's cleaner.

        let prCreated = false;
        try {
            const out = runCommand(`gh pr create --base main --head ${branch} --fill`);
            if (out) {
                console.log(`PR Created: ${out}`);
                prCreated = true;
            } else {
                console.log("PR creation returned empty, might imply failure or silent success.");
            }
        } catch (e) {
            console.log("PR creation failed (maybe exists?). Attempting merge anyway.");
            prCreated = true; // Assume exists
        }

        // Merge PR
        if (prCreated) {
            console.log(`Merging PR...`);
            try {
                runCommand(`gh pr merge "${branch}" --merge --auto`);
            } catch (e) {
                console.error(`Failed to merge ${branch}.`);
            }
        }

        // Wait 3s to be safe
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log("\n✅ Done processing all branches.");
}

main();
