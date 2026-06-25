variable "supabase_access_token" {
  description = "Supabase personal access token"
  type        = string
  sensitive   = true
}

variable "supabase_organization_id" {
  description = "Supabase organization ID"
  type        = string
}

variable "supabase_db_password" {
  description = "Supabase PostgreSQL database password"
  type        = string
  sensitive   = true
}

variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel Team ID (empty for personal account)"
  type        = string
  default     = ""
}

variable "jwt_secret" {
  description = "JWT secret for NestJS API authentication (min 32 chars)"
  type        = string
  sensitive   = true
}

variable "railway_api_url" {
  description = "URL do serviço Railway após o primeiro deploy (ex: https://combatsync-api.up.railway.app)"
  type        = string
  default     = "https://combatsync-api.up.railway.app"
}

variable "project_name" {
  description = "Project name used across all services"
  type        = string
  default     = "combatsync"
}

variable "github_repo" {
  description = "GitHub repository in format owner/repo"
  type        = string
  default     = "rveiga08/combatsync"
}
