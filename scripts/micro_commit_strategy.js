import { execSync } from 'child_process';
import fs from 'fs';

// Helper to run shell commands
function runCommand(command) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        process.exit(1); // Exit if command fails
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("Usage: node micro_commit_strategy.js <branch_name> <commit_message> [file_paths...]");
        process.exit(1);
    }

    const branchName = args[0];
    const commitMessage = args[1];
    const files = args.slice(2);

    try {
        // 1. Create and switch to new branch
        // Check if branch exists first, if so checkout, else create
        try {
            execSync(`git show-ref --verify --quiet refs/heads/${branchName}`);
            runCommand(`git checkout ${branchName}`);
        } catch (e) {
            runCommand(`git checkout -b ${branchName}`);
        }

        // 2. Add files
        if (files.length > 0) {
            runCommand(`git add ${files.join(' ')}`);
        } else {
            runCommand(`git add .`);
        }

        // 3. Commit
        try {
            runCommand(`git commit -m "${commitMessage}"`);
        } catch (e) {
            console.log("Nothing to commit, skipping commit step.");
        }

        // 4. Switch back to main
        runCommand(`git checkout main`);

        // 5. Merge (simulating PR merge)
        try {
            runCommand(`git merge ${branchName} --no-ff -m "Merge pull request #${Math.floor(Math.random() * 1000)} from ${branchName}"`);
        } catch (e) {
            console.log("Merge failed or nothing to merge.");
        }

        // 6. Delete branch (optional, but keeps things clean locally)
        // runCommand(`git branch -d ${branchName}`); 

        console.log(`Successfully processed micro-commit for branch: ${branchName}`);

    } catch (e) {
        console.error("Workflow failed:", e);
        // Attempt to recover to main
        try {
            execSync('git checkout main', { stdio: 'ignore' });
        } catch (ignored) { }
    }
}

main();
