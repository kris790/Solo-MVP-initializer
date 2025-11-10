import { ProjectType, GeneratedFiles, YouTubeAutomationSpec } from '../types';

class SoloMVPInitializer {
    private projectName: string;
    private projectType: ProjectType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private soloTemplates: Record<string, any>;

    constructor(projectName: string, projectType: ProjectType) {
        this.projectName = projectName;
        this.projectType = projectType;
        this.loadTemplates();
    }

    private loadTemplates() {
        this.soloTemplates = {
            [ProjectType.YouTubeAutomation]: {
                getSpec: this.generateQuickCastSpec,
                getPrompt: this.generateQuickCastPrompt,
                getStructure: this.generateQuickCastStructure,
            },
            [ProjectType.MicroSaaS]: {
                getSpec: this.generateMicroSaaSSpec,
                getPrompt: this.generateMicroSaaSPrompt,
                getStructure: this.generateMicroSaaSStructure,
            },
            [ProjectType.AITool]: {
                getSpec: this.generateAIToolSpec,
                getPrompt: this.generateAIToolPrompt,
                getStructure: this.generateAIToolStructure,
            },
        };
    }

    public initialize(): { files: GeneratedFiles; successMessage: string } {
        const template = this.soloTemplates[this.projectType];
        if (!template) {
            throw new Error(`Unknown project type: ${this.projectType}`);
        }

        let spec: string;
        let specForReadme: YouTubeAutomationSpec | string;
        let devPlan: string;
        let successMessage: string;
        let packageJson: string | undefined;
        let progressTracker: string | undefined;
        let workflowScript: string | undefined;

        if (this.projectType === ProjectType.YouTubeAutomation) {
            const specObj = template.getSpec(this.projectName);
            spec = this.generateHumanReadableSpec(specObj);
            specForReadme = specObj;
            devPlan = this.createDevelopmentPlan(specObj);
            successMessage = this.getSoloSuccessMessage(specObj);
            packageJson = this.generatePackageJson(specObj.mvp_focus.product_name);
            progressTracker = this.generateProgressTracker(specObj);
            workflowScript = this.generateSoloWorkflowScript();
        } else {
            const stringSpec = template.getSpec(this.projectName);
            spec = stringSpec;
            specForReadme = stringSpec;
            devPlan = this.createDevelopmentPlan(stringSpec);
            successMessage = `🎉 MVP for "${this.projectName}" initialized successfully!\n\nReview your generated blueprint below to get started.`;
        }

        const prompts: Record<string, string> = {
            '01-mvp-core.md': template.getPrompt(this.projectName)
        };

        if (this.projectType === ProjectType.YouTubeAutomation) {
            const phasePrompts = this.generateSoloPhasePrompts();
            Object.assign(prompts, phasePrompts);
        } else {
            prompts['prompt.md'] = template.getPrompt(this.projectName);
            delete prompts['01-mvp-core.md'];
        }

        const structure = template.getStructure();
        const workflowDoc = this.createSoloWorkflowDoc(spec);
        const readme = this.generateReadme(specForReadme);
        const gitignore = this.generateGitignore();

        const files: GeneratedFiles = {
            readme,
            spec,
            prompts,
            structure,
            workflowDoc,
            devPlan,
            gitignore,
            packageJson,
            progressTracker,
            workflowScript,
        };
        return { files, successMessage };
    }

    private generateGitignore(): string {
        return `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Environment Variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDEs and editors
.vscode/
.idea/
*.swp
*.swo

# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
/venv/
/env/
.env/
pip-cache/
pip-selfcheck.json
*.egg-info/
*.egg
`;
    }

    private generateReadme(specForReadme: YouTubeAutomationSpec | string): string {
        const isYouTubeAutomation = typeof specForReadme === 'object' && 'mvp_focus' in specForReadme;
        
        const workflowSection = isYouTubeAutomation 
            ? `---

## 🛠️ Using Your Generated Blueprint

The generated files provide a powerful, guided development experience, especially for the **YouTube Automation** blueprint. Here's how to use it effectively.

### 1. Prerequisites

- **Node.js**: Required to run the \`solo-workflow.js\` script.
- **Python**: The example YouTube Automation app is designed to be built with Python and Streamlit.
- An **AI Development Environment** (like Google AI Studio) where you can use the generated AI prompts.

### 2. Local Setup

1.  **Create Project Folder**: Create a new directory for your project on your local machine.
2.  **Create Files**: Using the output from this tool, create the following files and folders:
    - \`.gitignore\`
    - \`package.json\`
    - \`progress-tracker.json\`
    - \`solo-workflow.js\`
    - \`requirements.txt\`
    - \`.env.example\` (rename to \`.env\` and add your API keys)
    - \`PROJECT_BRIEF.md\`
    - Create the directory structure: \`src/\`, \`tests/\`, \`docs/\`, \`ai-prompts/\`, \`specs/\`.
    - Place the content for the spec, prompts, and plans into their respective files.
3.  **Install Dependencies**:
    - Run \`npm install\` in your terminal to install the dependencies listed in \`package.json\`.
    - Set up a Python virtual environment and run \`pip install -r requirements.txt\`.

### 3. The Interactive Workflow (\`solo-workflow.js\`)

This script is your personal project manager. It guides you through the development plan you generated.

#### **Step 1: Start Your First Week**

Open your terminal and run:
\`\`\`bash
node solo-workflow.js start-week 1
\`\`\`
This command will display the objectives for the first development phase (Weeks 1-2) and tell you which AI prompt to use.

#### **Step 2: Generate Code with AI**

-   Go to the \`ai-prompts/\` directory and open the prompt file for the current phase (e.g., \`02-week1-2.md\`).
-   Copy the content of this prompt into your preferred AI tool (e.g., Google AI Studio with the Gemini model).
-   Work with the AI to generate the Python/Streamlit code needed to meet the week's objectives. Save the generated code in your \`src/\` directory.

#### **Step 3: Mark Your Progress**

Once you'vecompleted the objectives for the week and integrated the code, update your progress tracker by running:
\`\`\`bash
node solo-workflow.js apply-week 1
\`\`\`
This will mark the tasks as complete in \`progress-tracker.json\` and set up the milestones for the next phase.

#### **Step 4: Check Your Status**

At any time, you can get a summary of your progress:
\`\`\`bash
node solo-workflow.js status
\`\`\`

#### **Step 5: Prepare for Launch**

When you're nearing the end of your development timeline, use the built-in checklist:
\`\`\`bash
node solo-workflow.js launch-checklist
\`\`\`
` 
            : '';

        return `# Solo MVP Initializer

A web-based tool designed to help solo developers, indie hackers, and entrepreneurs bridge the gap between an idea and a tangible development plan. It generates a comprehensive blueprint for your Minimum Viable Product (MVP), including specifications, AI prompts, and an interactive workflow.

## ✨ Features

- **Multiple MVP Blueprints**: Generate plans for different project types:
  - **YouTube Automation**: A tool to help creators with scripting and optimization.
  - **Micro SaaS**: A boilerplate for a small, focused software-as-a-service application.
  - **AI Productivity Tool**: A template for a tool that leverages large language models.
- **Comprehensive Artifacts**: Each blueprint includes:
  - **MVP Specification**: A clear, human-readable markdown file defining the project's vision, target users, core problems, and features.
  - **Phased AI Prompts**: Context-aware prompts for each development phase, designed to be used with powerful AI models like Gemini to generate code and logic.
  - **Project Structure**: A recommended file and directory layout for your project.
  - **Interactive Workflow**: An executable \`solo-workflow.js\` script to guide you through development week by week.
  - **Progress Tracker**: A \`progress-tracker.json\` file that works with the workflow script to log your progress.
  - **Development Plan**: A structured plan outlining milestones, resource needs, budget, and success criteria.

## 🚀 How to Use This Tool

1.  **Enter Project Name**: Give your project a name (e.g., "QuickCast AI").
2.  **Select Project Type**: Choose the blueprint that best fits your idea. The "YouTube Automation" type is the most feature-rich example.
3.  **Initialize MVP**: Click the button to generate your complete blueprint.
4.  **Review & Download**: Your generated files will appear below. Use the "Copy" button on each card to get the content and create the files locally.
${workflowSection}
## 💡 Project Philosophy

This tool is built on the "Solo MVP" methodology, which emphasizes:
- **Leveraging AI**: Use AI as a co-pilot to accelerate development.
- **Rapid Iteration**: Focus on short, productive sprints.
- **Lean Core**: Build and validate one core feature before expanding.
- **Structured Freedom**: A plan provides direction, but you have the freedom to adapt and innovate.
`;
    }

    private getSoloSuccessMessage(spec: YouTubeAutomationSpec): string {
        const coreFeatures = spec.core_features
            .sort((a, b) => a.priority - b.priority)
            .map((feature) => `${feature.priority}. ${feature.feature_name} (Priority ${feature.priority})`)
            .join('\n');
            
        const devPlanSummary = Object.values(spec.development_phases)
            .map(phase => phase.title)
            .join('\n');

        return `
🎉 SOLO DEVELOPER MVP INITIALIZED: ${spec.mvp_focus.product_name}

📊 Project Type: YouTube Automation Tool
👤 Developer: ${spec.project_constraints.developer}
⏱️  Timeline: ${spec.project_constraints.timeline}
💰 API Budget: ${spec.project_constraints.api_budget}

🎯 CORE FEATURES:
${coreFeatures}

🚀 QUICK START:
1. Start Week 1:    node solo-workflow.js start-week 1
2. Apply Changes:   node solo-workflow.js apply-week 1
3. Check Status:    node solo-workflow.js status

📁 Project Structure:
- /specs/          # MVP specification and constraints
- /ai-prompts/     # Week-by-week development prompts
- /src/            # Source code (Python + Streamlit)
- progress-tracker.json # Development progress

💡 Development Plan:
${devPlanSummary}

Next: Run 'node solo-workflow.js start-week 1' to begin Week 1 development!
`.trim();
    }

    private generatePackageJson(projectName: string): string {
        const pkg = {
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: "1.0.0",
            type: "module",
            scripts: {
                "dev": "streamlit run src/app.py",
                "test": "pytest tests/",
                "deploy": "node solo-workflow.js deploy",
                "scan": "node gemini-scanner.py . --output context.json"
            }
        };
        return JSON.stringify(pkg, null, 2);
    }

    private generateProgressTracker(spec: YouTubeAutomationSpec): string {
        const firstPhaseKey = Object.keys(spec.development_phases)[0];
        const firstMilestones = spec.development_phases[firstPhaseKey]?.tasks || ["Setup development environment", "Build script generator core"];

        const tracker = {
            project: spec.mvp_focus.product_name,
            timeline: spec.project_constraints.timeline,
            current_week: 1,
            completed: [],
            next_milestones: firstMilestones,
            log: ["Project initialized."]
        };
        return JSON.stringify(tracker, null, 2);
    }

    private generateSoloWorkflowScript(): string {
        return `// solo-workflow.js - Core workflow management CLI
import fs from 'fs';
import path from 'path';

const SPEC_PATH = 'specs/mvp-specification.json';
const PROGRESS_PATH = 'progress-tracker.json';

class SoloDevWorkflow {
    constructor() {
        try {
            this.spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
            this.progress = JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
        } catch (error) {
            console.error('❌ Error: Could not load spec or progress files. Make sure they exist.');
            process.exit(1);
        }
    }

    getPhaseForWeek(weekNumber) {
        const week = parseInt(weekNumber, 10);
        for (const key in this.spec.development_phases) {
            const [start, end] = key.split('_').slice(1).map(Number);
            if (week >= start && week <= end) {
                return { key, ...this.spec.development_phases[key] };
            }
        }
        return null;
    }

    startWeek(weekNumber) {
        console.log(\`🚀 Starting Week \${weekNumber} of \${this.spec.project_constraints.timeline}\`);
        const phase = this.getPhaseForWeek(weekNumber);
        if (!phase) {
            console.log('✅ All weeks completed or plan not found for this week! Ready for launch.');
            return;
        }

        console.log(\`\\n📋 Focus: \${phase.title}\`);
        console.log('Objectives:');
        phase.tasks.forEach((task, index) => {
            console.log(\`   \${index + 1}. \${task}\`);
        });
        
        console.log(\`\\n🎯 AI PROMPT READY FOR \${phase.title}\\n\`);
        console.log('Next steps:');
        console.log(\`1. Use the prompt from the 'ai-prompts/' directory for this phase.\`);
        console.log('2. Implement the features for the week.');
        console.log(\`3. Run 'node solo-workflow.js apply-week \${weekNumber}' when done.\`);
    }

    applyWeek(weekNumber) {
        const phase = this.getPhaseForWeek(weekNumber);
        if (!phase) {
            console.error('❌ No phase found for this week. Cannot apply changes.');
            return;
        }

        this.progress.completed.push(...phase.tasks);
        
        const phaseKeys = Object.keys(this.spec.development_phases);
        const currentPhaseIndex = phaseKeys.indexOf(phase.key);
        const nextPhaseKey = phaseKeys[currentPhaseIndex + 1];

        if (nextPhaseKey) {
            this.progress.next_milestones = this.spec.development_phases[nextPhaseKey].tasks;
            const nextWeek = parseInt(nextPhaseKey.split('_')[1], 10);
            this.progress.current_week = nextWeek;
        } else {
            this.progress.next_milestones = ["Prepare for launch!"];
            this.progress.current_week = parseInt(phase.key.split('_')[2], 10) + 1;
        }
        
        this.progress.log.push(\`Completed phase: \${phase.title}\`);
        fs.writeFileSync(PROGRESS_PATH, JSON.stringify(this.progress, null, 2));
        console.log(\`✅ Applied changes for \${phase.title}. Progress tracker updated.\`);
        this.status();
    }
    
    status() {
        console.log(\`\\n📊 \${this.progress.project} - Status Update\`);
        console.log('------------------------------------');
        console.log(\`Current Week: \${this.progress.current_week}\`);
        console.log(\`Timeline: \${this.progress.timeline}\`);
        
        console.log('\\n✅ Completed Milestones:');
        if(this.progress.completed.length === 0) console.log('   None yet.');
        this.progress.completed.forEach(task => console.log(\`   - \${task}\`));

        console.log('\\n🎯 Next Milestones:');
        this.progress.next_milestones.forEach(task => console.log(\`   - \${task}\`));
        console.log('------------------------------------');
    }

    launchChecklist() {
        console.log('\\n🚀 Pre-Launch Checklist:');
        const checklist = [
            "Finalize UI/UX and fix all known visual bugs.",
            "Perform end-to-end testing on all core features.",
            "Test on major browsers (Chrome, Firefox, Safari).",
            "Set up production database and environment variables.",
            "Implement analytics (e.g., Google Analytics, Plausible).",
            "Set up error monitoring (e.g., Sentry).",
            "Write a clear README and deployment instructions.",
            "Prepare marketing materials (landing page, social media posts).",
            "Get feedback from at least 5 beta testers.",
            "Celebrate the launch! 🎉"
        ];
        checklist.forEach(item => console.log(\`- [ ] \${item}\`));
    }

    showHelp() {
        console.log(\`
Usage: node solo-workflow.js <command> [options]

Commands:
  start-week <number>    Show the plan and prompt for a specific week.
  apply-week <number>    Mark a week's tasks as complete and update progress.
  status                 Display the current project status.
  launch-checklist       Show a pre-launch checklist.
  help                   Display this help message.

Example:
  node solo-workflow.js start-week 1
        \`);
    }
}

const command = process.argv[2];
const option = process.argv[3];
const workflow = new SoloDevWorkflow();

switch (command) {
    case 'start-week':
        if (!option) { console.error('❌ Week number is required.'); workflow.showHelp(); }
        else workflow.startWeek(option);
        break;
    case 'apply-week':
        if (!option) { console.error('❌ Week number is required.'); workflow.showHelp(); }
        else workflow.applyWeek(option);
        break;
    case 'status':
        workflow.status();
        break;
    case 'launch-checklist':
        workflow.launchChecklist();
        break;
    case 'help':
    default:
        workflow.showHelp();
        break;
}
`.trim();
    }

    private generateQuickCastSpec(): YouTubeAutomationSpec {
        return {
            project_constraints: {
                developer: "Solo builder",
                timeline: "4-6 weeks part-time",
                stack_preference: "Python + Streamlit for quick prototyping",
                api_budget: "Keep API costs under $50/month for initial testing",
                scope: "Minimal viable product with 1-2 core features that work well"
            },
            target_users: "Small YouTube creators (1K-10K subs) in personal finance niche",
            core_problems: [
                "Creator's block - struggling to come up with video ideas",
                "Time-consuming script writing process",
                "Difficulty optimizing titles/descriptions for SEO"
            ],
            mvp_focus: {
                product_name: "QuickCast AI",
                tagline: "AI-powered YouTube script assistant for solo creators",
                value_prop: "Generate ready-to-film YouTube scripts in 2 minutes instead of 2 hours"
            },
            core_features: [
                {
                    feature_name: "Script Generator",
                    description: "Generate complete YouTube scripts from a topic idea",
                    user_inputs: ["Main topic", "Video length (3/5/8/10 min)", "Tone (educational/entertaining/persuasive)"],
                    output_structure: "Title + Hook + 3 main points + Conclusion + Call-to-action",
                    technical_approach: "Gemini API with structured prompt engineering",
                    api_cost_estimate: "$0.10-$0.30 per script",
                    priority: 1
                },
                {
                    feature_name: "Title Optimizer",
                    description: "Generate 5 click-worthy titles and analyze CTR potential",
                    technical_approach: "Compare against YouTube title patterns database",
                    cost: "Minimal - can run locally after initial setup",
                    priority: 2
                }
            ],
            development_phases: {
                "weeks_1_2": {
                    "title": "Week 1-2: Core MVP Build",
                    "tasks": [
                        "Setup Streamlit application foundation",
                        "Implement Gemini API integration",
                        "Build script generator with structured output",
                        "Create basic UI with topic, length, and tone inputs",
                        "Test with 5 sample finance topics"
                    ]
                },
                "weeks_3_4": {
                    "title": "Week 3-4: Enhancements & Data",
                    "tasks": [
                        "Add SQLite database for user accounts and script history",
                        "Implement title optimizer feature",
                        "Add basic user authentication",
                        "Improve UI/UX based on initial testing",
                        "Add script export functionality"
                    ]
                },
                 "weeks_5_6": {
                    "title": "Week 5-6: Deployment & Launch Prep",
                    "tasks": [
                        "Refine UI and add loading/error states",
                        "Deploy to Hugging Face Spaces or Railway.app",
                        "Gather feedback from 10 beta testers",
                        "Write documentation (README)",
                        "Prepare for launch"
                    ]
                }
            },
            technical_spec: {
                apis_required: ["Google Gemini API", "YouTube Data API for research"],
                database: "SQLite for user accounts and script history",
                deployment: "Hugging Face Spaces or Railway.app (free tier)"
            },
            validation_metrics: [
                "10+ beta testers providing positive feedback",
                "Average script generation time under 15 seconds",
                "Users successfully generating and using 3+ scripts per session"
            ]
        };
    }

    private generateHumanReadableSpec(spec: YouTubeAutomationSpec): string {
        const features = spec.core_features
            .sort((a, b) => a.priority - b.priority)
            .map((feature, index) => `
### ${index + 1}. ${feature.feature_name}
**${feature.description}**${feature.user_inputs ? `\n**Inputs**: ${feature.user_inputs.join(', ')}` : ''}${feature.output_structure ? `\n**Output**: ${feature.output_structure}` : ''}
**Technical**: ${feature.technical_approach}
**Cost**: ${feature.api_cost_estimate || feature.cost || 'N/A'}`).join('');

        return `# ${spec.mvp_focus.product_name} - MVP Specification

## 🎯 Product Vision
**${spec.mvp_focus.tagline}**

${spec.mvp_focus.value_prop}

## 👥 Target Users
${spec.target_users}

## 🔥 Problems Solved
${spec.core_problems.map(p => `- ${p}`).join('\n')}

## 🛠️ Technical Constraints
- **Developer**: ${spec.project_constraints.developer}
- **Timeline**: ${spec.project_constraints.timeline}
- **Stack**: ${spec.project_constraints.stack_preference}
- **API Budget**: ${spec.project_constraints.api_budget}
- **Scope**: ${spec.project_constraints.scope}

## 🚀 Core Features
${features}
`;
    }

    private generateMicroSaaSSpec(projectName: string): string {
        return `
# MVP Specification for ${projectName} - Micro SaaS

**1. Project Vision:** To provide a simple, affordable, and beautiful solution for creating and managing public status pages for small to medium-sized businesses.

**2. Core Problem:** Existing status page solutions are often expensive, complex, or part of a larger, bloated monitoring suite. Startups and small businesses need a "just works" solution.

**3. Target Audience:** SaaS founders, indie hackers, and IT managers at SMBs.

**4. Key MVP Features:**
    - **User Authentication:** Simple email/password or social login.
    - **Status Page Creation:** Users can create one public status page on a subdomain (e.g., mycompany.statuspage.app).
    - **Service Management:** Add/edit/delete services/components to monitor (e.g., API, Website, Dashboard).
    - **Manual Incident Reporting:** Manually create and update incidents (e.g., Investigating, Identified, Monitoring, Resolved) with status updates.
    - **Customization:** Basic branding (logo, primary color).
    - **Public View:** A clean, fast, and responsive public-facing status page.

**5. Tech Stack (Proposed):**
    - Frontend: React/Vue with Tailwind CSS
    - Backend: Node.js with a framework like NestJS or a BaaS like Supabase/Firebase.
    - Database: PostgreSQL or Firestore.
    - Hosting: A platform-as-a-service like Vercel, Netlify, or Heroku.

**6. Monetization (Post-MVP):**
    - Tiered pricing: Free plan with branding, paid plans for custom domains, private pages, and automated monitoring.

**7. Success Metrics (MVP):**
    - Number of active status pages created.
    - Daily active users (creators).
    - Positive feedback from early adopters on Twitter/Indie Hackers.
`;
    }

    private generateAIToolSpec(projectName: string): string {
        return `
# MVP Specification for ${projectName} - AI Productivity Tool

**1. Project Vision:** An AI-powered tool that acts as a "second brain" for meetings, automatically generating summaries, action items, and follow-up emails.

**2. Core Problem:** Professionals attend countless meetings, leading to note-taking fatigue, missed action items, and time wasted on post-meeting administrative tasks.

**3. Target Audience:** Product managers, consultants, sales executives, and team leads who live in meetings.

**4. Key MVP Features:**
    - **Audio/Transcript Upload:** User can upload an audio file (mp3, wav) or paste a raw text transcript of a meeting.
    - **AI Processing:** Use a powerful language model (Gemini) to process the transcript.
    - **Structured Output Generation:** The tool generates a structured output with:
        - **Concise Summary:** A one-paragraph overview of the meeting.
        - **Key Decisions:** Bulleted list of important decisions made.
        - **Action Items:** A table of tasks, assigned owners (if mentioned), and deadlines.
        - **Draft Follow-up Email:** A pre-written email summarizing the meeting for attendees.
    - **Simple UI:** A single-page application for upload, processing, and viewing/copying the results.

**5. Tech Stack (Proposed):**
    - Frontend: React (Vite) with Tailwind CSS.
    - Backend: Serverless functions (Cloudflare Workers, Vercel Functions) for scalability and cost-efficiency.
    - AI: Gemini API for all language processing tasks.
    - Storage: A simple object storage for temporary audio file uploads (e.g., Cloudflare R2, AWS S3).

**6. Success Metrics (MVP):**
    - Number of meeting transcripts processed.
    - High user satisfaction with the quality and accuracy of the generated summaries and action items.
    - "Wow" moments shared by users on social media.
`;
    }

    private generateQuickCastPrompt(): string {
        return `## SOLO DEVELOPER MVP: QUICKCAST AI

You are a solo developer building a lean MVP for a YouTube automation tool. Focus on practical, implementable features that can be built quickly with available APIs and libraries.

## PROJECT CONSTRAINTS
- **Developer**: Solo builder working part-time
- **Timeline**: 4-6 weeks to working MVP
- **Stack**: Python + Streamlit for rapid prototyping
- **API Budget**: Under $50/month for initial testing
- **Scope**: Minimal viable product with 1-2 core features

## CORE MVP FEATURES

### 1. Script Generator (PRIORITY 1)
- Generate complete YouTube scripts from topic ideas
- User inputs: Main topic, Video length (3/5/8/10 min), Tone (educational/entertaining/persuasive)
- Output structure: Title + Hook + 3 main points + Conclusion + Call-to-action
- Technical: Gemini API with structured prompt engineering
- Cost target: $0.10-$0.30 per script

### 2. Title Optimizer (PRIORITY 2)  
- Generate 5 click-worthy titles and analyze CTR potential
- Compare against YouTube title patterns database
- Minimal API costs - can run locally after setup

## TECHNICAL SPECIFICATION
- **Frontend**: Streamlit web app (single .py file)
- **Backend**: Python with FastAPI if needed
- **APIs**: Google Gemini API, YouTube Data API for research
- **Database**: SQLite for user accounts and script history
- **Deployment**: Hugging Face Spaces or Railway.app (free tier)

## IMPLEMENTATION PRIORITIES
1. Working script generator with clean Streamlit UI
2. Basic user authentication and script history
3. Title optimizer feature
4. Deployment and beta testing

## DELIVERABLE REQUIREMENTS
- COMPLETE working Streamlit application
- All Python files with proper error handling
- SQLite database schema and operations
- API integration with proper error handling
- Environment configuration
- Deployment instructions
- Basic testing setup

## OUTPUT FORMAT
Provide ALL files needed for a working MVP in a single JSON response. Focus on clean, maintainable code that a solo developer can easily extend.
`;
    }

    private generateMicroSaaSPrompt(): string {
        return `
# Gemini Prompt Template: MicroSaaS Status Page Update

This is a template for generating professional incident updates for a public status page.
To use it, replace the placeholders \`{user_notes}\` and \`{current_status}\` with your specific details, then provide the entire text to a large language model like Gemini.

---

You are a helpful AI assistant for a SaaS company. Your task is to take a brief, informal description of a technical issue and generate a clear, professional incident update for a public status page. The tone should be calm, confident, and empathetic. Avoid overly technical jargon.

**User's Raw Notes:**
\`\`\`
{user_notes}
\`\`\`

**Current Incident Status:** {current_status}

---
## EXAMPLES

**Example 1:**
- **User Notes:** "API is slow, users complaining about timeouts. looks like a db query is hanging."
- **Status:** "Investigating"
- **Generated Output:** "We are currently investigating reports of slow API performance and timeouts. Our team is working to identify the root cause and we will provide another update shortly."

**Example 2:**
- **User Notes:** "fixed the db query, pushed a hotfix. everything looks green now."
- **Status:** "Resolved"
- **Generated Output:** "A fix has been implemented and we have confirmed that all systems are back to normal operation. We apologize for any inconvenience this may have caused."
`;
    }

    private generateAIToolPrompt(): string {
        return `
# Gemini Prompt for AI Productivity Tool - Meeting Summarizer

You are a world-class executive assistant. Your job is to analyze the following meeting transcript and produce a structured, actionable summary.

**Meeting Transcript:**
\`\`\`
{meeting_transcript}
\`\`\`

From the transcript, extract the following information and format it in JSON.

1.  \`summary\`: A concise, one-paragraph summary of the meeting's purpose, key discussion points, and outcomes.
2.  \`decisions\`: A bulleted list of all concrete decisions that were made.
3.  \`action_items\`: A list of all action items. Each item should be an object with keys for \`task\`, \`owner\`, and \`due_date\` (if mentioned). If an owner or due date is not explicitly mentioned, use "Not specified".
4.  \`follow_up_email\`: Draft a professional follow-up email to all meeting attendees. The email should briefly summarize the key points and clearly list the action items with their owners and due dates. Start the email with "Hi Team,".

**Output Format:** Return ONLY a single, valid JSON object with the keys \`summary\`, \`decisions\`, \`action_items\`, and \`follow_up_email\`.
`;
    }

    private generateSoloPhasePrompts(): Record<string, string> {
        return {
            '02-week1-2.md': `## WEEK 1-2: CORE MVP BUILD

## CURRENT STATUS
Starting from scratch - building core script generator.

## WEEK 1-2 OBJECTIVES
- Setup Streamlit application foundation
- Implement Gemini API integration
- Build script generator with structured output
- Create basic UI with topic, length, and tone inputs
- Test with 5 sample finance topics

## TECHNICAL FOCUS
- Clean Streamlit UI with proper state management
- Structured prompt engineering for consistent script format
- Error handling for API failures
- Basic session management

## DELIVERABLES
- Working script generator MVP
- Clean, responsive Streamlit interface
- Proper API error handling
- Sample test cases
`,
            '03-week3-4.md': `## WEEK 3-4: ENHANCEMENTS & DATA

## CURRENT STATUS  
Core script generator is working. Basic UI functional.

## WEEK 3-4 OBJECTIVES
- Add SQLite database for user accounts and script history
- Implement title optimizer feature
- Add basic user authentication
- Improve UI/UX based on initial testing
- Add script export functionality

## TECHNICAL FOCUS
- SQLite schema design for scripts and users
- Title analysis algorithm (local processing to save costs)
- Session-based authentication
- Data persistence and history

## DELIVERABLES
- Database with user accounts and script history
- Title optimizer feature
- Basic authentication system
- Enhanced UI with history view
`
        };
    }

    private generateQuickCastStructure(): string {
        const structure = {
            directories: {
                'src': ['utils', 'services', 'database'],
                'tests': [],
                'docs': ['api', 'deployment'],
                'data': ['sample_scripts'],
                'config': []
            },
            files: {
                'requirements.txt': `streamlit==1.28.0
google-generativeai
python-dotenv==1.0.0
`,
                '.env.example': `GEMINI_API_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=your_youtube_key_here
`,
                'PROJECT_BRIEF.md': `# QuickCast AI - Solo Developer MVP\n\nYouTube script generation tool for small creators.`
            }
        };
        return JSON.stringify(structure, null, 2);
    }

    private generateMicroSaaSStructure(): string {
        return `
/ (root)
|-- /src
|   |-- /app
|   |   |-- / (marketing pages)
|   |   |   |-- page.tsx
|   |   |   |-- layout.tsx
|   |   |-- /dashboard
|   |   |   |-- page.tsx (Main dashboard)
|   |   |   |-- /settings
|   |   |   |   |-- page.tsx
|   |   |-- /auth
|   |   |   |-- /sign-in
|   |   |   |   |-- page.tsx
|   |   |   |-- /sign-up
|   |   |   |   |-- page.tsx
|   |   |-- /api (Serverless functions or tRPC routes)
|   |   |   |-- /webhooks
|   |   |   |-- /statuspages
|   |-- /components
|   |   |-- IncidentForm.tsx
|   |   |-- ServiceStatus.tsx
|   |-- /lib
|   |   |-- db.ts (Database client, e.g., Prisma)
|   |   |-- auth.ts (Authentication logic)
|-- /public
|-- /prisma
|   |-- schema.prisma
|-- package.json
`;
    }

    private generateAIToolStructure(): string {
        const structure = {
            directories: {
                'src': ['services'],
                'public': []
            },
            files: {
                'package.json': JSON.stringify({
                    name: "ai-productivity-tool",
                    private: true,
                    version: "0.0.0",
                    type: "module",
                    scripts: {
                        dev: "vite",
                        build: "tsc && vite build",
                        preview: "vite preview"
                    },
                    dependencies: {
                        "react": "^18.2.0",
                        "react-dom": "^18.2.0",
                        "@google/genai": "^0.3.1"
                    },
                    devDependencies: {
                        "@types/react": "^18.2.0",
                        "@types/react-dom": "^18.2.0",
                        "@vitejs/plugin-react": "^4.2.0",
                        "autoprefixer": "^10.4.16",
                        "postcss": "^8.4.32",
                        "tailwindcss": "^3.3.6",
                        "typescript": "^5.2.2",
                        "vite": "^5.0.0"
                    }
                }, null, 2),
                'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is a workaround to make process.env available in the browser.
  // IMPORTANT: This is NOT secure for production apps.
  // In a real-world scenario, you should make your API calls from a backend server
  // where your API key can be kept secret. The key is injected by the
  // execution environment, but exposing it client-side is a security risk.
  define: {
    'process.env': {}
  }
})`,
                'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}`,
                '.env.example': 'API_KEY=your_gemini_api_key_here',
                'README.md': `# AI Productivity Tool\n\nThis is a boilerplate for an AI-powered tool that acts as a "second brain" for meetings, automatically generating summaries, action items, and follow-up emails.`,
                'src/index.css': `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
`,
                'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
                'src/App.tsx': `import React, { useState } from 'react';
import { summarizeMeeting, SummaryResult } from './services/gemini';

function App() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await summarizeMeeting(transcript);
      setSummary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Meeting Summarizer
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Paste your meeting transcript below to automatically generate summaries, action items, and follow-up emails.
          </p>
        </header>

        <main>
          <div className="space-y-4">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              className="w-full h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
              rows={10}
            />
            <button
              onClick={handleSummarize}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Summarizing...
                </>
              ) : 'Summarize Meeting'}
            </button>
          </div>

          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

          {summary && (
            <div className="mt-10 space-y-8">
              {/* Summary Card */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-fade-in">
                  <h2 className="text-xl font-bold mb-3 text-pink-400">Meeting Summary</h2>
                  <p className="text-gray-300 leading-relaxed">{summary.summary}</p>
              </div>
      
              {/* Decisions and Actions in a grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Decisions Card */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-fade-in" style={{animationDelay: '150ms'}}>
                      <h2 className="text-xl font-bold mb-3 text-purple-400">Key Decisions</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {summary.decisions.map((decision, index) => <li key={index}>{decision}</li>)}
                      </ul>
                  </div>
      
                  {/* Action Items Card */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-fade-in" style={{animationDelay: '300ms'}}>
                      <h2 className="text-xl font-bold mb-3 text-purple-400">Action Items</h2>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                              <thead className="text-gray-400">
                                  <tr>
                                      <th className="py-2 pr-2 font-semibold">Task</th>
                                      <th className="py-2 px-2 font-semibold">Owner</th>
                                      <th className="py-2 pl-2 font-semibold">Due Date</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700">
                                  {summary.action_items.map((item, index) => (
                                      <tr key={index}>
                                          <td className="py-2 pr-2 text-gray-300">{item.task}</td>
                                          <td className="py-2 px-2 text-gray-400">{item.owner}</td>
                                          <td className="py-2 pl-2 text-gray-400">{item.due_date}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
      
              {/* Follow-up Email Card */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-fade-in" style={{animationDelay: '450ms'}}>
                  <div className="flex justify-between items-center mb-3">
                       <h2 className="text-xl font-bold text-pink-400">Draft Follow-up Email</h2>
                       <button 
                         onClick={() => navigator.clipboard.writeText(summary.follow_up_email)} 
                         className="bg-gray-700 hover:bg-gray-600 text-xs font-mono px-3 py-1 rounded-md transition-colors"
                       >
                         Copy Email
                       </button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-gray-300 bg-gray-900/50 p-4 rounded-md overflow-x-auto">
                      <code>{summary.follow_up_email}</code>
                  </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
`,
                'src/services/gemini.ts': `import { GoogleGenAI, Type } from "@google/genai";

// IMPORTANT: The following code is a simplified example and should not be used in a production environment.
// The Gemini API key is exposed on the client side, which is a significant security risk.
// In a real-world application, all API calls should be made from a secure backend server
// to protect your API key from being compromised.
// The execution environment for this app injects the API key via process.env.API_KEY.

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you might show a user-friendly error message here.
    // For this boilerplate, we'll throw an error to make the issue clear during development.
    throw new Error("API_KEY environment variable not set. Please ensure it's configured in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface SummaryResult {
    summary: string;
    decisions: string[];
    action_items: {
        task: string;
        owner: string;
        due_date: string;
    }[];
    follow_up_email: string;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the meeting's purpose, key discussion points, and outcomes."
        },
        decisions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of all concrete decisions that were made."
        },
        action_items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    task: { type: Type.STRING },
                    owner: { type: Type.STRING },
                    due_date: { type: Type.STRING }
                },
                required: ['task', 'owner', 'due_date']
            },
            description: "A list of all action items. If an owner or due date is not explicitly mentioned, use 'Not specified'."
        },
        follow_up_email: {
            type: Type.STRING,
            description: 'Draft a professional follow-up email to all meeting attendees. Start the email with "Hi Team,".'
        }
    },
    required: ['summary', 'decisions', 'action_items', 'follow_up_email']
};

export async function summarizeMeeting(transcript: string): Promise<SummaryResult> {
    const prompt = \`Analyze the following meeting transcript and produce a structured, actionable summary in JSON format based on the provided schema.

Meeting Transcript:
\\\`\\\`\\\`
\${transcript}
\\\`\\\`\\\`
\`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SummaryResult;
    } catch (error) {
        console.error("Error summarizing meeting:", error);
        if (error instanceof Error) {
            throw new Error(\`Failed to get summary from Gemini: \${error.message}\`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
}`
            }
        };
        return JSON.stringify(structure, null, 2);
    }

    private createSoloWorkflowDoc(spec: string): string {
        return `
# Solo Workflow for MVP

This workflow is designed for a solo developer to build and launch the MVP efficiently. It's based on the "Solo MVP" methodology, focusing on rapid iteration and leveraging AI.

## 1. Foundation (Day 1-2)

- **Tech Stack Finalization:** Based on the spec, make final decisions on the tech stack. Prioritize simplicity and speed (e.g., Next.js over complex microservices, Supabase over self-hosted Postgres).
- **Project Setup:** Initialize the repository, set up the development environment, install dependencies, and configure CI/CD for automated deployments from day one.
- **Data Modeling:** Design the core database schema. Use a tool like Prisma or Supabase's table editor.

## 2. Core Logic & AI Integration (Day 3-5)

- **Build the "Magic":** Focus exclusively on the core AI feature. Write the server-side logic that takes user input, formats it for the Gemini prompt, calls the API, and processes the result.
- **Hardcode Everything Else:** The initial UI should be minimal. Use hardcoded values for user data, etc. The goal is to make the AI feature work end-to-end first.

## 3. UI/UX Scaffolding (Day 6-9)

- **Component-Based UI:** Build out the necessary React components. Use a component library like Shadcn/UI or a simple Tailwind CSS setup to move fast.
- **State Management:** Implement client-side state management. For simple apps, React's built-in hooks (\`useState\`, \`useContext\`, \`useReducer\`) are often enough.
- **Connect UI to Core Logic:** Wire up the frontend to the backend API endpoint. Ensure data flows correctly and errors are handled gracefully.

## 4. "Real" Features & Polish (Day 10-14)

- **Authentication & Database:** Replace hardcoded values with a real authentication system (e.g., NextAuth, Supabase Auth) and connect the application to the database.
- **Polishing:** Refine the UI. Add loading states, notifications, and improve the overall user experience.
- **Testing:** Perform thorough end-to-end testing of the main user flow.

## MVP Specification Used:

\`\`\`markdown
${spec}
\`\`\`
`;
    }

    private createDevelopmentPlan(spec: string | YouTubeAutomationSpec): string {
        if (typeof spec === 'object' && 'mvp_focus' in spec && 'technical_spec' in spec) {
            const structuredSpec = spec as YouTubeAutomationSpec;
            const plan = {
                project: structuredSpec.mvp_focus.product_name,
                timeline: structuredSpec.project_constraints.timeline,
                weekly_milestones: structuredSpec.development_phases,
                resources_needed: structuredSpec.technical_spec.apis_required,
                budget: {
                    api_costs: structuredSpec.core_features.find(f => f.priority === 1)?.api_cost_estimate || 'N/A',
                    total_monthly: "$50",
                    hosting: structuredSpec.technical_spec.deployment
                },
                success_criteria: structuredSpec.validation_metrics
            };
            return `# Development Plan: ${structuredSpec.mvp_focus.product_name}\n\n\`\`\`json\n${JSON.stringify(plan, null, 2)}\n\`\`\``;
        }

        const stringSpec = spec as string;
        return `
# High-Level Development Plan (14-Day Sprint)

This plan breaks down the MVP development into a 2-week sprint, focusing on delivering the core functionality defined in the specification.

---

### **Week 1: Building the Engine**

**Day 1: Setup & Scaffolding**
- [ ] Initialize Next.js/Vite project with TypeScript and Tailwind CSS.
- [ ] Set up Git repository on GitHub/GitLab.
- [ ] Create basic project structure (folders for components, services, etc.).
- [ ] Deploy the "Hello World" app to Vercel/Netlify to ensure CI/CD is working.

**Day 2: The "Spine" - API Endpoint**
- [ ] Create a serverless function/API route for the core task.
- [ ] Install Gemini SDK.
- [ ] Implement basic request handling (without the actual AI call yet).
- [ ] Set up environment variables for API keys.

**Day 3-4: Core AI Integration**
- [ ] Write the service/function that prepares the prompt for Gemini.
- [ ] Make the actual API call to Gemini.
- [ ] Implement logic to parse and handle the JSON response from the AI.
- [ ] Add robust error handling for API failures.
- [ ] Test the endpoint with a tool like Postman or curl.

**Day 5: Minimal Frontend**
- [ ] Create the main input form (e.g., text area, file upload).
- [ ] Write the logic to send data from the frontend to the API endpoint created on Day 2.
- [ ] Display the raw JSON response from the backend on the page. NO STYLING.

**Week 1 Goal:** Have a functioning, ugly prototype that proves the core AI feature works end-to-end.

---

### **Week 2: Building the Car Around the Engine**

**Day 6-7: UI Implementation**
- [ ] Design and build the main UI components using Tailwind CSS.
- [ ] Focus on a clean, simple layout.
- [ ] Create a dedicated component to display the formatted results from the AI.

**Day 8: State Management & UX**
- [ ] Manage application state (loading, error, success, data).
- [ ] Add loading spinners/skeletons to provide user feedback.
- [ ] Display user-friendly error messages.

**Day 9: Database & User Accounts (if applicable)**
- [ ] Set up database schema (e.g., using Prisma).
- [ ] Implement user sign-up and login.
- [ ] Write logic to save user data or results to the database.

**Day 10-11: Polish & Refinement**
- [ ] Add copy-to-clipboard buttons for results.
- [ ] Make the UI responsive for mobile devices.
- [ ] Refactor any messy code from Week 1.
- [ ] Add a simple landing page explaining what the tool does.

**Day 12-13: Testing & Feedback**
- [ ] Test the complete user flow on multiple browsers.
- [ ] Fix bugs found during testing.
- [ ] Share with a few friends or on a private forum to get initial feedback.

**Day 14: Prepare for Launch!**
- [ ] Final code cleanup.
- [ ] Write a simple README.
- [ ] Prepare marketing materials (e.g., a tweet, a short blog post).
- [ ] **LAUNCH!**

---

### **MVP Specification Reference:**

\`\`\`markdown
${stringSpec}
\`\`\`
`;
    }
}

export const initializeMvp = (projectName: string, projectType: ProjectType): { files: GeneratedFiles; successMessage: string } => {
    const initializer = new SoloMVPInitializer(projectName, projectType);
    return initializer.initialize();
};