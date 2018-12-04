locals {
  app_full_name = "${var.product}-${var.component}"
  ase_name = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  cet_key_vault = "${var.product}-${local.local_env}"

  previewVaultName = "${local.app_full_name}-aat"
  nonPreviewVaultName = "${local.app_full_name}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"

  vaultUri = "https://cet-${var.env}.vault.azure.net/"

  previewEnv = "aat"
  nonPreviewEnv = "${var.env}"
  localenv = "${(var.env == "preview" || var.env == "spreview") ? local.previewEnv : local.nonPreviewEnv}"
}


module "cet-frontend-redis-cache" {
  source = "git@github.com:hmcts/moj-module-redis?ref=master"
  product = "${(var.env == "preview" || var.env == "spreview") ? "${var.product}-${var.microservice}-pr-redis" : "${var.product}-${var.microservice}-redis-cache"}"
  location = "${var.location}"
  env = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
  common_tags = "${var.common_tags}"
}

data "azurerm_key_vault" "cet_key_vault" {
  name = "${local.cet_key_vault}"
  resource_group_name = "${local.cet_key_vault}"
}


data "azurerm_key_vault_secret" "postcode_service_token" {
  name = "postcode-service-token"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "postcode_service_url" {
  name = "postcode-service-url"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "application_fee_code" {
  name = "application-fee-code"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "service_id" {
  name = "service-id"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "site_id" {
  name = "site-id"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}


data "azurerm_key_vault_secret" "idam_secret" {
  name = "ccidam-idam-api-secret"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "s2s_key" {
  name = "microservicekey-cet"
  vault_uri = "https://s2s-${local.localenv}.vault.azure.net/"
}

module "cet-frontend" {
  source = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend = "${var.env != "preview" ? 1: 0}"
  subscription = "${var.subscription}"
  additional_host_name = "${var.external_host_name}"
  // need to give proper url
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  capacity = "${var.capacity}"
  common_tags = "${var.common_tags}"
  asp_rg = "${var.product}-${var.env}"
  asp_name = "${var.product}-${var.env}"

  app_settings = {

    // Node specific vars
    //NODE_ENV = "${var.node_env}"
    //UV_THREADPOOL_SIZE = "64"
    //NODE_CONFIG_DIR = "${var.node_config_dir}"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.product}-${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Packages
    PACKAGES_NAME = "${var.packages_name}"
    PACKAGES_PROJECT = "${var.packages_project}"
    PACKAGES_ENVIRONMENT = "${var.packages_environment}"
    PACKAGES_VERSION = "${var.packages_version}"

    DEPLOYMENT_ENV = "${var.deployment_env}"

    // Frontend web details
    PUBLIC_PROTOCOL = "${var.frontend_protocol}"

    // Service name
    SERVICE_NAME = "${var.service_name}"

    USE_HTTPS = "${var.use_https}"
    USE_AUTH = "${var.use_auth}"
    GA_TRACKING_ID = "${var.google_track_id}"

    // REDIS
    USE_REDIS = "${var.use_redis}"
    REDIS_USE_TLS = "${var.redis_use_tls}"
    REDIS_HOST = "${module.cet-frontend-redis-cache.host_name}"
    REDIS_PORT = "${module.cet-frontend-redis-cache.redis_port}"
    REDIS_PASSWORD = "${module.cet-frontend-redis-cache.access_key}"

    // IDAM
    USE_IDAM = "${var.use_idam}"
    IDAM_API_URL = "${var.idam_user_host}"
    IDAM_LOGIN_URL = "${var.private_beta_auth_url}"
    IDAM_S2S_URL = "${var.idam_service_api}"
    IDAM_SERVICE_KEY = "${data.azurerm_key_vault_secret.s2s_key.value}"
    IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_CET = "${data.azurerm_key_vault_secret.idam_secret.value}"

    //  PAYMENT
    PAYMENT_CREATE_URL = "${var.payment_create_url }"

    // POSTCODE
    POSTCODE_SERVICE_URL = "${data.azurerm_key_vault_secret.postcode_service_url.value}"
    POSTCODE_SERVICE_TOKEN = "${data.azurerm_key_vault_secret.postcode_service_token.value}"


    APPLICATION_FEE_CODE = "${data.azurerm_key_vault_secret.application_fee_code.value}"
    SERVICE_ID = "${data.azurerm_key_vault_secret.service_id.value}"
    SITE_ID = "${data.azurerm_key_vault_secret.site_id.value}"

    REFORM_ENVIRONMENT = "${var.reform_envirionment_for_test}"

    FEATURE_TOGGLES_API_URL = "${var.feature_toggles_api_url}"
  }
}
