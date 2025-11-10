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

## 🚀 Usage

Using the Solo MVP Initializer is a two-part process: first, you generate your blueprint using the web interface, and then you use the generated files (especially the interactive workflow script) to guide your local development.

### Part 1: Generating Your Blueprint

1.  **Enter Project Name**: Give your project a name (e.g., "QuickCast AI").
2.  **Select Project Type**: Choose the blueprint that best fits your idea. The "YouTube Automation" type is the most feature-rich example.
3.  **Initialize MVP**: Click the button to generate your complete blueprint.
4.  **Review & Create Files**: Your generated files will appear on the screen. Use the "Copy" button on each card to get the content and create the corresponding files on your local machine.

### Part 2: Local Development Setup & Workflow

Once you have generated your blueprint, follow these steps to set up your project locally and begin development.

#### Installation and Setup

**1. Prerequisites:**
-   **Node.js**: Required to run the `solo-workflow.js` script.
-   **Python**: The example YouTube Automation app is designed to be built with Python and Streamlit.
-   An **AI Development Environment** (like Google AI Studio) where you can use the generated AI prompts.

**2. Project Setup:**
1.  **Create Project Folder**: Create a new, empty directory for your project on your local machine.
2.  **Create Files**: Using the copied content from the web tool, create the full file and folder structure as outlined in the "Project Structure" card. This includes key files like:
    - `package.json`
    - `.gitignore`
    - `progress-tracker.json`
    - `solo-workflow.js`
    - `requirements.txt` (for Python projects)
    - `.env.example` (rename this to `.env` and add your API keys)
    - All spec, prompt, and plan files in their respective `specs/` and `ai-prompts/` directories.
3.  **Install Dependencies**:
    - Open your terminal in the project root and run `npm install` to install Node.js dependencies.
    - If it's a Python project, set up a virtual environment and run `pip install -r requirements.txt`.

#### The Interactive Workflow (`solo-workflow.js`)

This script is your personal project manager. It reads your plan and guides you through development.

1.  **Start Your First Week**:
    ```bash
    node solo-workflow.js start-week 1
    ```
    This command displays your objectives and tells you which AI prompt file to use.

2.  **Generate Code with AI**:
    -   Open the specified prompt file from the `ai-prompts/` directory.
    -   Copy the prompt into your AI tool (e.g., Google AI Studio with Gemini).
    -   Generate the code needed to meet the week's objectives and save it in your `src/` directory.

3.  **Mark Your Progress**:
    Once you've completed the objectives, update your progress tracker:
    ```bash
    node solo-workflow.js apply-week 1
    ```

4.  **Check Your Status**:
    At any time, get a summary of your progress:
    ```bash
    node solo-workflow.js status
    ```

5.  **Prepare for Launch**:
    When you're nearing completion, use the built-in checklist:
    ```bash
    node solo-workflow.js launch-checklist
    ```

## 💡 Project Philosophy

This tool is built on the "Solo MVP" methodology, which emphasizes:
- **Leveraging AI**: Use AI as a co-pilot to accelerate development.
- **Rapid Iteration**: Focus on short, productive sprints.
- **Lean Core**: Build and validate one core feature before expanding.
- **Structured Freedom**: A plan provides direction, but you have the freedom to adapt and innovate.
