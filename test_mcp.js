const { spawn } = require('child_process');

const proc = spawn('cmd', ['/c', 'npx', '-y', '@modelcontextprotocol/server-github', 'luttymedia/revelo-mockup'], {
    env: {
        ...process.env,
        GITHUB_PERSONAL_ACCESS_TOKEN: 'PLACEHOLDER_TOKEN'
    }
});

let messageId = 1;

function send(method, params = {}) {
    const msg = {
        jsonrpc: "2.0",
        id: messageId++,
        method,
        params
    };
    proc.stdin.write(JSON.stringify(msg) + '\n');
}

let buffer = '';
proc.stdout.on('data', chunk => {
    buffer += chunk.toString();
    let msgs = buffer.split('\n');
    buffer = msgs.pop();
    for (let m of msgs) {
        if (!m.trim()) continue;
        try {
            let data = JSON.parse(m);
            if (data.id === 1) {
                send('notifications/initialized');
                send('tools/list');
            } else if (data.id === 2) {
                if (data.result && data.result.tools) {
                    const names = data.result.tools.map(t => t.name);
                    console.log('Available tools:', names.join(', '));

                    // Next, try to call a tool that might get commits, or get_file_content if none exist
                    // Let's call "get_commits" if it exists, otherwise "search_commits" or just exit
                    const toolData = { owner: "luttymedia", repo: "revelo-mockup", per_page: 5, path: "" };
                    console.log("\nTrying get_issue or search...");
                    send("tools/call", {
                        name: "get_commit",  // Will try this or search? Let's just exit so the agent sees tool names
                        arguments: toolData
                    });
                }
            } else if (data.id === 3) {
                console.log('Result:', JSON.stringify(data.result, null, 2));
                process.exit(0);
            } else if (data.error) {
                console.error('Error:', JSON.stringify(data.error));
                process.exit(1);
            }
        } catch (e) { }
    }
});

send('initialize', {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    clientInfo: { name: "test", version: "1.0.0" }
});

setTimeout(() => { process.exit(1); }, 10000);
