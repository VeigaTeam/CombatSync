terraform {
  required_providers {
    tfe = {
      source  = "hashicorp/tfe"
      version = "~> 0.57"
    }
  }
}

# Variable set shared between workspaces (non-sensitive config)
resource "tfe_variable_set" "combatsync" {
  name         = "combatsync-shared"
  description  = "Shared configuration for all CombatSync workspaces"
  organization = var.organization
  global       = false
}

resource "tfe_workspace_variable_set" "production" {
  variable_set_id = tfe_variable_set.combatsync.id
  workspace_id    = tfe_workspace.production.id
}

resource "tfe_workspace_variable_set" "staging" {
  variable_set_id = tfe_variable_set.combatsync.id
  workspace_id    = tfe_workspace.staging.id
}

# Notification — Slack webhook on apply (optional)
resource "tfe_notification_configuration" "slack_production" {
  count            = var.slack_webhook_url != "" ? 1 : 0
  name             = "slack-production"
  enabled          = true
  destination_type = "slack"
  url              = var.slack_webhook_url
  workspace_id     = tfe_workspace.production.id
  triggers         = ["run:applying", "run:completed", "run:errored"]
}
