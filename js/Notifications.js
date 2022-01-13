var janelaPopUp = new Object();

janelaPopUp.abre = function(id, titulo, corpo,  textoCancelar, textoEnviar){

    var cancelar = (textoCancelar !== undefined)? textoCancelar: 'Cancel';
    var enviar = (textoEnviar !== undefined)? textoEnviar: 'Save';
    
    
  
   


    var popFundo = '<div id="popFundo_' + id + '" class="popUpFundo blue"></div>';

    var janela =
      '<div id="' +
      id +
      '" class="popUp p blue popUpEntrada"><h1>' +
      titulo +
      "</h1><div><span>" +
      corpo +
      "</span></div><button class='puCancelar ' id='" +
      id +
      "_cancelar' data-parent=" +
      id +
      ">" +
      cancelar +
      "</button><button class='puEnviar ' data-parent=" +
      id +
      " id='" +
      id +
      "_enviar'>" +
      enviar +
      "</button></div>";

    $("window, body").css('overflow', 'hidden');
    
    $("body").append(popFundo);
    $("body").append(janela);
    

     //alert(janela);

    $("#popFundo_" + id).fadeIn("fast");

   

    $("#" + id + '_cancelar').on("click", function(){
       
            janelaPopUp.fecha(id);
            
        
    });

    $("#" + id + '_enviar').on("click", function(){
        
            janelaPopUp.fecha(id);

            // saving schedule function from adminView.js file
            SaveSchedule(
              dp.events.list,
              dp.resources,
              dp.startDate.value.substring(0, 7),
              "ScheduleNotPub"
            );
           
        
    });
    
    
};

janelaPopUp.fecha = function(id){
    
        $("#" + id).removeClass("popUpEntrada").addClass("popUpSaida"); 
        
            $("#popFundo_" + id).fadeOut(1000, function(){
                $("#popFundo_" + id).remove();
                $("#" + $(this).attr("id") + ", #" + id).remove();
                if (!($(".popUp")[0])){
                    $("window, body").css('overflow', 'auto');
                }
            });
            
         
}



