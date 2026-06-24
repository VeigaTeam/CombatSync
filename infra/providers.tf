terraform {
  required_version = ">= 1.6.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    tfe = {
      source  = "hashicorp/tfe"
      version = "~> 0.57"
    }
  }

  cloud {
    organization = "VeigaTeam"

    workspaces {
      name = "combatsync-production"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

provider "tfe" {
  token = var.tfc_api_token
}
