<script>
  import { db_reminder, db_user, db_attachment } from "../config.js";
  import firebase from "firebase/app";
  export let user;
  export let idMeeting = [];
  var progress;

  let unit_creating = user.email.split("@")[0].toUpperCase();

  document.addEventListener("DOMContentLoaded", function() {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, options);
  });

  function addRow(tableID) {
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var colCount = table.rows[0].cells.length;
    for (var i = 0; i < colCount; i++) {
      var newcell = row.insertCell(i);
      newcell.style = "display: block;";
      newcell.innerHTML = table.rows[1].cells[i].innerHTML;
      switch (newcell.childNodes[0].type) {
        case "text":
          newcell.childNodes[0].value = "";
          break;
        case "checkbox":
          newcell.childNodes[0].checked = false;
          break;
        case "select-one":
          newcell.childNodes[0].selectedIndex = 0;
          break;
      }
    }
  }

  function deleteRow(tableID) {
    try {
      var table = document.getElementById(tableID);
      var rowCount = table.rows.length;

      for (var i = 0; i < rowCount; i++) {
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];
        if (null != chkbox && true == chkbox.checked) {
          table.deleteRow(i);
          rowCount--;
          i--;
        }
      }
    } catch (e) {
      alert(e);
    }
  }

  let value = [];
  function GetCellValues(tableID) {
    if (document.getElementById("meeting_name").value.trim() == "") {
      alert("Please Input Meeting Name...");
    } else if (document.getElementById("topic_name").value.trim() == "") {
      alert("Please Input Topic Meeting...");
    } else if (document.getElementById("lead_name").value.trim() == "") {
      alert("Please Input Leader Meeting...");
    } else if (document.getElementById("attendees_name").value.trim() == "") {
      alert("Please Input Attendeess Name...");
    } else {
      value = [];
      let data = {};
      var table = document.getElementById(tableID);

      for (var i = 1, row; (row = table.rows[i]); i++) {
        let uic = [];
        let j;
        for (
          j = 0;
          j < Array.from(row.cells[3].firstChild.selectedOptions).length;
          j++
        ) {
          if (
            Array.from(row.cells[3].firstChild.selectedOptions)[
              j
            ].value.trim() == ""
          ) {
            alert("Please Input Unit...");
          } else {
            let unit = {
              name: Array.from(row.cells[3].firstChild.selectedOptions)[j]
                .value,
              progress: "",
              attachment: ""
            };
            uic.push(unit);
          }
        }
        //rows would be accessed using the "row" variable assigned in the for loop

        if (uic.length > 0) {
          if (row.cells[1].children[1].value.trim() == "") {
            alert("Please Input Perihal...");
          } else if (row.cells[2].children[1].value.trim() == "") {
            alert("Please Input Action Plan...");
          } else if (row.cells[4].firstChild.value.trim() == "") {
            alert("Please Input Due Date...");
          } else {
            let task = {};
            task = {
              perihal: row.cells[1].children[1].value,
              action_plan: row.cells[2].children[1].value,
              due_date: row.cells[4].firstChild.value,
              data_uic: uic,
              status: false
            };
            value.push(task);
          }
        }
      }
      let file = "";
      if (value.length > 0) {
        if (document.getElementById("evidence").files[0]) {
          file = document.getElementById("evidence").files[0].name;
        }
        data = {
          meeting_name: document.getElementById("meeting_name").value,
          meeting_date: document.getElementById("meeting_date").value,
          lead_by: document.getElementById("lead_name").value,
          attendees: document.getElementById("attendees_name").value,
          topic_name: document.getElementById("topic_name").value,
          location: document.getElementById("location_name").value,
          city: document.getElementById("city_name").value,
          priority: document.getElementById("priorty_meeting").value,
          evidence: file,
          created_by: unit_creating,
          data_meeting: value
        };
        function makeid(length) {
          var result = "";
          var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          var charactersLength = characters.length;
          for (var i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          return result;
        }

        function idGenerate(id) {
          i = 0;
          while (i < idMeeting.length) {
            if (idMeeting[i] < id) {
              id = makeid(10);
              i = 0;
            } else {
              i++;
            }
          }

          return id;
        }
        let j;
        if (document.getElementById("evidence").files[0]) {
          for (i = 0; i < data.data_meeting.length; i++) {
            for (j = 0; j < data.data_meeting[i].data_uic.length; j++) {
              var user = db_user
                .collection("unitData")
                .doc(data.data_meeting[i].data_uic[j].name);
              user.update({
                notif: firebase.firestore.FieldValue.arrayUnion(
                  "You got task from " + data.created_by
                )
              });
            }
          }
          var uploadFile = db_attachment
            .ref(document.getElementById("evidence").files[0].name)
            .put(document.getElementById("evidence").files[0]);

          uploadFile.on("state_changed", function(snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              alert("Success");
              location.reload();
            }
          });
          db_reminder.ref("/" + idGenerate(makeid(10))).set(data);
        } else {
          for (i = 0; i < data.data_meeting.length; i++) {
            for (j = 0; j < data.data_meeting[i].data_uic.length; j++) {
              var user = db_user
                .collection("unitData")
                .doc(data.data_meeting[i].data_uic[j].name);
              user.update({
                notif: firebase.firestore.FieldValue.arrayUnion(
                  "You got task from " + data.created_by
                )
              });
            }
          }
          db_reminder.ref("/" + idGenerate(makeid(10))).set(data);
          if (window.confirm("Data added")) {
            // They clicked Yes
            setTimeout(location.reload.bind(location), 3000);
          }
        }
      } else {
        alert("No Data Meeting...");
      }
    }
  }
</script>

<style>
  tbody {
    width: 100%;
    display: table;
  }
  th {
    display: none;
  }
  td {
    display: block;
  }

  table {
    border-collapse: separate;
    border-spacing: 0 3rem;
  }

  input[type="text"]:hover {
    border-color: #f57170;
  }
  input[type="text"]:focus {
    background-color: #10ddc2;
    color: white;
    border-color: none !important;
  }

  textarea:hover {
    border-color: #f57170;
  }

  textarea:focus {
    background-color: #10ddc2;
    color: white;
    border-color: none !important;
  }
  .icon-leader {
    float: right;
    margin-left: 615px;
    margin-top: 45px !important;
    position: absolute;
    z-index: 3;
    color: black;
  }
</style>

<div>
  <label for="meeting_name">Meeting Name</label>
  <div class="form-group input-group">
    <input
      type="text"
      class="form-control"
      id="meeting_name"
      placeholder="Input meeting name..."
      required />
    <div class="input-group-append">
      <span class="input-group-text">
        <i class="fa fa-briefcase" aria-hidden="true" />
      </span>
    </div>
  </div>

  <div class="form-group">
    <label for="priorty_meeting">Priority</label>
    <select id="priorty_meeting" required>
      <option value="" disabled selected>Please input priority...</option>
      <option value="0">Important - Extremely Urgent</option>
      <option value="1">Important - Urgent</option>
      <option value="2">Important - Not Urgent</option>
      <option value="3">Not Important</option>
    </select>
  </div>
  <div class="form-group">
    <label for="meeting_date">Meeting Date</label>
    <input
      type="date"
      class="form-control"
      id="meeting_date"
      placeholder="Input Date..."
      required />
  </div>

  <label for="location_name">Location</label>
  <div class="form-group input-group">
    <input
      type="text"
      class="form-control"
      id="location_name"
      placeholder="Input location..."
      required />
    <div class="input-group-append">
      <span class="input-group-text">
        <i class="fa fa-map-marker" aria-hidden="true" />
      </span>
    </div>
  </div>

  <label for="city_name">City</label>
  <div class="form-group input-group">
    <input
      type="text"
      class="form-control"
      id="city_name"
      placeholder="Input city name..."
      required />
    <div class="input-group-append">
      <span class="input-group-text">
        <i class="fa fa-map" aria-hidden="true" />
      </span>
    </div>
  </div>

  <label for="topic_name">Topic Name</label>
  <div class="form-group input-group">
    <input
      type="text"
      class="form-control"
      id="topic_name"
      placeholder="Input topic name..."
      required />
    <span class="input-group-text">
      <i class="fa fa-file-word-o" aria-hidden="true" />
    </span>
  </div>

  <label for="topic_name">Meeting Leader</label>
  <div class="form-group input-group">
    <input
      type="text"
      class="form-control"
      id="lead_name"
      placeholder="Input leader name..."
      required />
    <span class="input-group-text">
      <i class="fa fa-user" aria-hidden="true" />
    </span>
  </div>

  <label for="topic_name" required>Attendees Name</label>
  <div class="form-group input-group">
    <input
      type="text"
      class="form-control"
      id="attendees_name"
      placeholder="Input attendees name... (ex Orang1,Orang2,Orang3)"
      required />
    <span class="input-group-text">
      <i class="fa fa-users" aria-hidden="true" />
    </span>
  </div>
  {#if progress}
    <div class="progress">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: {progress}%" />
    </div>
  {/if}
  <div class="form-group">
    <label for="topic_name">Attach File :</label>
    <input type="file" id="evidence" />
  </div>
  <h5 class="text-center mt-4 mb-2">TASK</h5>
  <table class="table table-responsive text-center" id="dataTable">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Perihal</th>
        <th scope="col">Action Plan</th>
        <th scope="col">UIC</th>
        <th scope="col">Due Date</th>
        <th scope="col">Support Needed</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td scope="row">
          <input type="checkbox" name="chk" />
        </td>
        <td>
          <label for="perihal">Perihal</label>
          <textarea
            class="form-control"
            id="perihal"
            rows="2"
            placeholder="Write here..."
            required />
        </td>
        <td>
          <label for="action">Action Plan</label>
          <textarea
            class="form-control"
            rows="2"
            id="action"
            placeholder="Write here..."
            required />
        </td>
        <td style="width:100% !important;">
          <select
            style="width:60% !important;"
            id="uic"
            multiple="true"
            required>
            <option value="" disabled selected>Choose UIC</option>
            <option value="GM">GM</option>
            <option value="ASO">ASO</option>
            <option value="OPTIMA">OPTIMA</option>
            <option value="CCAN&WAN">CCAN & WAN</option>
            <option value="HS_CS">HS/CS</option>
            <option value="ARNET">ARNET</option>
            <option value="EGBIS">EGBIS</option>
            <option value="CC">CC</option>
            <option value="HR&GS">HR & GS</option>
            <option value="PCF">PCF</option>
            <option value="WR">WR</option>
            <option value="TA">TA</option>
            <option value="DSW">DSW</option>
            <option value="DATEL_PWJ">DATEL PWJ</option>
            <option value="DATEL_TEM">DATEL TEM</option>
            <option value="DATEL_WOS">DATEL WOS</option>
            <option value="DATEL_MUN">DATEL MUN</option>
            <option value="DATEL_KBM">DATEL KBM</option>
            <option value="OTHER">OTHER</option>
          </select>
        </td>
        <td>
          <input id="due_date" type="date" required />
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div>
  <button
    type="button"
    class="btn btn-lg btn-block add"
    style="background-color:#ffbd69; color:white;"
    on:click={() => {
      addRow('dataTable');
    }}>
    ADD ROW
  </button>
  <button
    type="button"
    class="btn btn-lg btn-danger btn-block delete"
    on:click={() => {
      deleteRow('dataTable');
    }}>
    DELETE ROW
  </button>
  <button
    type="button"
    class="btn btn-lg btn-primary btn-block submit"
    style="color:white;"
    on:click={() => {
      GetCellValues('dataTable');
    }}>
    SUBMIT
  </button>
</div>
