<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.0/js/foundation.min.js'></script>
<script src="../SiteAssets/js/daypilot-all.min.js"></script>

    
<link rel="stylesheet" href="../SiteAssets/css/main.css">
<link rel="stylesheet" href="../SiteAssets/css/Notifications.css">
<link rel="stylesheet" href="../SiteAssets/css/CorNotification.css">
<link rel="stylesheet" href="../SiteAssets/css/Tabs.css">

<!-- Loading Div -->
<div id="overlayLoading"><img src="../SiteAssets/css/loading.svg"></div> 

<!-- Div for all the schedule stff -->
<div class="tab-wrap">

    <!-- Div for the navigation buttons -->
    <div style= "height: 40px; text-align: center;">
      
        <button type="button"   class = "NavButton" id="previous" >Previous</button>
        <button type="button"  class = "NavButton" id="today" >Current Month</button>
        <button type="button"  class = "NavButton" id="next" > Next </button>
    
    </div>


    <div id="dp"></div>


    <!-- Div for admin buttons -->
   <div style= "height: 40px; text-align: center;">

        <button type="button"  class = "NavButton" id="btnSave" >Save Draft</button>
        <button type="button"  class = "NavButton" id="btnPublish" >Publish Schedule</button>
        <button type="button"  class = "NavButton" id="btnCount" >Count Hours</button>
        <button type="button"  class = "NavButton" id="btnCheck" >Check Schedule</button>

    </div>
    </br>
    
</div>


<h2>Here you can manage Overtimes and preferences:</h2>
<!-- div Tabs for the OT and preferences-->
<div class="tab-wrap Flexedthingy">


    <input type="radio" id="tab1" name="tabGroup1" class="tab" checked>
    <label for="tab1">OverTime</label>

    <input type="radio" id="tab2" name="tabGroup1" class="tab">
    <label for="tab2">Preferences</label>

    <div class="tab__content">
    <button type="button" name="Show"  class = "NavButton" id="btnShow" > Show your OverTime</button>
    <div id="divListItems"></div>
    </div>

    <div class="tab__content">
    Preferences 
    </div>


</div>
      

<script  src="../SiteAssets/js/CorNotification.js"></script>
<script  src="../SiteAssets/js/Notifications.js"></script>   
<script src="../SiteAssets/js/AdminView.js"></script>




