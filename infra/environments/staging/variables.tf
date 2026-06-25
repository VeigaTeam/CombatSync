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
  description = "Supabase PostgreSQL database password (HML — diferente do PRD)"
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
  description = "JWT secret para HML (pode ser diferente do PRD)"
  type        = string
  sensitive   = true
}

variable "railway_api_url" {
  description = "URL do serviço Railway de staging"
  type        = string
  default     = "https://combatsync-api-staging.up.railway.app"
}

variable "project_name" {
  description = "Project name base"
  type        = string
  default     = "combatsync-staging"
}

variable "github_repo" {
  description = "GitHub repository in format owner/repo"
  type        = string
  default     = "rveiga08/combatsync"
}
