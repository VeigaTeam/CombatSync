output "project_id" {
  value = supabase_project.main.id
}

output "project_url" {
  value = "https://${supabase_project.main.id}.supabase.co"
}

output "anon_key" {
  value     = supabase_project.main.anon_key
  sensitive = true
}

output "service_role_key" {
  value     = supabase_project.main.service_key
  sensitive = true
}

output "db_url" {
  value     = "postgresql://postgres:${var.db_password}@db.${supabase_project.main.id}.supabase.co:5432/postgres"
  sensitive = true
}

output "pooler_url" {
  value     = "postgresql://postgres.${supabase_project.main.id}:${var.db_password}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  sensitive = true
}
