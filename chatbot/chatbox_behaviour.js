//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions


var botMessage = "";
var botName = 'Callista';
var COLOR_SCHEME_DEFAULT = 1;
var COLOR_SCHEME_TERMINAL = 2;
var displayPresentationInfo = false;
var KEYWORD_KEY_IN_STORAGE = "keywords";
var lastUserMessage = "";
var LINK_COLOR_DEFAULT = "blue";
var LINK_COLOR_TERMINAL = "green";
var LABEL_CALLISTA = "Callista: ";
var LABEL_NOTIS = "Notis: ";
var LABEL_PRESENTATION = "Presentation: ";
var LABEL_TEKNIK = "Teknik: ";
var presentationLinks = [];
var SPAN_BEGINNING = '<span>';
var SPAN_END = '</span>';
var SPAN_PRESENTATION_BEGINNING = '<span class="ce-presentation-tag">';
var talking = false;
var usedLinkColor = LINK_COLOR_DEFAULT;


//////////////////////////////////////////////////
//////////       Trigger and Main       //////////
//////////////////////////////////////////////////
document.onkeydown = keyPress;
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);

  if (key == 13 || key == 3) {
    newUserRequest();
  } else if (key == 38) {
        getLastUserRequest();
  } else if (key == 40) {
        clearLastUserRequest();
  }
}

function getLastUserRequest() {
    document.getElementById("chatbox").value = lastUserMessage;

    var input = document.getElementById('chatbox');
    setCaretPosition(input, input.value.length);
    //moveCursorToEnd(document.getElementById("chatbox"));
}

function clearLastUserRequest() {
    document.getElementById("chatbox").value = "";
}

function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange == "undefined") {  //!=
        el.focus();
        var range = el.createTextRange();
        range.collapse(true);  //false
        range.select();
    }
}

function setCaretPosition(ctrl, pos) {
  // Modern browsers
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);

  // IE8 and below
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

function newUserRequest() {
    if (document.getElementById("chatbox").value != "") {
        lastUserMessage = document.getElementById("chatbox").value;
        lastUserMessage = lastUserMessage.trim();
        document.getElementById("chatbox").value = "";

        if (chatboxCommand(lastUserMessage) == true) {
            if (lastUserMessage != "cmd") {
                document.getElementById("conversation").scrollTop = document.getElementById("conversation").scrollHeight;
            }
        } else {
            getResponseFromChatbot();
            var parsedBotMessage = JSON.parse(botMessage);

            Speech(extractContent(parsedBotMessage.messages[0].label));
            document.getElementById("conversation").innerHTML += "<br>Du: " + lastUserMessage+"<br>";
            displayBotMessages(parsedBotMessage);
            displayTeasers(parsedBotMessage);
            if (lastUserMessage == "help") {
                displayCommandInfo();
            }
        }
    }
}

function getResponseFromChatbot() {
    usermessagelowercase = lastUserMessage.toLowerCase();
    botMessage = callChatBot(nodeurl,usermessagelowercase);
}
//////////////////////////////////////////////////
//////////////////////////////////////////////////
function saveResponseInStorage(key,value) {
    localStorage[key] = value;
}
function updateKeywordListInStorage(keyword) {
    var keywordListExists = localStorage.hasOwnProperty(KEYWORD_KEY_IN_STORAGE);
    if (keywordListExists == true) {
        keywordList = localStorage[KEYWORD_KEY_IN_STORAGE] + "," + keyword;
    } else {
        keywordList = keyword;
    }
    localStorage[KEYWORD_KEY_IN_STORAGE] = keywordList;
}
function getStorageSize() {
    var storageSize = parseInt(localStorage.length);
    return storageSize;
}

function getSortedlResponsesFromStorage() {
    var localStorageContent = "";
    var keywordList = localStorage[KEYWORD_KEY_IN_STORAGE];
    var keywordArray = keywordList.split(',');
    for (var i = 0; i < keywordArray.length; i++) {
        for (var j = 1; j < localStorage.length; j++) {
            var localStorageKey = keywordArray[i]+"-"+j.toString();
            if (localStorage[localStorageKey] != null) {
                //localStorageContent += localStorageKey + ": " + localStorage[localStorageKey] + "\n\n";
                localStorageContent += localStorage[localStorageKey] + " ";
            } else {
                break;
            }
        }
    }
    return localStorageContent;
}
function clearStorage() {
    localStorage.clear();
    document.getElementById("conversation").innerHTML = "";
    document.getElementById("conversation").innerHTML += "Webbläsarens localStorage är nu tömt.";

}

function displayBotMessages(parsedBotMessage) {
    var keyword = "";
    var keyword_number = 1;
    for (var i = 0; i < parsedBotMessage.messages.length; i++) {
        if (i == 0) {
            var thisMessage = "<b>" + botName + ":</b> " + parsedBotMessage.messages[i].label + "<br>";
            document.getElementById("conversation").innerHTML += thisMessage;
            if (parsedBotMessage.messages[i].label.startsWith("Varsågod") && hasLocalStorage == true) {
                keyword = parsedBotMessage.messages[i].label.split(" ").pop();
                updateKeywordListInStorage(keyword);

                keyword_number = 1;
                key = keyword + "-" + keyword_number.toString();
                value = thisMessage;
                saveResponseInStorage(key,value);
                keyword_number += 1;
            }
        } else {
            if (parsedBotMessage.messages[i].label != "") {
                if (parsedBotMessage.messages[i].label.startsWith("Varsågod") && hasLocalStorage == true) {
                    var thisMessage = "<b>" + botName + ":</b> " + parsedBotMessage.messages[i].label + "<br>";
                    document.getElementById("conversation").innerHTML += thisMessage;
                    keyword = parsedBotMessage.messages[i].label.split(" ").pop();
                    updateKeywordListInStorage(keyword);
                    keyword_number = 1;

                    key = keyword + "-" + keyword_number.toString();
                    value = thisMessage;
                    saveResponseInStorage(key,value);
                    keyword_number += 1;
                }
            }
            if (parsedBotMessage.messages[i].link != "") {
                var tempInnerHtml = SPAN_BEGINNING;
                if (getBloggCategory(parsedBotMessage.messages[i]) == LABEL_PRESENTATION) {
                    presentationLinks.push(linkCount+1);
                    if (displayPresentationInfo == true) {
                        tempInnerHtml += getBloggCategory(parsedBotMessage.messages[i]);
                    }
                }
                tempInnerHtml += parsedBotMessage.messages[i].link + "&nbsp;&nbsp;<i>(" +
                parsedBotMessage.messages[i].publisheddate + ")</i><br><br>" + SPAN_END;
                document.getElementById("conversation").innerHTML += tempInnerHtml;
                if (hasLocalStorage == true) {
                    key = keyword + "-" + keyword_number.toString();
                    value = tempInnerHtml;
                    saveResponseInStorage(key,value);
                    keyword_number += 1;
                }
                Speech(extractContent(parsedBotMessage.messages[i].link));
                setLinkColor(linkCount);
                linkCount++;
            }
        }
    }
    document.getElementById("conversation").scrollTop = document.getElementById("conversation").scrollHeight;
}

function displayBotMessagesFromStorage() {
    var storedMessages = getSortedlResponsesFromStorage();
    var storedMessagesArray = storedMessages.split("<span>");
    document.getElementById("conversation").innerHTML = "";
        for (var i = 0; i < storedMessages.length; i++) {
            if (storedMessagesArray[i].length > 0) {
                document.getElementById("conversation").innerHTML += storedMessagesArray[i];
            }
        }
}

function displayHelpInfo() {
    botMessage = callChatBot(nodeurl,"help");
    var parsedBotMessage = JSON.parse(botMessage);
    displayBotMessages(parsedBotMessage);
    displayCommandInfo();
}

function displayCommandInfo() {
    document.getElementById("conversation").innerHTML += "<br><b><i>Chatbot-kommandon:</b><br>" +
    "cmd &nbsp;&nbsp; Visar vilka kommandon som stöds av chatboten<br>" +
    "color-1 eller c1 &nbsp;&nbsp; Standard-utseende aktiverat<br>" +
    "color-2 eller c2 &nbsp;&nbsp; Terminal-utseende aktiverat<br>" +
    "default &nbsp;&nbsp; Visar chatboxen med standardinställningar<br>" +
    "pres+ &nbsp;&nbsp; Visar vilka listade bloggar som innehåller presentationer<br>" +
    "pres- &nbsp;&nbsp; Döljer vilka listade bloggar som innehåller presentationer<br>" +
    "<br>" +
    "Tangentkommandon:<br>" +
    "pil-upp &nbsp;&nbsp; Lägger den senaste inmatningen i inmatningsfältet<br>" +
    "pil-ner &nbsp;&nbsp; Tömmer inmatningsfältet</i><br>";
    document.getElementById("conversation").scrollTop = document.getElementById("conversation").scrollHeight;
}

function displayTeasers(parsedBotMessage) {
    document.getElementById("eventAbout").style.display = "none";
    document.getElementById("eventTeaser").style.display = "none";
    document.getElementById("linkTeaser").style.display = "none";
    for (var i = 0; i < parsedBotMessage.teasers.length; i++) {
        if (parsedBotMessage.teasers[i].teaserCategory == "About") {
            document.getElementById("eventAbout").innerText = parsedBotMessage.teasers[i].teaserTitle;
            document.getElementById("eventAbout").href = parsedBotMessage.teasers[i].teaserURL;
            document.getElementById("eventAbout").style.display = "initial";
        }
        if (parsedBotMessage.teasers[i].teaserCategory == "Event") {
            document.getElementById("eventTeaser").innerText = parsedBotMessage.teasers[i].teaserTitle;
            document.getElementById("eventTeaser").href = parsedBotMessage.teasers[i].teaserURL;
            document.getElementById("eventTeaser").style.display = "initial";
        }
        if (parsedBotMessage.teasers[i].teaserCategory == "Link") {
            document.getElementById("linkTeaser").innerText = parsedBotMessage.teasers[i].teaserTitle;
            document.getElementById("linkTeaser").href = parsedBotMessage.teasers[i].teaserURL;
            document.getElementById("linkTeaser").style.display = "initial";
        }
    }
}

function chatboxCommand(userInput) {
    commandExecuted = false;
    switch (userInput.toLowerCase()) {
        case "cmd":
            displayCommandInfo();
            commandExecuted = true;
            break;
        case "c1":
            terminalLayout = false;
            commandExecuted = true;
            setColorScheme(COLOR_SCHEME_DEFAULT);
            break;
        case "color-1":
            terminalLayout = false;
            commandExecuted = true;
            setColorScheme(COLOR_SCHEME_DEFAULT);
            break;
        case "c2":
            terminalLayout = true;
            commandExecuted = true;
            setColorScheme(COLOR_SCHEME_TERMINAL);
            break;
        case "color-2":
            terminalLayout = true;
            commandExecuted = true;
            setColorScheme(COLOR_SCHEME_TERMINAL);
            break;
        case "default":
            displayPresentationInfo = false;
            showOrHidePresentationLabels();
            talking = false;
            //terminalLayout = false;
            setColorScheme(COLOR_SCHEME_DEFAULT);
            commandExecuted = true;
            break;
        case "pres+":
            displayPresentationInfo = true;
            showOrHidePresentationLabels();
            commandExecuted = true;
            break;
        case "pres-":
            displayPresentationInfo = false;
            showOrHidePresentationLabels();
            commandExecuted = true;
            break;
        case "speech+":
            talking = true;
            commandExecuted = true;
            break;
        case "speech-":
            talking = false;
            commandExecuted = true;
            break;
    }
    return commandExecuted;
}

function setLinkColor(linkIndex) {
    document.getElementById("conversation").getElementsByTagName("a")[linkIndex].style.color = usedLinkColor;
}

function setColorScheme(colorScheme) {
    switch (colorScheme) {
        case COLOR_SCHEME_DEFAULT:
            color = "white";
            document.getElementById("bodybox").style.backgroundColor = color;
            document.getElementById("bodybox").style.opacity = 1.0;
            document.getElementById("chatbox").style.backgroundColor = color;
            document.getElementById("chatbox").style.color = "black";
            //document.getElementById("useSpeech").style.color = "black";
            document.getElementById("chatborder").style.backgroundColor = color;
            document.getElementById("conversation").style.backgroundColor = color;
            document.getElementById("conversation").style.color = "black";
            document.getElementById("conversation").style.opacity = 1.0;
            usedLinkColor = LINK_COLOR_DEFAULT;
            for (var i= 0; i < linkCount; i++) {
                setLinkColor(i);
            }
            break;
        case COLOR_SCHEME_TERMINAL:
            color = "black";
            document.getElementById("bodybox").style.backgroundColor = color;
            document.getElementById("bodybox").style.opacity = 0.9;
            document.getElementById("chatbox").style.backgroundColor = color;
            document.getElementById("chatbox").style.color = "white";
            document.getElementById("chatborder").style.backgroundColor = color;
            document.getElementById("conversation").style.backgroundColor = color;
            document.getElementById("conversation").style.color = "white";
            document.getElementById("conversation").style.opacity = 0.9;
            usedLinkColor = LINK_COLOR_TERMINAL;
            for (var i= 0; i < linkCount; i++) {
                setLinkColor(i);
            }
            break;
        }
}

function getBloggCategory(botMessage) {
    var category = "";

    switch (botMessage.linkcategory) {
        case "callista":
            category = LABEL_CALLISTA;
            break;
        case "notiser":
            category = LABEL_NOTIS;
            break;
        case "presentationer":
            category = LABEL_PRESENTATION;
            break;
        case "teknik":
            category = LABEL_TEKNIK;
            break;
    }

    return category;
}

// 2do: add support for Callista, Notis and Teknik
function showOrHidePresentationLabels() {
    for (var i = 0; i < presentationLinks.length; i++) {
        if (displayPresentationInfo == true) {
            var index = presentationLinks[i] -1;
             document.getElementById("conversation").getElementsByTagName("span")[index].innerHTML =
                LABEL_PRESENTATION +
                document.getElementById("conversation").getElementsByTagName("span")[index].innerHTML;
        } else {
            var index = presentationLinks[i] -1;
            var newInnerHTML = document.getElementById("conversation").getElementsByTagName("span")[index].innerHTML
            newInnerHTML = newInnerHTML.replace(LABEL_PRESENTATION, '');
            document.getElementById("conversation").getElementsByTagName("span")[index].innerHTML = newInnerHTML;
        }
    }
}

function extractContent(content) {
  span = document.createElement('span');
  span.innerHTML = content;
  return span.textContent || span.innerText;
};

function speechUsage() {
    talking = document.getElementById("useSpeech").checked;
}

function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    //utterance.rate = 0.1; // 0.1 to 10
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    utterance.lang = 'sv'
    speechSynthesis.speak(utterance);
  }
}

function showHideChatbox() {
    if (document.getElementById("bodybox").style.display == "block") {
        document.getElementById("bodybox").style.display = "none";
        document.getElementById("chatborder").style.display = "none";
        document.getElementById("chatbox").style.display = "none";
    } else {
        document.getElementById("bodybox").style.display = "block";
        document.getElementById("chatborder").style.display = "block";
        document.getElementById("chatbox").style.display = "block";
    }
}

function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
  displayBotMessagesFromStorage();
}
