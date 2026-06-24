resource "supabase_project" "main" {
  organization_id   = var.organization_id
  name              = "${var.project_name}-${var.environment}"
  database_password = var.db_password
  region            = var.region

  lifecycle {
    # Prevent accidental destruction of the database
    prevent_destroy = true
  }
}

# Wait for the project to be fully provisioned
resource "time_sleep" "wait_for_project" {
  depends_on      = [supabase_project.main]
  create_duration = "30s"
}

# Apply the initial database schema via migration
resource "supabase_settings" "main" {
  project_ref = supabase_project.main.id

  api = jsonencode({
    db_schema            = "public,storage,graphql_public"
    db_extra_search_path = "public,extensions"
    max_rows             = 1000
  })
}
