export enum ProjectType {
  YouTubeAutomation = 'youtube-automation',
  MicroSaaS = 'saas-micro',
  AITool = 'ai-tool',
  PairProgramming = 'pair-programming',
}

export interface GeneratedFiles {
  readme: string;
  spec: string;
  prd: string;
  prompts: Record<string, string>;
  structure: string;
  workflowDoc: string; // Renamed from 'workflow' for clarity
  devPlan: string;
  gitignore: string;
  packageJson?: string;
  progressTracker?: string;
  workflowScript?: string;
}

export interface YouTubeAutomationSpec {
  project_constraints: {
    developer: string;
    timeline: string;
    stack_preference: string;
    api_budget: string;
    scope: string;
  };
  target_users: string;
  core_problems: string[];
  mvp_focus: {
    product_name: string;
    tagline: string;
    value_prop: string;
  };
  core_features: Array<{
    feature_name: string;
    description: string;
    user_inputs?: string[];
    output_structure?: string;
    technical_approach: string;
    api_cost_estimate?: string;
    cost?: string;
    priority: number;
  }>;
  development_phases: Record<string, { title: string; tasks: string[] }>;
  technical_spec: {
    apis_required: string[];
    database: string;
    deployment: string;
  };
  validation_metrics: string[];
}