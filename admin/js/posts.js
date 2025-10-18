/* admin/js/posts.js  v6.4.1_202510180200 */

export function slugify(t){return t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9\-]/g,"").replace(/\-+/g,"-").replace(/^-+|-+$/g,"")}
export function buildFrontMatter({title,desc,lang,tags}){
 const d=new Date().toISOString().slice(0,10);
 const lines=["---","layout: post",`title: "{title}"`.replace("{{","").replace("}}",""),`description: "{desc}"`.replace("{{","").replace("}}",""),`lang: ${lang}`,"tags:",...(tags?tags.split(",").map(t=>"  - "+t.trim()).filter(Boolean):["  - Tech"]),`date: ${d}`,"---","","# 본문을 작성하세요"]; return lines.join("\n");
}
export function makeFilename(title,lang){
 const d=new Date().toISOString().slice(0,10); const slug=slugify(title); const folder=lang==="en"?"_posts/en":"_posts/ko"; return `/${folder}/${d}-${slug}.md`;
}
