~(function anonymous(){
    function computed(){
        let HTML =document.documentElement,
            winW=HTML.clientWidth,
            desW=750;
        if(winW >= desW){
            HTML.style.fontSize ='100px';
            return;
        }

        HTML.style.fontSize = winW / 750 * 100 + 'px';
    }
    computed();
    window.addEventListener('resize', computed, false);
})();
