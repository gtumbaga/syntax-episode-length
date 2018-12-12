const button = document.getElementById('btnGetRss');

// handle click and add class
button.onclick = () => {
  xmlhttp.open('GET', 'https://feed.syntax.fm/rss');
	xmlhttp.send();
}

const xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(this.responseText,"text/xml");
    //const xmlParsed = parse(xmlDoc);
    console.log(xmlDoc);
  }
};
