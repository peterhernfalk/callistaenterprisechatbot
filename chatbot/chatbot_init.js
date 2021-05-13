
function chatbotInit() {
    //-----Global script variables
    botId = "1";
    displayBlogCategories = false;
    linkCount = 0;
    nodeurl = getNodeUrl(botId);
    result = "";
    terminalLayout = false;
    hasLocalStorage = false;

    if (window['localStorage'] !== null) {
      hasLocalStorage = true;
    }

    //-----Initial settings
    //setLanguage(nodeurl+'/language', '46')
    document.getElementById("bodybox").style.display = "none";
    document.getElementById("chatborder").style.display = "none";
    document.getElementById("chatbox").style.display = "none";
    //document.getElementById("useSpeech").value = document.getElementById("useSpeech").checked;
    //talking = document.getElementById("useSpeech").checked;

    document.getElementById("eventAbout").style.display = "none";
    document.getElementById("eventTeaser").style.display = "none";
    document.getElementById("linkTeaser").style.display = "none";

    //-----textarea
    botOut = botChat.value;
    document.getElementsByTagName("textarea")[0] = botChat
}
