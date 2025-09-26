variable "gcp_project_id" {
  description = "The GCP project ID to deploy the services to."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region to deploy the services in."
  type        = string
  default     = "us-central1"
}