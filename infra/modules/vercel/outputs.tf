output "project_id" {
  value = vercel_project.main.id
}

output "deployment_url" {
  value = "https://${var.project_name}.vercel.app"
}
