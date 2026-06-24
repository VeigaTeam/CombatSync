output "production_workspace_id" {
  value = tfe_workspace.production.id
}

output "staging_workspace_id" {
  value = tfe_workspace.staging.id
}

output "project_id" {
  value = tfe_project.combatsync.id
}
