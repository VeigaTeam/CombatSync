locals {
  project_id = "${var.project_name}-${var.environment}"
  common_tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ──────────────────────────────────────────────
# SUPABASE
# ──────────────────────────────────────────────
module "supabase" {
  source = "./modules/supabase"

  project_name     = var.project_name
  environment      = var.environment
  organization_id  = var.supabase_organization_id
  db_password      = var.supabase_db_password
  region           = "sa-east-1"   # São Paulo — closest free-tier region
}

# ──────────────────────────────────────────────
# VERCEL — Frontend (Next.js)
# ──────────────────────────────────────────────
module "vercel_frontend" {
  source = "./modules/vercel"

  project_name       = "${var.project_name}-web"
  framework          = "nextjs"
  root_directory     = "apps/web"
  github_repo        = var.github_repo
  environment        = var.environment

  environment_variables = {
    NEXT_PUBLIC_API_URL            = module.vercel_frontend.deployment_url
    NEXT_PUBLIC_SUPABASE_URL       = module.supabase.project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY  = module.supabase.anon_key
  }

  depends_on = [module.supabase]
}

# ──────────────────────────────────────────────
# TERRAFORM CLOUD — Workspaces management
# ──────────────────────────────────────────────
module "tfc_workspaces" {
  source = "./modules/tfc"

  organization   = "VeigaTeam"
  project_name   = var.project_name
  github_repo    = var.github_repo
  tfc_api_token  = var.tfc_api_token
}
