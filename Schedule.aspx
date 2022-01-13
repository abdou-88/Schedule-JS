<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.0/js/foundation.min.js'></script>
<script src="../SiteAssets/js/daypilot-all.min.js"></script>

    
<link rel="stylesheet" href="../SiteAssets/css/main.css">
<link rel="stylesheet" href="../SiteAssets/css/Notifications.css">
<link rel="stylesheet" href="../SiteAssets/css/CorNotification.css">
<link rel="stylesheet" href="../SiteAssets/css/Tabs.css">
<link rel="stylesheet" href="../SiteAssets/css/fv.css" type="text/css" />


<!-- The Loading Div-->
<div id="overlayLoading"><img src="../SiteAssets/css/loading.svg"></div> 

<!-- Div for all the schedule stff -->
<div class="tab-wrap">
  
  <!-- Navigation Buttons-->
  <div style= "height: 40px; text-align: center;">
    
    <button type="button"   class = "NavButton" id="previous" >Previous</button>

    <button type="button"  class = "NavButton" id="today" >Current Month</button>

    <button type="button"  class = "NavButton" id="next" > Next </button>

  </div>

  <!-- Main Schedule Div-->
  <div id="dp"></div>

  </br>

  <!-- Schedule color information-->
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td class="Shiftcolors"><span class="Spancolor pto" >&nbsp;</span>PTO</td>
        <td class="Shiftcolors"><span class="Spancolor BNholiday" >&nbsp;</span>Holiday OFF</td>
        <td class="Shiftcolors"><span class="Spancolor Unshift" >&nbsp;</span>Unusual shift</td>
        <td class="Shiftcolors"><span class="Spancolor ScikLeave" >&nbsp;</span>Sick Leave</td>
      </tr>
    </tbody>
  </table>
  </br>
</div>
  
<!----------------------------------------------------------------------->

<h2>Here you can submit your Over Time, Preferences and PTO requests:</h3>
<!-- div Tabs for the OT, preferences and PTO-->
<div class="tab-wrap Flexedthingy" style="display: none;">


    <input type="radio" id="tab1" name="tabGroup1" class="tab" >
    <label for="tab1">OverTime</label>

    <input type="radio" id="tab2" name="tabGroup1" class="tab" checked>
    <label for="tab2">Preferences</label>

    <input type="radio" id="tab3" name="tabGroup1" class="tab" >
    <label for="tab3">PTO Request</label>

    <div class="tab__content">
    </br>
      <div class="Prefcontainer">

        <div class="ShiftsArea">
          <button type="button" name="Show"  class = "NavButton" style = "width: 100%;" id="btnShow" > Show your OT</button>
          <div id="divListItems"></div>

        </div>
        
        <div class="FormAres">
          		
          	<form id = "OTForm" action="" method="post" novalidate>
              <fieldset>
                <div class="field">
                  <label>
                    <span>Analyst Name :</span>
                    <input id="txtAnalyst"  name="txtAnalyst" placeholder="EX: Youssfi, Abi" required="required" />
                  </label>
                  <div class='tooltip help'>
                    <span>?</span>
                    <div class='content'>
                      <b></b>
                      <p>This should be highlighted automatically, in case not, then contact Abi :D</p>
                    </div>
                  </div>
                </div>
              
                <div class="field">
                  <label>
                    <span>Date :</span>
                    <input id="txtFrom" placeholder="EX: MM/DD/YYYY" class='date' type="date" name="date" required='required'>
                  </label>
                  <div class='tooltip help'>
                    <span>?</span>
                    <div class='content'>
                      <b></b>
                      <p>If you are using IE please enter the date in the format MM/DD/YYYY</p>
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label>
                    <span>Time</span>
                    <input id="txtTo" placeholder="EX: 10 : 00 PM" class='time' type="time" name="txtTo" required='required'>
                    <div class='tooltip help'>
                    <span>?</span>
                    <div class='content'>
                      <b></b>
                      <p>If you are using IE please enter the Time in the format HH:MM PM/AM</p>
                    </div>
                  </div>
                  </label>
                </div>

                <div class="field">
                  <label>
                    <span>Number of hours :</span>
                    <input id="txtOThours" placeholder="EX: 1 or 1.5" type="number" class='number' name="number" data-validate-minmax="0,12" required='required'>
                  </label>
                  <div class='tooltip help'>
                    <span>?</span>
                    <div class='content'>
                      <b></b>
                      <p>If you are using IE please enter just the number of hours without any characters </p>
                    </div>
                  </div>
                </div>
              
                <div class="field">
                  <label>
                    <span>Comment :</span>
                    <textarea required='required' id="txtCmt" name='message'></textarea>
                  </label>
                  <div class='tooltip help'>
                    <span>?</span>
                    <div class='content'>
                      <b></b>
                      <p>Please add a comment explaining why you did this OT, and if this was approved by you TL</p>
                    </div>
                  </div>
                </div>
                
              </fieldset>
              <fieldset>
                <p>
                  Here abi thinking to tell you something :P but still doesnt know what
                </p>
                <input name="somethingHidden" required="required" type="text" style='display:none' />
              </fieldset>
              <button type='button' id="btnAddOT" >Submit</button>
              <button type='reset'>Reset</button>
			      </form>
		
        </div>
       </div> 

    </div>

    <div class="tab__content">
      </br>
      <div class="Prefcontainer">


        <div class="ShiftsArea">
          <img style = "max-width: 90%; max-height:100%; display: block;" src= "../SiteAssets/img/shiftslist.JPG" >
        </div>
        
        <div class="FormAres">
          		
          <form id = "PrefForm" action="" method="post" novalidate>
            <fieldset>
              <div class="field">
                <label>
                  <span>Analyst Name :</span>
                  <input  id="txtAnalystPref"  name="name" required="required" />
                </label>
                <div class='tooltip help'>
                  <span>?</span>
                  <div class='content'>
                    <b></b>
                    <p>This should be highlighted automatically, in case not, then contact Abi :D</p>
                  </div>
                </div>
              </div>
              
              <div class="field">
                <label>
                  <span>My preferred shifts :</span>
                  <!--<input required="required" type="text" pattern='\d+' />-->
                  <input id="txtPrefShit" type="text" required="required" placeholder="EX: 1,2,3,4,5,6"  />
                </label>
                <div class='tooltip help'>
                  <span>?</span>
                  <div class='content'>
                    <b></b>
                    <p>Please refer to the shifts number shown in the schedule beside, type N/A if nothing</p>
                  </div>
                </div>
              </div>

              <div class="field">
                <label>
                  <span>Shifts I really can’t work this month :</span>
                  <!--<input required="required" type="text" pattern='\d+' />-->
                  <input id="txtNotPrefShit" type="text" required="required" placeholder="EX: 1,2,3,4,5,6"  />
                </label>
                <div class='tooltip help'>
                  <span>?</span>
                  <div class='content'>
                    <b></b>
                    <p>Please refer to the shifts number shown in the schedule beside, type N/A if nothing</p>
                  </div>
                </div>
              </div>

              <div class="field">
                <label>
                  <span>PTO :</span>
                  <!--<input required="required" type="text" pattern='\d+' />-->
                  <input id="txtPTO" type="text" placeholder="EX: 1st to 5th"  />
                </label>
                <div class='tooltip help'>
                  <span>?</span>
                  <div class='content'>
                    <b></b>
                    <p>Dates (even if already approved)</p>
                  </div>
                </div>
              </div>

              <div class="field">
                <label>
                  <span>Day(s) Off in place of :</span>
                  <input id="txtDaysOff" type="text" placeholder="The 2nd of June"  />
                </label>
                
              </div>
              
              <div class="field">
                <label>
                  <span>Comment :</span>
                  <textarea id="txtCmtPref" name='message'></textarea>
                </label>
                <span class='extra'>(optional)</span>
              </div>

            </fieldset>

            <fieldset>
              <p>
                This Option will be activated from the <b>5th</b> to the <b>15th</b> of each month :) 
              </p>
              
            </fieldset>
            <button type="button" name="subPref"  id="btnSubPref" > Submit </button>
            <button type="button" name="resetPref"  id="btnresetPref">Reset</button>
          </form>
		
        </div>
        
      </div>


    </div>

    <div class="tab__content">
      </br>
      <div class="Prefcontainer">

        Coming soon :D 
        
      </div>


    </div>

</div>
          
   

<script  src="../SiteAssets/js/CorNotification.js"></script>
<script  src="../SiteAssets/js/Notifications.js"></script>   
<script src="../SiteAssets/js/validator.js"></script>
<script src="../SiteAssets/js/AnalystView.js"></script>


