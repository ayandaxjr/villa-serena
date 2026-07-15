# Run from repo root AFTER: vercel link (select villa-serena-three on Jelmer's team)
# Or ask Jelmer to run this script once you're invited to his Vercel team.

$ErrorActionPreference = "Stop"

$vars = @{
  "NEXT_PUBLIC_SUPABASE_URL"      = "https://qxiinagdjnbxjjvnjuvs.supabase.co"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aWluYWdkam5ieGpqdm5qdXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzkzNjQsImV4cCI6MjA5OTM1NTM2NH0.7Rfm4-Q45h_sEgPYTAyk5ZRZLT1V8sgnug82jXc2_JE"
  "SUPABASE_SERVICE_ROLE_KEY"     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aWluYWdkam5ieGpqdm5qdXZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzc3OTM2NCwiZXhwIjoyMDk5MzU1MzM2NH0.DblYBnSuFs3q89o-ldoFHN2N9pVkvGOvPGhywDYve5k"
}

$envs = @("production", "preview", "development")

foreach ($name in $vars.Keys) {
  foreach ($env in $envs) {
    Write-Host "Setting $name ($env)..."
    vercel env rm $name $env --yes 2>$null
    vercel env add $name $env --yes --value $vars[$name]
  }
}

Write-Host ""
Write-Host "Done. Redeploy production so env vars take effect:"
Write-Host "  vercel --prod"
