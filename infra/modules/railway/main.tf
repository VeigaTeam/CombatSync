# Railway não possui provider Terraform oficial estável.
# A integração com Railway é feita via GitHub Actions (CI/CD).
# Este módulo cria o arquivo de configuração railway.json
# e documenta as variáveis de ambiente necessárias.

resource "local_file" "railway_config" {
  content = jsonencode({
    "$schema" = "https://railway.app/railway.schema.json"
    build = {
      builder    = "NIXPACKS"
      buildCommand = "pnpm install && pnpm run build"
    }
    deploy = {
      startCommand  = "pnpm run start:prod"
      restartPolicyType = "ON_FAILURE"
      restartPolicyMaxRetries = 3
    }
  })
  filename = "${path.root}/../apps/api/railway.json"
}

output "required_env_vars" {
  description = "Variáveis de ambiente que devem ser configuradas manualmente no Railway"
  value = [
    "DATABASE_URL",
    "DIRECT_URL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "NODE_ENV",
    "PORT",
    "CORS_ORIGIN",
  ]
}
