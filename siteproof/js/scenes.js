(function(){
  const svg=(label,bg,accent)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500"><rect width="100%" height="100%" fill="${bg}"/><rect x="90" y="80" width="720" height="340" rx="20" fill="white" stroke="${accent}" stroke-width="10"/><path d="M180 330 L350 180 L500 320 L620 220 L760 350" fill="none" stroke="${accent}" stroke-width="18"/><text x="450" y="455" text-anchor="middle" font-family="Arial" font-size="28" fill="#172033">${label}</text></svg>`);
  window.SiteProofScenes={tile:svg('Demo photo · cracked tile','#dbeafe','#2563eb'),paint:svg('Demo photo · paint area','#fef3c7','#b45309'),window:svg('Demo photo · window seal','#dcfce7','#15803d')};
})();
