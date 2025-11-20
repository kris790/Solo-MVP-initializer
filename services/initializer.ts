import { ProjectType, GeneratedFiles, YouTubeAutomationSpec } from '../types';
import {
    generateQuickCastSpec,
    generateQuickCastPrompt,
    generateQuickCastStructure,
    generateMicroSaaSSpec,
    generateMicroSaaSPrompt,
    generateMicroSaaSStructure,
    generateAIToolSpec,
    generateAIToolPrompt,
    generateAIToolStructure,
    generatePairProgrammingSpec,
    generatePairProgrammingPrompt,
    generatePairProgrammingStructure,
    generateSoloPhasePrompts,
    generatePRD
} from './templates';

interface TemplateHandlers {
    getSpec: (projectName: string) => YouTubeAutomationSpec | string;
    getPrompt: (projectName: string) => string;
    getStructure: () => string;
}

class SoloMVPInitializer {
    private projectName: string;
    private projectType: ProjectType;
    private soloTemplates: Record<string, TemplateHandlers>;

    constructor(projectName: string, projectType: ProjectType) {
        this.projectName = projectName;
        this.projectType = projectType;
        this.soloTemplates = {
            [ProjectType.YouTubeAutomation]: {
                getSpec: generateQuickCastSpec,
                getPrompt: generateQuickCastPrompt,
                getStructure: generateQuickCastStructure,
            },
            [ProjectType.MicroSaaS]: {
                getSpec: generateMicroSaaSSpec,
                getPrompt: generateMicroSaaSPrompt,
                getStructure: generateMicroSaaSStructure,
            },
            [ProjectType.AITool]: {
                getSpec: generateAIToolSpec,
                getPrompt: generateAIToolPrompt,
                getStructure: generateAIToolStructure,
            },
            [ProjectType.PairProgramming]: {
                getSpec: generatePairProgrammingSpec,
                getPrompt: generatePairProgrammingPrompt,
                getStructure: generatePairProgrammingStructure,
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
            const specObj = template.getSpec(this.projectName) as YouTubeAutomationSpec;
            spec = this.generateHumanReadableSpec(specObj);
            specForReadme = specObj;
            devPlan = this.createDevelopmentPlan(specObj);
            successMessage = this.getSoloSuccessMessage(specObj);
            packageJson = this.generatePackageJson(specObj.mvp_focus.product_name);
            progressTracker = this.generateProgressTracker(specObj);
            workflowScript = this.generateSoloWorkflowScript();
        } else if (this.projectType === ProjectType.PairProgramming) {
            const stringSpec = template.getSpec(this.projectName) as string;
            spec = stringSpec;
            specForReadme = stringSpec;
            devPlan = this.createDevelopmentPlan(stringSpec);
            successMessage = `🎉 Pair Programming setup for "${this.projectName}" initialized!\n\nCopy the system instruction into your AI chat to begin.`;
        } else {
            const stringSpec = template.getSpec(this.projectName) as string;
            spec = stringSpec;
            specForReadme = stringSpec;
            devPlan = this.createDevelopmentPlan(stringSpec);
            successMessage = `🎉 MVP for "${this.projectName}" initialized successfully!\n\nReview your generated blueprint below to get started.`;
        }

        const prd = generatePRD(this.projectName, this.projectType);

        const prompts: Record<string, string> = {
            '01-mvp-core.md': template.getPrompt(this.projectName)
        };

        if (this.projectType === ProjectType.YouTubeAutomation) {
            const phasePrompts = generateSoloPhasePrompts();
            Object.assign(prompts, phasePrompts);
        } else if (this.projectType === ProjectType.PairProgramming) {
             // For Pair Programming, we provide the System Instruction instead of a standard prompt
             prompts['system_instruction.md'] = template.getPrompt(this.projectName);
             delete prompts['01-mvp-core.md'];
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
            prd,
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
  - **Pair Programmer**: A custom system instruction for iterative, task-based development with an AI.
- **Comprehensive Artifacts**: Each blueprint includes:
  - **MVP Specification**: A clear, human-readable markdown file defining the project's vision, target users, core problems, and features.
  - **Product Requirements Document (PRD)**: A formal requirements document detailing user stories and functional requirements.
  - **Phased AI Prompts**: Context-aware prompts for each development phase, designed to be used with powerful AI models like Gemini to generate code and logic.
  - **Project Structure**: A recommended file and directory layout for your project.
  - **Interactive Workflow**: An executable \`solo-workflow.js\` script to guide you through development week by week.
  - **Progress Tracker**: A \`progress-tracker.json\` file that works with the workflow script to log your progress.
  - **Development Plan**: A structured plan outlining milestones, resource needs, budget, and success criteria.

## 🚀 How to Use This Tool

1.  **Enter Project Name**: Give your project a name (e.g., "QuickCast AI").
2.  **Select Project Type**: Choose the blueprint that best fits your idea. The "YouTube Automation" type is the most feature-rich example.
3.  **Initialize MVP**: Click the button to generate your complete blueprint.
4.  **Review & Download**: Your generated files will appear below. Use the "Download ZIP" button or "Copy" button on each card to get the content.
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