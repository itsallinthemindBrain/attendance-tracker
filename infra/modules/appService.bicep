@description('App Service name')
param name string

@description('Azure region for deployment')
param location string

@description('Resource ID of the App Service Plan')
param appServicePlanId string

@description('Resource tags')
param tags object

resource app 'Microsoft.Web/sites@2022-03-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    serverFarmId: appServicePlanId
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      alwaysOn: false // not available on F1 Free tier
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
    }
  }
}

output defaultHostname string = app.properties.defaultHostName
