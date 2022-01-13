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
dp.treePreventParentUsage = true;
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
  SP.SOD.executeFunc(
    "SP.js",
    "SP.ClientContext",

    function () {
      var clientContext = new SP.ClientContext();
      var ScheList = clientContext.get_web().get_lists().getByTitle("Schedule");
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

        // disable all cells
        dp.onBeforeCellRender = function (args) {
          args.cell.disabled = true;
        };
        //////////

        try {
          dp.init();
        } catch (err) {
          dp.update();
        }
      }

      function onRetrieveFailed(sender, args) {
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
    }
  );
}

// get the sharepoint user name

$(document).ready(function () {
  document.getElementById("txtFrom").valueAsDate = new Date();

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
    document.getElementById("txtAnalyst").value = loginName;
    document.getElementById("txtAnalyst").disabled = true;
    document.getElementById("txtAnalystPref").value = loginName;
    document.getElementById("txtAnalystPref").disabled = true;
  }

  function onError(error) {
    alert(error);
  }

  retrieveScheduleData(dp.startDate.value.substring(0, 7));

  $("#btnAddOT").click(function () {
    var validator = new FormValidator(
      { events: ["blur", "paste", "change"] },
      document.forms[0]
    );

    validatorResult = validator.checkAll(document.forms[0]);

   
    if (validatorResult.valid) {
       
    var AnalName = $("#txtAnalyst").val();
    var FromDate = $("#txtFrom").val();
    var ToDate = $("#txtTo").val();
    var OTHours = $("#txtOThours").val();
    var Cmnt = $("#txtCmt").val();

    AddOT(AnalName, FromDate, ToDate, OTHours, Cmnt);

    }
   
  });

  $("#btnShow").click(function () {
    ShowOT();
  });

  $("#btnSubPref").click(function () {
    var validator = new FormValidator(
      { events: ["blur", "paste", "change"] },
      document.forms[1]
    );

    validatorResult = validator.checkAll(document.forms[1]);

    if (validatorResult.valid) {
      var AnalName = $("#txtAnalystPref").val();
      var PrefShifts = $("#txtPrefShit").val();
      var NotPrefShifts = $("#txtNotPrefShit").val();
      var PTO = $("#txtPTO").val();
      var DaysOff = $("#txtDaysOff").val();
      var Cmnt = $("#txtCmtPref").val();

      AddPref(AnalName, PrefShifts, NotPrefShifts, PTO, DaysOff, Cmnt);
    }
  });

 
});


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

    //change month
    dp.startDate = date.firstDayOfMonth();
    dp.days = dp.startDate.daysInMonth();
    retrieveScheduleData(date.value.substring(0, 7));

    dp.update();
  
}

// function to reset the forms with exception 

function ResetFormWithException(form){
   var inputs = form.getElementsByTagName("input");

   for (i = 0; i < inputs.length; i++) {
     if (i != 0) {
       inputs[i].value = "";
     }
   }
};

// add OT to the sharepoint list
function AddOT(NameField, FromField, ToField, HoursField, CmntField) {
  var ListName = "OverTime";
  var context = new SP.ClientContext.get_current();
  var lstObject = context.get_web().get_lists().getByTitle(ListName);
  var listItemCreationInfo = new SP.ListItemCreationInformation();
  var newItem = lstObject.addItem(listItemCreationInfo);

  newItem.set_item("Title", NameField);
  newItem.set_item("_x006f_u81", FromField);
  newItem.set_item("_x006f_lr0", ToField);
  newItem.set_item("ee5r", HoursField);
  newItem.set_item("_x0064_vk2", CmntField);

  newItem.update();
  context.executeQueryAsync(
    Function.createDelegate(this, this.onOTSuccess),
    Function.createDelegate(this, this.onOTFailure)
  );
}

function onOTSuccess() {
  //clean fields and show the OT msg
  document.getElementById("txtOThours").value = "";
  document.getElementById("txtTo").value = "";
  document.getElementById("txtCmt").value = "";
  //Corner Notification
  alertify.set({ delay: 5000 });
  alertify.success(
    "Your OT has been added successfully!\n However it will be waiting for your TL's approval."
  );
}

function onOTFailure(args) {
  alertify.set({ delay: 5000 });
  alertify.success("Something went wrong!! ");
}


// add OT to the sharepoint list
function AddPref(NameField, PrefField, NotPrefField, PTOField, DaysOffFlied, CmntField) {
  var ListName = "Preferences";
  var context = new SP.ClientContext.get_current();
  var lstObject = context.get_web().get_lists().getByTitle(ListName);
  var listItemCreationInfo = new SP.ListItemCreationInformation();
  var newItem = lstObject.addItem(listItemCreationInfo);

  newItem.set_item("Title", NameField);
  newItem.set_item("MyPreferredShifts", PrefField);
  newItem.set_item("ShiftsICannotWork", NotPrefField);
  newItem.set_item("PTO", PTOField);
  newItem.set_item("DaysOff", DaysOffFlied);
  newItem.set_item("Comment", CmntField);

  newItem.update();
  context.executeQueryAsync(
    Function.createDelegate(this, this.onPrefSuccess),
    Function.createDelegate(this, this.onPrefFailure)
  );
}

function onPrefSuccess() {
  //clean fields 
  document.getElementById("txtPrefShit").value = "";
  document.getElementById("txtNotPrefShit").value = "";
  document.getElementById("txtPTO").value = "";
  document.getElementById("txtDaysOff").value = "";
  document.getElementById("txtCmtPref").value = "";
  //Corner Notification
  alertify.set({ delay: 5000 });
  alertify.success(
    "Your Prefereces have been added successfully!\n We will try our best to make these dreams become true :D"
  );
}

function onPrefFailure(args) {
  alertify.set({ delay: 5000 });
  alertify.success("Something went wrong!! ");
}


// get OT data from the SP list to show it
var collListItem;

function ShowOT() {
  var clientContext = new SP.ClientContext();
  var oList = clientContext.get_web().get_lists().getByTitle("OverTime");
  var camlQuery = new SP.CamlQuery();
  collListItem = oList.getItems(camlQuery);
  clientContext.load(collListItem);
  clientContext.executeQueryAsync(
    Function.createDelegate(this, this.onQuerySucceeded),
    Function.createDelegate(this, this.onQueryFailed)
  );
}

function onQuerySucceeded(sender, args) {
  var listItemInfo = "";
  var listItemEnumerator = collListItem.getEnumerator();

  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();
    if (oListItem.get_item("Title") == loginName) {
      listItemInfo +=
        " <strong>Date :</strong> " +
        oListItem.get_item("_x006f_u81") +
        " <strong>Time:</strong> " +
        oListItem.get_item("_x006f_lr0") +
        "<strong>amount of hours :</strong> " +
        oListItem.get_item("ee5r") +
        "<br />";
    }
    $("#divListItems").html(listItemInfo);
  }
}

function onQueryFailed(sender, args) {
  alert("Request failed. " + args.get_message() + "\n" + args.get_stackTrace());
}

window.alert = function () {};
