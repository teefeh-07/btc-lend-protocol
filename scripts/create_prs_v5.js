const { execSync } = require('child_process');

function runCommand(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (error) {
        if (error.stderr) console.error(`STDERR: ${error.stderr.toString()}`);
        return null;
    }
}

async function main() {
    console.log("Fetching branches...");
    const rawBranches = runCommand("git for-each-ref --sort=committerdate --format=%(refname:short) refs/heads/");

    if (!rawBranches) {
        console.error("Failed to fetch branches.");
        return;
    }

    const branches = rawBranches.split('\n')
        .map(b => b.trim().replace(/^'|'$/g, '').replace(/^"|"$/g, ''))
        .filter(b => b && b !== 'main' && b !== "'main'" && b !== '"main"');

    console.log(`Found ${branches.length} branches to process.`);

    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        console.log(`\n[${i + 1}/${branches.length}] Processing: ${branch}`);

        // Get commit info
        let title = `Merge ${branch}`;
        let body = "Automated PR created by script.";

        try {
            const logOut = runCommand(`git log -1 --pretty=%B "${branch}"`);
            if (logOut) {
                const lines = logOut.split('\n');
                title = lines[0].replace(/"/g, '\\"').substring(0, 100);
                if (lines.length > 1) body = lines.slice(1).join('\n').replace(/"/g, '\\"').substring(0, 500);
            }
        } catch (e) {
            console.log("Failed to get commit info, using defaults.");
        }

        // Create PR
        console.log(`Creating PR "${title}"...`);
        let prCreated = false;

        // Pass title/body
        const createCmd = `gh pr create --base main --head "${branch}" --title "${title}" --body "${body}"`;
        const out = runCommand(createCmd);

        if (out && out.includes('https://github.com')) {
            console.log(`PR Created: ${out}`);
            prCreated = true;
        } else {
            console.log("PR creation failed or returned empty.");
            // Check if exists
            const listOut = runCommand(`gh pr list --head "${branch}" --state all --json url --jq ".[0].url"`);
            if (listOut && listOut.includes('https://github.com')) {
                console.log(`PR already exists: ${listOut}`);
                prCreated = true;
            }
        }

        // Merge PR
        if (prCreated) {
            console.log(`Merging PR...`);
            const mergeOut = runCommand(`gh pr merge "${branch}" --merge --auto`);
            if (mergeOut) console.log("Merged.");
            else console.log("Merge command failed (or silent).");
        }

        // Wait 2s
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n✅ Done processing all branches.");
}

main();
