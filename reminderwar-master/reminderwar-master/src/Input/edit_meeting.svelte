<script>
  export let id = "";
  export let user;

  import { db_reminder, db_attachment } from "../config";
  let readData = {
    meeting_name: "",
    topic_name: "",
    lead_by: "",
    attendees: ""
  };
  import { beforeUpdate } from "svelte";
  beforeUpdate(() => {
    if (id != "") {
      var database = db_reminder.ref("/" + id + "/");
      database.on("value", function(snapshot) {
        readData = snapshot.val();
      });
    }
  });
  var progress;
  function priority_val(value) {
    if (value == "on") {
      return true;
    }
    if (value == "false") {
      return false;
    }
  }

  function Update(meet) {
    if (document.getElementById("input_file_evidence").files[0]) {
      var uploadEvidence = db_attachment
        .ref(document.getElementById("input_file_evidence").files[0].name)
        .put(document.getElementById("input_file_evidence").files[0]);

      uploadEvidence.on("state_changed", function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100) {
          alert("Success");
          location.reload();
        }
      });

      db_reminder.ref("/" + meet + "/").update({
        meeting_name: document.getElementById("meeting_name_edit").value,
        topic_name: document.getElementById("topic_name_edit").value,
        location: document.getElementById("location_name_change").value,
        city: document.getElementById("city_name_change").value,
        meeting_date: document.getElementById("meeting_date_change").value,
        priority: document.getElementById("priorty_meeting_change").value,
        lead_by: document.getElementById("lead_name_edit").value,
        attendees: document.getElementById("attendees_name_edit").value,
        evidence: document.getElementById("input_file_evidence").files[0].name
      });
    } else {
      db_reminder.ref("/" + meet + "/").update({
        meeting_name: document.getElementById("meeting_name_edit").value,
        topic_name: document.getElementById("topic_name_edit").value,
        location: document.getElementById("location_name_change").value,
        city: document.getElementById("city_name_change").value,
        meeting_date: document.getElementById("meeting_date_change").value,
        priority: document.getElementById("priorty_meeting_change").value,
        lead_by: document.getElementById("lead_name_edit").value,
        attendees: document.getElementById("attendees_name_edit").value
      });
      alert("Success");
      location.reload();
    }
  }
</script>

<div>
  <div class="form-group">
    <label for="meeting_name">Meeting Name</label>
    <input
      type="text"
      class="form-control"
      id="meeting_name_edit"
      value={readData.meeting_name} />
  </div>
  <div class="form-group">
    <label for="meeting_date_change">Meeting Date</label>
    <input
      type="date"
      class="form-control"
      id="meeting_date_change"
      placeholder="Input Date..."
      value={readData.meeting_date}
      required />
  </div>
  <div class="form-group">
    <label for="priorty_meeting_change">Priority</label>
    <select id="priorty_meeting_change" required>
      <option value="" disabled selected>Please input priority...</option>
      <option value="0">Important - Extremely Urgent</option>
      <option value="1">Important - Urgent</option>
      <option value="2">Important - Not Urgent</option>
      <option value="3">Not Important</option>
    </select>
  </div>
  <div class="form-group">
    <label for="location_name_change">Location</label>
    <input
      type="text"
      class="form-control"
      id="location_name_change"
      placeholder="Input location..."
      value={readData.location}
      required />
  </div>
  <div class="form-group">
    <label for="city_name_change">City</label>
    <input
      type="text"
      class="form-control"
      id="city_name_change"
      placeholder="Input city name..."
      value={readData.city}
      required />
  </div>
  <div class="form-group">
    <label for="topic_name">Topic Name</label>
    <input
      type="text"
      class="form-control"
      id="topic_name_edit"
      value={readData.topic_name} />
  </div>
  <div class="form-group">
    <label for="topic_name">Meeting Leader</label>
    <input
      type="text"
      class="form-control"
      id="lead_name_edit"
      value={readData.lead_by} />
  </div>
  <div class="form-group">
    <label for="topic_name">Attendees Name</label>
    <input
      type="text"
      class="form-control"
      id="attendees_name_edit"
      value={readData.attendees} />
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
    <label for="input_file_evidence">Input Evidence</label>
    <input type="file" class="form-control" id="input_file_evidence" />
  </div>
  <button
    class="btn btn-success"
    on:click={() => {
      Update(id);
    }}>
    EDIT
  </button>
</div>
