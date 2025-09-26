output "service_urls" {
  description = "The URLs of the deployed Cloud Run services."
  value = {
    for name, service in google_cloud_run_v2_service.clouditect_services :
    name => service.uri
  }
}