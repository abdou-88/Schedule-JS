var savedBol = "0";
var loginName = "";
var ScheduleListItem;
var month;



// setting up the Schedule and adding options
var dp = new DayPilot.Scheduler("dp");

dp.startDate = DayPilot.Date.today().firstDayOfMonth();
dp.cellGroupBy = "Month";
dp.days = dp.startDate.daysInMonth();
dp.scale = "Day";
dp.cellWidthSpec = "Auto";

dp.timeHeaders = [
  { groupBy: "Month", format: "MMMM yyyy" },
  { groupBy: "Day", format: "d" },
];

dp.treeEnabled = true;

dp.heightSpec = "Max";
dp.height = "Max";
dp.eventMovingStartEndEnabled = true;
dp.eventResizingStartEndEnabled = true;
dp.timeRangeSelectingStartEndEnabled = true;
dp.treePreventParentUsage = true;


// the main function to get data from Catalent sharepoint list
function retrieveScheduleData(TheMonth) {
  
  document.getElementById("overlayLoading").style.display = "block";

  month = TheMonth;
  SP.SOD.executeFunc('SP.js', 'SP.ClientContext',
    
    function(){

      var clientContext = new SP.ClientContext();
      var ScheList = clientContext
        .get_web()
        .get_lists()
        .getByTitle("ScheduleNotPub");
      var camlQuery = new SP.CamlQuery();
      ScheduleListItem = ScheList.getItems(camlQuery);
      clientContext.load(ScheduleListItem);

      clientContext.executeQueryAsync(
        Function.createDelegate(this, onRetrieveSucceeded),
        Function.createDelegate(this, onRetrieveFailed)
      );
        
            
      function onRetrieveSucceeded() {
        // getting the data of the schedule
        var listItemEnumerator = ScheduleListItem.getEnumerator();
        var found = "0";
        
        while (listItemEnumerator.moveNext() && found == "0") {
          var oListItem = listItemEnumerator.get_current();
          dp.events.list = [];

          if (oListItem.get_item("Month") == month) {
            dp.events.list = JSON.parse($(oListItem.get_item("data")).text());
            dp.resources = JSON.parse(
              $(oListItem.get_item("AnalystsData")).text()
            );
            found = "1";
          }
          
        }
        document.getElementById("overlayLoading").style.display = "none";
        
        // event creating
        dp.onTimeRangeSelected = function (args) {
          DayPilot.Modal.prompt("New Shift:", "14-22").then(function (modal) {
            dp.clearSelection();
            var name = modal.result;
            if (!name) return;
            var e = new DayPilot.Event({
              start: args.start,
              end: args.end,
              id: DayPilot.guid(),
              resource: args.resource,
              text: name,
            });
            dp.events.add(e);
            dp.message("The new shift has been added");
          });
          savedBol = "1";
        };

        //Creating Events menu context
        dp.contextMenu = new DayPilot.Menu({
          items: [
            {
              text: "Edit",
              onClick: function (args) {
                dp.events.edit(args.source);
                savedBol = "1";
              },
            },
            {
              text: "Delete",
              onClick: function (args) {
                dp.events.remove(args.source);
                savedBol = "1";
              },
            },
            { text: "-" },
            {
              text: "PTO Day",
              onClick: function (args) {
                var e = args.source;
                e.data.backColor =
                  "linear-gradient(to bottom, #eda99d  0%, red)";
                dp.events.update(e);
                savedBol = "1";
              },
            },
            {
              text: "Bank Holiday",
              onClick: function (args) {
                var e = args.source;
                e.data.backColor =
                  "linear-gradient(to bottom, #f1faaa  0%, yellow)";
                dp.events.update(e);
                savedBol = "1";
              },
            },
            {
              text: "Different Shift",
              onClick: function (args) {
                var e = args.source;
                e.data.backColor =
                  "linear-gradient(to bottom, #63d274  0%, #1fc600)";
                dp.events.update(e);
                savedBol = "1";
              },
            },
            {
              text: "Sick Leave",
              onClick: function (args) {
                var e = args.source;
                e.data.backColor =
                  "linear-gradient(to bottom, #FF8C00  0%, #FFA500)";
                dp.events.update(e);
                savedBol = "1";
              },
            },
            { text: "-" },
            {
              text: "New Starter",
              onClick: function (args) {
                var e = args.source;
                e.data.backColor =
                  "linear-gradient(to bottom, #ccffcc  0%, #fff)";
                dp.events.update(e);
                savedBol = "1";
              },
            },
          ],
        });

        // Creating Resources menu context
        dp.contextMenuResource = new DayPilot.Menu({
          items: [
            {
              text: "Edit...",
              onClick: function (args) {
                var row = args.source;
                DayPilot.Modal.prompt("Analyst name:", row.name).then(function (
                  args
                ) {
                  if (!args.result) {
                    return;
                  }
                  row.data.name = args.result;
                  dp.update();
                  dp.message("The analyst name has been changed");
                });
                savedBol = "1";
              },
            },
            {
              text: "Delete",
              onClick: function (args) {
                var row = args.source;
                dp.rows.remove(row);
                dp.message("Deleted");
                savedBol = "1";
              },
            },
            {
              text: "-",
            },
            {
              text: "Add Child...",
              onClick: function (args) {
                var row = args.source;
                DayPilot.Modal.prompt("Analyst name:", "").then(function (
                  args
                ) {
                  if (!args.result) {
                    return;
                  }
                  if (!row.data.children) {
                    row.data.children = [];
                    row.data.expanded = true;
                  }
                  row.data.children.push({
                    name: args.result,
                    id: DayPilot.guid(),
                  });
                  dp.update();
                });
                savedBol = "1";
              },
            },
          ],
        });

        // Copy event
        dp.onEventMove = function (args) {
          if (args.ctrl) {
            var newEvent = new DayPilot.Event({
              start: args.newStart,
              end: args.newEnd,
              text: "" + args.e.text(),
              resource: args.newResource,
              id: DayPilot.guid(), // generate random id
            });
            dp.events.add(newEvent);

            // notify the server about the action here

            args.preventDefault(); // prevent the default action - moving event to the new location
          }
          if (args.areaData === "event-copy") {
            dp.events.add(
              new DayPilot.Event({
                start: args.newStart,
                end: args.newEnd,
                resource: args.newResource,
                id: DayPilot.guid(),
                text: "" + args.e.text(),
              })
            );
            args.preventDefault();
            savedBol = "1";
          }
        };

        // the copy event icon creation
        dp.onBeforeEventRender = function (args) {
          args.data.areas = [
            {
              right: 2,
              bottom: 2,
              width: 16,
              height: 16,
              backColor: "#fff",
              style:
                "box-sizing: border-box; border-radius: 7px; padding-left: 3px; border: 1px solid #ccc;font-size: 14px;line-height: 14px;color: #999;",
              html: "&raquo;",
              toolTip: "Copy",
              action: "Move",
              data: "event-copy",
            },
          ];
          //for(const event of args) {
          //GetEventsOfRow(event.id)
          // console.log(args.data);
          // };
        };

        // adding the hours count color div
        dp.onBeforeResHeaderRender = function (args) {

          if (args.resource.id != "G1" && args.resource.id != "G2") {
            args.resource.html =
              "<div class= 'hourscounterdiv' id= " +
              args.resource.id +
              "></div>" +
              args.resource.name;
            
          }
        };

        // adding the icon to move rows
        dp.rowMoveHandling = "Update";
        dp.onRowMoving = function () { savedBol="1";};

        //////////

        try {
          dp.init();
        } catch (err) {
          dp.update();
        }

      }

      function onRetrieveFailed(sender, args) {
        alert("Request failed. " + args.get_message() + "\n" + args.get_stackTrace());
      }

    }
  );
}




//Navigation buttons logic
var elements = {
  previous: document.getElementById("previous"),
  today: document.getElementById("today"),
  next: document.getElementById("next"),
  
};

elements.previous.addEventListener("click", function (e) {
  e.preventDefault();
  changeDate(dp.startDate.addMonths(-1));
});
elements.today.addEventListener("click", function (e) {
  e.preventDefault();
  changeDate(DayPilot.Date.today());
});
elements.next.addEventListener("click", function (e) {
  e.preventDefault();
  changeDate(dp.startDate.addMonths(1));
});




// function to change the month selected
function changeDate(date) {

  // we check if there is any change or not before moving to other month
  if (savedBol == "1") {

    janelaPopUp.abre(
      "SaveSch",
      "Catalent Schedule",
      "Do you want to save the changes you made to the schedule ?"
    );
  } 
  else {

    //change month
    dp.startDate = date.firstDayOfMonth();
    dp.days = dp.startDate.daysInMonth();
    retrieveScheduleData(date.value.substring(0, 7));

    dp.update();
  }
}




//save the schedule data
function SaveSchedule(ShiftsList, AnalystsList, themonth, Listname) {

  document.getElementById("overlayLoading").style.display = "block";

  var clientContext = SP.ClientContext.get_current();
  list = clientContext.get_web().get_lists().getByTitle(Listname);
  var skillcamlQuery = new SP.CamlQuery();

  skillcamlQuery.set_viewXml(
    "<View><Query><Where><Eq><FieldRef Name='Month' /><Value Type='Text'>" +
      themonth +
      "</Value></Eq></Where></Query></View>"
  );

  this.skillcollListItem = list.getItems(skillcamlQuery);

  clientContext.load(skillcollListItem);

  clientContext.executeQueryAsync(Function.createDelegate(this, function () {_returnParam = onSavingSucceeded();}),Function.createDelegate(this, function () {_returnParam = onSavingFailed();}));


  
  function onSavingSucceeded() {

    const Shifts = JSON.stringify(ShiftsList);
    const AnalystsOrder = JSON.stringify(AnalystsList);

    // if the month already exist - we update
    if (skillcollListItem.get_count() >= 1) {
      var listItemEnumerator = skillcollListItem.getEnumerator();

      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        if (oListItem.get_item("Month") == themonth) {
          oListItem.set_item("AnalystsData", AnalystsOrder);
          oListItem.set_item("data", Shifts);

          oListItem.update();
        }
      }
    }
    // if it is a new month - we add new item
    else {
      
      var listItemCreationInfo = new SP.ListItemCreationInformation();
      var newItem = list.addItem(listItemCreationInfo);

      newItem.set_item("Month", dp.startDate.value.substring(0, 7));
      newItem.set_item("AnalystsData", AnalystsOrder);
      newItem.set_item("data", Shifts);

      newItem.update();
    }

    clientContext.executeQueryAsync(
      Function.createDelegate(this, onSavedSuccess),
      Function.createDelegate(this, onSavedFailure)
    );



    function onSavedSuccess() {
        document.getElementById("overlayLoading").style.display = "none";
        savedBol = "0";
        alertify.set({ delay: 5000 });
        alertify.success("The schedule has been saved successfully");
        
    }

    function onSavedFailure(args) {

        alertify.set({ delay: 5000 });
        alertify.error("Something went wrong!!");
        return false;
    }

  }

  function onSavingFailed(sender, args) {
    alert(
      "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
    );
    return false;
  }

}
  



// get OT data from the SP list
var collListItem;

function retrieveListItems() {
var clientContext = new SP.ClientContext();
var oList = clientContext.get_web().get_lists().getByTitle('OverTime');
var camlQuery = new SP.CamlQuery();
collListItem = oList.getItems(camlQuery);
clientContext.load(collListItem);
clientContext.executeQueryAsync(
Function.createDelegate(this, this.onQuerySucceeded),Function.createDelegate(this, this.onQueryFailed)
);
}

function onQuerySucceeded(sender, args) {

var listItemInfo = '';
var listItemEnumerator = collListItem.getEnumerator();

while (listItemEnumerator.moveNext()) {

var oListItem = listItemEnumerator.get_current();
if(oListItem.get_item('Title') == loginName){
  listItemInfo += 
' <strong>Name:</strong> ' + oListItem.get_item('Title') +
' <strong>Date :</strong> ' + oListItem.get_item('_x006f_u81') +
' <strong>Time:</strong> ' + oListItem.get_item('_x006f_lr0') +
'<strong>amount of hours :</strong> ' + oListItem.get_item('ee5r') +
'<br />';
}
$("#divListItems").html(listItemInfo);
}

}

function onQueryFailed(sender, args) {
alert('Request failed. ' + args.get_message() +
'\n' + args.get_stackTrace());
}


// hnaya hanjibo events kamlin dyal rows and count the hours

function GetEventsOfRow(Resources){

  Resources.forEach(element => {

    element.children.forEach(child =>{
       var MonthHoursCount = 0;
       
       var events = dp.rows.find(child.id).events.all();

       events.forEach(event => {
          

          
          if (event.data.end.substring(8, 10) != "01"){
            var daysAmount =
              event.data.end.substring(8, 10) -
              event.data.start.substring(8, 10);
          
          }else{
            var daysAmount =
              (dp.startDate.daysInMonth() + 1 ) - event.data.start.substring(8, 10);
          
          }
          
          var StartH = event.data.text.substring(0, 2);
          var EndH = event.data.text.substring(3, 5);
          
          var shiftHoursCount = 0;
          while (StartH != EndH) {
            if (StartH == 24) {
              StartH = 0;
            } else {
              shiftHoursCount++;
              StartH++;
            }
          }
          MonthHoursCount = MonthHoursCount + (daysAmount * shiftHoursCount);
          
        
            
       });
       console.log(MonthHoursCount);

    });

   
   

  });
  

};



// get the sharepoint user name   

$(document).ready(function () {

  
  var userid = _spPageContextInfo.userId;
  GetCurrentUser();

  function GetCurrentUser() {
    var requestUri =
      _spPageContextInfo.webAbsoluteUrl +
      "/_api/web/getuserbyid(" +
      userid +
      ")";

    var requestHeaders = { accept: "application/json;odata=verbose" };

    $.ajax({
      url: requestUri,
      contentType: "application/json;odata=verbose",
      headers: requestHeaders,
      success: onSuccess,
      error: onError,
    });
  }

  function onSuccess(data, request) {
    loginName = data.d.Title;
    
  }

  function onError(error) {
    alert(error);
  }

  
  retrieveScheduleData(dp.startDate.value.substring(0, 7));



  $("#btnShow").click(function () {
    retrieveListItems();
  });

  $("#btnSave").click(function () {
    
    SaveSchedule(
      dp.events.list,
      dp.resources,
      dp.startDate.value.substring(0, 7),
      "ScheduleNotPub"
    );
    
  });

    $("#btnPublish").click(function () {
      SaveSchedule(
        dp.events.list,
        dp.resources,
        dp.startDate.value.substring(0, 7),
        "Schedule"
      );
    });

    $("#btnCount").click(function () {
       GetEventsOfRow(dp.resources);
    });
});



window.alert = function () {};
