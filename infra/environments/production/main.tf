locals {
  environment = "production"
  common_tags = {
    project     = var.project_name
    environment = local.environment
    managed_by  = "terraform"
  }
}

# ──────────────────────────────────────────────
# SUPABASE — Banco de dados PostgreSQL
# ──────────────────────────────────────────────
module "supabase" {
  source = "../../modules/supabase"

  project_name    = var.project_name
  environment     = local.environment
  organization_id = var.supabase_organization_id
  db_password     = var.supabase_db_password
  region          = "sa-east-1"
}

# ──────────────────────────────────────────────
# RAILWAY — config gerada localmente (deploy via CI)
# ──────────────────────────────────────────────
module "railway" {
  source = "../../modules/railway"
}

# ──────────────────────────────────────────────
# VERCEL — Frontend Next.js
# ──────────────────────────────────────────────
module "vercel_frontend" {
  source = "../../modules/vercel"

  project_name   = "${var.project_name}-web"
  framework      = "nextjs"
  root_directory = "apps/web"
  github_repo    = var.github_repo
  environment    = local.environment

  environment_variables = {
    NEXT_PUBLIC_API_URL           = var.railway_api_url
    NEXT_PUBLIC_SUPABASE_URL      = module.supabase.project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY = module.supabase.anon_key
    NEXT_PUBLIC_APP_NAME          = "CombatSync"
  }

  depends_on = [module.supabase]
}
