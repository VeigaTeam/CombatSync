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
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.11"
    }
  }

  # Terraform Cloud backend — descomentar após configurar TF_API_TOKEN válido
  # cloud {
  #   organization = "VeigaTeam"
  #   workspaces {
  #     name = "combatsync-staging"
  #   }
  # }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}
