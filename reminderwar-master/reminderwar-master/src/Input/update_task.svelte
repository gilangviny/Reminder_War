<script>
  import { db_reminder, db_attachment } from "../config";
  export let id = [];
  export let task;
  export let idTask = 0;
  export let user;
  var progress;
  import { onMount } from "svelte";
  let readData;
  function Update(meet) {
    if (document.getElementById("update_progress").value.trim() == "") {
      alert("Please Input Progress...");
    } else {
      if (meet != undefined) {
        if (document.getElementById("update_attachment").files[0]) {
          var uploadTask = db_attachment
            .ref(document.getElementById("update_attachment").files[0].name)
            .put(document.getElementById("update_attachment").files[0]);

          uploadTask.on("state_changed", function(snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              alert("Success");
              location.reload();
            }
          });
          db_reminder
            .ref(
              "/" +
                id[task] +
                "/data_meeting/" +
                idTask +
                "/data_uic/" +
                meet +
                "/"
            )
            .update({
              progress: document.getElementById("update_progress").value,
              attachment: document.getElementById("update_attachment").files[0]
                .name
            });
        } else {
          db_reminder
            .ref(
              "/" +
                id[task] +
                "/data_meeting/" +
                idTask +
                "/data_uic/" +
                meet +
                "/"
            )
            .update({
              progress: document.getElementById("update_progress").value
            });
          alert("Success");
          location.reload();
        }
      }
    }
  }
</script>

<div class="form-group">
  <label for="update_progress" required>Input Progress</label>
  <input
    type="text"
    class="form-control"
    id="update_progress"
    placeholder="Input update progress..."
    required />
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
  <label for="update_attachment" required>File Attachment Progress</label>
  <input
    type="file"
    class="form-control"
    id="update_attachment"
    placeholder="Input update progress..."
    required />
</div>

<button
  class="btn btn-success"
  on:click={() => {
    let found;
    let i = 0;
    let j = 0;
    var database = db_reminder.ref('/' + id[task] + '/data_meeting/' + idTask + '/data_uic/');
    database.on('value', function(snapshot) {
      readData = snapshot.val();
    });
    if (readData) {
      readData.forEach(function(item) {
        if (item.name == user) {
          found = i;
        }
        i = i + 1;
      });
    }
    console.log(found);
    Update(found);
  }}>
  UPDATE
</button>
