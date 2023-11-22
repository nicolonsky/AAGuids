$uri = 'https://github.com/passkeydeveloper/passkey-authenticator-aaguids/raw/main/combined_aaguid.json'
$targetPath = 'public/combined_aaguid.json'

$data = Invoke-RestMethod -Uri $uri
$aaGuidInfo = @{}
$data.psobject.properties.name | ForEach-Object { $aaGuidInfo[$PSItem] = $data.$PSItem }

$aaGuidInfo.GetEnumerator() | ForEach-Object {
    [PSCustomObject]@{
        AAGuid = $_.Key
        Name = $_.Value.Name
    }
} | ConvertTo-Json | Set-Content $targetPath -Encoding utf8 -Force    