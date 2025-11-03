#
# GOFUNWITH Blog Gemfile (v23.0 Final and Verified)
# This file corrects all syntax errors and includes all required dependencies.
#

source "https://rubygems.org"

# Core Jekyll and Theme
gem "jekyll", "~> 4.3.3"
gem "jekyll-theme-chirpy", "~> 7.4.1"

# Jekyll Plugins required by _config.yml
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-paginate"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Dependency for GitHub Actions build validation step
# This resolves the 'command not found: htmlproofer' error.
gem "html-proofer", "~> 4"

# Dependency for running Jekyll server locally on Ruby 3+
gem "webrick", "~> 1.8"
