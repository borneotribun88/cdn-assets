/* =========================
   GLOBAL SLIDER STATE
========================= */
let slideIndex = 0;
let slidesData = [];

/* =========================
   RP LOAD (FEATURE POST)
========================= */
function rpLoad(json, feedURL = "") {

  var entries = json.feed.entry;

  var mainHTML = "";
  var sideHTML = "";
  var bottomHTML = "";

  var feedLabel = "";

  if (feedURL && feedURL.indexOf("/-/") > -1) {
    feedLabel = feedURL.split("/-/")[1];
  }

  for (var i = 0; i < entries.length; i++) {

    var entry = entries[i];
    var title = entry.title.$t;

    var link = "";
    for (var j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel == "alternate") {
        link = entry.link[j].href;
        break;
      }
    }

    var rawDate = new Date(entry.published.$t);

    var date = rawDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    var labelHTML = "";
    if (feedLabel) {
      labelHTML = `<span class="rp-separator"> | </span>
                   <span class="rp-label">${feedLabel}</span>`;
    }

    var thumb = "https://via.placeholder.com/1600x900";

    if (entry.content) {
      var img = entry.content.$t.match(/<img.*?src="(.*?)"/);
      if (img) thumb = img[1].replace(/s72-c|s1600/g, "s1600");
    } else if (entry.media$thumbnail) {
      thumb = entry.media$thumbnail.url.replace(/s72-c/, "s1600");
    }

    /* MAIN */
    if (i == 0) {
      mainHTML += `
        <div class="rp-main">
          <a href="${link}">
            <img loading="lazy" src="${thumb}">
          </a>
          <div class="rp-title"><a href="${link}">${title}</a></div>
          <div class="rp-date">${date}${labelHTML}</div>
        </div>
      `;
    }

    /* SIDE */
    if (i > 0 && i <= 3) {
      sideHTML += `
        <div class="rp-side-item">
          <a href="${link}">
            <img loading="lazy" src="${thumb}">
          </a>
          <div>
            <div class="rp-side-title"><a href="${link}">${title}</a></div>
            <div class="rp-date">${date}</div>
          </div>
        </div>
      `;
    }

    /* BOTTOM */
    if (i > 3 && i <= 12) {
      bottomHTML += `
        <div class="rp-bottom-item">
          <a href="${link}">
            <img loading="lazy" src="${thumb}">
          </a>
          <div>
            <div class="rp-bottom-title"><a href="${link}">${title}</a></div>
            <div class="rp-date">${date}${labelHTML}</div>
          </div>
        </div>
      `;
    }
  }

  document.getElementById("rp-main").innerHTML = mainHTML;
  document.getElementById("rp-side").innerHTML = sideHTML;
  document.getElementById("rp-bottom-full").innerHTML = bottomHTML;
}


/* =========================
   SLIDER + RECENT POSTS
========================= */
function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getImage(entry) {
  let content = entry.content?."$t" || "";
  let img = content.match(/<img.+?src="([^"]+)"/);
  if (img) return img[1];
  return entry.media$thumbnail?.url || "https://via.placeholder.com/800x450";
}

function getLabel(entry) {
  if (entry.category && entry.category.length > 0) {
    return `<span class="label-badge">${entry.category[0].term}</span>`;
  }
  return "";
}

function recentPosts(json) {

  let smallHTML = "";

  for (let i = 0; i < 9; i++) {

    if (!json.feed.entry[i]) break;

    let entry = json.feed.entry[i];

    let title = entry.title.$t;

    let link = "";
    for (let j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel == "alternate") {
        link = entry.link[j].href;
        break;
      }
    }

    let img = getImage(entry);
    let date = formatDate(entry.published.$t);
    let label = getLabel(entry);

    if (i < 5) {
      document.getElementById("slider").innerHTML += `
        <div class="slide">
          <a href="${link}">
            <img loading="lazy" src="${img}">
          </a>
          <div class="slide-info">
            <div class="slide-title"><a href="${link}">${title}</a></div>
            <div class="slide-meta">${date} | ${label}</div>
          </div>
        </div>
      `;
    }

    if (i > 0 && i <= 8) {
      smallHTML += `
        <div>
          <div class="small-item">
            <a href="${link}">
              <img loading="lazy" src="${img}">
            </a>
          </div>
          <div class="small-title"><a href="${link}">${title}</a></div>
          <div class="small-meta">${date} | ${label}</div>
        </div>
      `;
    }

  }

  document.getElementById("smallPosts").innerHTML = smallHTML;

  showSlide(0);
}


/* SLIDER CONTROL */
function showSlide(n) {
  let slides = document.getElementsByClassName("slide");

  if (slides.length === 0) return;

  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex].style.display = "block";
}

function changeSlide(n) {
  slideIndex += n;
  showSlide(slideIndex);
}

setInterval(() => {
  slideIndex++;
  showSlide(slideIndex);
}, 5000);


/* TOUCH SLIDE */
(function () {
  let startX = 0;
  const slider = document.getElementById("slider");

  if (!slider) return;

  slider.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", function (e) {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) changeSlide(1);
    if (endX - startX > 50) changeSlide(-1);
  });
})();


/* =========================
   APRIL MULTI FEED MODULE
========================= */
(function () {

  const aprilFeeds = [
    "/feeds/posts/default/-/Kalbar?alt=json&max-results=5",
    "/feeds/posts/default/-/Kalsel?alt=json&max-results=5",
    "/feeds/posts/default/-/Kaltim?alt=json&max-results=5",
    "/feeds/posts/default/-/Kalteng?alt=json&max-results=5",
    "/feeds/posts/default/-/Kaltara?alt=json&max-results=5"
  ];

  const maxPosts = 10;

  function getLabelFromUrl(url) {
    let match = url.match(/-\/([^?]+)/);
    return match ? decodeURIComponent(match[1]) : "Umum";
  }

  function formatAprilDate(d) {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function getAprilImage(post, size = "small") {

    let img = "";

    if (post.content?."$t") {
      let match = post.content.$t.match(/<img[^>]+src="([^">]+)"/);
      if (match) img = match[1];
    }

    if (!img && post.media$thumbnail) {
      img = post.media$thumbnail.url;
    }

    return img || "https://via.placeholder.com/800x450";
  }

  function getAprilLink(post) {
    return post.link.find(l => l.rel === "alternate")?.href;
  }

  function render(posts) {

    let html = "";

    if (!posts.length) return;

    let first = posts[0];

    html += `
      <div class="big-aprilpost">
        <a href="${getAprilLink(first)}">
          <img src="${getAprilImage(first,'large')}">
          <div class="overlay">
            <h4>${first.title.$t}</h4>
            <div>${formatAprilDate(first.published.$t)}</div>
          </div>
        </a>
      </div>
    `;

    html += `<div class="small-aprilposts">`;

    for (let i = 1; i < posts.length; i++) {
      let p = posts[i];

      html += `
        <div class="small-aprilpost">
          <a href="${getAprilLink(p)}">
            <img src="${getAprilImage(p)}">
          </a>
          <div>
            <a href="${getAprilLink(p)}">${p.title.$t}</a>
          </div>
        </div>
      `;
    }

    html += `</div>`;

    document.getElementById("recent-april-container").innerHTML = html;
  }

  async function load() {
    try {

      let results = await Promise.all(
        aprilFeeds.map(url =>
          fetch(url)
            .then(r => r.json())
            .then(d => {
              let label = getLabelFromUrl(url);
              return (d.feed.entry || []).map(p => {
                p.feedLabel = label;
                return p;
              });
            })
        )
      );

      let all = results.flat()
        .sort((a, b) =>
          new Date(b.published.$t) - new Date(a.published.$t)
        )
        .slice(0, maxPosts);

      render(all);

    } catch (e) {
      document.getElementById("recent-april-container").innerHTML =
        "Gagal memuat artikel";
    }
  }

  load();

})();