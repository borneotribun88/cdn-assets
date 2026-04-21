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
</script>



  <script>
  /* ================= LABEL OTOMATIS DARI FEED ================= */

function getFeedLabel(){

/* ambil semua script feed */
var scripts = document.getElementsByTagName("script");

for(var i=0;i<scripts.length;i++){

var src = scripts[i].src;

/* cek jika itu feed label */
if(src && src.includes("/feeds/posts/default/-/")){

/* ambil label dari URL */
var label = src.split("/-/")[1];

/* hapus parameter */
label = label.split("?")[0];

/* decode spasi */
label = decodeURIComponent(label);

/* tampilkan badge */
return '<span class="label-badge">'+label+'</span>';

}

}

/* fallback jika tidak ada */
return "";

}

var slideIndex = 0;
var slidesData = [];

/* ================= FORMAT DATE ================= */
function formatDate(d){
var date = new Date(d);
return date.toLocaleDateString("id-ID",{
day:"numeric",
month:"short",
year:"numeric"
});
}

/* ================= LABEL (1 LABEL SAJA) ================= */
function getLabel(entry){

if(entry.category && entry.category.length > 0){

/* ambil label pertama dari RSS */
var label = entry.category[0].term;

/* tampil sebagai badge */
return '<span class="label-badge">'+label+'</span>';

}

return "";

}

/* ================= IMAGE ================= */
function getImage(entry){
var content = entry.content.$t;
var img = content.match(/<img.+?src="([^"]+)"/);
if(img){
return img[1];
}
return "https://via.placeholder.com/800x450";
}

/* ================= MAIN FUNCTION ================= */
function recentPosts(json){

var smallHTML = "";

/* 1 SLIDER + 8 GRID */
for(var i=0;i<9;i++){

if(!json.feed.entry[i]) break;

var entry = json.feed.entry[i];

var title = entry.title.$t;

var link = "";

for(var j=0;j<entry.link.length;j++){
if(entry.link[j].rel=="alternate"){
link = entry.link[j].href;
break;
}
}

var img = getImage(entry);
var date = formatDate(entry.published.$t);
var label = getFeedLabel();

/* SAVE SLIDES */
slidesData.push({title,link,img,date,label});

/* SLIDER (5 POST) */
if(i < 5){
document.getElementById("slider").innerHTML += `
<div class="slide">
<a href="${link}">
<img loading="lazy" src="${img}">
</a>

<div class="slide-info">
<div class="slide-title">
<a href="${link}">${title}</a>
</div>

<div class="slide-meta">
${date} | ${label}
</div>

</div>
</div>
`;
}

/* GRID 8 POST */
if(i > 0 && i <= 8){
smallHTML += `
<div>

<div class="small-item">
<a href="${link}">
<img loading="lazy" src="${img}">
</a>
</div>

<div class="small-title">
<a href="${link}">${title}</a>
</div>

<div class="small-meta">
${date} | ${label}
</div>

</div>
`;
}

}

/* RENDER */
document.getElementById("smallPosts").innerHTML = smallHTML;

document.getElementById("skeleton").style.display = "none";
document.getElementById("content").style.display = "block";

showSlide(0);
}

/* ================= SLIDE CONTROL ================= */
function showSlide(n){

var slides = document.getElementsByClassName("slide");

if(n >= slides.length) slideIndex = 0;
if(n < 0) slideIndex = slides.length - 1;

for(var i=0;i<slides.length;i++){
slides[i].style.display = "none";
}

slides[slideIndex].style.display = "block";
}

function changeSlide(n){
slideIndex += n;
showSlide(slideIndex);
}

/* AUTO SLIDE */
setInterval(function(){
slideIndex++;
showSlide(slideIndex);
},5000);

/* SWIPE MOBILE */
var startX = 0;

document.getElementById("slider").addEventListener("touchstart",function(e){
startX = e.touches[0].clientX;
});

document.getElementById("slider").addEventListener("touchend",function(e){
var endX = e.changedTouches[0].clientX;

if(startX - endX > 50){
changeSlide(1);
}

if(endX - startX > 50){
changeSlide(-1);
}
});

</script>


<script>

/* Bungkus script supaya tidak bentrok */

(function(){

/* ===== FEED ===== */

const aprilFeeds = [

"/feeds/posts/default/-/Kalbar?alt=json&max-results=5",
"/feeds/posts/default/-/Kalsel?alt=json&max-results=5",
"/feeds/posts/default/-/Kaltim?alt=json&max-results=5",
"/feeds/posts/default/-/Kalteng?alt=json&max-results=5",
"/feeds/posts/default/-/Kaltara?alt=json&max-results=5"

];

const aprilMaxPosts = 10;



/* ===== LOAD ===== */

async function loadAprilFeeds(){

try{


function getFeedLabel(url){

let match = url.match(/-\/([^?]+)/);

return match ? match[1] : "Umum";

}


let requests = aprilFeeds.map(feed =>

fetch(feed)

.then(res => res.json())

.then(data => {

let labelName = getFeedLabel(feed);

if (data.feed.entry){

data.feed.entry.forEach(post => {

post.feedLabel = labelName;

});

return data.feed.entry;

}

return [];

})

);


let results = await Promise.all(requests);

let allPosts = results.flat();



/* ===== SORT ===== */

allPosts.sort((a,b)=>

new Date(b.published.$t) -

new Date(a.published.$t)

);



/* ===== LIMIT ===== */

allPosts = allPosts.slice(0, aprilMaxPosts);

renderAprilPosts(allPosts);

}

catch(e){

console.log("Feed load error:", e);

document.getElementById(

"recent-april-container"

).innerHTML = "Gagal memuat artikel";

}

}



/* ===== FORMAT TANGGAL ===== */

function formatAprilDate(dateString){

let date = new Date(dateString);

return date.toLocaleDateString(

"id-ID",

{

day: "numeric",

month: "short",

year: "numeric"

}

);

}



/* ===== IMAGE ===== */

function getAprilImage(post, size="small"){

let img = "";


if (post.content && post.content.$t){

let match = post.content.$t

.match(/<img[^>]+src="([^">]+)"/);

if (match){

img = match[1];

if (img.includes("blogger.googleusercontent.com")){

if (size==="large"){

img = img.replace(

/\/s[0-9\-c]+\//,

"/w1200-h630-p-k-no-nu/"

);

}else{

img = img.replace(

/\/s[0-9\-c]+\//,

"/w300-h200-p-k-no-nu/"

);

}

}

}

}


if (!img && post.media$thumbnail){

img = size==="large"

? post.media$thumbnail.url.replace("/s72-c/","/w1200-h630-p-k-no-nu/")

: post.media$thumbnail.url.replace("/s72-c/","/w300-h200-p-k-no-nu/");

}


if (!img){

img = size==="large"

? "https://via.placeholder.com/1200x630"

: "https://via.placeholder.com/300x200";

}

return img;

}



/* ===== LINK ===== */

function getAprilLink(post){

for (let link of post.link){

if (link.rel=="alternate"){

return link.href;

}

}

}



/* ===== LABEL ===== */

function getAprilLabel(post){

return post.feedLabel || "Umum";

}



/* ===== RENDER ===== */

function renderAprilPosts(posts){

if(!posts.length) return;

let html = "";

let p0 = posts[0];


/* POST BESAR */

html += `

<div class="big-aprilpost">

<a href="${getAprilLink(p0)}">

<img 

src="${getAprilImage(p0,'large')}"

loading="lazy"

>

<div class="overlay">

<h4>${p0.title.$t}</h4>

<div class="aprilmeta">

${formatAprilDate(p0.published.$t)}

• ${getAprilLabel(p0)}

</div>

</div>

</a>

</div>

`;


/* POST KECIL */

html += `<div class="small-aprilposts">`;

for(let i=1;i<posts.length;i++){

let p = posts[i];

html += `

<div class="small-aprilpost">

<a href="${getAprilLink(p)}">

<img 

src="${getAprilImage(p,'small')}"

loading="lazy"

>

</a>

<div>

<a href="${getAprilLink(p)}">

<h4>${p.title.$t}</h4>

</a>

<div class="aprilmeta">

${formatAprilDate(p.published.$t)}

•

<a href="/search/label/${getAprilLabel(p)}">

${getAprilLabel(p)}

</a>

</div>

</div>

</div>

`;

}

html += `</div>`;


document

.getElementById("recent-april-container")

.innerHTML = html;

}


/* START */

loadAprilFeeds();

})();