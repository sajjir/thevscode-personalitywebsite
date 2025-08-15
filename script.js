document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.querySelector('#explorer-view');

    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when a file is clicked on mobile
    document.querySelector('.file-explorer').addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && e.target.closest('.file')) {
            sidebar.classList.remove('open');
        }
    });

    const fileExplorerItems = document.querySelectorAll('.file-explorer .file');
    const folderItems = document.querySelectorAll('.file-explorer .folder');
    const activityBarIcons = document.querySelectorAll('.activity-bar .action-icon');
    
    const tabsContainer = document.querySelector('.tabs-container');
    const editorContainer = document.querySelector('.editor-container');
    let openFiles = {}; // Tracks open files and their content

// --- Content for each file ---
const fileContents = {
    'readme.md': `
# Hi, I'm Sajjad 👋

Welcome to my interactive portfolio. This website is a simulation of my favorite code editor, **VS Code**.

### 🚀 About Me
- A software developer passionate about solving complex problems.
- Always learning and exploring new technologies.
- To see my skills, open the \`skills.py\` file!

### 🎮 Hobbies
- Playing strategy video games.
- Reading sci-fi books.
- Exploring cool projects on GitHub.
`,
    'aboutme.md': `
## More About Me

I am a software developer with experience in building efficient and creative tools that make life easier for people.
This project is one of my showcases to demonstrate a combination of my front-end and back-end skills.
`,
    'skills.py': `
class SajjadSkills:
    def __init__(self):
        self.languages = ["Python", "JavaScript", "HTML", "CSS"]
        self.frameworks = {
            "backend": ["Flask", "Django", "FastAPI"],
            "frontend": ["React", "Vue.js"] # Just for demonstration
        }
        self.tools = ["Git", "Docker", "VS Code", "Linux"]

    def display_skills(self):
        print("--- My Technical Skills ---")
        for skill_type, skills in self.__dict__.items():
            print(f"\\n# {skill_type.capitalize()}")
            if isinstance(skills, list):
                for skill in skills:
                    print(f"- {skill}")
            elif isinstance(skills, dict):
                 for category, items in skills.items():
                    print(f"  ## {category.capitalize()}")
                    for item in items:
                        print(f"  - {item}")

me = SajjadSkills()
me.display_skills()
`,
    'cool-project.json': `
{
  "projectName": "VS Code Portfolio",
  "description": "A creative personal website inspired by the VS Code environment to showcase skills and projects in an engaging way.",
  "technologies": ["HTML", "CSS", "JavaScript", "Python", "Flask"],
  "status": "In Development",
  "github_link": "https://github.com/your-username/your-repo"
}
`,
    'contact.html': `
<div class="contact-form">
    <h2><i class="fas fa-paper-plane"></i> Get in Touch</h2>
    <p>Feel free to reach out for collaboration, questions, or just to say hi!</p>
    <form id="contactForm">
        <label for="name">Your Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">Your Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="message">Your Message:</label>
        <textarea id="message" name="message" rows="6" required></textarea>
        
        <button type="submit">Send Message</button>
    </form>
    <div id="form-response"></div>
</div>
`
};

    // --- Event Listeners ---

    // 1. Activity Bar clicks
    activityBarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            activityBarIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            
            // Show/hide corresponding sidebar view (simple version)
            const viewId = icon.dataset.view + '-view';
            document.querySelectorAll('.sidebar').forEach(view => {
                view.style.display = view.id === viewId ? 'flex' : 'none';
            });
        });
    });

    // 2. Folder clicks
    folderItems.forEach(folder => {
        folder.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN' || e.target.tagName === 'I') {
                const currentState = folder.dataset.state;
                folder.dataset.state = currentState === 'closed' ? 'open' : 'closed';
            }
        });
    });
    
    // 3. File clicks
    fileExplorerItems.forEach(item => {
        item.addEventListener('click', () => {
            const filename = item.dataset.file;
            openFile(filename);
        });
    });

    // --- Core Functions ---
    
    function openFile(filename) {
        if (!openFiles[filename]) {
            // If file is not open, create tab and content
            createTab(filename);
            createEditorContent(filename);
        }
        setActiveFile(filename);
    }

    function createTab(filename) {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.file = filename;
        
        const fileIcon = document.querySelector(`.file[data-file="${filename}"] i`).cloneNode(true);
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times close-tab';

        tab.appendChild(fileIcon);
        tab.append(` ${filename} `);
        tab.appendChild(closeIcon);
        
        tabsContainer.appendChild(tab);

        tab.addEventListener('click', () => setActiveFile(filename));
        closeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            closeFile(filename);
        });
    }

    function createEditorContent(filename) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'editor-content';
        contentDiv.dataset.file = filename;
        contentDiv.innerHTML = fileContents[filename];
        editorContainer.appendChild(contentDiv);
        
        openFiles[filename] = { tab: null, content: contentDiv }; // Store reference
        
        // If it's the contact form, add the submit listener
        if (filename === 'contact.html') {
            const form = contentDiv.querySelector('#contactForm');
            form.addEventListener('submit', handleFormSubmit);
        }
    }

    function setActiveFile(filename) {
        // Deactivate all
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.editor-content').forEach(c => c.classList.remove('active'));

        // Activate selected
        const activeTab = document.querySelector(`.tab[data-file="${filename}"]`);
        const activeContent = document.querySelector(`.editor-content[data-file="${filename}"]`);
        
        if(activeTab) activeTab.classList.add('active');
        if(activeContent) activeContent.classList.add('active');
    }

    function closeFile(filename) {
        const tab = document.querySelector(`.tab[data-file="${filename}"]`);
        const content = document.querySelector(`.editor-content[data-file="${filename}"]`);

        if (tab) tab.remove();
        if (content) content.remove();
        delete openFiles[filename];

        // Activate another tab if one exists, otherwise show empty
        const remainingTabs = document.querySelectorAll('.tab');
        if (remainingTabs.length > 0) {
            setActiveFile(remainingTabs[remainingTabs.length - 1].dataset.file);
        }
    }
    
    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const responseDiv = document.querySelector('#form-response');
        responseDiv.textContent = 'در حال ارسال پیام...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://127.0.0.1:5000/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                responseDiv.style.color = '#34c759'; // Green
                responseDiv.textContent = result.message;
                form.reset();
            } else {
                throw new Error(result.message || 'خطایی رخ داد.');
            }
        } catch (error) {
            responseDiv.style.color = '#ff3b30'; // Red
            responseDiv.textContent = `خطا در ارسال: ${error.message}`;
        }
    }

    // Open README.md by default
    openFile('readme.md');

// --- Panel (Terminal) Logic ---
const panel = document.getElementById('panel');
let terminalInput = document.getElementById('terminal-input'); // Use let to re-assign
const terminalBody = document.getElementById('terminal-body');
const closePanelBtn = document.getElementById('close-panel-btn');
const togglePanelBtn = document.getElementById('toggle-panel-btn');
const panelResizer = document.getElementById('panel-resizer');
const editorContainer = document.querySelector('.editor-container');

function togglePanel() {
    panel.classList.toggle('visible');
    if(panel.classList.contains('visible')){
        editorContainer.style.height = `calc(100% - ${panel.style.height || '200px'})`;
    } else {
        editorContainer.style.height = '100%';
    }
}

closePanelBtn.addEventListener('click', togglePanel);
togglePanelBtn.addEventListener('click', togglePanel);

// Draggable Resizer Logic
let isResizing = false;
panelResizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ns-resize'; // Change cursor for the whole page
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newHeight = window.innerHeight - e.clientY - document.querySelector('.status-bar').offsetHeight;
    if (newHeight > 50 && newHeight < (window.innerHeight - 200)) { // Set min/max resize height
        panel.style.height = `${newHeight}px`;
        editorContainer.style.height = `calc(100% - ${newHeight}px)`;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = 'default'; // Reset cursor
});


// Command execution logic
function handleTerminalInput(e) {
    if (e.key === 'Enter') {
        const command = terminalInput.value;
        const prompt = terminalBody.querySelector('.terminal-prompt');
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `<span>user@portfolio:~$</span> ${command}`;
        terminalBody.insertBefore(newLine, prompt);

        executeCommand(command);

        terminalInput.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

terminalInput.addEventListener('keydown', handleTerminalInput);

function executeCommand(command) {
    let output = '';
    const commands = {
        'help': `Available commands:
- whoami    : About me
- skills    : List my technical skills
- contact   : Show my contact information
- clear     : Clear the terminal screen`,
        'whoami': 'Sajjad - A passionate developer who loves solving complex problems and building cool things.',
        'skills': `
Languages:  Python, JavaScript, HTML, CSS
Frameworks: Flask, Django, React, Vue.js
Tools:      Git, Docker, VS Code, Linux`,
        'contact': `You can reach me at:
Email: your_email@gmail.com
LinkedIn: linkedin.com/in/your-profile`,
        'clear': ''
    };

    if (command.toLowerCase() in commands) {
        output = commands[command.toLowerCase()];
        if (command.toLowerCase() === 'clear') {
            // Re-create the terminal body to clear it
            terminalBody.innerHTML = `
                <div class="terminal-prompt">
                    <span>user@portfolio:~$</span>
                    <input type="text" id="terminal-input" autofocus>
                </div>
            `;
            // Re-assign the input and add the listener again
            terminalInput = document.getElementById('terminal-input');
            terminalInput.addEventListener('keydown', handleTerminalInput);
            terminalInput.focus();
            return;
        }
    } else {
        output = `bash: command not found: ${command}`;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';
    outputLine.textContent = output;
    terminalBody.insertBefore(outputLine, terminalBody.querySelector('.terminal-prompt'));
}
});