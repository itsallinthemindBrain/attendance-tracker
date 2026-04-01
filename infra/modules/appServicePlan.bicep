@description('App Service Plan name')
param name string

@description('Azure region for deployment')
param location string

@description('Resource tags')
param tags object

resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  properties: {
    reserved: true // Linux
  }
}

output id string = plan.id
