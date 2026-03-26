
<p align="center">
	<img src="https://img.shields.io/badge/WebAuthn-AAGUIDs-blueviolet" alt="WebAuthn AAGUIDs" />
</p>

# 🛡️ AAGuids for Passkeys

**AAGuids for Passkeys** is a resource for security researchers, blue teams, and anyone working with FIDO2/WebAuthn authenticators. It provides up-to-date lists of Authenticator Attestation GUIDs (AAGuids) for use in advanced hunting and device identification.

The <https://aaguid.nicolasuter.ch> website provides an easy to use app to browse and explore the AAGuids for various models.

## 🚀 What is this?

This project collects and publishes JSON files containing AAGuids from multiple sources, including password managers and the official FIDO Alliance Metadata Service. 

## 📦 Data Sources

- **[Combined AAGuid List (with password managers)](public/combined_aaguid.json)**
- **[FIDO Alliance Metadata Service Blob](public/mdsblob.json)**

The lists are automatically updated via [GitHub Actions](.github/workflows/dump-aaguids.yml).

## 🛠️ Advanced Hunting

You can benefit via `externaldata`operator for Advanced Hunting and other Kusto related queries. Example:

```kusto
let AAGuids = externaldata (AAGuid: string, Name: string) ['https://raw.githubusercontent.com/nicolonsky/AAGuids/refs/heads/main/public/combined_aaguid.json'] with (format=multijson);
AuditLogs
| where TimeGenerated > ago(90d)
| where OperationName has_any ("Add Passkey", "Add FIDO2")
| mv-apply AdditionalDetails on (
    summarize AAGuid = tostring(take_anyif(AdditionalDetails.value, AdditionalDetails.key =~ "AAGuid"))
)
| extend Actor = InitiatedBy.user.userPrincipalName
| lookup kind=leftouter AAGuids on AAGuid
| project-rename PasskeyName = Name
| project
    TimeGenerated,
    OperationName,
    Actor,
    PasskeyName,
    AAGuid
```

## 🤝 Contributing

Contributions, corrections, and new sources are welcome! Open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

<p align="center">
	<sub>Maintained with ❤️ by Nicola.</sub>
</p>