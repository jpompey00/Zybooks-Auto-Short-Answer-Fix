function solveAll() {
    solveAnimations();
    solveMultipleChoice();
    solveShortAnswer();
}

function nextPage() {
    let nextBtn = document.getElementsByClassName('nav-text next');
    if (nextBtn.length > 0) {
        nextBtn[0].click();
    }
}

function getStatus() {
    let status = document.querySelectorAll('div.activity-title-bar > div.activity-description > div.title-bar-chevron-container > div');
    let res = true;
    for (const s of status) {
        let question = s.parentElement.parentElement.parentElement.parentElement;
        try
        {
            if (question.children[1].children[1].children[1].className.includes('draggable')) 
                continue;
        }
        catch (e) {}
        if (s.ariaLabel != 'Activity completed') {
            res = false;
            break;
        }
    }
    return res;
}

function solveAnimations() {
    for (const doubleSpeedBtn of document.querySelectorAll('[aria-label="2x speed"]'))
        doubleSpeedBtn.click()
    for (const startBtn of document.getElementsByClassName("start-button"))
        startBtn.click();

    setInterval(function () {
        if (document.getElementsByClassName("play-button").length > 0) {
            let playBtns = document.getElementsByClassName('play-button')
            for (let i = 0; i < playBtns.length; i++) {
                if (!playBtns[i]
                    .className
                    .replace(/\s+/g, ' ')
                    .split(' ')
                    .includes('rotate-180')) {
                    playBtns[i].click();
                }
            }
        }
    }, 1500);
}

function solveMultipleChoice() {
    let i = 0;
    let mc = document.querySelectorAll('input[type=radio]');
    setInterval(() => {
        if (i < mc.length) {
            mc[i].click();
            i++;
        }
    }, 300);
}

function solveShortAnswer() {
    console.log(document.getElementsByClassName('show-answer-button'));
    for (const answerBtn of document.getElementsByClassName('show-answer-button')) {
        setTimeout(() => answerBtn.click(), 300);
        setTimeout(() => answerBtn.click(), 300);
    }

    setTimeout(() => {
        let answers = document.getElementsByClassName('forfeit-answer');
        let answerBoxes = document.getElementsByClassName('zb-text-area');

        //start of my addition
       let answersModified = [];

        //Some of the answers when it comes to small programming questions would have the elements
        //like "answer" or "answer"
        //The code before did not have catches for that
        //This block loops through the answers elements and if the answer is not preceeded by or
        //or is null then it will add them to the new list which only has the valid answers
        for(let i = 0; i < answers.length; i++){
            if(answers[i].previousElementSibling == null ||
                answers[i].previousElementSibling.innerHTML !==  "or" ){
                   answersModified.push(answers[i]);
            }
        }


        //changed the condiion from answers.length to answersModified.length because they are not always 1 to 1
        //for reasons explained in around line 80
        for (let i = 0; i < answersModified.length; i++) {
            setTimeout(() => answerBoxes[i].focus(), 1000);
            setTimeout(() => answerBoxes[i].select(), 1000);

            setTimeout(() => {
                
                //the "typos" are replaced and returned and set as the answerbox values
                answerBoxes[i].value = lookForTypos(answersModified[i].innerHTML);
                
                
                answerBoxes[i].dispatchEvent(new Event('input', {bubbles: true}));
            }, 1000);
        }

        for (const checkBtn of document.getElementsByClassName('check-button')) {
            setTimeout(() => checkBtn.click(), 1000);
            setTimeout(() => checkBtn.click(), 1000);
        }
    }, 1000);
}


//The html was replacing the answer with HTML characters "&amp &lt &gt"
//So i've had those replaced with their correct characters and the result
//returned
function lookForTypos(answer) {
    let answerInnerHtml = answer;


        if (answerInnerHtml.includes("&amp;")) {
            answerInnerHtml = answerInnerHtml.replaceAll("&amp;", "&");
            console.log("& replaced " + answerInnerHtml);
        }
        if (answerInnerHtml.includes("&lt;")) {
            answerInnerHtml = answerInnerHtml.replaceAll("&lt;", "<");
            console.log("< replaced " + answerInnerHtml);
        }
        if (answerInnerHtml.includes("&gt;")) {
            answerInnerHtml = answerInnerHtml.replaceAll("&gt;", ">");
            console.log("> replaced " + answerInnerHtml);
        }
        console.log("answerInnerHtml: " + answer);
        console.log("replaced answer: " + answerInnerHtml );

    return answerInnerHtml;
}
//end of my addition 05/09



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.message) {
            case "solveAuto":
                console.log("Solving automatically");
                solveAll();
                setInterval(() => {
                    if (getStatus()) {
                        nextPage();
                        setTimeout(() => solveAll(), 1000);
                    }
                }, 1000);
                break;
            case "solveAll":
                solveAll();
                break;
            case "solveAnimations":
                solveAnimations();
                break;
            case "solveMC":
                solveMultipleChoice();
                break;
            case "solveSA":
                solveShortAnswer();
                break;
            default:
                console.log("Unknown message: " + request.message);
        }
    }
);