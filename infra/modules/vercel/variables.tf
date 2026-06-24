variable "project_name" {
  type = string
}

variable "framework" {
  type    = string
  default = "nextjs"
}

variable "root_directory" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "environment" {
  type = string
}

variable "environment_variables" {
  type      = map(string)
  default   = {}
  sensitive = true
}
