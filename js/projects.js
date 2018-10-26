//User set vars
var numbOfPanes = 3;

// global vars
var paneHeight, paneWidth, screenHeight, paneSpacing, pageCenter;
var panesArray = [];
var projectData;

function loadJson() {
    $.getJSON("../static/projectsData.json", {callback: "?"} , function( data ) {
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
    for(var i = focusedPaneId + 1; i < panesArray.length; i ++) {
        pane = document.getElementById(panesArray[i]);
        pane.style.top = '50%';
        pane.style.transform = 'translateY(-' + (paneHeight * (i - focusedPaneId)) + 'px) translateY(-50%) scale(' + getScale(panesArray[i]) + ') ';
        pane.style.boxShadow = "";
    }

    // set panes below it
    for(var i = focusedPaneId - 1; i >= 0; i --) {
        pane = document.getElementById(panesArray[i]);
        pane.style.top = '50%';
        pane.style.transform = 'translateY(' + (paneHeight * (focusedPaneId - i)) + 'px) translateY(-50%) scale(' + getScale(panesArray[i]) + ') ';
        pane.style.boxShadow = "";
    }
}

function displayText(elementId) {
    var ele = document.getElementById(elementId);
    var label = ele.getAttribute("data-ele");

}

function getScale(elementId) {
    var ele = document.getElementById(elementId).getBoundingClientRect();
    var center = ele.top + ((ele.bottom - ele.top) / 2);

    var diff = Math.max(Math.abs(center - pageCenter), 1);

    var t = 200 / diff;
    // console.log(diff);
    if(t < .8) t = 0.8;
    if(t > 1.2) t = 1.2;
    return 0.9;
}

// loadJson();


// clicking
$('.project-pane').click((event) => {
    snapTo(event.target.id.split("-")[1] - 1);
    console.log(event.target.id.split("-")[1]);
});

// drag ffs why is this so much harder than clicking
$('.projects-panel').mousedown((event) => {
    // enable mousemove event
    $('.projects-panel').on("mousemove");
    // set most recent Y position
    var lastY = event.pageY;
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
    var ele = document.getElementById(panesArray[0]).getBoundingClientRect();
    var center = ele.top + ((ele.bottom - ele.top) / 2);
    var least = Math.abs(center - pageCenter);
    for(var i in panesArray) {
        ele = document.getElementById(panesArray[i]).getBoundingClientRect();
        center = ele.top + ((ele.bottom - ele.top) / 2);
        if (Math.abs(center - pageCenter) < least) {
            least = Math.abs(center - pageCenter);
        }
    }
    
});

$(document).ready(function () {
    loadJson();
    setupPanes();
});