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

    var scale = 0.9;
    // set panes above it
    for(var i = focusedPaneId + 1; i < panesArray.length; i ++) {
        pane = document.getElementById(panesArray[i]);
        pane.style.top = '50%';
        pane.style.transform = 'translateY(-' + (paneHeight * (i - focusedPaneId)) + 'px) translateY(-50%) scale(' + getScale(panesArray[i]) + ') ';
    }

    // set panes below it
    for(var i = focusedPaneId - 1; i >= 0; i --) {
        pane = document.getElementById(panesArray[i]);
        pane.style.top = '50%';
        pane.style.transform = 'translateY(' + (paneHeight * (focusedPaneId - i)) + 'px) translateY(-50%) scale(' + getScale(panesArray[i]) + ') ';
    }
}

function getScale(elementId) {
    var ele = document.getElementById(elementId).getBoundingClientRect();
    var center = ele.top + ((ele.bottom - ele.top) / 2);

    var diff = Math.abs(center - pageCenter);
    

    var t = 0.1 / ((diff + 100) / 1000)
    return t * 1.1;
}

setupPanes();

$('#project-3').click(() => {
    // snapTo(1);
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
        $('#project-1').css({transform: '+= scale(' + getScale('project-1') + ')'});
        $('#project-2').css({transform: '+= scale(' + getScale('project-2') + ')'});
        // $('#project-3').css({transform: 'scale(' + getScale('project-3') + ')'});

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

