//User set vars
var numbOfPanes = 3;

// global vars
var paneHeight, paneWidth, screenHeight, paneSpacing, pageCenter;
var panesArray = [];
var projectData;

var panelClickTime; //Used for determining if mouse up on the projects pane is a click or drag

function loadJson() {
    $.getJSON("../static/projectsData.json?x=1&callback=?", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          items.push( "<li id='" + key + "'>" + val + "</li>" );
        });
       
        $( "<ul/>", {
          "class": "my-new-list",
          html: items.join( "" )
        }).appendTo( "body" );
      });

}

function setupPanes() {
    var temp = document.getElementById("projects-panel").getBoundingClientRect();
    pageCenter = temp.top + ((temp.bottom - temp.top) / 2);
    if(window.innerWidth < 800) {
        alert("Uhh sorry this page only really works on desktop right now. Mobile coming soon");
    }
    // setup pane array
    for(var i = 1; i <= numbOfPanes; i ++) {
        panesArray.push('project-' + i);
    }

    paneWidth = document.getElementById(panesArray[0]).offsetWidth;
    paneHeight = document.getElementById(panesArray[0]).offsetHeight;
    screenHeight = window.innerHeight;
    paneSpacing = paneHeight * 1.1;    

    snapTo(1);
}

function snapTo(focusedPaneId) {
    // set main pane to centre
    var pane = document.getElementById(panesArray[focusedPaneId]);
    pane.style.top = '50%';
    pane.style.transform = 'translateY(-50%) scale(' + getScale(panesArray[focusedPaneId]) + ')';

    // Highlight main pane
    pane.style.boxShadow = "white 0px 0 20px 10px";

    var scale = 0.9;
    // set panes above it
    for(var i = +focusedPaneId + 1; i < panesArray.length; i ++) {
        pane = document.getElementById(panesArray[i]);
        pane.style.top = '50%';
        pane.style.transform = 'translateY(' + (paneHeight * (i - focusedPaneId)) + 'px) translateY(-50%) scale(' + getScale(panesArray[i]) + ') ';
        pane.style.boxShadow = "";
    }

    // set panes below it
    for(var i = focusedPaneId - 1; i >= 0; i --) {
        pane = document.getElementById(panesArray[i]);
        pane.style.top = '50%';
        pane.style.transform = 'translateY(-' + (paneHeight * (focusedPaneId - i)) + 'px) translateY(-50%) scale(' + getScale(panesArray[i]) + ') ';
        pane.style.boxShadow = "";
    }
    displayText(focusedPaneId);
}

function displayText(elementId) {
    var ele = document.getElementById(panesArray[elementId]);
    var label = ele.getAttribute("data-label");
    // Set the easy labels
    document.getElementById("project-title").innerHTML = projectData[label]["Title"];
    document.getElementById("project-description").innerHTML = projectData[label]["Description"];

    // now add list
    var techsList = projectData[label]["Techs"];
    var list = document.getElementById("project-techs");
    // Clear current list
    list.innerHTML = "";
    // Add stuff
    for(var t in techsList) {
        list.innerHTML += `<li class="tech-item">${techsList[t]}</li>`;
    }
}

function getScale(elementId) {
    var ele = document.getElementById(elementId).getBoundingClientRect();
    var center = ele.top + ((ele.bottom - ele.top) / 2);

    var diff = Math.max(Math.abs(center - pageCenter), 1);

    var t = 200 / diff;
    if(t < .8) t = 0.8;
    if(t > 1.2) t = 1.2;
    return 0.9;
}

// loadJson();


// drag ffs why is this so much harder than clicking
$('.projects-panel').mousedown((event) => {
    // enable mousemove event
    $('.projects-panel').on("mousemove");
    // set most recent Y position
    var lastY = event.pageY;
    panelClickTime = new Date();
    // change transition time to 0
    $('.project-pane').css({transition: "0s"});
    // Move stuff on mousemove
    $('.projects-panel').mousemove((event)=> {
        $('.project-pane').css({top: '+=' + (event.pageY - lastY) + 'px'});
        // $('#project-1').css({transform: '= scale(' + getScale('project-1') + ')'});
        // $('#project-2').css({transform: '+= scale(' + getScale('project-2') + ')'});
        // $('#project-3').css({transform: '+= scale(' + getScale('project-3') + ')'});

        lastY = event.pageY;
    });
    // reset stuff when mouseup
    $('.projects-panel').mouseup(() => {
        // stop the mouse move event
        $('.projects-panel').off("mousemove");
        // reset transition time
        $('.project-pane').css({transition: "0.75s"});
    }); 
});

$('.projects-panel').mouseup((event) => {
    $('.project-pane').css({transition: "0.75s"});

    //Check if the mouse up event is for a click or drag
    if(new Date() - panelClickTime < 150) {
        //it is a click

        var arrayId = event.target.id.split("-")[1] - 1;

        if(!isNaN(arrayId)) {
            snapTo(arrayId);
        }
        return;
    }

    //it is a drag
    var ele = document.getElementById(panesArray[0]).getBoundingClientRect();
    var center = ele.top + ((ele.bottom - ele.top) / 2);
    var least = Math.abs(center - pageCenter);
    var elementId = 0;
    for(var i in panesArray) {
        ele = document.getElementById(panesArray[i]).getBoundingClientRect();
        center = ele.top + ((ele.bottom - ele.top) / 2);
        if (Math.abs(center - pageCenter) < least) {
            least = Math.abs(center - pageCenter);
            elementId = i;
        }
    }
    snapTo(elementId);    
});

$(document).ready(function () {
    // loadJson();
    loadJsonLocal();
    setupPanes();
});


// this is ghetto solution for local testing, revert to actually loading the file later
function loadJsonLocal() {
    projectData = {
        "Riot-API": {
            "Title": "Riot Games API Challenge",
            "Techs": ["NodeJS", "HTML", "CSS", "Javascript", "MySQL", "Heroku"],
            "Description": "This project was done at the end of 2017 for the Riot Games API Challenge. The challenge was to create a tool that would help introduce new players to some of the newer features in the game using Riot Games' API. Me and my partner created a two-part website. The first part was to analyze top players games and how they used these new features. We then used this data to help newer players find more optimal uses of these features. The other part was a more in-depth teaching section where we detailed what these new features do and the strategy behind when and why they are good. We finished second in our category."
        },
        "Earlebot": {
            "Title": "Earle-Bot",
            "Techs": ["NodeJS", "Discord"],
            "Description": "This project is a bot for a popular social chat program (Discord). It reads the text messages that are sent in the chat and if they are sent in a specific format, in this case preceded by a percent(%), then they would be interpreted as a command. Using this any user can feed commands to my bot and have it do various tasks. Some of these tasks include playing music, searching imgur and reddit, as well as rolling a dice amoung other things. This was originally an earlier project of mine to help me get more familer with Node.js and since I have restarted on this project trying to integrate some of the better programming habits that I have picked up since my first version. "
        },
        "Profile-Site": {
            "Title": "Profile Site",
            "Techs": ["Github Sites", "CSS", "Javascript", "HTML"],
            "Description": "Hey look! It's this site. I made this site hoping to impresses someone who might be looking at this site with my web skills. Hopefully I succeceded, maybe not. If I did it would be great if you could let me know. Similarly if my website falls flat I would be appreciative if you let me know where exactly I went wrong. My design sense isn't the best and I am always learning so if you could help me I would love that. I built this site on HTML, CSS and JS using jQuery. I did not use any website builder like Wix or Wordpress."
        }
    }
}