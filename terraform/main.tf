terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam_api" {
  service = "iam.googleapis.com"
  disable_on_destroy = false
}

# Allow unauthenticated access to Cloud Run services
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Define the services
locals {
  services = {
    "clouditect-frontend"              = 3000
    "clouditect-api-gateway"           = 4000
    "clouditect-pricing-service"       = 4001
    "clouditect-recommendation-service" = 4002
    "clouditect-provider-service"      = 4003
  }
}

resource "google_cloud_run_v2_service" "clouditect_services" {
  for_each = local.services
  name     = each.key
  location = var.gcp_region

  template {
    containers {
      image = "gcr.io/${var.gcp_project_id}/${each.key}:latest" # The image will be built by our CI/CD pipeline
      ports {
        container_port = each.value
      }
    }
  }

  depends_on = [
    google_project_service.run_api
  ]
}

resource "google_cloud_run_v2_service_iam_policy" "noauth_policy" {
  for_each = google_cloud_run_v2_service.clouditect_services
  name     = each.value.name
  location = each.value.location
  project  = each.value.project
  policy_data = data.google_iam_policy.noauth.policy_data
}