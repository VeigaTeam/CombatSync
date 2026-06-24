resource "vercel_project" "main" {
  name      = var.project_name
  framework = var.framework

  git_repository = {
    type              = "github"
    repo              = var.github_repo
    production_branch = "main"
  }

  root_directory         = var.root_directory
  serverless_function_region = "gru1"  # São Paulo

  build_command   = "pnpm build"
  output_directory = ".next"
  install_command  = "pnpm install"
}

resource "vercel_project_environment_variable" "vars" {
  for_each = var.environment_variables

  project_id = vercel_project.main.id
  key        = each.key
  value      = each.value
  target     = [var.environment == "production" ? "production" : "preview"]
}

resource "vercel_project_environment_variable" "node_env" {
  project_id = vercel_project.main.id
  key        = "NODE_ENV"
  value      = var.environment
  target     = [var.environment == "production" ? "production" : "preview"]
}
