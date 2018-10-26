//User set vars
var numbOfPanes = 3;

// global vars
var paneHeight, paneWidth, screenHeight, paneSpacing, pageCenter;
var panesArray = [];

function setupPanes() {
    var temp = document.getElementById("projects-panel").getBoundingClientRect();
    pageCenter = temp.top + ((temp.bottom - temp.top) / 2);
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

setupPanes();

$('.project-pane').click((event) => {
    snapTo(event.target.id.split("-")[1] - 1);
    console.log(event.target.id.split("-")[1]);
});

// drag
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

