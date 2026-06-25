output "supabase_project_url" {
  value = module.supabase.project_url
}

output "supabase_project_id" {
  value = module.supabase.project_id
}

output "supabase_anon_key" {
  value     = module.supabase.anon_key
  sensitive = true
}

output "supabase_service_role_key" {
  value     = module.supabase.service_role_key
  sensitive = true
}

output "supabase_db_url" {
  value     = module.supabase.db_url
  sensitive = true
}

output "supabase_pooler_url" {
  value     = module.supabase.pooler_url
  sensitive = true
}

output "vercel_frontend_url" {
  description = "Vercel URL do ambiente de staging (HML)"
  value       = module.vercel_frontend.deployment_url
}

output "backend_env_vars" {
  description = "Variáveis de ambiente para o NestJS no Railway (HML)"
  value = {
    DATABASE_URL              = module.supabase.pooler_url
    DIRECT_URL                = module.supabase.db_url
    SUPABASE_URL              = module.supabase.project_url
    SUPABASE_SERVICE_ROLE_KEY = module.supabase.service_role_key
    JWT_SECRET                = var.jwt_secret
    NODE_ENV                  = "staging"
    CORS_ORIGIN               = module.vercel_frontend.deployment_url
    PORT                      = "3001"
    JWT_EXPIRES_IN            = "7d"
  }
  sensitive = true
}
