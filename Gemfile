# .github/workflows/jekyll.yml (V1.0.14)
name: Build and Deploy Jekyll site to GitHub Pages

on:
  push:
    branches: ["main"] # 또는 사용하는 기본 브랜치
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1' # Jekyll 3.9 호환 버전
          bundler-cache: true # 'bundle install' 실행 및 Gem 캐시
          cache-version: 1
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      # ⭐️ V1.0.14: Bundler를 사용하여 Jekyll 빌드 실행 (기본 액션 대신)
      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3 # 기본적으로 ./_site 업로드

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
