window.GFW = window.GFW || {};
GFW.loadThemeConfig = async function(){
  try {
    const resp = await fetch('/_data/theme.yml', {cache:'no-store'});
    if(!resp.ok) return null;
    const text = await resp.text();
    return text;
  } catch { return null; }
};
