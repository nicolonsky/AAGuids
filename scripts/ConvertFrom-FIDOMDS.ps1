# Convert the FIDO MDS blob from the JWT format to a more easily consumable JSON format for the frontend application.
# This script fetches the MDS blob, decodes the JWT, extracts the relevant metadata, and saves it to a JSON file. It also updates the .env file with the time of generation and the next update time.

$metaDataBlobUri = 'https://mds.fidoalliance.org/'
$targetPath = 'public/mdsblob.json'

# By Vasil Michev https://www.michev.info/blog/post/2140/decode-jwt-access-and-id-tokens-via-powershell
function ConvertFrom-JWT {
          
    [cmdletbinding()]
    param([Parameter(Mandatory = $true)][string]$token)
          
    #Validate as per https://tools.ietf.org/html/rfc7519
    #Access and ID tokens are fine, Refresh tokens will not work
    if (!$token.Contains(".") -or !$token.StartsWith("eyJ")) { Write-Error "Invalid token" -ErrorAction Stop }
          
    #Header
    $tokenheader = $token.Split(".")[0].Replace('-', '+').Replace('_', '/')
    #Fix padding as needed, keep adding "=" until string length modulus 4 reaches 0
    while ($tokenheader.Length % 4) { Write-Verbose "Invalid length for a Base-64 char array or string, adding ="; $tokenheader += "=" }
    Write-Verbose "Base64 encoded (padded) header:"
    Write-Verbose $tokenheader
    #Convert from Base64 encoded string to PSObject all at once
    Write-Verbose "Decoded header:"
    [System.Text.Encoding]::ASCII.GetString([system.convert]::FromBase64String($tokenheader)) | ConvertFrom-Json | fl | Out-Default
          
    #Payload
    $tokenPayload = $token.Split(".")[1].Replace('-', '+').Replace('_', '/')
    #Fix padding as needed, keep adding "=" until string length modulus 4 reaches 0
    while ($tokenPayload.Length % 4) { Write-Verbose "Invalid length for a Base-64 char array or string, adding ="; $tokenPayload += "=" }
    Write-Verbose "Base64 encoded (padded) payoad:"
    Write-Verbose $tokenPayload
    #Convert to Byte array
    $tokenByteArray = [System.Convert]::FromBase64String($tokenPayload)
    #Convert to string array
    $tokenArray = [System.Text.Encoding]::ASCII.GetString($tokenByteArray)
    Write-Verbose "Decoded array in JSON format:"
    Write-Verbose $tokenArray
    #Convert from JSON to PSObject
    $tokobj = $tokenArray | ConvertFrom-Json
    Write-Verbose "Decoded Payload:"
              
    return $tokobj
}

$metadata = Invoke-WebRequest -Uri $metaDataBlobUri

$jwt = ConvertFrom-JWT -token $metadata.ToString()

$metadata = $jwt.entries | Select-Object -ExpandProperty metadataStatement | ForEach-Object {
    [PSCustomObject]@{
        aaguid                   = $_.aaguid
        description              = $_.description
        authenticatorVersion     = $_.authenticatorVersion
        protocolFamily           = $_.protocolFamily
        schema                   = $_.schema
        upv                      = $_.upv
        authenticationAlgorithms = $_.authenticationAlgorithms
        publicKeyAlgAndEncodings = $_.publicKeyAlgAndEncodings
        attestationTypes         = $_.attestationTypes
        keyProtection            = $_.keyProtection
        matcherProtection        = $_.matcherProtection
        cryptoStrength           = $_.cryptoStrength
        attachmentHint           = $_.attachmentHint
    }
}

$metadata | ConvertTo-Json -Depth 5 | Set-Content $targetPath -Encoding utf8 -Force

$dotenv = Get-Content .env -Raw
$dotenv = $dotenv -replace 'REACT_APP_TIME_GENERATED\s*=.*', "REACT_APP_TIME_GENERATED = $(Get-Date -Format 'yyyy-MM-dd')"
$dotenv = $dotenv -replace 'REACT_APP_NEXT_UPDATE\s*=.*', "REACT_APP_NEXT_UPDATE = $($jwt.nextUpdate)"
$dotenv.TrimEnd() | Set-Content .env -Encoding utf8 -Force