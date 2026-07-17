# Deploy the Real 3D OrderRise Website

## Local test

Open PowerShell in the project folder:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Do not test the 3D module by double-clicking `index.html`.

## Update existing GitHub repository

Copy all files into:

```text
D:\orderrise-static-website\orderrise-static
```

Then run:

```powershell
cd "D:\orderrise-static-website\orderrise-static"

git add .
git commit -m "Build complete OrderRise real 3D website"

git pull origin main --no-rebase
git push origin main
```

If a merge conflict appears, do not force-push immediately. Review `git status`, keep the new website versions, complete the merge, and push.

## GitHub Pages settings

- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

Website:

```text
https://hamzakhalilbhatti-stack.github.io/orderrise-website/
```

After deployment press `Ctrl + F5`.
