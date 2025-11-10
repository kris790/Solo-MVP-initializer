# Solo MVP Initializer

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
  - **Interactive Workflow**: An executable `solo-workflow.js` script to guide you through development week by week.
  - **Progress Tracker**: A `progress-tracker.json` file that works with the workflow script to log your progress.
  - **Development Plan**: A structured plan outlining milestones, resource needs, budget, and success criteria.

## 🚀 How to Use This Tool

1.  **Enter Project Name**: Give your project a name (e.g., "QuickCast AI").
2.  **Select Project Type**: Choose the blueprint that best fits your idea. The "YouTube Automation" type is the most feature-rich example.
3.  **Initialize MVP**: Click the button to generate your complete blueprint.
4.  **Review & Download**: Your generated files will appear below. Use the "Copy" button on each card to get the content and create the files locally.

---

## 🛠️ Using Your Generated Blueprint

The generated files provide a powerful, guided development experience, especially for the **YouTube Automation** blueprint. Here's how to use it effectively.

### 1. Prerequisites

- **Node.js**: Required to run the `solo-workflow.js` script.
- **Python**: The example YouTube Automation app is designed to be built with Python and Streamlit.
- An **AI Development Environment** (like Google AI Studio) where you can use the generated AI prompts.

### 2. Local Setup

1.  **Create Project Folder**: Create a new directory for your project on your local machine.
2.  **Create Files**: Using the output from this tool, create the following files and folders:
    - `package.json`
    - `progress-tracker.json`
    - `solo-workflow.js`
    - `requirements.txt`
    - `.env.example` (rename to `.env` and add your API keys)
    - `PROJECT_BRIEF.md`
    - Create the directory structure: `src/`, `tests/`, `docs/`, `ai-prompts/`, `specs/`.
    - Place the content for the spec, prompts, and plans into their respective files.
3.  **Install Dependencies**:
    - Run `npm install` in your terminal to install the dependencies listed in `package.json`.
    - Set up a Python virtual environment and run `pip install -r requirements.txt`.

### 3. The Interactive Workflow (`solo-workflow.js`)

This script is your personal project manager. It guides you through the development plan you generated.

#### **Step 1: Start Your First Week**

Open your terminal and run:
```bash
node solo-workflow.js start-week 1
```
This command will display the objectives for the first development phase (Weeks 1-2) and tell you which AI prompt to use.

#### **Step 2: Generate Code with AI**

-   Go to the `ai-prompts/` directory and open the prompt file for the current phase (e.g., `02-week1-2.md`).
-   Copy the content of this prompt into your preferred AI tool (e.g., Google AI Studio with the Gemini model).
-   Work with the AI to generate the Python/Streamlit code needed to meet the week's objectives. Save the generated code in your `src/` directory.

#### **Step 3: Mark Your Progress**

Once you've completed the objectives for the week and integrated the code, update your progress tracker by running:
```bash
node solo-workflow.js apply-week 1
```
This will mark the tasks as complete in `progress-tracker.json` and set up the milestones for the next phase.

#### **Step 4: Check Your Status**

At any time, you can get a summary of your progress:
```bash
node solo-workflow.js status
```

#### **Step 5: Prepare for Launch**

When you're nearing the end of your development timeline, use the built-in checklist:
```bash
node solo-workflow.js launch-checklist
```

## 💡 Project Philosophy

This tool is built on the "Solo MVP" methodology, which emphasizes:
- **Leveraging AI**: Use AI as a co-pilot to accelerate development.
- **Rapid Iteration**: Focus on short, productive sprints.
- **Lean Core**: Build and validate one core feature before expanding.
- **Structured Freedom**: A plan provides direction, but you have the freedom to adapt and innovate.
