output "supabase_project_url" {
  description = "Supabase project API URL"
  value       = module.supabase.project_url
}

output "supabase_project_id" {
  description = "Supabase project ID"
  value       = module.supabase.project_id
}

output "supabase_anon_key" {
  description = "Supabase anonymous (public) key"
  value       = module.supabase.anon_key
  sensitive   = true
}

output "supabase_service_role_key" {
  description = "Supabase service role key (backend only)"
  value       = module.supabase.service_role_key
  sensitive   = true
}

output "supabase_db_url" {
  description = "PostgreSQL direct connection URL (for Prisma migrations)"
  value       = module.supabase.db_url
  sensitive   = true
}

output "supabase_pooler_url" {
  description = "PostgreSQL connection pooler URL (for app runtime)"
  value       = module.supabase.pooler_url
  sensitive   = true
}

output "vercel_frontend_url" {
  description = "Vercel frontend URL de produção"
  value       = module.vercel_frontend.deployment_url
}

output "backend_env_vars" {
  description = "Variáveis de ambiente para o NestJS no Railway (copiar para o painel Railway)"
  value = {
    DATABASE_URL             = module.supabase.pooler_url
    DIRECT_URL               = module.supabase.db_url
    SUPABASE_URL             = module.supabase.project_url
    SUPABASE_SERVICE_ROLE_KEY = module.supabase.service_role_key
    JWT_SECRET               = var.jwt_secret
    NODE_ENV                 = local.environment
    CORS_ORIGIN              = module.vercel_frontend.deployment_url
    PORT                     = "3001"
    JWT_EXPIRES_IN           = "7d"
  }
  sensitive = true
}
