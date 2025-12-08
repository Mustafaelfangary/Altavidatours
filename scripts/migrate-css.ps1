# Create the script file
@'
# migrate-css.ps1
# This script sets up a new CSS architecture for the project

Write-Host "🚀 Starting CSS migration..." -ForegroundColor Green

# 1. Create directory structure
$directories = @(
    "src/styles/core",
    "src/styles/components",
    "src/styles/layout",
    "src/styles/themes",
    "src/styles/pages",
    "src/styles/utils"
)

Write-Host "📂 Creating directory structure..." -ForegroundColor Cyan
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "  Created: $dir" -ForegroundColor DarkGray
}

# 2. Create core files
Write-Host "📝 Creating core files..." -ForegroundColor Cyan

# _variables.css
@"
:root {
  /* Color System */
  --primary: #0B70E1;
  --primary-light: #3D8DE8;
  --primary-dark: #0852A3;
  --accent: #1BAE70;
  --accent-light: #48C08D;
  --accent-dark: #158653;
  --text-primary: #1A1A1A;
  --text-secondary: #4A4A4A;
  --background: #FFFFFF;
  --background-alt: #F8F9FA;
  --border: #E0E0E0;
  --error: #DC3545;
  --warning: #FFC107;
  --success: #28A745;
  
  /* Spacing */
  --spacing-xxs: 0.25rem;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  
  /* Breakpoints */
  --breakpoint-xs: 0;
  --breakpoint-sm: 600px;
  --breakpoint-md: 960px;
  --breakpoint-lg: 1280px;
  --breakpoint-xl: 1920px;
}
"@ | Out-File -FilePath "src/styles/core/_variables.css" -Encoding utf8

# Other core files
@'/* Reset styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: var(--font-sans);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
'@ | Out-File -FilePath "src/styles/core/_reset.css" -Encoding utf8

@'/* Typography styles */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-dark);
  }
}
'@ | Out-File -FilePath "src/styles/core/_typography.css" -Encoding utf8

@'/* Utility classes */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  max-width: var(--breakpoint-xl);
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }

.mt-1 { margin-top: var(--spacing-xs); }
.mt-2 { margin-top: var(--spacing-sm); }
.mt-3 { margin-top: var(--spacing-md); }
.mt-4 { margin-top: var(--spacing-lg); }
.mt-5 { margin-top: var(--spacing-xl); }

/* Add more utility classes as needed */
'@ | Out-File -FilePath "src/styles/core/_utilities.css" -Encoding utf8

# 3. Create main CSS file
@'
/* Main CSS Entry Point */
@import 'core/variables';
@import 'core/reset';
@import 'core/typography';
@import 'core/utilities';

/* Components */
@import 'components/buttons';
@import 'components/forms';
@import 'components/cards';
@import 'components/navigation';
@import 'components/admin';

/* Layout */
@import 'layout/header';
@import 'layout/footer';
@import 'layout/grid';
@import 'layout/responsive';

/* Themes */
@import 'themes/light';
@import 'themes/dark';
@import 'themes/luxury';

/* Pages */
@import 'pages/home';
@import 'pages/packages';
@import 'pages/admin';
'@ | Out-File -FilePath "src/styles/main.css" -Encoding utf8

# 4. Create component files
@'/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &-primary {
    background-color: var(--primary);
    color: white;

    &:hover {
      background-color: var(--primary-dark);
    }
  }

  &-outline {
    background-color: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);

    &:hover {
      background-color: rgba(var(--primary), 0.1);
    }
  }
}
'@ | Out-File -FilePath "src/styles/components/_buttons.css" -Encoding utf8

@'/* Form styles */
.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(var(--primary), 0.2);
    }
  }
}
'@ | Out-File -FilePath "src/styles/components/_forms.css" -Encoding utf8

# 5. Create layout files
@'/* Grid system */
.grid {
  display: grid;
  gap: var(--spacing-md);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
  }
}

.col {
  grid-column: span 12;
  
  @media (min-width: 768px) {
    &-md-6 {
      grid-column: span 6;
    }
    &-md-4 {
      grid-column: span 4;
    }
    &-md-3 {
      grid-column: span 3;
    }
  }
}
'@ | Out-File -FilePath "src/styles/layout/_grid.css" -Encoding utf8

# 6. Create theme files
@'/* Light theme (default) */
:root {
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --color-border: #e0e0e0;
}
'@ | Out-File -FilePath "src/styles/themes/_light.css" -Encoding utf8

@'/* Dark theme */
[data-theme="dark"] {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
  --color-border: #333333;
}
'@ | Out-File -FilePath "src/styles/themes/_dark.css" -Encoding utf8

# 7. Create PostCSS config
@'
module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-nested": {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "nesting-rules": true,
        "custom-media-queries": true,
        "custom-properties": true,
      },
    },
    "postcss-simple-vars": {},
    "postcss-custom-media": {},
    "tailwindcss": {},
    "autoprefixer": {},
  }
}
'@ | Out-File -FilePath "postcss.config.js" -Encoding utf8

# 8. Update Next.js config
@'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-s3-bucket-name.s3.your-region.amazonaws.com'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              auto: true,
              localIdentName: '[local]--[hash:base64:5]',
            },
          },
        },
        'postcss-loader',
      ],
      include: /\.module\.css$/,
    });

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
      exclude: /\.module\.css$/,
    });

    return config;
  },
};

module.exports = nextConfig;
'@ | Out-File -FilePath "next.config.js" -Encoding utf8

# 9. Install required dependencies
Write-Host "📦 Installing required dependencies..." -ForegroundColor Cyan
npm install -D postcss-import postcss-nested postcss-preset-env postcss-simple-vars postcss-custom-media

# 10. Move existing CSS files
Write-Host "🔄 Moving existing CSS files..." -ForegroundColor Cyan
$moves = @{
    "luxury-design.css" = "themes/_luxury.css"
    "theme-altavida.css" = "themes/_altavida.css"
    "theme-jacada.css" = "themes/_jacada.css"
    "travelok-theme.css" = "themes/_travelok.css"
    "admin.css" = "components/_admin.css"
    "mui-admin-override.css" = "components/_mui-overrides.css"
    "admin-contrast-fix.css" = "utils/_a11y.css"
    "mobile-enhancements.css" = "layout/_responsive.css"
    "mobile-complete.css" = "layout/_mobile.css"
    "custom.css" = "utils/_utilities.css"
}

foreach ($file in $moves.Keys) {
    $source = "src/styles/$file"
    $dest = "src/styles/$($moves[$file])"
    if (Test-Path $source) {
        Move-Item -Path $source -Destination $dest -Force
        Write-Host "  Moved: $file -> $($moves[$file])" -ForegroundColor DarkGray
    }
}

# 11. Clean up old files
$filesToRemove = @(
    "theme-modern.css",
    "luxury-design.css",
    "theme-altavida.css",
    "theme-jacada.css",
    "travelok-theme.css",
    "admin.css",
    "mui-admin-override.css",
    "admin-contrast-fix.css",
    "mobile-enhancements.css",
    "mobile-complete.css",
    "custom.css"
)

foreach ($file in $filesToRemove) {
    $path = "src/styles/$file"
    if (Test-Path $path) {
        Remove-Item -Path $path -Force
        Write-Host "  Removed: $file" -ForegroundColor DarkGray
    }
}

Write-Host "🎉 CSS migration completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your _app.js/_app.tsx to import '../styles/main.css'"
Write-Host "2. Review the new CSS structure in src/styles/"
Write-Host "3. Start your development server with 'npm run dev'"
'@ | Out-File -FilePath "scripts/migrate-css.ps1" -Encoding utf8

Write-Host "✅ Created migrate-css.ps1 in the scripts folder" -ForegroundColor Green
Write-Host "To run the migration:" -ForegroundColor Cyan
Write-Host "1. Open PowerShell as Administrator" -ForegroundColor White
Write-Host "2. Run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
Write-Host "3. Run: .\scripts\migrate-css.ps1" -ForegroundColor White