variable "supabase_access_token" {
  description = "Supabase personal access token (manage.supabase.com -> Account -> Access Tokens)"
  type        = string
  sensitive   = true
}

variable "supabase_organization_id" {
  description = "Supabase organization ID"
  type        = string
}

variable "vercel_api_token" {
  description = "Vercel API token (vercel.com -> Settings -> Tokens)"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel Team ID (optional, leave empty for personal account)"
  type        = string
  default     = ""
}

variable "tfc_api_token" {
  description = "Terraform Cloud API token (app.terraform.io -> User Settings -> Tokens)"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging"], var.environment)
    error_message = "Environment must be 'production' or 'staging'."
  }
}

variable "project_name" {
  description = "Project name used across all services"
  type        = string
  default     = "combatsync"
}

variable "supabase_db_password" {
  description = "Supabase PostgreSQL database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for NestJS API authentication (min 32 chars)"
  type        = string
  sensitive   = true
}

variable "railway_api_token" {
  description = "Railway API token for backend deployment notifications"
  type        = string
  sensitive   = true
  default     = ""
}

variable "github_repo" {
  description = "GitHub repository in format owner/repo"
  type        = string
  default     = "rveiga08/combatsync"
}
