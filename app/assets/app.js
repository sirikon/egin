let myapp = {
    myfunction : function () { document.getElementById('info').innerHTML = NL_NAME + " is running on port " +
                    NL_PORT + " inside " + NL_OS + "<br/><br/>" + "<span>v" + NL_VERSION + "</span>"; }
};
    

Neutralino.init({
    load: function() {
        myapp.myfunction();
    },
    pingSuccessCallback : function() {

    },
    pingFailCallback : function() {

    }
});
