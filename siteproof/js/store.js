(function(){
  const KEY='siteproof.demo.v1';
  const statuses={NEW:'New',ASSIGNED:'Assigned',PROGRESS:'In progress',REVIEW:'Ready for review',CLOSED:'Closed',REWORK:'Rework needed'};
  const now=()=>new Date().toISOString();
  const seedIssues=()=>[
    {id:'SP-0001',title:'Cracked bathroom tile',type:'Damage',location:'Building A · Floor 2 · Apartment 204',description:'A tile beside the shower is cracked.',reportedBy:'l.becker',assignee:null,status:statuses.NEW,deadline:null,photo:'tile',history:[{at:now(),by:'Lukas Becker',text:'Issue reported.'}]},
    {id:'SP-0002',title:'Paint missing near stairwell',type:'Workmanship',location:'Building A · Stairwell 1',description:'A small section needs a final coat.',reportedBy:'a.demir',assignee:'t.nowak',status:statuses.ASSIGNED,deadline:'2026-11-20',photo:'paint',history:[{at:now(),by:'Ayşe Demir',text:'Issue reported.'},{at:now(),by:'Katrin Vogel',text:'Assigned to Tomasz Nowak.'}]},
    {id:'SP-0003',title:'Window seal needs review',type:'Installation',location:'Building B · Floor 1 · Apartment 103',description:'The seal looks incomplete around the lower edge.',reportedBy:'j.weber',assignee:'l.becker',status:statuses.REVIEW,deadline:'2026-11-12',photo:'window',completionNote:'Seal replaced and photographed for review.',history:[{at:now(),by:'Jonas Weber',text:'Issue reported.'},{at:now(),by:'Katrin Vogel',text:'Assigned to Lukas Becker.'},{at:now(),by:'Lukas Becker',text:'Submitted repair for review.'}]}
  ];
  function load(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):seedIssues()}catch(e){return seedIssues()}}
  function save(issues){localStorage.setItem(KEY,JSON.stringify(issues));return issues}
  function reset(){localStorage.removeItem(KEY);return seedIssues()}
  function activeUser(){return sessionStorage.getItem('siteproof.user')}
  function setUser(id){sessionStorage.setItem('siteproof.user',id)}
  function getIssues(){return load()}
  function actor(users,id){return users.find(u=>u.id===id)?.name||id}
  window.SiteProofStore={KEY,statuses,now,seedIssues,load,save,reset,activeUser,setUser,getIssues,actor}
})();
