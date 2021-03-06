variable "product" {
  type = "string"
}

variable "raw_product" {
  default = "cet"
  // jenkins-library overrides product for PRs and adds e.g. pr-118-cmc
}

variable "component" {
  type = "string"
}

variable "team_name" {
  default = "cet"
}

variable "microservice" {
  default = "frontend"
}

variable "location" {
  default = "UK South"
}

variable "env" {
  type = "string"
}

variable "ilbIp" {}

variable "deployment_env" {
  type = "string"
}

variable "node_config_dir" {
  // for Windows
  default = "D:\\home\\site\\wwwroot\\config"
}

variable "subscription" {}

variable "vault_section" {
  type = "string"
}

// CNP settings
variable "jenkins_AAD_objectId" {
  type = "string"
  description = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "client_id" {
  description = "(Required) The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. This is usually sourced from environment variables and not normally required to be specified."
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default = ""
}
variable "node_env" {
  default = "production"
}

variable "node_path" {
  default = "."
}

// Package details
variable "packages_name" {
  default = "cet-frontend"
}

variable "packages_project" {
  default = "cet"
}

variable "packages_environment" {
  type = "string"
}

variable "packages_version" {
  default = "-1"
}

variable "version" {
  default = "-1"
}

variable "public_port" {
  default = "443"
}

variable "port" {
  default = "3001"
}

variable "redis_use_tls" {
  default = "true"
  //always true in cnp
}

variable "reform_envirionment_for_test" {
  default = "prod"
}
variable "health_endpoint" {
  default = "/health"
}

variable "service_name" {
  default = "cet-frontend"
}

variable "use_redis" {
  default = "false"
}

variable "use_https" {
  default = "false"
}

variable "use_auth" {
  default = "false"
}

variable "use_idam" {
  default = "false"
}

variable "frontend_protocol" {
  default = "https"
}

variable "reform_team" {
  default = "cet"
}

variable "capacity" {
  default = "1"
}

variable "common_tags" {
  type = "map"
}
