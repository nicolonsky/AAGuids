# This script fetches the combined AAGUID blob from the Passkey Authenticator AAGUIDs repository, extracts the relevant information, and saves it as a JSON file in the public directory for use in the application.

$uri = 'https://raw.githubusercontent.com/passkeydeveloper/passkey-authenticator-aaguids/refs/heads/main/combined_aaguid.json'
$targetPath = 'public/combined_aaguid.json'

$combinedBlob = Invoke-RestMethod -Uri $uri

$aaguids = $combinedBlob.psobject.properties | ForEach-Object { 
    [PSCustomObject]@{
        AAGuid = $_.Name
        Name   = $_.Value.name
    }
} | Sort-Object -Property AAGuid

# Manually Add Microsoft Authenticator
$aaguids += [PSCustomObject]@{
    AAGuid = 'de1e552d-db1d-4423-a619-566b625cdc84'
    Name   = 'Microsoft Authenticator for Android'
}
$aaguids += [PSCustomObject]@{
    AAGuid = '90a3ccdf-635c-4729-a248-9b709135078f'
    Name   = 'Microsoft Authenticator for iOS'
}
$aaguids | ConvertTo-Json -Depth 5 | Set-Content $targetPath -Encoding utf8 -Force  