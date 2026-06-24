resource "tfe_workspace" "production" {
  name              = "${var.project_name}-production"
  organization      = var.organization
  description       = "CombatSync production — Supabase + Vercel"
  terraform_version = "1.9.0"
  execution_mode    = "remote"
  auto_apply        = false
  working_directory = "infra"
  project_id        = tfe_project.combatsync.id

  vcs_repo {
    identifier     = var.github_repo
    oauth_token_id = var.github_oauth_token_id
    branch         = "main"
  }

  tag_names = ["combatsync", "production"]
}

resource "tfe_workspace" "staging" {
  name              = "${var.project_name}-staging"
  organization      = var.organization
  description       = "CombatSync staging — testes antes de produção"
  terraform_version = "1.9.0"
  execution_mode    = "remote"
  auto_apply        = true
  working_directory = "infra"
  project_id        = tfe_project.combatsync.id

  vcs_repo {
    identifier     = var.github_repo
    oauth_token_id = var.github_oauth_token_id
    branch         = "develop"
  }

  tag_names = ["combatsync", "staging"]
}

resource "tfe_project" "combatsync" {
  organization = var.organization
  name         = "CombatSync"
}
