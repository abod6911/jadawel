$ErrorActionPreference = 'Stop'
$tempIndex = Join-Path (Get-Location) '.git\temp_index'
if (Test-Path $tempIndex) { Remove-Item $tempIndex -Force }

$env:GIT_INDEX_FILE = $tempIndex
try {
    git --work-tree=out add -A
    $tree = (git write-tree).Trim()
    Write-Host "Tree: $tree"
    $parent = (git rev-parse origin/gh-pages).Trim()
    Write-Host "Parent: $parent"
    $commit = (git commit-tree $tree -p $parent -m "deploy: overhaul mobile UI/UX ergonomics & integrate AnimatedPathText wave ribbon and VIP orbit card").Trim()
    Write-Host "New Commit: $commit"
    git push origin "$commit`:refs/heads/gh-pages" --force
    Write-Host "Successfully pushed to origin/gh-pages!"
} finally {
    Remove-Item Env:\GIT_INDEX_FILE -ErrorAction SilentlyContinue
    if (Test-Path $tempIndex) { Remove-Item $tempIndex -Force }
}
