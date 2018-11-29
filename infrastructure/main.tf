provider "vault" {
  //  # It is strongly recommended to configure this provider through the
  //  # environment variables described above, so that each user can have
  //  # separate credentials set in the environment.
  //  #
  //  # This will default to using $VAULT_ADDR
  //  # But can be set explicitly
  address = "https://vault.reform.hmcts.net:6200"
}



# data "vault_generic_secret" "idam_frontend_service_key" {
#   path = "secret/${var.vault_section}/ccidam/service-auth-provider/api/microservice-keys/cet-frontend"
# }

# data "vault_generic_secret" "idam_frontend_idam_key" {
#   path = "secret/${var.vault_section}/ccidam/idam-api/oauth2/client-secrets/cet"
# }

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"  
  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
  localenv = "${(var.env == "preview" || var.env == "spreview") ? "aat": "${var.env}"}"
}


module "cet-frontend-redis-cache" {
  source   = "git@github.com:hmcts/moj-module-redis?ref=master"
  product     = "${(var.env == "preview" || var.env == "spreview") ? "${var.product}-${var.microservice}-pr-redis" : "${var.product}-${var.microservice}-redis-cache"}"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
  common_tags  = "${var.common_tags}"
}

data "azurerm_key_vault" "cet_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}


data "azurerm_key_vault_secret" "cet_postcode_service_token" {
  name = "postcode-service-token"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "cet_postcode_service_url" {
  name = "postcode-service-url"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "cet_application_fee_code" {
  name = "cet-application-fee-code"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "cet_service_id" {
  name = "cet-service-id"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "cet_site_id" {
  name = "cet-site-id"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}


data "azurerm_key_vault_secret" "idam_secret_cet" {
  name = "ccidam-idam-api-secrets-cet"
  vault_uri = "${data.azurerm_key_vault.cet_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "s2s_key" {
  name      = "microservicekey-cet-frontend"
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
  asp_name     = "${var.asp_name}"
  additional_host_name = "${var.external_host_name}"  // need to give proper url
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  capacity     = "${var.capacity}"
  common_tags  = "${var.common_tags}"
  asp_rg       = "${var.asp_rg}"

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
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"
	
    DEPLOYMENT_ENV="${var.deployment_env}"

	  // Frontend web details
    PUBLIC_PROTOCOL ="${var.cet_frontend_protocol}"

    // Service name
    SERVICE_NAME = "${var.frontend_service_name}"

    USE_HTTPS =  "${var.cet_frontend_https}"
    USE_AUTH = "${var.cet_frontend_use_auth}"
    GA_TRACKING_ID = "${var.cet_google_track_id}"

    // REDIS
    USE_REDIS = "${var.cet_frontend_use_redis}"
    REDIS_USE_TLS = "${var.redis_use_tls}" 
    REDIS_HOST      = "${module.cet-frontend-redis-cache.host_name}"
    REDIS_PORT      = "${module.cet-frontend-redis-cache.redis_port}"
    REDIS_PASSWORD  = "${module.cet-frontend-redis-cache.access_key}"

    // IDAM
    USE_IDAM = "${var.cet_frontend_use_idam}"
    IDAM_API_URL = "${var.idam_user_host}"
    IDAM_LOGIN_URL = "${var.cet_private_beta_auth_url}"
    IDAM_S2S_URL = "${var.idam_service_api}"
    IDAM_SERVICE_KEY = "${data.azurerm_key_vault_secret.s2s_key.value}"
    IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_CET = "${data.azurerm_key_vault_secret.idam_secret_cet.value}"

    //  PAYMENT
    PAYMENT_CREATE_URL = "${var.payment_create_url }"

    // POSTCODE
    POSTCODE_SERVICE_URL = "${data.azurerm_key_vault_secret.cet_postcode_service_url.value}"
    POSTCODE_SERVICE_TOKEN = "${data.azurerm_key_vault_secret.cet_postcode_service_token.value}"


    APPLICATION_FEE_CODE = "${data.azurerm_key_vault_secret.cet_application_fee_code.value}"
    SERVICE_ID = "${data.azurerm_key_vault_secret.cet_service_id.value}"
    SITE_ID = "${data.azurerm_key_vault_secret.cet_site_id.value}"

    REFORM_ENVIRONMENT = "${var.reform_envirionment_for_test}"

    FEATURE_TOGGLES_API_URL = "${var.feature_toggles_api_url}"
  }
}
