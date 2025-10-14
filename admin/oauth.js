function loginToGitHub(){
  const clientId = "Ov23liqsljSBAqajz2eu";
  const redirectUri = location.origin + "/admin/callback.html";
  const scope = "repo";
  location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
}
