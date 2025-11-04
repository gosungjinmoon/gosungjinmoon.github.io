# frozen_string_literal: true
module Jekyll
  module LangFilter
    def filter_lang(posts, lang)
      posts.select { |p| p.data["lang"] == lang }
    end
  end
end

Liquid::Template.register_filter(Jekyll::LangFilter)
