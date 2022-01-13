
var render1mara = 0;
// hadi kansoviw biha data

function Saveschedule(MonthDa, Analysts) {
  //console.log(MonthDa);
  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };
  const Shifts = JSON.stringify(MonthDa);
  const AnalystsOrder = JSON.stringify(Analysts);
  downloadToFile(
    "var AnalystsOrder ="+ AnalystsOrder +"; var shiftlist =" + Shifts,
    "ShiftsList.js",
    "text/plain"
  );
};

// var jString = JSON.stringify(dataObject);
// setFieldValue("NameOfField", jString);

//////////////////////////////////////////////////////////
  
      var dp = new DayPilot.Scheduler("dp");
      //dp.startDate = DayPilot.Date.today().firstDayOfMonth();
      dp.startDate = "2021-01-01";
      dp.cellGroupBy = "Month";
      //dp.days = dp.startDate.daysInMonth();
      dp.days = "30";
      dp.scale = "Day";
      dp.cellWidthSpec = "Auto";
      dp.timeHeaders = [
        { groupBy: "Month", format: "MMMM yyyy" },
        { groupBy: "Day", format: "d" },
      ];

      dp.contextMenu = new DayPilot.Menu({
        items: [
          {
            text: "Edit",
            onClick: function (args) {
              //console.log(args.source.resource());
              dp.events.edit(args.source);
              
            },
          },
          {
            text: "Delete",
            onClick: function (args) {
              
              dp.events.remove(args.source);
              //console.log(args.source.resource());
              console.log("--------------");
              GetEventsOfRow(args.source.resource());
            },
          },
          {text: "-"},
        {
            text: "PTO Day", onClick: function (args) {
                var e = args.source;
                e.data.backColor ="linear-gradient(to bottom, #eda99d  0%, red)";
                
                dp.events.update(e);
            }
        },
        {
            text: "Bank Holiday", onClick: function (args) {
                var e = args.source;
                e.data.backColor = "linear-gradient(to bottom, #f1faaa  0%, yellow)";
               
                dp.events.update(e);
            }
        },
        {
            text: "Different Shift", onClick: function (args) {
                var e = args.source;
                e.data.backColor = "linear-gradient(to bottom, #63d274  0%, #1fc600)";
                
                dp.events.update(e);
            }
        },
        ],
      });

      dp.treeEnabled = true;
      dp.treePreventParentUsage = true;
      
      
      //giving the schedule the current month
      var today = new Date();
      //var mm = today.getMonth() + 1;
      var mm = "01";

      dp.resources = window["Analyst" + mm];

      dp.heightSpec = "Max";
      dp.height = "Max";
      
      dp.contextMenuResource = new DayPilot.Menu({
        items: [
          {
            text: "Edit...",
            onClick: function (args) {
              var row = args.source;
              DayPilot.Modal.prompt("Analyst name:", row.name).then(function (args) {
                if (!args.result) {
                  return;
                }
                row.data.name = args.result;
                dp.update();
                dp.message("The analyst name has been changed");
              });
            },
          },
          {
            text: "Delete",
            onClick: function (args) {
              var row = args.source;
              dp.rows.remove(row);
              dp.message("Deleted");
            },
          },
          {
            text: "-",
          },
          {
            text: "Add Child...",
            onClick: function (args) {
              var row = args.source;
              DayPilot.Modal.prompt("Resource name:", "New Resource").then(function (
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
            },
          },
        ],
      });
     

      
      dp.events.list = window["shift" + mm];




      dp.eventMovingStartEndEnabled = true;
      dp.eventResizingStartEndEnabled = true;
      dp.timeRangeSelectingStartEndEnabled = true;

      // event moving
      dp.onEventMoved = function (args) {
        dp.message("Moved: " + args.e.text());
        // hnata kan3tiw id row jdida 
        console.log("");
        GetEventsOfRow(args.e.resource());

      };
      // event deleting
      dp.onEventDeleted = function (args) {
        dp.message("deleted: " + args.e.text());
        // hnata kan3tiw id row jdida
        console.log("");
        //GetEventsOfRow(args.e.resource());
      };

    
      // event resizing
      dp.onEventResized = function (args) {
        dp.message("Resized: " + args.e.text());
        console.log("");
        GetEventsOfRow(args.e.resource());
        
      };

      dp.onEventEdited = function(args) {
            dp.message("Edited: " + args.e.text());
            console.log("--------------");
            GetEventsOfRow(args.e.resource());
      };

     
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
            backbarColor: "#9dc8e8",
          });
          dp.events.add(e);
          dp.message("The new shift has been added");
          console.log("--------------");
          
         
          modal.onClosed = function(args) {
              
                GetEventsOfRow(args.resource);
            
        };
        });
        
      };


dp.treePreventParentUsage = true;

dp.onEventMove = function (args) {
    if (args.ctrl) {
        var newEvent = new DayPilot.Event({
            start: args.newStart,
            end: args.newEnd,
            text: "" + args.e.text(),
            resource: args.newResource,
            id: DayPilot.guid()  // generate random id
        });
        dp.events.add(newEvent);
 
        // notify the server about the action here

        args.preventDefault(); // prevent the default action - moving event to the new location
    }
    if (args.areaData === "event-copy") {
        dp.events.add(new DayPilot.Event({
            start: args.newStart,
            end: args.newEnd,
            resource: args.newResource,
            id: DayPilot.guid(),
            text: "" + args.e.text()
        }));
        args.preventDefault();
    }
    
};

dp.onBeforeEventRender = function (args) {
  
    args.data.areas = [
      {
        right: 2,
        bottom: 2,
        width: 16,
        height: 16,
        backColor: "#fff",
        style: "box-sizing: border-box; border-radius: 7px; padding-left: 3px; border: 1px solid #ccc;font-size: 14px;line-height: 14px;color: #999;",
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

dp.onAfterRender = function (args) {
  //console.log("now rendered");
 // GetEventsOfRow("A");
 //console.log(args);
};
//disable all the cells for the analyst view
/** 
dp.onBeforeCellRender = function (args) {
 
    args.cell.disabled = true;
    
};
**/
// adding the icon to move rows
dp.onBeforeResHeaderRender = function (args) {
if (render1mara == 0) {
  if (args.resource.id != "G1" && args.resource.id != "G2") {
    args.resource.html =
      "<div class= 'hourscounterdiv' id= " +
      args.resource.id +
      "></div>" +
      args.resource.name;
    console.log("went inside");
    
  }
};

//GetEventsOfRow(args.resource.id);
  //GetEventsOfRow(args.resource.id);
  
      
  
};

dp.onEventMoving = function (args) {
    if (args.areaData && args.areaData === "event-copy") {
        args.html = "Copying";
    }
};



dp.rowMoveHandling = "Update";

dp.onRowMoving = function (args) {
  if (args.target.id === "B" && args.position === "child") {
    args.position = "forbidden";
  }
};
      dp.init();
      
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

function changeDate(date) {
  dp.startDate = date.firstDayOfMonth();
  dp.days = dp.startDate.daysInMonth();

  if (window["Analyst" + date.value.substring(5, 7)]) {
    dp.events.list = window["shift" + date.value.substring(5, 7)];
    dp.resources = window["Analyst" + date.value.substring(5, 7)];
  }

  dp.update();
}

// hnaya hanjibo events kamlin dyal special row

function GetEventsOfRow(ResId){
  var events = dp.rows.find(ResId).events.all();

  for (const event of events) {
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
    console.log(shiftHoursCount);
  }
  document.getElementById(ResId).classList.toggle("hourscounterdivRed");

  //document.getElementById().style.color= "linear-gradient(to right, #00ffff 0%, red);";
  //dp.rows.find(ResId).backColor = "red";
  
  
  //re.backColor = "red";
  //console.log(re);
};


     
  window.alert = function () {};
