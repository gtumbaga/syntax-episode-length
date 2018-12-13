document.getElementById('btnGetRss').onclick = () => {
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

    //lets create an array of just the times as seconds.
    let myEpisodesArray = Array();
    myEpisodes.forEach((item, index) => {
      const currentEpisodeDuration = (typeof item['itunes:duration'] !== 'undefined') ? item['itunes:duration']['#text'] : "00:00"; //the hosting & servers episode is missing itunes:duration
      const currentDurationAsSeconds = convertDurationToSeconds(currentEpisodeDuration);
      myEpisodesArray.push(currentDurationAsSeconds);
    });

    //get our results
    const goodResults = calcEpisodes(myEpisodesArray);

    //display our results
    //as seconds
    document.getElementById('sHolder').innerHTML = goodResults;

    //or, as hours insetad
    document.getElementById('hHolder').innerHTML = parseFloat(goodResults / 60).toFixed(2);

    //or, as days insetad
    document.getElementById('dHolder').innerHTML = parseFloat(goodResults / 86400).toFixed(2);
  }
};


// --------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------------------------------------------
//Use reduce to sum all seconds together
const calcEpisodes = (episodesObject) => {
  const allTheTimes = episodesObject.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  });
  
  return allTheTimes;
}

//Convert string of time to seconds
const convertDurationToSeconds = (itunesDuration) => {
  //split the time into hours, minutes, seconds
  timeObj = itunesDuration.split(":");
  //console.log(timeObj);

  let h = 0;
  let m = 0;
  let s = 0;

  if (timeObj.length == 3) {
    h = timeObj[0];
    m = timeObj[1];
    s = timeObj[2];
  } else if (timeObj.length == 2) {
    h = 0;
    m = timeObj[0];
    s = timeObj[1];
  }

  //calculate time to seconds
  const combinedTimeAsSeconds = (parseInt(h * 3600) + parseInt(m * 60) + parseInt(s));

  //return combinedTimeAsSeconds;
  return combinedTimeAsSeconds;
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
