/* admin/js/posts.js v1.0.0_202510250840 */
/*
 * 새 포스트 생성 로직
 * ⭐️ 아키텍처 핵심 ⭐️
 * 이 파일은 'window.githubApi'를 사용하여 n8n 웹훅 주소를 가져오고,
 * GitHub 토큰을 가져와 n8n 웹훅으로 포스트 데이터를 전송합니다.
 * n8n 워크플로우가 GitHub PR 생성을 처리합니다.
 */
(function (githubApi) {
  'useSrict';

  // YYYY-MM-DD 형식의 날짜 생성 (Timezone 기준)
  function getLocalDate(tz) {
    try {
      // Intl API를 사용하여 Asia/Seoul 시간대 날짜 객체 생성
      const date = new Date(
        new Date().toLocaleString('en-US', { timeZone: tz }),
      );
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      // Fallback
      console.warn('Timezone API failed, using local date.');
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  // 제목을 slug (URL 친화적 문자열)로 변환
  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // 공백을 -로
      .replace(/[^\w-]+/g, '') // 영숫자, 밑줄, 하이픈 외 제거
      .replace(/--+/g, '-'); // 연속 하이픈 제거
  }

  // 마크다운 Front Matter 생성
  function createFrontMatter(title, date, lang, tags) {
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const tagsYaml = tagArray.length > 0 ? `[${tagArray.join(', ')}]` : '[]';

    return `---
layout: post
title: "${title.replace(/"/g, '\\"')}"
date: ${date} 09:00:00 +0900
lang: ${lang}
tags: ${tagsYaml}
---
`;
  }

  // 새 포스트 생성 (n8n 웹훅 호출)
  async function createNewPost(title, lang, tags, content) {
    if (!title || !content) {
      throw new Error('Title and Content are required.');
    }

    const token = githubApi.getToken();
    if (!token) {
      throw new Error('Not authenticated. Please login again.');
    }

    // 1. 설정 파일에서 n8n 주소 및 repo 정보 가져오기
    const config = await githubApi.loadThemeConfig();
    const n8nWebhookUrl = config.n8n_webhook_subscribe;
    const repoFullName = config.repo; // 예: "gosungjinmoon/gosungjinmoon.github.io"
    const timezone = config.timezone || 'Asia/Seoul';

    // 2. 파일명 및 경로 생성
    const date = getLocalDate(timezone);
    const slug = slugify(title);
    const filename = `${date}-${slug}.${lang}.md`;
    const filePath = `_posts/${lang}/${filename}`;

    // 3. 전체 파일 내용 생성
    const frontMatter = createFrontMatter(title, date, lang, tags);
    const fileContent = `${frontMatter}\n${content}`;

    // 4. n8n 웹훅으로 데이터 전송
    // n8n 워크플로우는 이 데이터를 받아 GitHub PR을 생성해야 합니다.
    const payload = {
      token: token, // n8n이 GitHub API를 사용할 수 있도록 토큰 전달
      repo: repoFullName,
      branchName: `new-post/${slug}-${Date.now()}`,
      baseBranch: 'main',
      filePath: filePath,
      commitMessage: `New Post (${lang}): ${title}`,
      prTitle: `[Blog] New Post: ${title}`,
      prBody: `Admin Console에서 작성된 새 포스트입니다. (${lang})`,
      // Base64 인코딩: n8n이 바로 GitHub API에 사용할 수 있도록
      contentBase64: btoa(unescape(encodeURIComponent(fileContent))),
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `n8n Webhook Error: ${errorData.message || response.statusText}`,
      );
    }

    // n8n이 PR URL을 응답으로 반환한다고 가정
    const result = await response.json();
    return {
      prUrl: result.prUrl || '(n8n response did not include PR URL)',
      filePath: filePath,
    };
  }

  // Public API
  window.postCreator = {
    createNewPost,
  };
})(window.githubApi);
