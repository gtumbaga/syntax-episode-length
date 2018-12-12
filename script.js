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
    const xmlParsed = xmlToJson(xmlDoc);
    const myEpisodes = xmlParsed.rss.channel.item;
    calcEpisodes(myEpisodes);
  }
};

//Iterate Thru all episodes
const calcEpisodes = (episodesObject) => {
  episodesObject.forEach(function (item, key) {
    //check each item for a duration, and use "0" in it's place if it isn't set
    const currentEpisodeDuration = (typeof item['itunes:duration'] !== 'undefined') ? item['itunes:duration']['#text'] : "0";
    console.log(currentEpisodeDuration); // using the [''] notation because I don't know how to work with colons =)
  });
}


// Changes XML to JSON
// found function here: https://davidwalsh.name/convert-xml-json
const  xmlToJson = (xml) => {

  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};
