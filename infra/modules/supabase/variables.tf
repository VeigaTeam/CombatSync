variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "organization_id" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "region" {
  type    = string
  default = "sa-east-1"
}
