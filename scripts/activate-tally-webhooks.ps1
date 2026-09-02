param(
    [string]$WebhookUrl = "https://moonshine-capital-portal.vercel.app/api/webhooks/tally"
)

$ErrorActionPreference = "Stop"

$CanonicalForms = @(
    "rjM6do",
    "9qjWEE",
    "dWvEqN",
    "w4R2Ad"
)

function ConvertFrom-SecureStringPlainText {
    param([Parameter(Mandatory = $true)][Security.SecureString]$SecureValue)

    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

Write-Host "Moonshine Capital — Tally webhook activation" -ForegroundColor Cyan
Write-Host "Target: $WebhookUrl"
Write-Host "Forms:  $($CanonicalForms -join ', ')"
Write-Host ""

$ApiKeySecure = Read-Host "Paste your Tally API key" -AsSecureString
$SigningSecretSecure = Read-Host "Paste the existing TALLY_WEBHOOK_SECRET" -AsSecureString

$ApiKey = ConvertFrom-SecureStringPlainText $ApiKeySecure
$SigningSecret = ConvertFrom-SecureStringPlainText $SigningSecretSecure

try {
    if ([string]::IsNullOrWhiteSpace($ApiKey)) {
        throw "Tally API key cannot be empty."
    }

    if ([string]::IsNullOrWhiteSpace($SigningSecret)) {
        throw "TALLY_WEBHOOK_SECRET cannot be empty."
    }

    $Headers = @{
        Authorization = "Bearer $ApiKey"
        "Content-Type" = "application/json"
    }

    Write-Host "Fetching existing Tally webhooks..." -ForegroundColor DarkCyan
    $Existing = Invoke-RestMethod -Method GET -Uri "https://api.tally.so/webhooks?limit=100" -Headers $Headers

    foreach ($FormId in $CanonicalForms) {
        $Matches = @(
            $Existing.webhooks | Where-Object {
                $_.formId -eq $FormId -and $_.url -eq $WebhookUrl
            }
        )

        $Payload = @{
            formId = $FormId
            url = $WebhookUrl
            eventTypes = @("FORM_RESPONSE")
            signingSecret = $SigningSecret
            httpHeaders = @()
        }

        if ($Matches.Count -gt 0) {
            $WebhookId = $Matches[0].id
            $Payload.isEnabled = $true

            Invoke-RestMethod -Method PATCH -Uri "https://api.tally.so/webhooks/$WebhookId" -Headers $Headers -Body ($Payload | ConvertTo-Json -Depth 6) | Out-Null
            Write-Host "UPDATED  $FormId  $WebhookId" -ForegroundColor Yellow
        }
        else {
            $Payload.externalSubscriber = "moonshine-capital-portal"

            $Created = Invoke-RestMethod -Method POST -Uri "https://api.tally.so/webhooks" -Headers $Headers -Body ($Payload | ConvertTo-Json -Depth 6)
            Write-Host "CREATED  $FormId  $($Created.id)" -ForegroundColor Green
        }
    }

    Write-Host ""
    Write-Host "Verifying canonical webhook state..." -ForegroundColor DarkCyan

    $Verified = Invoke-RestMethod -Method GET -Uri "https://api.tally.so/webhooks?limit=100" -Headers $Headers

    $Canonical = @(
        $Verified.webhooks | Where-Object {
            $_.formId -in $CanonicalForms -and $_.url -eq $WebhookUrl
        }
    )

    $Canonical |
        Select-Object id, formId, url, isEnabled, eventTypes, updatedAt |
        Format-Table -AutoSize

    $Missing = @($CanonicalForms | Where-Object { $_ -notin $Canonical.formId })
    $Disabled = @($Canonical | Where-Object { -not $_.isEnabled })

    if ($Missing.Count -gt 0) {
        throw "Missing canonical webhook(s): $($Missing -join ', ')"
    }

    if ($Disabled.Count -gt 0) {
        throw "One or more canonical webhooks are disabled."
    }

    Write-Host ""
    Write-Host "SUCCESS: all four canonical Tally webhooks are enabled." -ForegroundColor Green
}
finally {
    $ApiKey = $null
    $SigningSecret = $null
    Remove-Variable ApiKeySecure -ErrorAction SilentlyContinue
    Remove-Variable SigningSecretSecure -ErrorAction SilentlyContinue
}
