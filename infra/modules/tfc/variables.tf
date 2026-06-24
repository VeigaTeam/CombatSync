variable "organization" {
  type = string
}

variable "project_name" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "tfc_api_token" {
  type      = string
  sensitive = true
}

variable "github_oauth_token_id" {
  description = "TFC OAuth token ID for GitHub VCS connection (Settings -> VCS Providers in TFC)"
  type        = string
  default     = ""
}

variable "slack_webhook_url" {
  description = "Slack webhook for deployment notifications (optional)"
  type        = string
  default     = ""
  sensitive   = true
}
