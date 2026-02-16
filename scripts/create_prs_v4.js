const { execSync } = require('child_process');

function runCommand(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (error) {
        return null;
    }
}

async function main() {
    console.log("Fetching branches...");
    // Use format with no quotes to avoid shell issues
    const rawBranches = runCommand("git for-each-ref --sort=committerdate --format=%(refname:short) refs/heads/");

    if (!rawBranches) {
        console.error("Failed to fetch branches.");
        return;
    }

    const branches = rawBranches.split('\n')
        .map(b => b.trim().replace(/^'|'$/g, '').replace(/^"|"$/g, '')) // Remove quotes
        .filter(b => b && b !== 'main' && b !== "'main'" && b !== '"main"');

    console.log(`Found ${branches.length} branches to process.`);

    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        console.log(`\n[${i + 1}/${branches.length}] Processing: ${branch}`);

        // Get commit info
        let title = `Merge ${branch}`;
        let body = "Automated PR created by script.";

        try {
            // Use no quotes in git command args to be safe, relying on execSync array? 
            // execSync string interface is tricky on Windows. 
            // quoting branch with double quotes is standard Windows.
            const logOut = runCommand(`git log -1 --pretty=%B "${branch}"`);
            if (logOut) {
                const lines = logOut.split('\n');
                // Escape double quotes for shell
                title = lines[0].replace(/"/g, '\\"').substring(0, 100);
                if (lines.length > 1) body = lines.slice(1).join('\n').replace(/"/g, '\\"').substring(0, 500);
            }
        } catch (e) {
            console.log("Failed to get commit info, using defaults.");
        }

        // Create PR
        console.log(`Creating PR "${title}"...`);
        let prCreated = false;

        try {
            // Use explicit title/body
            // Use double quotes for all args
            const createCmd = `gh pr create --base main --head "${branch}" --title "${title}" --body "${body}"`;
            const out = runCommand(createCmd);

            if (out && out.includes('https://github.com')) {
                console.log(`PR Created: ${out}`);
                prCreated = true;
            } else {
                // If it fails, maybe it exists?
                // Check if PR exists
                const listOut = runCommand(`gh pr list --head "${branch}" --json url --jq ".[0].url"`);
                if (listOut && listOut.includes('https://github.com')) {
                    console.log(`PR already exists: ${listOut}`);
                    prCreated = true;
                } else {
                    console.log("PR creation failed and not found.");
                }
            }
        } catch (e) {
            console.log("PR creation threw error.");
        }

        // Merge PR
        if (prCreated) {
            console.log(`Merging PR...`);
            try {
                // Use --admin or --merge
                runCommand(`gh pr merge "${branch}" --merge --auto`);
            } catch (e) {
                console.error(`Failed to merge ${branch}.`);
            }
        }

        // Wait 2s
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n✅ Done processing all branches.");
}

main();
