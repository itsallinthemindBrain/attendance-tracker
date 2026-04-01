targetScope = 'subscription'

@description('Environment name used in resource naming (e.g. prod, staging)')
param env string

@description('Azure region for all resources')
param location string = 'southeastasia'

// Tags applied to every resource
var tags = {
  project: 'attendance-tracker'
  environment: env
  managedBy: 'bicep'
}

// Storage account names may not contain dashes — strip them from the convention
var storageAccountName = replace('attendancetracker-sa-${env}', '-', '')

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'attendancetracker-rg-${env}'
  location: location
  tags: tags
}

module appServicePlan 'modules/appServicePlan.bicep' = {
  name: 'appServicePlan'
  scope: rg
  params: {
    name: 'attendancetracker-asp-${env}'
    location: location
    tags: tags
  }
}

module appService 'modules/appService.bicep' = {
  name: 'appService'
  scope: rg
  params: {
    name: 'attendancetracker-app-${env}'
    location: location
    appServicePlanId: appServicePlan.outputs.id
    tags: tags
  }
}

module storageAccount 'modules/storageAccount.bicep' = {
  name: 'storageAccount'
  scope: rg
  params: {
    name: storageAccountName
    location: location
    tags: tags
  }
}

output appServiceHostname string = appService.outputs.defaultHostname
output storageAccountName string = storageAccount.outputs.name
