import{t as e}from"./ordinal.CysACInB.js";import"./src.Cvj73aKn.js";import{n as t}from"./path.BWPyau1x.js";import{p as n}from"./math.Bi_r_ZWc.js";import{t as r}from"./arc.CL5tmseE.js";import{t as i}from"./array.BifhSqXX.js";import{f as a,r as o}from"./chunk-GEFDOKGD.DXfHcdUG.js";import{n as s,r as c}from"./chunk-AGHRB4JF.DXi8Yuax.js";import{B as l,C as u,V as d,W as f,_ as p,a as m,b as h,c as g,d as _,v}from"./chunk-7R4GIKGN.D_S8eJt_.js";import{t as y}from"./chunk-HHEYEP7N.EbL8D1KD.js";import{t as b}from"./chunk-4BX2VUAB.CS7-OOya.js";import{t as x}from"./mermaid-parser.core.DiY4yFSz.js";function S(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}function C(e){return e}function w(){var e=C,r=S,a=null,o=t(0),s=t(n),c=t(0);function l(t){var l,u=(t=i(t)).length,d,f,p=0,m=Array(u),h=Array(u),g=+o.apply(this,arguments),_=Math.min(n,Math.max(-n,s.apply(this,arguments)-g)),v,y=Math.min(Math.abs(_)/u,c.apply(this,arguments)),b=y*(_<0?-1:1),x;for(l=0;l<u;++l)(x=h[m[l]=l]=+e(t[l],l,t))>0&&(p+=x);for(r==null?a!=null&&m.sort(function(e,n){return a(t[e],t[n])}):m.sort(function(e,t){return r(h[e],h[t])}),l=0,f=p?(_-u*b)/p:0;l<u;++l,g=v)d=m[l],x=h[d],v=g+(x>0?x*f:0)+b,h[d]={data:t[d],index:l,value:x,startAngle:g,endAngle:v,padAngle:y};return h}return l.value=function(n){return arguments.length?(e=typeof n==`function`?n:t(+n),l):e},l.sortValues=function(e){return arguments.length?(r=e,a=null,l):r},l.sort=function(e){return arguments.length?(a=e,r=null,l):a},l.startAngle=function(e){return arguments.length?(o=typeof e==`function`?e:t(+e),l):o},l.endAngle=function(e){return arguments.length?(s=typeof e==`function`?e:t(+e),l):s},l.padAngle=function(e){return arguments.length?(c=typeof e==`function`?e:t(+e),l):c},l}var T=_.pie,E={sections:new Map,showData:!1,config:T},D=E.sections,O=E.showData,k=structuredClone(T),A={getConfig:s(()=>structuredClone(k),`getConfig`),clear:s(()=>{D=new Map,O=E.showData,m()},`clear`),setDiagramTitle:f,getDiagramTitle:u,setAccTitle:d,getAccTitle:v,setAccDescription:l,getAccDescription:p,addSection:s(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);D.has(e)||(D.set(e,t),c.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:s(()=>D,`getSections`),setShowData:s(e=>{O=e},`setShowData`),getShowData:s(()=>O,`getShowData`)},j=s((e,t)=>{b(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),M={parse:s(async e=>{let t=await x(`pie`,e);c.debug(t),j(t,A)},`parse`)},N=s(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),P=s(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1).sort((e,t)=>t.value-e.value);return w().value(e=>e.value)(n)},`createPieArcs`),F={parser:M,db:A,renderer:{draw:s((t,n,i,s)=>{c.debug(`rendering pie chart
`+t);let l=s.db,u=h(),d=o(l.getConfig(),u.pie),f=y(n),p=f.append(`g`);p.attr(`transform`,`translate(225,225)`);let{themeVariables:m}=u,[_]=a(m.pieOuterStrokeWidth);_??=2;let v=d.textPosition,b=r().innerRadius(0).outerRadius(185),x=r().innerRadius(185*v).outerRadius(185*v);p.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+_/2).attr(`class`,`pieOuterCircle`);let S=l.getSections(),C=P(S),w=[m.pie1,m.pie2,m.pie3,m.pie4,m.pie5,m.pie6,m.pie7,m.pie8,m.pie9,m.pie10,m.pie11,m.pie12],T=0;S.forEach(e=>{T+=e});let E=C.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=e(w);p.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,b).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),p.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+x.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`),p.append(`text`).text(l.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`);let O=[...S.entries()].map(([e,t])=>({label:e,value:t})),k=p.selectAll(`.legend`).data(O).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*O.length/2;return`translate(216,`+(t*22-n)+`)`});k.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),k.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>l.getShowData()?`${e.label} [${e.value}]`:e.label);let A=512+Math.max(...k.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0));f.attr(`viewBox`,`0 0 ${A} 450`),g(f,450,A,d.useMaxWidth)},`draw`)},styles:N};export{F as diagram};