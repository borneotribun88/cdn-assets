function rpLoad(json){

var entries=json.feed.entry;

var mainHTML="";
var sideHTML="";
var bottomHTML="";
  
  /* DETEKSI LABEL DARI FEED URL */

var feedLabel = "";

if(feedURL.indexOf("/-/") > -1){

feedLabel = feedURL.split("/-/")[1];

}

for(var i=0;i<entries.length;i++){

var entry=entries[i];

var title=entry.title.$t;

var link;

for(var j=0;j<entry.link.length;j++){
if(entry.link[j].rel=="alternate"){
link=entry.link[j].href;
break;
}
}

var rawDate = new Date(entry.published.$t);

var date = rawDate.toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});
  
  
  
/* LABEL */

var labelHTML = "";

if(feedLabel){

labelHTML =
`<span class="rp-separator"> | </span>
<span class="rp-label">${feedLabel}</span>`;

}

var thumb;

if(entry.content){

var content = entry.content.$t;

var img = content.match(/<img.*?src="(.*?)"/);

if(img){

thumb = img[1]

.replace(/s72-c/,"s1600")
.replace(/s1600/,"s1600");

}else{

thumb="https://via.placeholder.com/1600x900";

}

}else if(entry.media$thumbnail){

thumb = entry.media$thumbnail.url
.replace(/s72-c/,"s1600");

}else{

thumb="https://via.placeholder.com/1600x900";

}


/* MAIN */

if(i==0){


var mainThumb = thumb
.replace(/s1600/,"s1600");

mainHTML+=`

<div class="rp-main">

<a href="${link}">
<img loading="lazy"
src="${mainThumb}">
</a>

<div class="rp-title">
<a href="${link}">
${title}
</a>
</div>

<div class="rp-date">
${date}${labelHTML}
</div>

</div>

`;

}




/* RIGHT (3) */

if(i>0 && i<=3){

sideHTML+=`

<div class="rp-side-item">

<a href="${link}">
<img loading="lazy"
src="${thumb}">
</a>

<div>

<div class="rp-side-title">
<a href="${link}">
${title}
</a>
</div>

<div class="rp-date">
${date}
</div>

</div>

</div>

`;

}


/* BOTTOM FULL (6+) */

if(i>3 && i<=12){

bottomHTML+=`

<div class="rp-bottom-item">

<a href="${link}">
<img loading="lazy"
src="${thumb}">
</a>

<div>

<div class="rp-bottom-title">
<a href="${link}">
${title}
</a>
</div>

<div class="rp-date">
${date}${labelHTML}
</div>

</div>

</div>

`;

}

}


/* Render */

document.getElementById("rp-main").innerHTML=mainHTML;

document.getElementById("rp-side").innerHTML=sideHTML;

document.getElementById("rp-bottom-full").innerHTML=bottomHTML;

}
